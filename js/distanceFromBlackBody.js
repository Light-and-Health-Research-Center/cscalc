function dfbb(spd){
	// Calculate Correlated Color Temperature, Tc
	var Tc = CCTcalc(spd);
	
	// Interpolate bar values
	var cie = cie31by1();
	var xbar = interp1(cie.wavelength, cie.xbar, spd.wavelength, 0);
	var ybar = interp1(cie.wavelength, cie.ybar, spd.wavelength, 0);
	var zbar = interp1(cie.wavelength, cie.zbar, spd.wavelength, 0);
	
	// Calculate Reference Source Spectrum, spdref
	var spdref = blackbodySpectra23Sep05(Tc, spd.wavelength);
	
	// Load TCS Color Standards
	var TCS = Tcs14_23Sep09();
	var TCS_1 = new Object;
	for(var iCS in TCS.color_standards){
		if(TCS.color_standards.hasOwnProperty(iCS)){
			TCS_1[iCS] = interp1(TCS.wavelength,arrayScalar(TCS.color_standards[iCS],1/1000),spd.wavelength,0);
		}
	}
	
	// Calculate u, v chromaticity coordinates of samples
	//test illuminant, uk, vk
	var deltaWavelength = createDelta(spd.wavelength);
	var X = sumproduct(spd.value, arrayMul(deltaWavelength, xbar));
	var Y = sumproduct(spd.value, arrayMul(deltaWavelength, ybar));
	var Z = sumproduct(spd.value, arrayMul(deltaWavelength, zbar));
	var Yknormal = 100/Y;
	var uk = 4*X/(X+15*Y+3*Z);
	var vk = 6*Y/(X+15*Y+3*Z);
	
	//reference illuminant, ur, vr.
	X = sumproduct(spdref, arrayMul(deltaWavelength, xbar));
	Y = sumproduct(spdref, arrayMul(deltaWavelength, ybar));
	Z = sumproduct(spdref, arrayMul(deltaWavelength, zbar));
	var Yrnormal = 100/Y;
	var ur = 4*X/(X+15*Y+3*Z);
	var vr = 6*Y/(X+15*Y+3*Z);
	
	var DC = Math.sqrt(Math.pow(uk-ur,2)+Math.pow(vk-vr,2));
	
	return DC;
}