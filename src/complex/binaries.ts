import { ComplexDecimal } from '../types';
import { absolute } from './unaries';

export function add(x: ComplexDecimal, y: ComplexDecimal): ComplexDecimal {
    return {
        re: x.re.plus(y.re),
        im: x.im.plus(y.im),
    };
}

export function subtract(x: ComplexDecimal, y: ComplexDecimal): ComplexDecimal {
    return {
        re: x.re.minus(y.re),
        im: x.im.minus(y.im),
    };
}

export function multiply(x: ComplexDecimal, y: ComplexDecimal): ComplexDecimal {
    return {
        re: x.re.times(y.re).minus(x.im.times(y.im)),
        im: x.re.times(y.im).plus(x.im.times(y.re)),
    };
}

export function divide(x: ComplexDecimal, y: ComplexDecimal): ComplexDecimal {
    const denominator = absolute(y).pow(2);

    return {
        re: x.re.times(y.re).plus(x.im.times(y.im)).div(denominator),
        im: x.im.times(y.re).minus(x.re.times(y.im)).div(denominator),
    };
}
