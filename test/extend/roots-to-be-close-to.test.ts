import 'test/extend';
import Decimal from 'decimal.js';
import { ComplexDecimal } from 'src/.';

test.each<{
    actual: readonly ComplexDecimal[];
    expected: readonly ComplexDecimal[];
    delta: number;
}>([
    {
        actual: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        expected: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        delta: 1e-2,
    },
    {
        actual: [
            { re: new Decimal('10.115'), im: new Decimal('20.225') },
            { re: new Decimal('11.115'), im: new Decimal('21.225') },
            { re: new Decimal('12.115'), im: new Decimal('22.225') },
        ],
        expected: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        delta: 1e-2,
    },
    {
        actual: [
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
        ],
        expected: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        delta: 1e-2,
    },
])('expect.rootsToBeCloseTo', ({ actual, expected, delta }) => {
    expect(actual).rootsToBeCloseTo(expected, delta);
});

test.each<{
    actual: readonly ComplexDecimal[];
    expected: readonly ComplexDecimal[];
    delta: number;
}>([
    {
        actual: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        expected: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        delta: 1e-2,
    },
    {
        actual: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('12.13'), im: new Decimal('22.22') },
        ],
        expected: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        delta: 1e-2,
    },
    {
        actual: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.24') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        expected: [
            { re: new Decimal('10.11'), im: new Decimal('20.22') },
            { re: new Decimal('11.11'), im: new Decimal('21.22') },
            { re: new Decimal('12.11'), im: new Decimal('22.22') },
        ],
        delta: 1e-2,
    },
])('expect.not.rootsToBeCloseTo', ({ actual, expected, delta }) => {
    expect(actual).not.rootsToBeCloseTo(expected, delta);
});
