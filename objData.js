

function infLine(_p1, _p2) {
	// let u = normalize(sub(_p1, _p2))
	let u = p5.Vector.sub(_p1, _p2).normalize()
	let p1 = p5.Vector.add(_p1, p5.Vector.mult(u, 1e3))
	let p2 = p5.Vector.add(_p2, p5.Vector.mult(u, -1e3))
	
	line(p1.x, p1.y, p2.x, p2.y)
	line(p1.x, p1.z, p2.x, p2.z)
}

function infLine3(_p1, _p2) {
	let u = p5.Vector.sub(_p1, _p2).normalize()
	let p1 = p5.Vector.add(_p1, p5.Vector.mult(u, 1e3))
	let p2 = p5.Vector.add(_p2, p5.Vector.mult(u, -1e3))
	
	sv.line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
}

function lineTraces(_p1, _p2) {
	let u = p5.Vector.sub(_p1, _p2).normalize()
	let p1 = p5.Vector.add(_p1, p5.Vector.mult(u, 1e3))
	let p2 = p5.Vector.add(_p2, p5.Vector.mult(u, -1e3))
	
	sv.push()
	sv.stroke(244, 110, 0)
	sv.line(p1.x, 0, p1.z, p2.x, 0, p2.z)
	sv.stroke(0, 110, 244)
	sv.line(p1.x, p1.y, 0, p2.x, p2.y, 0)
	sv.pop()
}

class Point {
	constructor(_pos) {
		this.pos = _pos;
	}
	
	draw2d() {
		push()
		fill(200, 150)
		line(this.pos.x, this.pos.y, this.pos.x, this.pos.z)
		noStroke()
		fill(0, 0, 255)
		ellipse(this.pos.x, this.pos.y, 10, 10)
		fill(255, 0, 0)
		ellipse(this.pos.x, this.pos.z, 10, 10)
		pop()
	}

	draw3d() {
		sv.push()
		sv.fill(0)
		sv.stroke(0)
		sv.line(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.pos.z)
		sv.line(this.pos.x, 0, this.pos.z, this.pos.x, this.pos.y, this.pos.z)
		sv.translate(this.pos)
		sv.sphere(5);
		sv.pop()
	}

	distance(p) {
		let distA1 = dist(p.x, p.y, this.pos.x, this.pos.y)
		let distA2 = dist(p.x, p.y, this.pos.x, this.pos.z)

		return createVector(distA1, distA2)
	}

}


class Line {
	constructor(_p1, _p2) {
		this.p1 = _p1
		this.p2 = _p2
	}

	draw2d() {
		push()
		fill(0)
		infLine(this.p1.pos, this.p2.pos)
		pop()
	}

	draw3d() {
		sv.push()
		sv.stroke(0)
		infLine3(this.p1.pos, this.p2.pos)
		lineTraces(this.p1.pos, this.p2.pos)

		sv.pop()
	}

}
