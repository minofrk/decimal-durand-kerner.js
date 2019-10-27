decimal-durand-kerner
===============================================================================

[![NPM Version](https://img.shields.io/npm/v/decimal-durand-kerner.svg?style=flat-square)](https://www.npmjs.com/package/decimal-durand-kerner)
[![Build Status](https://img.shields.io/travis/com/minofrk/decimal-durand-kerner.js/master.svg?style=flat-square)](https://travis-ci.com/minofrk/decimal-durand-kerner.js)
[![codecov.io](https://img.shields.io/codecov/c/github/minofrk/decimal-durand-kerner.js/master.svg?style=flat-square)](https://codecov.io/github/minofrk/decimal-durand-kerner.js?branch=master)
[![License](https://img.shields.io/github/license/minofrk/decimal-durand-kerner.js.svg?style=flat-square)](LICENSE)

JS/TS library for finding multiple roots of polynomials with complex coefficients using [decimal.js](https://github.com/MikeMcl/decimal.js).

Install
-------------------------------------------------------------------------------

In ECMAScript 5 environment `Number.isFinite` needs to be polyfilled.

    npm install decimal-durand-kerner decimal.js

API
-------------------------------------------------------------------------------

```typescript
import decimalDurandKerner from 'decimal-durand-kerner';
```

### `decimalDurandKerner(coefficients, config): Result`

#### `coefficients`

An `Array` of coefficients. Each `coefficients[n]` corresponds to the coefficient of *x*<sup>*n*</sup>.

```typescript
// 6 + 5x + 4x^2 + 3x^3 + 2x^4 + x^5
[6, 5, 4, 3, 2, 1];

// 1 + (2 + 3i)x^2
[1, 0, { re: 2, im: 3 }];
```

You can use `Decimal` instances from [decimal.js](https://github.com/MikeMcl/decimal.js) instead of numbers.

```typescript
// Wilkinson's polynomial
[
    new Decimal('2432902008176640000'),
    new Decimal('-8752948036761600000'),
    //
    // ... 18 lines ...
    //
    new Decimal('1'),
];
```

####  `config`

```typescript
interface Config {
    maxIterations: number;
    tolerance: number | Decimal;
    decimalConstructor?: typeof Decimal;
}
```

A calculation *succeeds* if there exists *n* &le; `maxIterations` such that |**x**<sub>*n*+1</sub> &minus; **x**<sub>*n*</sub>| &le; `tolerance` &sdot; |**x**<sub>*n*+1</sub>| where each **x**<sub>*n*</sub> is a vector consisting of approximate roots and |**z**| is a maximum norm of **z**.

- `maxIterations` ... Sufficiently large positive finite number.
- `tolerance` ... Sufficiently small positive finite number.
- `decimalConstructor` (optional) ... Customized `Decimal` constructor from `Decimal.clone()`. If not provided, `Decimal` constructor exported from `decimal.js` is used.

```typescript
// Example
{
    maxIterations: 100,
    tolerance: 1e-25,
    decimalConstructor: Decimal.clone({ precision: 30 }),
};
```

#### `Result`

```typescript
interface Result {
    roots: ComplexDecimal[];
    successful: boolean;
}

interface ComplexDecimal {
    re: Decimal;
    im: Decimal;
}
```

- `roots` ... Found roots in arbitrary order.
- `successful` ... If the calculation has *succeeded* (see above) or not. 

Example
-------------------------------------------------------------------------------

```typescript
import decimalDurandKerner from 'decimal-durand-kerner';
import Decimal from 'decimal.js';

const BigDecimal = Decimal.clone({ precision: 30 });

// -2 + x^2 = 0
const coefficients = [-2, 0, 1];

const result = decimalDurandKerner(coefficients, {
    maxIterations: 100,
    tolerance: 1e-25,
    decimalConstructor: BigDecimal,
});

// true
console.log(result.successful);

// ±√2
console.log(result.roots[0].re);
console.log(result.roots[1].re);
```

License
-------------------------------------------------------------------------------

See [LICENSE](LICENSE)
