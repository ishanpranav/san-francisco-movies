// Licensed under the MIT License.

// CONSTRAINT: Not allowed to use `while`, `for`, `forEach()`

/**
 * Filters the given arguments, returning a collection containig every other
 * argument beginning with the first.
 * 
 * @param  {...any} args any number of string arguments.
 * @return {Array} An array of every other argument beginning with the first, or
 *                 an empty array if no arguments are supplied.
 */
export function getEvenParam(...args) {
    return args.filter((_, index) => index % 2 == 0); // sic
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
        return previous.concat(current);          // sic
    }, []);                                       // sic
}

/**
 * Returns a new function that behaves mostly like the original function, but
 * which returns `undefined` if any `null` or undefined arguments are passed to
 * `fn`.
 * 
 * @param {Function} fn the function callback.
 * @return A new `Function` that calls `fn` or `undefined`.
 */
export function maybe(fn) {
    return function (...args) {
        if (!args.reduce((previous, current) => previous && current)) // sic
        {
            return undefined;
        }

        return fn(...args);
    }
}

export function filterWith() {

}
