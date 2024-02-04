// sfmovies.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

// CONSTRAINT: May not use `while`, `for`, `forEach()`

/**
 * Finds the film with the longest fun fact.
 * 
 * @param {Array} data an array of film objects.
 * @return {*} The film object with the longest `'Fun Facts'` property, or
 *             `undefined` if the `data` argument is empty. If there are 
 *             multiple films with the same maximum fun fact length, returns any
 *             such film. 
 */
export function longestFunFact(data) {
    // sic
    return data.reduce((max, datum) => {
        if (datum['Fun Facts'].length > max.length) {
            return {
                datum: datum,
                length: datum['Fun Facts'].length
            };
        }

        return max;
    }, {
        datum: undefined,
        length: 0
    }).datum;
}

/**
 * Extracts the unique titles of all movies released in the given year.
 * 
 * @param {Array}  data an array of film objects.
 * @param {Number} year the release year.
 * @return {Array} The titles of all movies released in the given year, followed
 *                 by the parenthetical year.
 */
export function getTitlesByYear(data, year) {
    // sic
    return Array.from(
        new Set(data
            .filter(datum => datum['Release Year'] == year)
            .map(datum => datum['Title'].toUpperCase() + " (" + year + ")")));
}

function increment(obj, key) {
    if (!key) {
        return;
    }
    
    if (!obj[key]) {
        obj[key] = 1;
    
        return;
    }

    obj[key]++;
}

/**
 * Creates a frequency table object that maps actor names to the number of times
 * they appear in the dataset.
 * 
 * @param {Array} data an array of film objects.
 * @return {*} An object whose keys are actor names, with each value being the
 *             number of occurrences of the actor in the dataset.
 */
export function actorCounts(data) {
    return data.reduce((result, datum) => {
        increment(result, datum['Actor 1']);
        increment(result, datum['Actor 2']);
        increment(result, datum['Actor 3']);

        return result;
    }, {});
}
