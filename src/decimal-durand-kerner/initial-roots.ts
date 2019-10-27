import Decimal from 'decimal.js';
import { ComplexDecimal } from '../types';
import * as c from '../complex';
import DeciMath from '../deci-math';

export default function initialRoots(
    {
        deciMath,
        degree,
    }: {
        deciMath: DeciMath;
        degree: number;
    },
    center: ComplexDecimal,
    radius: Decimal,
): ComplexDecimal[] {
    const pi4 = deciMath.pi().times(4);
    const initialRoots: ComplexDecimal[] = [];

    for (let i = 0; i < degree; i++) {
        initialRoots[i] = c.add(
            center,
            deciMath.polar(
                radius,
                pi4
                    .times(i)
                    .add(3)
                    .div(degree * 2),
            ),
        );
    }

    return initialRoots;
}
