// drawing.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

// CONSTRAINT: May not use `while`, `for`, `forEach()`

import { writeFile } from 'fs';

/** Represents a generic SVG element. */
export class GenericElement {
    /** 
     * Initializes a new instance of the `GenericElement` class. 
     * 
     * @param {String} name the element name; for example, `svg`.
     */
    constructor(name) {
        this.name = name;
        this.attrs = new Map();
        this.children = [];
    }

    /**
     * Adds an attribute with the given name and value to this element if it
     * does not exist.
     * 
     * @param {String} name  the attribute name.
     * @param {String} value the attribute value.
     * @return `true` if the element was added; otherwise, false.
     */
    addAttr(name, value) {
        if (this.attrs.has(name)) {
            return false;
        }

        this.attrs.set(name, value);

        return true;
    }

    /**
     * Sets the value of an attribute with the given name to the given value,
     * creating it if it does not exist.
     * 
     * @param {String} name  the attribute name.
     * @param {String} value the attribute value.
     */
    setAttr(name, value) {
        this.attrs.set(name, value);
    }

    /**
     * Given an object, adds its properties as name-value pairs to this
     * instance's attributes, including only those that do not already exist.
     * 
     * @param {*} obj the object whose properties to add as name-value pairs.
     * @return the number of attributes added.
     */
    addAttrs(obj) {
        return Object
            .entries(obj)
            .reduce(
                (count, [name, value]) => count + this.addAttr(name, value),
                0);
    }

    /**
     * Given an array of attribute names, removes them if they exist.
     * 
     * @param {Array} arr the array of attribute names to remove.
     * @return the number of attributes removed.
     */
    removeAttrs(arr) {
        return arr.reduce((count, name) => count + this.attrs.delete(name), 0);
    }

    /**
     * Adds a child element to this instance.
     * 
     * @param {GenericElement} child the element to add.
     */
    addChild(child) {
        this.children.push(child);
    }

    /** 
     * Converts this element's abstract syntax tree into a sequence of tokens.
     * 
     * @param {Array}  tokens an existing array of tokens.
     * @param {Number} indent the indentation level.
     * @return {Array} A sequence of tokens representing this element.
     */
    tokenize(tokens, indent) {
        const indentChars = '    '.repeat(indent);
        
        tokens.push(indentChars, '<', this.name);

        // sic
        tokens.push(...Array
            .from(this.attrs.entries())
            .reduce(
                (x, [name, value]) => x.concat([' ', name, '="', value, '"']),
                []));

        tokens.push('>');

        const outerLength = tokens.length;

        if (this.content) {
            tokens.push('\n', indentChars, '    ', this.content);
        }

        // sic
        tokens.push(...this.children.reduce(
            (x, child) => x.concat(['\n', ...child.tokenize([], indent + 1)]),
            []));

        if (tokens.length > outerLength) {
            tokens.push('\n', indentChars);
        }

        tokens.push('</', this.name, '>');

        return tokens;
    }

    toString() {
        return this.tokenize([], 0).join("");
    }
}

/** Represents an SVG root (`svg`) element. */
export class RootElement extends GenericElement {
    /** Initializes a new instance of the `RootElement` class. */
    constructor() {
        super('svg');

        this.addAttr('xmlns', 'http://www.w3.org/2000/svg');
    }

    /**
     * Saves the string representation of this element to a file.
     *
     * @param {String}    fileName the file path.
     * @param {() => any} cb       a parameterless callback action invoked
     *                             after writing.
     */
    write(fileName, cb) {
        writeFile(fileName, this.toString(), cb);
    }

    toString() {
        return this
            .tokenize([
`<?xml version="1.0" encoding="utf-8"?>
<!-- Licensed under the MIT License. -->
`
            ], 0)
            .join("");
    }
}

/** Represent an SVG rectangle (`rect`) element. */
export class RectangleElement extends GenericElement {
    /**
     * Initializes a new instance of the `RectangleElement` class.
     *
     * @param {Number} x      the horizontal position.
     * @param {Number} y      the vertical position.
     * @param {Number} width  the horizontal dimension.
     * @param {Number} height the vertical dimension.
     * @param {String} fill   the fill color.
     */
    constructor(x, y, width, height, fill) {
        super('rect');

        this.addAttr('x', x);
        this.addAttr('y', y);
        this.addAttr('width', width);
        this.addAttr('height', height);
        this.addAttr('fill', fill);
    }
}

/** Represents an SVG text (`text`) element. */
export class TextElement extends GenericElement {
    /**
     * Initializes a new instance of the `TextElement` class.
     * 
     * @param {Number} x        the horizontal position.
     * @param {Number} y        the vertical position.
     * @param {Number} fontSize the font size.
     * @param {String} content  the text content.
     */
    constructor(x, y, fontSize, fill, content) {
        super('text');

        this.addAttr('x', x);
        this.addAttr('y', y);
        this.addAttr('font-size', fontSize);
        this.addAttr('fill', fill);

        this.content = content;
    }
}

const root = new RootElement();
root.addAttrs({ width: 800, height: 170, abc: 200, def: 400 });
root.removeAttrs(['abc', 'def', 'non-existent-attribute']);

const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'yellow');
c.addAttrs({ 'cx': 200, 'cy': 80 });
root.addChild(c);

const r = new RectangleElement(0, 0, 200, 100, 'blue');
root.addChild(r);

const t = new TextElement(50, 70, 70, 'red', 'wat is a prototype? 😬');
root.addChild(t);

console.log(root.toString());

root.write('test.svg', () => console.log('done writing!'));
