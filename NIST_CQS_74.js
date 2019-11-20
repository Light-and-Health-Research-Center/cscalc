function NIST_CQS_74(spd){
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
	
	// Load VS Color Standards
	var VS = vs_74();
	var VS_1 = new Object;
	for(var iVS in VS.color_standards){
		if(VS.color_standards.hasOwnProperty(iCS)){
			VS_1[iCS] = interp1(VS.wavelength,arrayScalar(VS.color_standards[iCS],1/1000),spd.wavelength,0);
		}
	}
	
	// Calculate u, v chromaticity coordinates of samples
	//test illuminant, uk, vk
	var deltaWavelength = createDelta(spd.wavelength);
	var Xk = sumproduct(spd.value, arrayMul(deltaWavelength, xbar));
	var Yk = sumproduct(spd.value, arrayMul(deltaWavelength, ybar));
	var Zk = sumproduct(spd.value, arrayMul(deltaWavelength, zbar));
	var Yknormal = 100/Yk;
	var xk = Xk/(Xk + Yk + Zk);
	var yk = Yk/(Xk + Yk + Zk);
	var uk = 4*Xk/(Xk+15*Yk+3*Zk);
	var vk = 6*Yk/(Xk+15*Yk+3*Zk);
	
	//reference illuminant, ur, vr.
	Xr = sumproduct(spdref, arrayMul(deltaWavelength, xbar));
	Yr = sumproduct(spdref, arrayMul(deltaWavelength, ybar));
	Zr = sumproduct(spdref, arrayMul(deltaWavelength, zbar));
	var Yrnormal = 100/Yr;
	var xr = Xr/(Xr + Yr + Zr);
	var yr = Yr/(Xr + Yr + Zr);
	var ur = 4*Xr/(Xr+15*Yr+3*Zr);
	var vr = 6*Yr/(Xr+15*Yr+3*Zr);
	
	// color standards, uri, vri
	var Yki = new Object;
	var xki = new Object;
	var yki = new Object;
	var uki = new Object;
	var vki = new Object;
	var Yri = new Object;
	var xri = new Object;
	var yri = new Object;
	var uri = new Object;
	var vri = new Object;
	for(var iCS in VS_1){
		if(VS_1.hasOwnProperty(iCS)){
			//test illuminant, uki, vki
			X = sumproduct(arrayMul(spd.value, VS_1[iCS]), arrayMul(deltaWavelength, xbar));
			Y = sumproduct(arrayMul(spd.value, VS_1[iCS]), arrayMul(deltaWavelength, ybar));
			Z = sumproduct(arrayMul(spd.value, VS_1[iCS]), arrayMul(deltaWavelength, zbar));
			Yki[iCS] = Y*Yknormal;
			xki[iCS] = X/(X + Y + Z);
			yki[iCS] = Y/(X + Y + Z);
			uki[iCS] = 4*X/(X+15*Y+3*Z);
			vki[iCS] = 6*Y/(X+15*Y+3*Z);
			
			//reference illuminant, uri, vri
			X = sumproduct(arrayMul(spdref,VS_1[iCS]), arrayMul(deltaWavelength, xbar));
			Y = sumproduct(arrayMul(spdref,VS_1[iCS]), arrayMul(deltaWavelength, ybar));
			Z = sumproduct(arrayMul(spdref,VS_1[iCS]), arrayMul(deltaWavelength, zbar));
			Yri[iCS] = Y*Yrnormal;
			xri[iCS] = X/(X + Y + Z);
			yri[iCS] = Y/(X + Y + Z);
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
	
	// Transformation into 1974 L*a*b* color space
	var Lstarr = new Object;
	var astarr = new Object;
	var bstarr = new Object;
	
	var Lstark = new Object;
	var astark = new Object;
	var bstark = new Object;
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

function fval(val){
	val result;
	var eps = 0.00856;
	val k = 903.3;
	if(val > eps){
		result = Math.pow(val,(1/3));
	}else{
		result = (k*val + 16)/116;
	}
	return result;
}

function xyz2uv(x,y,z){
	var result = new Object;
	result = {
		u: 4*x/(-2*x + 12*y + 3),
		v: 6*y/(-2*x + 12*y + 3),
	};
	return result;
}

function 