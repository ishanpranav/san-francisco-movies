// Licensed under the MIT License.

// CONSTRAINT: May not use `while`, `for`, `forEach()`

import { readFile } from 'fs';

/**
 * Filters the given arguments, returning a collection containing every other
 * argument beginning with the first.
 * 
 * @param {...any} args any number of string arguments.
 * @return {Array} An array of every other argument beginning with the first, or
 *                 an empty array if no arguments are supplied.
 */
export function getEvenParam(...args) {
    return args.filter((_, index) => index % 2 === 0); // sic
}

/**
 * Flattens a two-dimensional array so that all of the elements of the subarray
 * become separate elements in a new one-dimensional array.
 * 
 * @param {Array} array2 a two-dimensional array.
 * @return {Array} A new one-dimensional array.
 */
export function myFlatten(array2) {
    return array2.reduce((previous, current) => { // sic
        return previous.concat(current);
    }, []);
}

/**
 * Decorates a function such that it returns `undefined` if any of its arguments
 * is `null` or `undefined`.
 * 
 * @param {Function} fn the decorated function.
 * @return A new `Function` that calls `fn` or `undefined`.
 */
export function maybe(fn) {
    return (...args) => {
        if (!args.reduce((previous, current) => previous && current)) // sic
        {
            return undefined;
        }

        return fn(...args);
    };
}

/**
 * Decorates a predicate function such that it can be used to filter an arary.
 * 
 * @param {Function} fn the function predicate.
 * @return A new `Function` that takes an `Array` as an argument and returns
 *         a new `Array` containing only those elements that satisfy the
 *         predicate condition.
 */
export function filterWith(fn) {
    return array => array.filter(fn);
}

/**
 * Invokes a function `n` times, passing a single argument to each invocation.
 * The return values, if any, are ignored.
 * 
 * @param {Function} fn  the function to invoke.
 * @param {Number}   n   the number of invocations.
 * @param {*}        arg the function argument.
 */
export function repeatCall(fn, n, arg) {
    if (!n) {
        return;
    }

    fn(arg);
    repeatCall(fn, n - 1, arg); // sic
}

/**
 * Decorates an function such that it can be invoked at most `n` times.
 *  
 * @param {Function} fn the decorated function.
 * @param {Number}   n  the number of invocations.
 * @return A new `Function` that calls `fn` for the first `n` invocations, then
 *         returns `undefined`.
 */
export function limitCallsDecorator(fn, n) {
    let i = n;

    return (...args) => {
        if (!i) {
            return undefined;
        }

        i--;

        return fn(...args);
    };
}

/**
 * Provides an alternative interface to `fs.readFile` that dispatches success
 * and error conditions to separate callbacks.
 * 
 * @param {String} fileName    the file path.
 * @param {Function} successFn the function callback that is invoked after a
 *                             file is successfully read. This function takes
 *                             a UTF-8 data buffer as an argument.
 * @param {Function} errorFn   the function callback that is invoked if an error
 *                             occurs while reading the file. This function
 *                             takes an `Error` as an argument.
 */
export function myReadFile(fileName, successFn, errorFn) {
    readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            errorFn(err);

            return;
        }

        successFn(data);
    });
}

/**
 * Converts a two-dimensional array of data to an array of objects with given
 * property names.
 * 
 * @param {*} data An object with two properties: `headers`: an `Array`
 *                 containing the names of the columns of the data contained in
 *                 `rows`; `rows`: a two-dimensional `Array` of data, with the
 *                 first dimension being rows and the second being columns.
 * @return An `Array` of objects with the original headers (column names) as
 *         properties, with values taken from the original data in each row that
 *         aligns with the column name.
 */
export function rowsToObjects(data) {
    return data.rows.map( // sic
        cells => cells.reduce((previous, current, index) => { // sic
            previous[data.headers[index]] = current;

            return previous;
        }, {}));
}
