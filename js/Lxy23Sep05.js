function Lxy23Sep05(spd){
	var result = new Object;
	
	// Interpolate bar values
	var cie = cie31by1();
	var xbar = interp1(cie.wavelength, cie.xbar, spd.wavelength, 0);
	var ybar = interp1(cie.wavelength, cie.ybar, spd.wavelength, 0);
	var zbar = interp1(cie.wavelength, cie.zbar, spd.wavelength, 0);
	
	var deltaWavelength = createDelta(spd.wavelength);
	var X = sumproduct(spd.value, arrayMul(deltaWavelength, xbar));
	var Y = sumproduct(spd.value, arrayMul(deltaWavelength, ybar));
	var Z = sumproduct(spd.value, arrayMul(deltaWavelength, zbar));
	
	result = {
		x: X/(X + Y + Z),
		y: Y/(X + Y + Z)
	};
	
	return result;
}