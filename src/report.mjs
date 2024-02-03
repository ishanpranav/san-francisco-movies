// Licensed under the MIT License.

import { parse } from 'csv-parse';
import { readFile } from 'fs';
import * as sf from './sfmovies.mjs';

function rowsToObjects(data) {
    return data.rows.map( // sic
        cells => cells.reduce((previous, current, index) => { // sic
            previous[data.headers[index]] = current;

            return previous;
        }, {}));
}

const fileName = "data/Film_Locations_in_San_Francisco.csv";

function getData(parsedData) {
    if (!parsedData.length) {
        return {
            headers: [],
            rows: []
        };
    }

    const data = {};

    [data.headers, ...data.rows] = parsedData;

    return rowsToObjects(data);
}

readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    parse(data, (err, parsedData) => {
        if (err) {
            throw err;
        }

        const state = getData(parsedData);

        console.log(sf.actorCounts(state));
    });
});
