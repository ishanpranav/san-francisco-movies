// Licensed under the MIT License.

// CONSTRAINT: May not use `while`, `for`, `forEach()`

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
     * As a child element to this instance.
     * 
     * @param {GenericElement} child the element to add.
     */
    addChild(child) {
        this.children.push(child);
    }

    /** 
     * Converts this element's abstract syntax tree into a sequence of tokens.
     * 
     * @param {Number} indent the indentation level.
     * @return {Array} A sequence of tokens representing this element.
     */
    tokenize(indent) {
        const indentChars = '    '.repeat(indent);
        const tokens = [indentChars, '<', this.name];

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
            (x, child) => x.concat(['\n', ...child.tokenize(indent + 1)]),
            []));

        if (tokens.length > outerLength) {
            tokens.push('\n', indentChars);
        }

        tokens.push('</', this.name, '>');

        return tokens;
    }

    toString() {
        return this.tokenize(0).join("");
    }
}

/** Represents an SVG root (`svg`) element. */
export class RootElement extends GenericElement {
    /** Initializes a new instance of the `RootElement` class. */
    constructor() {
        super('svg');

        this.addAttr('xmlns', 'http://www.w3.org/2000/svg');
    }
}

/** Represent an SVG rectangle (`rect`) element. */
export class RectangleElement extends GenericElement {
    /** Initializes a new instance of the `RectangleElement` class. */
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
    /** Initializes a new instance of the `TextElement` class. */
    constructor(x, y, fontSize, fill, content) {
        super('text');

        this.addAttr('x', x);
        this.addAttr('y', y);
        this.addAttr('fontSize', fontSize);
        this.addAttr('fill', fill);

        this.content = content;
    }
}

// the following is used for testing
// create root element with fixed width and height
const root = new RootElement();
root.addAttrs({ width: 800, height: 170, abc: 200, def: 400 });
root.removeAttrs(['abc', 'def', 'non-existent-attribute']);

// create circle, manually adding attributes, then add to root element
const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'yellow');
c.addAttrs({ 'cx': 200, 'cy': 80 });
root.addChild(c);

// create rectangle, add to root svg element
const r = new RectangleElement(0, 0, 200, 100, 'blue');
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(50, 70, 70, 'red', 'wat is a prototype? 😬');
root.addChild(t);

// show string version, starting at root element
console.log(root.toString());

// write string version to file, starting at root element
root.write('test.svg', () => console.log('done writing!'));
