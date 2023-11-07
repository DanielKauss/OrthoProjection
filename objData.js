function infLine(_p1, _p2) {
	// let u = normalize(sub(_p1, _p2))
	let u = p5.Vector.sub(_p1, _p2).normalize()
	let p1 = p5.Vector.add(_p1, p5.Vector.mult(u, 1e5))
	let p2 = p5.Vector.add(_p2, p5.Vector.mult(u, -1e5))

	line(p1.x, p1.y, p2.x, p2.y)
	line(p1.x, p1.z, p2.x, p2.z)
}

function infLine3(_p1, _p2) {
	let u = p5.Vector.sub(_p1, _p2).normalize()
	let p1 = p5.Vector.add(_p1, p5.Vector.mult(u, 1e5))
	let p2 = p5.Vector.add(_p2, p5.Vector.mult(u, -1e5))

	sv.line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
}

function lineTraces(_p1, _p2) {
	let u = p5.Vector.sub(_p1, _p2).normalize()
	let p1 = p5.Vector.add(_p1, p5.Vector.mult(u, 1e5))
	let p2 = p5.Vector.add(_p2, p5.Vector.mult(u, -1e5))

	sv.push()
	sv.stroke(244, 110, 0)
	sv.line(p1.x, 0, p1.z, p2.x, 0, p2.z)
	sv.stroke(0, 110, 244)
	sv.line(p1.x, p1.y, 0, p2.x, p2.y, 0)
	sv.pop()
}

class Point {
	active = true
	drawOrder = 0
	constructor(_pos) {
		this.pos = _pos;
	}

	draw2d() {
		push()
		stroke(0)
		strokeWeight(1)
		drawingContext.setLineDash([5, 5]);
		fill(200, 150)
		line(this.pos.x, this.pos.y, this.pos.x, this.pos.z)
		fill(0, 0, 255)
		ellipse(this.pos.x, this.pos.y, 10, 10)
		fill(255, 0, 0)
		ellipse(this.pos.x, this.pos.z, 10, 10)
		pop()
	}

	draw3d() {
		sv.push()
		sv.stroke(0, 220)
		sv.line(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.pos.z)
		sv.line(this.pos.x, 0, this.pos.z, this.pos.x, this.pos.y, this.pos.z)
		sv.translate(this.pos)
		sv.noStroke()
		sv.fill(0)
		sv.sphere(5);
		sv.pop()
	}

	intersections(objects) { }

	distance(p) {
		let distA1 = dist(p.x, p.y, this.pos.x, this.pos.y)
		let distA2 = dist(p.x, p.y, this.pos.x, this.pos.z)

		return createVector(distA1, distA2)
	}

}


class Line {
	drawOrder = 1
	constructor(_p1, _p2) {
		this.p1 = _p1
		this.p2 = _p2

		this.h = createVector()
		this.v = createVector()
	}

	draw2d() {
		push()
		stroke(0)
		strokeWeight(1)
		infLine(this.p1.pos, this.p2.pos)

		fill(244, 110, 0)
		ellipse(this.h.x, this.h.y, 10, 10)
		ellipse(this.h.x, this.h.z, 10, 10)

		fill(0, 110, 244)
		ellipse(this.v.x, this.v.y, 10, 10)
		ellipse(this.v.x, this.v.z, 10, 10)
		pop()
	}

	draw3d() {
		sv.push()
		sv.stroke(0)
		sv.strokeWeight(2)
		infLine3(this.p1.pos, this.p2.pos)
		lineTraces(this.p1.pos, this.p2.pos)

		sv.noStroke()
		sv.push()
		sv.translate(this.h)
		sv.fill(244, 110, 0)
		sv.sphere(5)
		sv.pop()

		sv.push()
		sv.translate(this.v)
		sv.fill(0, 110, 244)
		sv.sphere(5)
		sv.pop()

		sv.pop()
	}

	intersections(objects) {
		if (this.p1.active == false || this.p2.active == false) {
			let selfIndex = geometries.indexOf(this)
			if (selfIndex != -1) {
				geometries.splice(geometries.indexOf(this), 1)
			}
		}
		this.h = linePlaneInt(this.p1.pos, this.p2.pos, createVector(0, 0, 0), createVector(0, 1, 0))
		this.v = linePlaneInt(this.p1.pos, this.p2.pos, createVector(0, 0, 0), createVector(0, 0, 1))
	}
}


class Plane {
	drawOrder = 2
	constructor(_p1, _p2, _p3) {
		this.p1 = _p1
		this.p2 = _p2
		this.p3 = _p3

		this.pd = vcross(vsub(_p1.pos, _p2.pos), vsub(_p2.pos, _p3.pos))
		this.pd.normalize()

		this.l1 = new Line(_p1, _p2)
		this.l2 = new Line(_p2, _p3)

		this.shade = Math.random() * 140
	}

	draw2d() {
		push()
		stroke(220, 0, 110)
		infLine(this.l1.h, this.l2.h)
		stroke(110, 0, 220)
		infLine(this.l1.v, this.l2.v)
		stroke(50, 150)
		infLine(this.p1.pos, this.p2.pos)
		infLine(this.p2.pos, this.p3.pos)
		pop()

	}
	draw3d() {
		sv.push()

		sv.push()
		sv.stroke(220, 0, 110)
		sv.strokeWeight(2)
		infLine3(this.l1.h, this.l2.h)
		sv.stroke(110, 0, 220)
		infLine3(this.l1.v, this.l2.v)
		sv.pop()

		let yRot = Math.atan2(this.pd.x, this.pd.z)
		let r = Math.sqrt(this.pd.x * this.pd.x + this.pd.z * this.pd.z)
		let xRot = Math.atan2(r, this.pd.y) + Math.PI / 2

		sv.translate(this.p1.pos)
		sv.rotateY(yRot)
		sv.rotateX(xRot)
		sv.fill(0, 0, 110 + this.shade, 150)
		sv.plane(700)

		sv.pop()

	}
	intersections() {
		if (this.p1.active == false || this.p2.active == false || this.p3.active == false) {
			let selfIndex = geometries.indexOf(this)
			if (selfIndex != -1) {
				geometries.splice(geometries.indexOf(this), 1)
			}
		}
		this.pd = vcross(vsub(this.p2.pos, this.p1.pos), vsub(this.p3.pos, this.p1.pos))
		this.pd.normalize()
		this.l1.intersections(0)
		this.l2.intersections(0)
	}


}
