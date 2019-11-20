function CCTcalc(spd){
	// Load values
	var cie = cie31by1();
	var isoTempLines = isoTempLinesNewestFine23Sep05();
	var deltaWavelength = createDelta(spd.wavelength);

	// Interpolate bar values
	var xbar = interp1(cie.wavelength, cie.xbar, spd.wavelength, 0);
	var ybar = interp1(cie.wavelength, cie.ybar, spd.wavelength, 0);
	var zbar = interp1(cie.wavelength, cie.zbar, spd.wavelength, 0);

	// Trapz bar values
	var X = sumproduct(spd.value, arrayMul(deltaWavelength, xbar));
	var Y = sumproduct(spd.value, arrayMul(deltaWavelength, ybar));
	var Z = sumproduct(spd.value, arrayMul(deltaWavelength, zbar));

	// Base math
	x = X/(X+Y+Z);
	y = Y/(X+Y+Z);
	u = 4*x/(-2*x+12*y+3);
	v = 6*y/(-2*x+12*y+3);

	// Find adjacent lines to (us,vs)
	var index = 0;
	var d1 = ((v-isoTempLines.vt[1]) - isoTempLines.tt[1]*(u-isoTempLines.ut[1]))/Math.sqrt(1+isoTempLines.tt[1]*isoTempLines.tt[1]);
	for(var i = 1;i < isoTempLines.T.length; i++){
		var d2 = ((v-isoTempLines.vt[i]) - isoTempLines.tt[i]*(u-isoTempLines.ut[i]))/Math.sqrt(1+isoTempLines.tt[i]*isoTempLines.tt[i]);
		if (d1/d2 < 0){
			index = i;
			break;
		}else{
			d1 = d2;
		}
	}
	
	// Calc Tc
	var Tc;
	if(index == 0){
		Tc = NaN; //-1;
	}else{
		Tc = 1/(1/isoTempLines.T[index-1]+d1/(d1-d2)*(1/isoTempLines.T[index]-1/isoTempLines.T[index-1]));
	}
	return Tc;
}