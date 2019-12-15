const isCoordinateInsideSegment = function(coordinate, limit1, limit2) {
  const min = Math.min(limit1, limit2);
  const max = Math.max(limit1, limit2);

  return coordinate >= min && coordinate <= max;
};

const arePointsEqual = function(point1, point2) {
  return point1.x === point2.x && point1.y === point1.y;
};

class Line {
  constructor(pointA, pointB) {
    this.endA = { x: pointA.x, y: pointA.y };
    this.endB = { x: pointB.x, y: pointB.y };
  }

  toString() {
    return `[Line (${this.endA.x},${this.endA.y}) to (${this.endB.x},${this.endB.y})]`;
  }

  split() {
    const midPoint = {
      x: (this.endA.x + this.endB.x) / 2,
      y: (this.endA.y + this.endB.y) / 2
    };

    return [
      new this.constructor(this.endA, midPoint),
      new this.constructor(midPoint, this.endB)
    ];
  }

  get length() {
    const diffInX = this.endA.x - this.endB.x;
    const diffInY = this.endA.y - this.endB.y;
    return Math.sqrt(diffInX ** 2 + diffInY ** 2);
  }

  getSlope(line = this) {
    const diffInX = line.endA.x - line.endB.x;
    const diffInY = line.endA.y - line.endB.y;
    return diffInY / diffInX;
  }

  get slope() {
    return this.getSlope();
  }

  getIntercept(line = this) {
    let intercept = this.endA.y - this.endA.x * this.slope;
    if (intercept == Infinity) intercept = undefined;
    return intercept;
  }

  get intercept() {
    return this.getIntercept();
  }

  isEqualTo(otherObject) {
    return (
      otherObject instanceof Line &&
      arePointsEqual(this.endA, otherObject.endA) &&
      arePointsEqual(this.endB, otherObject.endB)
    );
  }

  isParallelTo(otherObject) {
    if (this.isEqualTo(otherObject)) return false;

    return (
      otherObject instanceof Line && this.slope === this.getSlope(otherObject)
    );
  }

  findX(y) {
    if (!isCoordinateInsideSegment(y, this.endA.y, this.endB.y)) return NaN;
    if (this.slope == Infinity || this.slope == -Infinity) return this.endA.x;
    return (y - this.intercept) / this.slope;
  }
}

module.exports = Line;
