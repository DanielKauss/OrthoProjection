let bgColor = 160
let bgEditorColor = 132
let axisPlaneColor = 150
let axisPlaneAlpha = 150

let lineSec = new jsts.algorithm.RobustLineIntersector()
let projRender;

const editModes = {
	Move: 1,
	Point: 2,
	Line: 3
}
let currentMode = editModes.Move;
let selected = []
let selectedA1 = true

let currCamera;
let panelWidth = 0

let points = []
let lines = []
let planes = []

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	currCamera = createCamera();
	currCamera.ortho()
	panelWidth = width / 2
}

function drawPlanes() {
	push()
	ambientMaterial(axisPlaneColor, axisPlaneAlpha)
	plane(600)
	rotateX(radians(90))
	plane(600)
	pop()
}

function draw() {
	background(150);

	// 3d graphics
	push()
	translate(width / 4, 0)
	rotateY(radians(45))
	rotateX(radians(-10))
	rotateZ(radians(-10))
	noStroke()


	for (let i = 0; i < points.length; i++) {
		points[i].draw3d()
	}

	drawPlanes()
	pop()

	// 2d graphics
	push()
	translate(-width / 4, 0);
	stroke(0)

	fill(bgEditorColor);
	rect(-panelWidth / 2, -height / 2, panelWidth, height);
	fill(0, 0, 0);
	line(-panelWidth / 2, 0, panelWidth / 2, 0);
	for (let i = 0; i < points.length; i++) {
		points[i].draw2d()
	}
	for (let i = 0; i < lines.length; i++) {
		lines[i].draw2d()
	}
	pop()

}


function mousePressed() {
	let mX = mouseX - panelWidth / 2
	let mY = mouseY - height / 2
	let mousePos = createVector(mX, mY, -mY)
	for (let i = 0; i < points.length; i++) {
		let dist = points[i].distance(mousePos)
		if (dist.x < 10) {
			selected.push(points[i])
			selectedA1 = true
		}
		if (dist.y < 10) {
			selected.push(points[i])
			selectedA1 = false
		}
	}

	if (currentMode === editModes.Point) {
		points.push(new Point(mousePos))
	}

	if (currentMode === editModes.Line && selected.length > 1) {
		let p1 = selected[selected.length - 1]
		let p2 = selected[selected.length - 2]
		lines.push(new Line(p1, p2))
	}
}

function mouseDragged() {
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
	selected = []
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	panelWidth = width / 2
}

