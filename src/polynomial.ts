import { ComplexDecimal } from './types';
import * as c from './complex';
import DeciMath from './deci-math';

export default class Polynomial {
    readonly degree: number;

    private readonly coefficients: readonly ComplexDecimal[];

    constructor(readonly deciMath: DeciMath, rawCoefficients: readonly ComplexDecimal[]) {
        this.degree = rawCoefficients.length - 1;

        // Let `coefficients` be a monic form of `rawCoefficients`
        const leader = rawCoefficients[this.degree];
        this.coefficients = rawCoefficients.map(x => c.divide(x, leader));
    }

    averageOfRoots(): ComplexDecimal {
        let x: ComplexDecimal;
        x = this.coefficients[this.degree - 1];
        x = c.divide(x, this.coefficients[this.degree]);
        x = c.divide(x, this.deciMath.complex(this.degree));
        return x;
    }

    evaluate(x: ComplexDecimal): ComplexDecimal {
        let result = this.deciMath.complex(0);

        for (let i = this.degree; i >= 0; i--) {
            result = c.multiply(x, result);
            result = c.add(this.coefficients[i], result);
        }

        return result;
    }

    derivative(x: ComplexDecimal): ComplexDecimal {
        let result = this.deciMath.complex(0);

        for (let i = this.degree; i >= 1; i--) {
            result = c.add(c.multiply(this.deciMath.complex(i), this.coefficients[i]), c.multiply(x, result));
        }

        return result;
    }

    divideByBinomial(constant: ComplexDecimal): Polynomial {
        let carry = this.deciMath.complex(0);
        let result: ComplexDecimal[] = [];

        for (let i = this.degree; i >= 1; i--) {
            result[i - 1] = c.add(this.coefficients[i], carry);
            carry = c.multiply(result[i - 1], constant);
        }

        return new Polynomial(this.deciMath, result);
    }
}
