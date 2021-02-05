import { ComplexDecimal } from '../types';
import Decimal from 'decimal.js';

export function isZero(x: ComplexDecimal): boolean {
    return x.re.isZero() && x.im.isZero();
}

export function isFinite(x: ComplexDecimal): boolean {
    return x.re.isFinite() && x.im.isFinite();
}

export function minus(x: ComplexDecimal): ComplexDecimal {
    return {
        re: x.re.neg(),
        im: x.im.neg(),
    };
}

export function invert(x: ComplexDecimal): ComplexDecimal {
    const abs2 = absolute(x).pow(2);

    return {
        re: x.re.div(abs2),
        im: x.im.neg().div(abs2),
    };
}

export function absolute(x: ComplexDecimal): Decimal {
    const re = x.re.abs();
    const im = x.im.abs();

    const [p, q] = re.greaterThan(im) ? [re, im] : [im, re];

    if (q.isZero() || p.isZero()) {
        return p;
    }

    return q.div(p).pow(2).plus(1).sqrt().times(p);
}
