let vdot = p5.Vector.dot
let vcross = p5.Vector.cross
let vadd = p5.Vector.add
let vsub = p5.Vector.sub
let vmult = p5.Vector.mult

let bgColor = 160
let bgEditorColor = 132
let axisPlaneColor = 40
let axisPlaneAlpha = 150

let sv;
let gl;
let camSv;
let sensitivityX = 0.001

const editModes = {
	Move: 1,
	Point: 2,
	Line: 3,
	Plane: 4
}
let currentMode = editModes.Move;
let selected = []
let selectedA1 = true

let currCamera;
let panelWidth = 0

let geometries = []

function setup() {
	createCanvas(windowWidth, windowHeight);
	panelWidth = width / 2

	sv = createGraphics(panelWidth, height, WEBGL)
	gl = sv._renderer.GL
	// gl.disable(gl.DEPTH_TEST)
	camSv = sv.createCamera()
	camSv.ortho(-panelWidth / 2, panelWidth / 2, height / 2, -height / 2, -10000, 10000);
	camSv.move(0, 150, 0)
	camSv.lookAt(0, 0, 0)
}

// draw from front to back
function drawPlanes() {
	sv.push()
	sv.fill(axisPlaneColor, axisPlaneAlpha - 20)
	sv.rotateX(radians(90))
	sv.translate(0, -150, 0)
	sv.plane(600, 300)
	sv.pop()

	sv.push()
	sv.fill(axisPlaneColor, axisPlaneAlpha)
	sv.translate(0, -150, 0)
	sv.plane(600, 300)
	sv.pop()
	
	sv.push()
	sv.fill(axisPlaneColor, axisPlaneAlpha)
	sv.translate(0, 150, 0)
	sv.plane(600, 300)
	sv.pop()

	sv.push()
	sv.fill(axisPlaneColor, axisPlaneAlpha - 20)
	sv.rotateX(radians(90))
	sv.translate(0, 150, 0)
	sv.plane(600, 300)
	sv.pop()

	sv.push()
	sv.stroke(0)
	sv.strokeWeight(4)
	sv.line(-300, 0, 0, 300, 0, 0)
	sv.pop()

}

function draw() {
	geometries.sort(function(a, b) {return a.drawOrder - b.drawOrder})

	background(150);

	// 3d graphics
	sv.clear()
	sv.blendMode(ADD)
	sv.background(bgColor)
	sv.push()
	sv.rotateY(radians(45))
	sv.scale(1, -1, 1)
	// sv.rotateX(radians(-10))
	// sv.rotateZ(radians(-10))
	sv.noStroke()


	for (let i = 0; i < geometries.length; i++) {
		geometries[i].intersections(0)
	}
	for (let i = 0; i < geometries.length; i++) {
		geometries[i].draw3d()
	}

	drawPlanes()
	
	sv.pop()


	// 2d graphics
	push()
	translate(width / 4, height / 2);
	fill(bgEditorColor);
	rect(-panelWidth / 2, -height / 2, panelWidth, height);
	for (let i = 0; i < geometries.length; i++) {
		geometries[i].draw2d()
	}
	stroke(0)
	strokeWeight(2)
	line(-panelWidth / 2, 0, panelWidth / 2, 0);
	pop()

	// geometriesy space on top
	fill(bgColor)
	rect(panelWidth, 0, panelWidth, height)
	image(sv, panelWidth, 0)
}

function editorMousePress() {
	let mX = mouseX - panelWidth / 2
	let mY = mouseY - height / 2
	let mousePos = createVector(mX, mY, -mY)
	for (let i = 0; i < geometries.length; i++) {
		if (!(geometries[i] instanceof Point)) { continue; }
		let dist = geometries[i].distance(mousePos)
		if (dist.x < 10) {
			selected.push(geometries[i])
			selectedA1 = true
		}
		if (dist.y < 10) {
			selected.push(geometries[i])
			selectedA1 = false
		}
	}

	if (mouseButton === RIGHT) {
		console.log(selected)
		if (selected.length > 0) {
			console.log("trying to delete" + geometries.indexOf(selected[selected.length-1]))
			geometries.splice(geometries.indexOf(selected[selected.length-1]), 1)
			selected[selected.length-1].active = false
		}
		selected = []
		return
	}

	if (currentMode === editModes.Point) {
		geometries.push(new Point(mousePos))
		selected = []
	}

	if (currentMode === editModes.Line && selected.length > 1) {
		let p1 = selected[selected.length - 1]
		let p2 = selected[selected.length - 2]
		geometries.push(new Line(p1, p2))
		selected = []
	}

	if (currentMode === editModes.Plane && selected.length > 2) {
		let p1 = selected[selected.length - 1]
		let p2 = selected[selected.length - 2]
		let p3 = selected[selected.length - 3]
		geometries.push(new Plane(p1, p2, p3))
		selected = []

	}

}

function editorMouseDrag() {
	// console.log(selected)
	let mX = mouseX - panelWidth / 2
	let mY = mouseY - height / 2
	let mousePos = createVector(mX, mY, -mY)
	if (currentMode === editModes.Move) {
		var p = selected[selected.length - 1]
		if (p === undefined) { return; }
		if (selectedA1) {
			p.pos.x = mousePos.x
			p.pos.y = mousePos.y
		} else {
			p.pos.x = mousePos.x
			p.pos.z = mousePos.y
		}
	}


}

function spaceMouseDrag() {
	const deltaTheta = (-sensitivityX * (mouseX - pmouseX));
	camSv._orbit(deltaTheta, 0, 0);
}

function mousePressed() {
	if (mouseX < panelWidth) {
		editorMousePress()
	} else {
		selected = []
	}
}

function mouseDragged() {
	if (mouseX < panelWidth) {
		editorMouseDrag()
	} else {
		selected = []
		spaceMouseDrag()
	}
}

function keyPressed() {
	if (key === "m") {
		currentMode = editModes.Move
	}
	if (key === "p") {
		currentMode = editModes.Point
	}
	if (key === "l") {
		currentMode = editModes.Line
	}
	if (key === "k") {
		currentMode = editModes.Plane
	}

	selected = []
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	panelWidth = width / 2
	sv = createGraphics(panelWidth, height, WEBGL)
	camSv = sv.createCamera()
	camSv.ortho(-panelWidth / 2, panelWidth / 2, height / 2, -height / 2, -10000, 10000);
	camSv.move(0, 150, 0)
	camSv.lookAt(0, 0, 0)
}

