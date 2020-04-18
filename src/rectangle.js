const Point = require('./point');
const Line = require('./line');

const withinRange = function (value) {
  return value > this.min && value < this.max;
};

const getLimit = function (point1, point2) {
  const max = Math.max(point1, point2);
  const min = Math.min(point1, point2);
  return { max, min };
};

const getRange = function (rectangle) {
  const x = getLimit(rectangle.vertexA.x, rectangle.vertexC.x);
  const y = getLimit(rectangle.vertexA.y, rectangle.vertexC.y);
  return { x, y };
};

const getSides = function (line) {
  const sides = [];
  const names = ['B', 'C', 'D', 'A'];
  let prevName = 'A';

  for (let name of names) {
    sides.push(new Line(line[`vertex${prevName}`], line[`vertex${name}`]));
    prevName = name;
  }

  return sides;
};

class Rectangle {
  constructor(pointA, pointC) {
    this.vertexA = new Point(pointA.x, pointA.y);
    this.vertexB = new Point(pointC.x, pointA.y);
    this.vertexC = new Point(pointC.x, pointC.y);
    this.vertexD = new Point(pointA.x, pointC.y);
    this.l = this.vertexA.findDistanceTo(this.vertexB);
    this.b = this.vertexB.findDistanceTo(this.vertexC);
  }

  get area() {
    return this.l * this.b;
  }

  get perimeter() {
    return 2 * (this.l + this.b);
  }

  toString() {
    return `[Rectangle (${this.vertexA.x},${this.vertexA.y}) to (${this.vertexC.x},${this.vertexC.y})]`;
  }

  isEqualTo(rectangle) {
    const vertices = ['vertexA', 'vertexB', 'vertexC', 'vertexD'];

    if (!(rectangle instanceof Rectangle)) return false;

    for (let vertex of vertices) {
      if (!this[vertex].isEqualTo(rectangle[vertex])) return false;
    }

    return true;
  }

  hasPoint(point) {
    if (!(point instanceof Point)) return false;
    const sides = getSides(this);
    return sides.some((side) => point.isOn(side));
  }

  covers(point) {
    if (!(point instanceof Point)) return false;
    const range = getRange(this);
    const withinXRange = withinRange.bind(range.x);
    const withinYRange = withinRange.bind(range.y);
    return withinXRange(point.x) && withinYRange(point.y);
  }
}

module.exports = Rectangle;
