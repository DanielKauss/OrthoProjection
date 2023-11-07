function linePlaneInt(l1, l2, p1, pd) {
	ld = vsub(l1, l2)
	ld.normalize()
	if (p5.Vector.dot(pd, ld) == 0) {
		return vadd(l1, vmult(ld, 1e10))
	}
	let tNumerator = vdot(pd, p1) - vdot(pd, l1)
	let tDenominator = vdot(pd, ld)
	let t = tNumerator / tDenominator
	return vadd(l1, vmult(ld, t))
}
