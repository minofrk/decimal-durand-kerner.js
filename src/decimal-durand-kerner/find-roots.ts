import { Result, ComplexDecimal } from '../types';
import * as c from '../complex';
import Polynomial from '../polynomial';
import Decimal from 'decimal.js';

export default function findRoots(
    polynomial: Polynomial,
    initialRoots: readonly ComplexDecimal[],
    maxIterations: number,
    tolerance: Decimal,
): Result {
    const deciMath = polynomial.deciMath;
    let roots: ComplexDecimal[] = [...initialRoots];

    for (let i = 1; i <= maxIterations; i++) {
        let errors: ComplexDecimal[] = [];

        roots = roots.map((z, i) => {
            const quotient = c.divide(polynomial.evaluate(z), polynomial.derivative(z));

            const difference = c.divide(
                quotient,
                c.subtract(
                    deciMath.complex(1),
                    c.multiply(
                        quotient,
                        deciMath.sum(roots, (x, j) => {
                            if (i === j) return deciMath.complex(0);
                            return c.invert(c.subtract(z, x));
                        }),
                    ),
                ),
            );

            errors.push(difference);

            return c.subtract(z, difference);
        });

        if (deciMath.height(errors).abs().lessThanOrEqualTo(deciMath.height(roots).times(tolerance))) {
            return { roots, successful: true };
        }
    }

    return { roots, successful: false };
}
