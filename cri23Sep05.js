function cri23Sep05(spd){
	// Calculate Correlated Color Temperature, Tc
	var Tc = CCTcalc(spd);
	
	// Interpolate bar values
	var cie = cie31by1();
	var xbar = interp1(cie.wavelength, cie.xbar, spd.wavelength, 0);
	var ybar = interp1(cie.wavelength, cie.ybar, spd.wavelength, 0);
	var zbar = interp1(cie.wavelength, cie.zbar, spd.wavelength, 0);
	
	// Calculate Reference Source Spectrum, spdref
	var spdref = [];
	if(Tc < 5000 && Tc > 0){
		spdref = blackbodySpectra23Sep05(Tc, spd.wavelength);
	}else{
		if(Tc <= 25000){
			spdref = cieDaySpectra23Sep05(Tc, spd.wavelength);
		}else{
		
		}
	}
	
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
	
	// color standards, uri, vri
	var Yki = new Object;
	var uki = new Object;
	var vki = new Object;
	var Yri = new Object;
	var uri = new Object;
	var vri = new Object;
	for(var iCS in TCS_1){
		if(TCS_1.hasOwnProperty(iCS)){
			//test illuminant, uki, vki
			X = sumproduct(arrayMul(spd.value, TCS_1[iCS]), arrayMul(deltaWavelength, xbar));
			Y = sumproduct(arrayMul(spd.value, TCS_1[iCS]), arrayMul(deltaWavelength, ybar));
			Z = sumproduct(arrayMul(spd.value, TCS_1[iCS]), arrayMul(deltaWavelength, zbar));
			Yki[iCS] = Y*Yknormal;
			uki[iCS] = 4*X/(X+15*Y+3*Z);
			vki[iCS] = 6*Y/(X+15*Y+3*Z);
			
			//reference illuminant, uri, vri
			X = sumproduct(arrayMul(spdref,TCS_1[iCS]), arrayMul(deltaWavelength, xbar));
			Y = sumproduct(arrayMul(spdref,TCS_1[iCS]), arrayMul(deltaWavelength, ybar));
			Z = sumproduct(arrayMul(spdref,TCS_1[iCS]), arrayMul(deltaWavelength, zbar));
			Yri[iCS] = Y*Yrnormal;
			uri[iCS] = 4*X/(X+15*Y+3*Z);
			vri[iCS] = 6*Y/(X+15*Y+3*Z);
		}
	}
	
	// Check tolarance for reference illuminant
	var DC = Math.sqrt(Math.pow(uk-ur,2)+Math.pow(vk-vr,2));
	
	// Apply adaptive (perceived) color shift
	var ck = (4 - uk - 10*vk) / vk;
	var dk = (1.708*vk + 0.404 - 1.481*uk) / vk;
	var cr = (4 - ur - 10*vr) / vr;
	var dr = (1.708*vr + 0.404 - 1.481*ur) / vr;
	
	var cki;
	var dki;
	var ukip = new Object;
	var vkip = new Object;
	for(var iCS in TCS_1){
		if(TCS_1.hasOwnProperty(iCS)){
			cki = (4 - uki[iCS] - 10*vki[iCS]) / vki[iCS];
			dki = (1.708*vki[iCS] + 0.404 - 1.481*uki[iCS]) / vki[iCS];
			ukip[iCS] = (10.872 + 0.404*cr/ck*cki - 4*dr/dk*dki) / (16.518 + 1.481*cr/ck*cki - dr/dk*dki);
			vkip[iCS] = 5.520 / (16.518 + 1.481*cr/ck*cki - dr/dk*dki);
		}
	}
	
	// Transformation into 1964 Uniform space coordinates
	var Wstarr = new Object;
	var Ustarr = new Object;
	var Vstarr = new Object;
	
	var Wstark = new Object;
	var Ustark = new Object;
	var Vstark = new Object;
	for(var iCS in TCS_1){
		if(TCS_1.hasOwnProperty(iCS)){
			Wstarr[iCS] = 25*Math.pow(Yri[iCS],0.333333) - 17;
			Ustarr[iCS] = 13*Wstarr[iCS]*(uri[iCS] - ur);
			Vstarr[iCS] = 13*Wstarr[iCS]*(vri[iCS] - vr);
			
			Wstark[iCS] = 25*Math.pow(Yki[iCS],0.333333) - 17;
			Ustark[iCS] = 13*Wstark[iCS]*(ukip[iCS] - ur);
			Vstark[iCS] = 13*Wstark[iCS]*(vkip[iCS] - vr);
		}
	}
	
	// Determination of resultant color shift, delta E
	var deltaE = new Object;
	var R = new Object;
	for(var iCS in TCS_1){
		if(TCS_1.hasOwnProperty(iCS)){
			deltaE[iCS] = Math.sqrt(Math.pow(Ustarr[iCS] - Ustark[iCS],2) + Math.pow(Vstarr[iCS] - Vstark[iCS],2) + Math.pow(Wstarr[iCS] - Wstark[iCS],2));
			R[iCS] = 100 - 4.6*deltaE[iCS];
		}
	}
	var Ra = (R.R01 + R.R02 + R.R03 + R.R04 + R.R05 + R.R06 + R.R07 + R.R08)/8;
	
	return Ra;
}