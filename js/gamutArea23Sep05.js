function gamutArea23Sep05(spd){
	// Load values
	var cie = cie31by1();
	var isoTempLines = isoTempLinesNewestFine23Sep05();
	var deltaWavelength = createDelta(spd.wavelength);

	// Interpolate bar values
	var xbar = interp1(cie.wavelength, cie.xbar, spd.wavelength, 0);
	var ybar = interp1(cie.wavelength, cie.ybar, spd.wavelength, 0);
	var zbar = interp1(cie.wavelength, cie.zbar, spd.wavelength, 0);
	
	// Load TCS Color Standards
	var TCS = Tcs14_23Sep09();
	var TCS_1 = new Object;
	for(var iCS in TCS.color_standards){
		if(TCS.color_standards.hasOwnProperty(iCS)){
			TCS_1[iCS] = interp1(TCS.wavelength,arrayScalar(TCS.color_standards[iCS],1/1000),spd.wavelength,0);
		}
	}
	
	// Calculate u, v chromaticity coordinates of samples under test illuminant
	var xki = new Object;
	var yki = new Object;
	var uki = new Object;
	var vki = new Object;
	var ukiprime = new Object;
	var vkiprime = new Object;
	for(var iCS in TCS_1){
		if(TCS_1.hasOwnProperty(iCS)){
			//test illuminant, uki, vki
			X = sumproduct(arrayMul(spd.value, TCS_1[iCS]), arrayMul(deltaWavelength, xbar));
			Y = sumproduct(arrayMul(spd.value, TCS_1[iCS]), arrayMul(deltaWavelength, ybar));
			Z = sumproduct(arrayMul(spd.value, TCS_1[iCS]), arrayMul(deltaWavelength, zbar));
			xki[iCS] = X/(X+Y+Z);
			yki[iCS] = Y/(X+Y+Z);
			uki[iCS] = 4*X/(X+15*Y+3*Z);
			vki[iCS] = 6*Y/(X+15*Y+3*Z);
			ukiprime[iCS] = uki[iCS];
			vkiprime[iCS] = vki[iCS]*1.5;
		}
	}
	
	// Select sources 1 - 8
	var iSource = 0;
	var ukprimeArray = [];
	var vkprimeArray = [];
	for(var iCS in TCS_1){
		if(TCS_1.hasOwnProperty(iCS)){
			ukprimeArray[iSource] = ukiprime[iCS];
			vkprimeArray[iSource] = vkiprime[iCS];
			iSource = iSource + 1;
		}
	}
	ukprimeArrayS = ukprimeArray.slice(0,8);
	vkprimeArrayS = vkprimeArray.slice(0,8);
	
	// Calculate area with selected sources
	var ukprimeArraySR1 = ukprimeArrayS.slice(1,8);
	ukprimeArraySR1.push(ukprimeArrayS[0]);
	var vkprimeArraySR1 = vkprimeArrayS.slice(1,8);
	vkprimeArraySR1.push(vkprimeArrayS[0]); 
	
	var area = Math.abs(arrayMul(arraySub(ukprimeArraySR1,ukprimeArrayS),arrayAdd(vkprimeArraySR1,vkprimeArrayS)).sum()/2);
	
	var gai = (area/0.007354)*100;
	
	return gai
}
