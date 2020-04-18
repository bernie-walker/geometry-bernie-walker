const Point = require('./point');

const getCoordinates = function (line, m, n) {
  const sumOfRatios = m + n;
  const x = (m * line.endB.x + n * line.endA.x) / sumOfRatios;
  const y = (m * line.endB.y + n * line.endA.y) / sumOfRatios;
  return { x, y };
};

const isVertical = function (slope) {
  return slope == Infinity || slope == -Infinity;
};

const isCoordinateInsideSegment = function (coordinate, limit1, limit2) {
  const min = Math.min(limit1, limit2);
  const max = Math.max(limit1, limit2);

  return coordinate >= min && coordinate <= max;
};

class Line {
  constructor(pointA, pointB) {
    this.endA = new Point(pointA.x, pointA.y);
    this.endB = new Point(pointB.x, pointB.y);
  }

  toString() {
    return `[Line (${this.endA.x},${this.endA.y}) to (${this.endB.x},${this.endB.y})]`;
  }

  split() {
    const midPoint = {
      x: (this.endA.x + this.endB.x) / 2,
      y: (this.endA.y + this.endB.y) / 2,
    };

    return [new Line(this.endA, midPoint), new Line(midPoint, this.endB)];
  }

  get length() {
    return this.endA.findDistanceTo(this.endB);
  }

  get slope() {
    const diffInX = this.endA.x - this.endB.x;
    const diffInY = this.endA.y - this.endB.y;
    return diffInY / diffInX;
  }

  get intercept() {
    let intercept = this.endA.y - this.endA.x * this.slope;
    if (intercept == Infinity) intercept = NaN;
    return intercept;
  }

  isEqualTo(otherObject) {
    return (
      otherObject instanceof Line &&
      this.endA.isEqualTo(otherObject.endA) &&
      this.endB.isEqualTo(otherObject.endB)
    );
  }

  isParallelTo(otherObject) {
    if (
      this.intercept == otherObject.intercept ||
      !(otherObject instanceof Line)
    )
      return false;

    return otherObject instanceof Line && this.slope === otherObject.slope;
  }

  findX(y) {
    if (!isCoordinateInsideSegment(y, this.endA.y, this.endB.y)) return NaN;
    if (isVertical(this.slope)) return this.endA.x;
    if (this.slope == 0) return Math.max(this.endA.x, this.endB.x);
    return (y - this.intercept) / this.slope;
  }

  findY(x) {
    if (!isCoordinateInsideSegment(x, this.endA.x, this.endB.x)) return NaN;
    if (isVertical(this.slope)) return Math.max(this.endA.y, this.endB.y);
    return this.slope * x + this.intercept;
  }

  hasPoint(point) {
    if (!(point instanceof Point)) return false;
    return point.x == this.findX(point.y) || point.y == this.findY(point.x);
  }

  findPointFromStart(distance) {
    if (distance > this.length || distance < 0) return undefined;
    const coordinates = getCoordinates(this, distance, this.length - distance);
    return new Point(coordinates.x, coordinates.y);
  }

  findPointFromEnd(distance) {
    const reversedLine = new Line(this.endB, this.endA);
    return reversedLine.findPointFromStart(distance);
  }
}

module.exports = Line;
