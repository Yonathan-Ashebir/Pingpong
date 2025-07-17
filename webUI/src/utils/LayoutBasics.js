// LineSegment, Point, Vector
//  getCoordinatesFromParameters



 // return this for methods that does not return a value
export class Vector {
    x = 0
    y = 0

    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    rotate(rad) {
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)
        const x = this.x * cos - this.y * sin
        const y = this.x * sin + this.y * cos
        this.x = x
        this.y = y
        return this
    }

    getR() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    setR(r) {
        const theta = Math.atan2(this.y, this.x)
        this.x = r * Math.cos(theta)
        this.y = r * Math.sin(theta)
        return this
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    resetComponent(direction, multiplier) {
        const mag = Math.abs((this.x * direction.x + this.y * direction.y) /
                    Math.sqrt(direction.x ** 2 + direction.y ** 2))
        const factor = multiplier * mag / Math.sqrt(direction.x ** 2 + direction.y ** 2)
        this.x = direction.x * factor
        this.y = direction.y * factor
        return this
    }

    setX(x){
        this.x  = x
        return this
    }

    setY(y){
        this.y = y
        return this
    }
}

export class LineSegment {
    a
    b

    constructor(a, b) {
        this.a = a
        this.b = b
    }

    to(point) {
        const ax = this.a.x, ay = this.a.y
        const bx = this.b.x, by = this.b.y
        const px = point.x, py = point.y

        const abx = bx - ax, aby = by - ay
        const apx = px - ax, apy = py - ay
        const abLenSq = abx * abx + aby * aby
        const dot = apx * abx + apy * aby
        let t = Math.max(0, Math.min(1, dot / abLenSq))
        const closestX = ax + abx * t
        const closestY = ay + aby * t
        return new Vector(px - closestX, py - closestY)
    }

    getA() {
        return this.a
    }

    getB() {
        return this.b
    }

    getR() {
        return Math.sqrt(
            (this.b.x - this.a.x) ** 2 + (this.b.y - this.a.y) ** 2
        )
    }
}

export class Point {
    x = 0
    y = 0

    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    setX(x) {
        this.x = x
        return this
    }

    setY(y) {
        this.y = y
        return this
    }
}

export function getCoordinatesFromParameters({ height, width, x, y, bound }) {
    const maxX = bound.right - width
    const maxY = bound.bottom - height
    const minX = bound.left
    const minY = bound.top

    return {
        x: Math.min(Math.max(x, minX), maxX),
        y: Math.min(Math.max(y, minY), maxY)
    }
}
