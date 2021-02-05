import { ComplexDecimal } from 'src/.';
import Decimal from 'decimal.js';

declare global {
    namespace jest {
        interface Matchers<R> {
            rootsToBeCloseTo(expected: readonly ComplexDecimal[], delta: number): CustomMatcherResult;
        }
    }
}

function areClose(x: Decimal, y: Decimal, delta: number): boolean {
    return x.minus(y).abs().lessThanOrEqualTo(delta);
}

expect.extend({
    rootsToBeCloseTo(actual: readonly ComplexDecimal[], expected: readonly ComplexDecimal[], delta: number) {
        const pass =
            actual.length === expected.length &&
            actual.every((x) => !!expected.find((y) => areClose(x.re, y.re, delta) && areClose(x.im, y.im, delta)));

        return {
            pass,
            message: () => {
                const matcherHint = this.utils.matcherHint((pass ? '.not' : '') + '.rootsToBeCloseTo');

                const expectedResult = expected
                    .map(({ re, im }) => {
                        const reOutput = this.utils.printExpected(re.toString());
                        const imOutput = this.utils.printExpected(im.toString());
                        return `    (${reOutput}, ${imOutput})`;
                    })
                    .join('\n');

                const receivedResult = actual
                    .map(({ re, im }) => {
                        const reOutput = this.utils.printReceived(re.toString());
                        const imOutput = this.utils.printReceived(im.toString());
                        return `    (${reOutput}, ${imOutput})`;
                    })
                    .join('\n');

                return `${matcherHint}

Expected roots ${pass ? 'NOT to' : 'to'} be close to:
${expectedResult}

Received:
${receivedResult}`;
            },
        };
    },
});
