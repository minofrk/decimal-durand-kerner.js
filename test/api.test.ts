import 'test/extend';
import decimalDurandKerner from 'src/.';
import Decimal from 'decimal.js';
import { InputCoefficient, Config, ComplexDecimal } from 'src/types';

const commonConfig = {
    maxIterations: 20,
    tolerance: 1e-6,
};

describe('decimalDurandKerner', () => {
    it.each<[readonly InputCoefficient[]]>([[[]], [[1]]])(
        'should throw if 1-2 coefficients are given.',
        coefficients => {
            expect(() => decimalDurandKerner(coefficients, commonConfig)).toThrow();
        },
    );

    it.each<[readonly InputCoefficient[]]>([[[1, 2, 5, 0]], [[{ re: 1, im: 3 }, 3, { re: 0, im: 0 }]]])(
        'should throw if given leading coefficient is 0.',
        coefficients => {
            expect(() => decimalDurandKerner(coefficients, commonConfig)).toThrow();
        },
    );

    it.each<[readonly InputCoefficient[]]>([
        [[1, Infinity, 1]],
        [[5, -Number.NaN, 6]],
        [[1, { re: -Infinity, im: 4 }, 1]],
        [[5, { re: new Decimal(5), im: Number.NaN }, 6]],
    ])('should throw if there exists `Infinity` or `NaN` in coefficients.', coefficients => {
        expect(() => decimalDurandKerner(coefficients, commonConfig)).toThrow();
    });

    it.each<Config['maxIterations']>([Infinity, Number.NaN])(
        'should throw if `maxIterations` is not a finite number.',
        maxIterations => {
            expect(() => decimalDurandKerner([1, 1], { ...commonConfig, maxIterations })).toThrow();
        },
    );

    it.each<Config['maxIterations']>([0, -3, 1.4, 1e100, Number.MAX_SAFE_INTEGER])(
        'should not throw if `maxIterations` is a finite number.',
        maxIterations => {
            expect(() => decimalDurandKerner([1, 1], { ...commonConfig, maxIterations })).not.toThrow();
        },
    );

    it.each<Config['tolerance']>([Infinity, Number.NaN])(
        'should throw if `tolerance` is not a finite number.',
        tolerance => {
            expect(() => decimalDurandKerner([1, 1], { ...commonConfig, tolerance })).toThrow();
        },
    );

    it.each<Config['tolerance']>([0, -5, Number.MAX_VALUE, Number.MIN_VALUE])(
        'should not throw if `tolerance` is a finite number.',
        tolerance => {
            expect(() => decimalDurandKerner([1, 1], { ...commonConfig, tolerance })).not.toThrow();
        },
    );

    it('should fail to solve if `maxIterations` is too small.', () => {
        expect(
            decimalDurandKerner([1, 1, 1, 1], {
                ...commonConfig,
                maxIterations: 1,
            }).successful,
        ).toBe(false);
    });

    it.each<{
        coefficients: readonly InputCoefficient[];
        roots: readonly ComplexDecimal[];
    }>([
        // √2 + 2x = 0 ⇔ x = -√2/2
        {
            coefficients: [Math.sqrt(2), 2],
            roots: [{ re: new Decimal(2).sqrt().div(-2), im: new Decimal(0) }],
        },

        // 178.5 - 58x + 2x^2 = 0 ⇔ x = 3.5, 25.5
        {
            coefficients: [178.5, -58, 2],
            roots: [{ re: new Decimal(3.5), im: new Decimal(0) }, { re: new Decimal(25.5), im: new Decimal(0) }],
        },

        // x^3 = 0 ⇔ x = 0
        {
            coefficients: [0, 0, 0, 1],
            roots: [
                { re: new Decimal(0), im: new Decimal(0) },
                { re: new Decimal(0), im: new Decimal(0) },
                { re: new Decimal(0), im: new Decimal(0) },
            ],
        },

        // (-1.875 + 4.375i) + (10.25 - 0.375i)x + (-8.25 - 2.5i)x^2 + x^3 = 0
        // ⇔ x = 7 + 3i, -0.5i, 1.25
        {
            coefficients: [{ re: -1.875, im: 4.375 }, { re: 10.25, im: -0.375 }, { re: -8.25, im: -2.5 }, 1],
            roots: [
                { re: new Decimal(7), im: new Decimal(3) },
                { re: new Decimal(0), im: new Decimal(-0.5) },
                { re: new Decimal(1.25), im: new Decimal(0) },
            ],
        },
    ])('should be able to solve sane polynomials successfully.', ({ coefficients, roots }) => {
        const result = decimalDurandKerner(coefficients, commonConfig);
        expect(result.roots).rootsToBeCloseTo(roots, 1e-5);
    });

    it("should be able to solve Wilkinson's polynomial.", () => {
        const coefficients = [
            '2432902008176640000',
            '-8752948036761600000',
            '13803759753640704000',
            '-12870931245150988800',
            '8037811822645051776',
            '-3599979517947607200',
            '1206647803780373360',
            '-311333643161390640',
            '63030812099294896',
            '-10142299865511450',
            '1307535010540395',
            '-135585182899530',
            '11310276995381',
            '-756111184500',
            '40171771630',
            '-1672280820',
            '53327946',
            '-1256850',
            '20615',
            '-210',
            '1',
        ].map(x => new Decimal(x));

        const expectedRoots = Array.from({ length: 20 }, (_, i) => ({
            re: new Decimal(i + 1),
            im: new Decimal(0),
        }));

        const result = decimalDurandKerner(coefficients, commonConfig);

        expect(result.successful).toBe(true);
        expect(result.roots).rootsToBeCloseTo(expectedRoots, 1e-5);
    });

    it('should work with customised `Decimal`.', () => {
        const BigDecimal = Decimal.clone({
            precision: 100,
        });

        const coefficients = [
            { re: 0.72, im: 2.07 },
            { re: 3.64, im: 5.9 },
            { re: 6.24, im: 5.27 },
            { re: 7.92, im: 8.39 },
        ];

        const expectedRoots = [
            {
                re: new BigDecimal(
                    '-0.3881793349627768221429303912900568908690402861454250669220928241178054956110691002696827450067072922',
                ),
                im: new BigDecimal(
                    '-0.03787411483913810607274782723009368368452161426760909982219005825364326705815826819894356190345772235',
                ),
            },
            {
                re: new BigDecimal(
                    '-0.2862399022514337514445708921410492557379502346758952798789626823035880865587830895990952825936831925',
                ),
                im: new BigDecimal(
                    '0.7346522281120422719883795811811592925536869464761952787947715626956222669550728875578964048652900187',
                ),
            },
            {
                re: new BigDecimal(
                    '-0.02898487265782073686145960480005631390751347373991644598131508819918883124376049356740852798730018182',
                ),
                im: new BigDecimal(
                    '-0.6170356281938204923465936412920437599150379945357608391437823518072963675054739105168309741006296836',
                ),
            },
        ];

        const result = decimalDurandKerner(coefficients, {
            maxIterations: 100,
            tolerance: 1e-91,
            decimalConstructor: BigDecimal,
        });

        expect(result.successful).toBe(true);
        expect(result.roots).rootsToBeCloseTo(expectedRoots, 1e-90);
    });
});
