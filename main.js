let bgColor = 160
let bgEditorColor = 132
let axisPlaneColor = 150
let axisPlaneAlpha = 150

let lineSec = new jsts.algorithm.RobustLineIntersector()
let sv;
let camSv;
let sensitivityX = 0.05
let sensitivityY = 0.05
let scaleFactor = 1

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
	createCanvas(windowWidth, windowHeight);
	panelWidth = width / 2

	sv = createGraphics(panelWidth, height, WEBGL)
	camSv = sv.createCamera()
	camSv.ortho(-panelWidth / 2, panelWidth / 2, height / 2, -height / 2, -10000, 10000);
	camSv.move(0, 150, 0)
	camSv.lookAt(0, 0, 0)
}

function drawPlanes() {
	sv.push()
	sv.ambientMaterial(axisPlaneColor, axisPlaneAlpha)
	sv.plane(600)
	sv.rotateX(radians(90))
	sv.plane(600)
	sv.pop()
}

function draw() {
	background(150);

	// 3d graphics
	sv.clear()
	sv.orbitControl()
	sv.background(bgColor)
	sv.push()
	sv.rotateY(radians(45))
	sv.scale(1, -1, 1)
	// sv.rotateX(radians(-10))
	// sv.rotateZ(radians(-10))
	sv.noStroke()


	for (let i = 0; i < points.length; i++) {
		points[i].draw3d()
	}
	for (let i = 0; i < lines.length; i++) {
		lines[i].draw3d()
	}

	drawPlanes()
	sv.pop()


	// 2d graphics
	push()
	translate(width / 4, height / 2);
	// scale(1, -1)
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

	// display space on top
	fill(bgColor)
	rect(panelWidth, 0, panelWidth, height)
	image(sv, panelWidth, 0)
}

function editorMousePress() {
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
	const deltaTheta = (-sensitivityX * (mouseX - pmouseX)) / scaleFactor;
	const deltaPhi = 0//(sensitivityY * (mouseY - pmouseY)) / scaleFactor;
	camSv._orbit(deltaTheta, deltaPhi, 0);
}

function mousePressed() {
	if (mouseX < panelWidth) {
		editorMousePress()
	} else {
		console.log("spcae press")
	}
}

function mouseDragged() {
	if (mouseX < panelWidth) {
		editorMouseDrag()
	} else {
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

