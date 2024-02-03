// Licensed under the MIT License.

/**
 * Filters the given arguments, returning a collection containig every other
 * argument beginning with the first.
 * 
 * @param  {...any} args any number of string arguments.
 * @return {Array} An array of every other argument beginning with the first, or
 *                 an empty array if no arguments are supplied.
 */
export function getEvenParam(...args) {
    let i = 0;
    let j = 0;
    let result = new Array(Math.trunc(args.length / 2));
    
    while (i < args.length) {
        result[j] = args[i];
        i += 2;
        j++;
    }

    return result;
}

export function filterWith() {

}
