import { Result, InputCoefficient, Config } from '../types';
import * as c from '../complex';
import DeciMath from '../deci-math';
import Polynomial from '../polynomial';
import core from './core';
import Decimal from 'decimal.js';

export function decimalDurandKerner(rawCoefficients: readonly InputCoefficient[], config: Config): Result {
    const { maxIterations, tolerance, decimalConstructor = Decimal } = config;

    const decimalTolerance = new decimalConstructor(tolerance);
    const deciMath = new DeciMath(decimalConstructor);
    const coefficients = rawCoefficients.map((x) => deciMath.parse(x));

    if (coefficients.length <= 1) {
        throw new Error('`coefficients` must have at least 2 elements.');
    }
    if (c.isZero(coefficients[coefficients.length - 1])) {
        throw new Error('`coefficients` must end with a non-zero value.');
    }
    if (coefficients.some((x) => !c.isFinite(x))) {
        throw new Error('`coefficients` must not contain `Infinity` and `NaN`.');
    }
    if (!decimalTolerance.isFinite()) {
        throw new Error('`tolerance` must be a finite number or Decimal.');
    }
    if (!Number.isFinite(maxIterations)) {
        throw new Error('`maxIterations` must be a finite number.');
    }

    return core(new Polynomial(deciMath, coefficients), maxIterations, decimalTolerance);
}
