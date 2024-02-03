// report.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

// CONSTRAINT: May not use `while`, `for`, `forEach()`

import { parse } from 'csv-parse';
import { readFile } from 'fs';
import { RectangleElement, RootElement, TextElement } from './drawing.mjs';
import { rowsToObjects } from './hoffy.mjs';
import { actorCounts, getTitlesByYear, longestFunFact } from './sfmovies.mjs';

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

function addBar(root, pair, offset, color) {
    const [, value] = pair;

    root.addChild(new RectangleElement(offset, 0, 40, value, color));
    root.addChild(new TextElement(offset, value + 20, 12, 'black', pair));

    return offset + 110;
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    parse(data, (err, parsedData) => {
        if (err) {
            throw err;
        }

        const state = getData(parsedData);

        console.log(longestFunFact(state));
        console.log(getTitlesByYear(state, 2023));
        
        const frequencies = actorCounts(state);
        const sorted = Object
            .entries(frequencies)
            .sort(([_1, left], [_2, right]) => {
                return right - left;
            });

        const root = new RootElement();
        let offset = 0;

        offset = addBar(root, sorted[0], offset, 'blue');
        offset = addBar(root, sorted[1], offset, 'yellow');
        offset = addBar(root, sorted[2], offset, 'black');

        root.write('actors.svg', () => {});
    });
});
