function ansi_duv(spd){
	// Interpolate bar values
	var cie = cie31by1();
	var xbar = interp1(cie.wavelength, cie.xbar, spd.wavelength, 0);
	var ybar = interp1(cie.wavelength, cie.ybar, spd.wavelength, 0);
	var zbar = interp1(cie.wavelength, cie.zbar, spd.wavelength, 0);

	// Calculate u, v chromaticity coordinates of samples
	//test illuminant, uk, vk
	var deltaWavelength = createDelta(spd.wavelength);
	var X = sumproduct(spd.value, arrayMul(deltaWavelength, xbar));
	var Y = sumproduct(spd.value, arrayMul(deltaWavelength, ybar));
	var Z = sumproduct(spd.value, arrayMul(deltaWavelength, zbar));
	var Yknormal = 100/Y;
	var uk = 4*X/(X+15*Y+3*Z);
	var vk = 6*Y/(X+15*Y+3*Z);

	// Calculate Lfp
	var Lfp = Math.sqrt(Math.pow(uk-0.292,2)+Math.pow(vk-0.24,2));

	// Calculate Lbb
	var a = Math.acos((uk-0.292)/Lfp);
	var k = [-0.471106,1.925865,-2.4243787,1.5317403,-0.5179722,0.0893944,-0.00616793];
	var Lbb = k[6]*Math.pow(a,6) + k[5]*Math.pow(a,5) + k[4]*Math.pow(a,4) + k[3]*Math.pow(a,3) + k[2]*Math.pow(a,2) + k[1]*Math.pow(a,1) + k[0];

	// Calculate Duv
	var Duv = Lfp - Lbb;
	return Duv;
}
