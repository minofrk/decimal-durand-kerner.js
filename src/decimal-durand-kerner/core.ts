import { Result } from '../types';
import * as c from '../complex';
import Polynomial from '../polynomial';
import initialRoots from './initial-roots';
import findRoots from './find-roots';
import Decimal from 'decimal.js';

// https://doi.org/10.11540/jsiamt.3.4_451

export default function core(polynomial: Polynomial, maxIterations: number, tolerance: Decimal): Result {
    if (polynomial.degree === 0) {
        return { roots: [], successful: true };
    }

    const center = c.minus(polynomial.averageOfRoots());
    const residual = polynomial.evaluate(center);

    if (!c.isZero(residual)) {
        const radius = c.absolute(residual).pow(1 / polynomial.degree);
        const roots = initialRoots(polynomial, center, radius);
        return findRoots(polynomial, roots, maxIterations, tolerance);
    }

    const reducedPolynomial = polynomial.divideByBinomial(center);
    const otherResult = core(reducedPolynomial, maxIterations, tolerance);

    return {
        roots: [center, ...otherResult.roots],
        successful: otherResult.successful,
    };
}
