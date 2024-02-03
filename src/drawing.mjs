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
    }
}

/** Represents an SVG root (`svg`) element. */
class RootElement {

}

/** Represent an SVG rectangle (`rect`) element. */
class RectangleElement {

}

/** Represents an SVG text (`text`) element. */
class TextElement {

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