/**
 * Complement array with zeros.
 *
 * @param {Array.<number>} a
 * @param {number} n
 * @returns {Array.<number>}
 */
let complement = (a, n) => new Array(n).fill(0).concat(a);

/**
 * Complement the shorter of the operands with zeros.
 *
 * @param {Array.<number>} a
 * @param {Array.<number>} b
 * @returns {[*,*]}
 */
function complementOperands(a, b) {
    if (a.length < b.length) {
        a = complement(a, b.length - a.length);
    } else if (b.length < a.length) {
        b = complement(b, a.length - b.length);
    }
    return [a, b];
}

/**
 * Remove leading zeros from the array.
 *
 * @param {Array.<number>} a
 * @returns {Array.<number>}
 */
function removeLeadingZeros(a) {
    let cnt = 0;
    for (let i = 0; i < a.length - 1; i++) {
        if (a[i] === 0) {
            cnt++;
        } else {
            break;
        }
    }
    return a.slice(cnt);
}

console.assert(removeLeadingZeros([0, 0]).length === 1);
console.assert(removeLeadingZeros([0, 0, 1, 0]).length === 2);
console.assert(removeLeadingZeros([0, 0, 1, 0])[0] === 1);
console.assert(removeLeadingZeros([0, 0, 1, 0])[1] === 0);

/**
 * @param {number} n
 * @returns {string}
 */
let bPow = n => '1' + '0'.repeat(n);

/**
 * Summation of numbers represented by array (Naive).
 *
 * @param {Array.<number>} a
 * @param {Array.<number>} b
 * @returns {Array.<number>}
 */
function sum(a, b) {
    let tmp = 0,
        result = [];
    [a, b] = complementOperands(a, b);
    for (let i = a.length - 1; i >= 0; i--) {
        let x = Number(a[i]) + Number(b[i]) + tmp;
        if (x >= 10) {
            tmp = 1;
            result[i] = x - 10;
        } else {
            tmp = 0;
            result[i] = x;
        }
    }
    if (tmp !== 0) {
        result.unshift(tmp);
    }
    return result;
}

/**
 * Subtraction of numbers represented by array (Naive).
 *
 * @param {Array.<number>} a
 * @param {Array.<number>} b
 * @returns {Array.<number>}
 */
function sub(a, b) {
    [a, b] = a.length >= b.length ? [a, b] : [b, a];
    [a, b] = complementOperands(a, b);
    let result = [],
        n = a.length;
    for (let i = n - 1; i >= 0; i--) {
        if (a[i] >= b[i]) {
            result[i] = a[i] - b[i];
        } else {
            a[i - 1] -= 1;
            result[i] = a[i] + 10 - b[i];
        }
    }
    return removeLeadingZeros(result);
}

/**
 * Multiplication of numbers represented by arrays (Naive).
 *
 * @param {Array.<number>} a
 * @param {Array.<number>} b
 * @returns {Array.<number>}
 */
function mult(a, b) {
    let rows = [],
        result = [],
        c = 0,
        tmp = 0;
    [a, b] = a.length > b.length ? [a, b] : [b, a];
    for (let i = b.length - 1; i >= 0; i--) {
        for (let j = a.length - 1; j >= 0; j--) {
            if (rows[i] === undefined) rows[i] = [];
            let z = a[j] * b[i] + tmp;
            if (z >= 10) {
                tmp = (z - (z % 10)) / 10;
                rows[i][j] = z % 10;
            } else {
                tmp = 0;
                rows[i][j] = z;
            }
        }
        if (tmp > 0) {
            rows[i].unshift(tmp);
            tmp = 0;
        }
        rows[i] = rows[i].concat(new Array(c).fill(0));
        c++;
    }
    for (let i = rows.length - 1; i >= 0; i--) {
        result = sum(result, rows[i]);
    }
    return result;
}

/**
 *
 * @param {NumberArray} x
 * @param {NumberArray} y
 * @returns {NumberArray}
 */
function karatsuba(x, y) {
    if (x.length === 1 || y.length === 1) {
        return x.mult(y);
    }
    let a, b, c, d, m, z0, z1, z2, result;

    m = Math.max(x.length, y.length);
    m = Math.floor(m / 2);

    [a, b] = x.split(m);
    [c, d] = y.split(m);

    z2 = karatsuba(a, c);
    z0 = karatsuba(b, d);
    z1 = karatsuba(a.sum(b), c.sum(d)).sub(z2).sub(z0);

    result = z2.mult(NumberArray.of(bPow(2 * m)))
        .sum(z1.mult(NumberArray.of(bPow(m))))
        .sum(z0);

    return result;
}

/**
 * Representation of a Number as an Array.
 *
 * @param {Array.<number>} a
 * @returns {{length: Number, toArray: toArray, sum: sum, sub: sub, mult: mult, split: split, toString: toString, valueOf: valueOf}}
 * @constructor
 */
function NumberArray(a) {
    a = removeLeadingZeros(a);
    return {
        length: a.length,
        toArray: function () {
            return a;
        },
        sum: function (n) {
            return new NumberArray(sum(a, n.toArray()));
        },
        sub: function (n) {
            return new NumberArray(sub(a, n.toArray()));
        },
        mult: function (n) {
            return new NumberArray(mult(a, n.toArray()));
        },
        split: function (m) {
            return [
                new NumberArray(a.slice(0, -m)),
                new NumberArray(a.slice(-m))
            ];
        },
        toString: function () {
            return a.join('');
        },
        valueOf: function () {
            return Number(this.toString());
        }
    };
}

NumberArray.karatsuba = karatsuba;

/**
 * Create NumberArray from a string convertible argument.
 *
 * @param {*} n
 * @returns {NumberArray}
 */
NumberArray.of = n => new NumberArray(n.toString().split('').map(x => parseInt(x)));

console.assert(karatsuba(NumberArray.of(99), NumberArray.of(10)).toString() === '990');
console.assert(karatsuba(NumberArray.of(9), NumberArray.of(9)).toString() === '81');
console.assert(karatsuba(NumberArray.of(999), NumberArray.of(100)).toString() === '99900');

module.exports = NumberArray;