import Decimal from 'decimal.js';

export interface ComplexDecimal {
    re: Decimal;
    im: Decimal;
}

export type InputCoefficient =
    | number
    | Decimal
    | {
          re: number | Decimal;
          im: number | Decimal;
      };

export interface Config {
    maxIterations: number;
    tolerance: number | Decimal;
    decimalConstructor?: typeof Decimal;
}

export interface Result {
    roots: ComplexDecimal[];
    successful: boolean;
}
