import Decimal from 'decimal.js';
import { ComplexDecimal, InputCoefficient } from './types';
import { absolute, add } from './complex';

// Operations directly dependent on `Decimal` constructor.

export default class DeciMath {
    constructor(private readonly decimalConstructor: typeof Decimal) {}

    private isDecimal(x: any): x is Decimal {
        return this.decimalConstructor.isDecimal(x);
    }

    pi(): Decimal {
        return this.decimalConstructor.atan(1).times(4);
    }

    parse(value: InputCoefficient): ComplexDecimal {
        if (typeof value === 'number' || this.isDecimal(value)) {
            return this.complex(value);
        }

        return this.complex(value.re, value.im);
    }

    complex(re: number | Decimal, im: number | Decimal = 0): ComplexDecimal {
        return {
            re: new this.decimalConstructor(re),
            im: new this.decimalConstructor(im),
        };
    }

    polar(modulus: number | Decimal, argument: number | Decimal): ComplexDecimal {
        return {
            re: this.decimalConstructor.cos(argument).times(modulus),
            im: this.decimalConstructor.sin(argument).times(modulus),
        };
    }

    sum(vector: readonly ComplexDecimal[], fn: (x: ComplexDecimal, i: number) => ComplexDecimal): ComplexDecimal {
        return vector.reduce((r, x, i) => add(r, fn(x, i)), this.complex(0));
    }

    height(vector: readonly ComplexDecimal[]): Decimal {
        return this.decimalConstructor.max(...vector.map(x => absolute(x)));
    }
}
