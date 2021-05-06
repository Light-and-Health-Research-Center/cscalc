function rdivide(a, b){
	if (a.length != b.length){
		console.log(a + " and " + b + " are not the same length and can not be rdivided.");
		return;
	}
	var ret = [];
	for(var i = 0; i < a.length; i ++){
		ret[i] = a[i]/b[i];
	}
	return ret;
}

function elementWiseDivision(a, b){
	if (b.length != 1){
		console.log(b + "'s length is not equal to 1 and element-wise division cannot be performed.");
	}
	var ret = [];
	for (var i = 0; i < a.length; i++){
		ret[i] = a[i]/b;
	}
	return ret;
}

function elementWiseMultiplication(a, b){
	if (b.isNaN){
		console.log(b + "'s length is not equal to 1 and element-wise multiplication cannot be performed.");
	}
	var ret = [];
	for (var i = 0; i < a.length; i++){
		ret[i] = a[i]*b;
	}
	return ret;
}

// CCT
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
	var d2;
	for(var i = 1;i < isoTempLines.T.length; i++){
		d2 = ((v-isoTempLines.vt[i]) - isoTempLines.tt[i]*(u-isoTempLines.ut[i]))/Math.sqrt(1+isoTempLines.tt[i]*isoTempLines.tt[i]);
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
// CCT

// CLA
function CLAcalc(spd){
	var arod1 = 2.30;
	var arod2 = 1.60;
	var a_bminusY = 0.21;

	var g1 = 1;
	var g2 = 0.16;
	var k = 0.2616;

	var rodSat = 6.5215;

	var wavelengths = spd.wavelength;
	var values = spd.value;

	var efs = efficienyFunctions(wavelengths, thickness);
	var deltaWavelength = createDelta(wavelengths);

	var vlambda = sumproduct(values, arrayMul(deltaWavelength, efs.Vlambda));
	var vprime = sumproduct(values, arrayMul(deltaWavelength, efs.Vprime));
	var scone = sumproduct(values, arrayMul(deltaWavelength, efs.Scone));
	var melanopsin = sumproduct(values, arrayMul(deltaWavelength, efs.Melanopsin));

	// var macula = {
	// 	wavelength: [4.00E+02,4.05E+02,4.10E+02,4.15E+02,4.20E+02,4.25E+02,4.30E+02,4.35E+02,4.40E+02,4.45E+02,4.50E+02,4.55E+02,4.60E+02,4.65E+02,4.70E+02,4.75E+02,4.80E+02,4.85E+02,4.90E+02,4.95E+02,5.00E+02,5.05E+02,5.10E+02,5.15E+02,5.20E+02,5.25E+02,5.30E+02,5.35E+02,5.40E+02,5.45E+02,5.50E+02,5.55E+02,5.60E+02,5.65E+02,5.70E+02,5.75E+02,5.80E+02,5.85E+02,5.90E+02,5.95E+02,6.00E+02,6.05E+02,6.10E+02,6.15E+02,6.20E+02,6.25E+02,6.30E+02,6.35E+02,6.40E+02,6.45E+02,6.50E+02,6.55E+02,6.60E+02,6.65E+02,6.70E+02,6.75E+02,6.80E+02,6.85E+02,6.90E+02,6.95E+02,7.00E+02,7.05E+02,7.10E+02,7.15E+02,7.20E+02,7.25E+02,7.30E+02],
	// 	value: [2.24E-01,2.44E-01,2.64E-01,2.83E-01,3.14E-01,3.53E-01,3.83E-01,4.00E-01,4.17E-01,4.40E-01,4.66E-01,4.90E-01,5.00E-01,4.83E-01,4.62E-01,4.38E-01,4.37E-01,4.36E-01,4.27E-01,4.04E-01,3.51E-01,2.83E-01,2.14E-01,1.55E-01,9.60E-02,6.80E-02,4.00E-02,2.85E-02,1.70E-02,1.30E-02,9.00E-03,8.50E-03,8.00E-03,6.50E-03,5.00E-03,4.50E-03,4.00E-03,2.00E-03,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00,0.00E+00]
	// };

	// var macularT = arrayPow(10,arrayScalar(macula.value,-_thickness));
	// var macularTi = interp1(macula.wavelength,macularT,wavelengths,1);


	var rod_mel = vprime/(vlambda + g1*scone);
	var rod_bminusY = vprime/(vlambda + g2*scone);

	var bminusY = scone-k*vlambda;
	var cs1 = melanopsin;
	if (cs1 < 0) {
		cs1 = 0;
	}
	var cs2,cs;
	var rod = arod2 * rod_bminusY * (1-Math.exp(-vprime/rodSat));
	var rodmel = arod1 *rod_mel * (1-Math.exp(-vprime/rodSat));
	if (bminusY >= 0){
		cs2 = a_bminusY*bminusY;
		if (cs2 < 0){
			cs2 = 0;
		}
		var cs = (cs1 + cs2 - rod - rodmel);
	}else{
		cs = (cs1 - rodmel);
	}
	if (cs < 0){
		cs = 0;
	}
	cla = cs*1548;
	return cla;
}

// function CLAcalc(spd, thickness){
// 	var cs;
//
// 	var wavelength = spd.wavelength;
// 	var value = spd.value;
//
// 	var efs = efficienyFunctions(wavelength, thickness);
// 	var deltaWavelength = createDelta(wavelength);
//
// 	var spdScone = sumproduct(value, arrayMul(deltaWavelength, efs.Scone));
// 	var spdVlambda = sumproduct(value, arrayMul(deltaWavelength, efs.Vlambda));
// 	console.log(spdVlambda);
// 	var spdMelanopsin = sumproduct(value, arrayMul(deltaWavelength, efs.Melanopsin));
// 	var spdVprime = sumproduct(value, arrayMul(deltaWavelength, efs.Vprime));
//
// 	var rodSat1 = 35000;
// 	var retinalE = [1, 3, 10, 30, 100, 300, 1000, 3000, 10000, 30000, 100000];
// 	var pupilDiam = [7.1, 7, 6.9, 6.8, 6.7, 6.5, 6.3, 5.65, 5, 3.65, 2.3];
// 	var diam = interp1(retinalE,pupilDiam,rodSat1,0);
// 	var rodSat = rodSat1/(Math.pow(diam,2)/4*Math.PI)*Math.PI/1700;
//
// 	var a1 = 1;
// 	var b1 = 0.0;
// 	var a2 = 0.7000;
// 	var b2 = 0.0;
// 	var k = 0.2616;//0.2883;//0.2616;
// 	var a3 = 3.3000;
//
	// if((spdScone - k*spdVlambda) > 0){
	// 	var cs1 = a1*spdMelanopsin - b1;
	// 	if(cs1 < 0){
	// 		cs1 = 0;
	// 	}
	// 	var cs2 = a2*(spdScone - k*spdVlambda) - b2;
	// 	if(cs2 < 0){
	// 		cs2 = 0;
	// 	}
	// 	var rod = a3*(1-Math.exp(-spdVprime/rodSat));
	// 	cs = (cs1 + cs2 - rod);
	// 	if(cs < 0){
	// 		cs = 0;
	// 	}
	// }else{
	// 	cs = a1*spdMelanopsin-b1;
	// 	if(cs < 0){
	// 		cs = 0;
	// 	}
	// }
// 	var cla = cs * 1547.9;
//
// 	return cla;
// }

function cla2cs(cla){
	return 0.7*(1-(1/(1+Math.pow((cla * _t*_d/355.7),1.1026))));
}

function cs2cla(cs){
	return (355.7/(_t*_d))*Math.pow((1/(1-(cs/0.7))-1),(1/1.1026));
}

function zeros(n){
	var result = [];
	for(var i = 0;i < n;i++){
		result[i] = 0;
	}
	return result;
}
// CLA

// Blackbody Spectra
function blackbodySpectra23Sep05(Tc, wave){
	/* Black Body Spectra
	 Calculates the Planktian black body spectrum of given color temperature, Tc.
	% Function arguements are:
	%	Tc - color temperature in Kelvin
	%	wave - column vector specifiying the wavelength values at which the spd is evaluated */

	// 2002 CODATA recommended values
	var h = 6.6260693e-34;
	var c = 299792458;
	var k = 1.3806505e-23;

	var c1 = 2*Math.PI*h*Math.pow(c,2);
	var c2 = h*c/k;
	var e9 = 1e-9;

	//var spdBlackBody = arrayDiv(arrayScalar(arrayBase(arrayScalar(wave,e9),-5),c1),(Math.exp(arrayScalar(arrayInverse(arrayScalar(arrayScalar(wave,e9),Tc)),c2) - 1)));
	var calc1 = arrayScalar(arrayBase(arrayScalar(wave,e9),-5),c1);
	var calc2 = arrayAdd2(arrayPow(Math.exp(1),arrayScalar(arrayInverse(arrayScalar(arrayScalar(wave,e9),Tc)),c2)), - 1);

	var spdBlackBody = arrayDiv(calc1, calc2);

	return spdBlackBody;
}
// Blackbody Spectra

// CIE Day Spectra
function cieDaySpectra23Sep05(Tc,wave){
	var v = NaN;
	if(Tc <= 25000){
		var cieDaySn  = {
			wavelength: [300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,650,660,670,680,690,700,710,720,730,740,750,760,770,780,790,800,810,820,830],
			S0: [0.04,6,29.6,55.3,57.3,61.8,61.5,68.8,63.4,65.8,94.8,104.8,105.9,96.8,113.9,125.6,125.5,121.3,121.3,113.5,113.1,110.8,106.5,108.8,105.3,104.4,100,96,95.1,89.1,90.5,90.3,88.4,84,85.1,81.9,82.6,84.9,81.3,71.9,74.3,76.4,63.3,71.7,77,65.2,47.7,68.6,65,66,61,53.3,58.9,61.9],
			S1: [0.02,4.5,22.4,42,40.6,41.6,38,42.4,38.5,35,43.4,46.3,43.9,37.1,36.7,35.9,32.6,27.9,24.3,20.1,16.2,13.2,8.6,6.1,4.2,1.9,0,-1.6,-3.5,-3.5,-5.8,-7.2,-8.6,-9.5,-10.9,-10.7,-12,-14,-13.6,-12,-13.3,-12.9,-10.6,-11.6,-12.2,-10.2,-7.8,-11.2,-10.4,-10.6,-9.7,-8.3,-9.3,-9.8],
			S2: [0,2,4,8.5,7.8,6.7,5.3,6.1,3,1.2,-1.1,-0.5,-0.7,-1.2,-2.6,-2.9,-2.8,-2.6,-2.6,-1.8,-1.5,-1.3,-1.2,-1,-0.5,-0.3,0,0.2,0.5,2.1,3.2,4.1,4.7,5.1,6.7,7.3,8.6,9.8,10.2,8.3,9.6,8.5,7,7.6,8,6.7,5.2,7.4,6.8,7,6.4,5.5,6.1,6.5]
		};
		//var cieDaySn = cieDaySn();
		var xd;
		if(Tc <= 7000){
			xd = -4.6070e9 / Math.pow(Tc,3) + 2.9678e6 / Math.pow(Tc,2) + 0.09911e3 / Tc + 0.244063;
		}else{
			xd = -2.0064e9 / Math.pow(Tc,3) + 1.9018e6 / Math.pow(Tc,2) + 0.24748e3 / Tc + 0.237040;
		}

		var yd = -3.000*xd*xd + 2.870*xd - 0.275;
		var M1 = (-1.3515 - 1.7703*xd + 5.9114*yd) / (0.0241 + 0.2562*xd - 0.7341*yd);
		var M2 = (0.0300 - 31.4424*xd + 30.0717*yd) / (0.0241 + 0.2562*xd - 0.7341*yd);
		var spdDay = arrayAdd(cieDaySn.S0,arrayAdd(arrayScalar(cieDaySn.S1,M1),arrayScalar(cieDaySn.S2,M2)));

		v = pchip(cieDaySn.wavelength, spdDay, wave);
		for(var i = 0;i < v.length;i++){
			if(isNaN(v[i])){
				v[i] = 0;
			}
		}
	}
	return v;
}

function pchip(x, y, xx){
	var h = arrayDiff(x);
	var m = 1;
	var del = arrayDiv(arrayDiff(y),h);
	var n = x.length;

	// First derivatives
	var d = pchipslopes(x,y,del);

	// Piecewise polynomial coefficients
	var d1 = d.slice(0,n-1);
	var d2 = d.slice(1,n);
	var a1 = arrayScalar(d1,2);
	var a = arrayDiv(arraySub(arraySub(arrayScalar(del,3),arrayScalar(d1,2)),d2),h);
	var b = arrayDiv(arrayAdd(arraySub(d1,arrayScalar(del,2)),d2),arrayBase(h,2));

	// Find Subinterval indicies
	var k = arrayRep(1,xx.length);
	for(var j = 1;j < x.length;j++){
		for(var i = 0;i < xx.length;i++){
			if(x[j] <= xx[i]){
				k[i] = j;
			}
		}
	}

	// Evaluate inerpolant
	var s = arraySub(xx,arrayEval(x,k));
	var v = arrayAdd(arrayEval(y,k),arrayMul(arrayAdd(arrayEval(d,k),arrayMul(arrayAdd(arrayEval(a,k),arrayMul(arrayEval(b,k),s)),s)),s));

	return v;
}

function pchipslopes(x, y, del){
	var n = x.length;
	var d = arrayRep(0,y.length);
	var h = arrayDiff(x);

	// k = find(sign(del(1:n-2)).*sign(del(2:n-1)) > 0);
	var signDel = arrayDiv(del,arrayAbs(del));
	var signDel1 = signDel.slice(0,n-1);
	var signDel2 = signDel.slice(1,n);
	var signDelTest = arrayMul(signDel1,signDel2);
	var k = [];
	var kIndex = 0;
	for(var i = 0;i < signDelTest.length;i++){
		if(signDelTest[i] > 0){
			k[kIndex] = i;
			kIndex = kIndex + 1;
		}
	}

	for(i = 0; i < k.length; i++){
		var hs = h[k[i]] + h[k[i]+1];
		var w1 = (h[k[i]] + hs)/(3*hs);
		var w2 = (h[k[i]+1] + hs)/(3*hs);
		var dmax = Math.max(Math.abs(del[k[i]]),Math.abs(del[k[i]+1]));
		var dmin = Math.min(Math.abs(del[k[i]]),Math.abs(del[k[i]+1]));
		d[k[i]+1] = dmin/(w1 * (del[k[i]]/dmax) + w2 * (del[k[i]+1]/dmax));
	}

	d[0] = ((2*h[0]+h[1])*del[0] - h[0]*del[1])/(h[0]+h[1]);
	if(d[0]*del[0] < 0){
		d[0] = 0;
	}else if((del[0]*del[1] < 0) && (Math.abs(d[0]) > Math.abs(del[0]*3))){
		d[0] = 3*del[0];
	}
	d[n-1] = ((2*h[n-2]+h[n-3])*del[n-2] - h[n-2]*del[n-3])/(h[n-2]+h[n-3]);
	if(d[n-1]*del[n-1] < 0){
		d[n-1] = 0;
	}else if((del[n-2]*del[n-3] < 0) && (Math.abs(d[n-1]) > Math.abs(3*del[n-2]))){
		d[n-1] = 3*del[n-2];
	}
	return d;
}
// CIE Day Spectra

// CRI
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
	var TCS_1 = {};
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
	var Yki = {};
	var uki = {};
	var vki = {};
	var Yri = {};
	var uri = {};
	var vri = {};
	for(iCS in TCS_1){
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
	var ukip = {};
	var vkip = {};
	for(iCS in TCS_1){
		if(TCS_1.hasOwnProperty(iCS)){
			cki = (4 - uki[iCS] - 10*vki[iCS]) / vki[iCS];
			dki = (1.708*vki[iCS] + 0.404 - 1.481*uki[iCS]) / vki[iCS];
			ukip[iCS] = (10.872 + 0.404*cr/ck*cki - 4*dr/dk*dki) / (16.518 + 1.481*cr/ck*cki - dr/dk*dki);
			vkip[iCS] = 5.520 / (16.518 + 1.481*cr/ck*cki - dr/dk*dki);
		}
	}

	// Transformation into 1964 Uniform space coordinates
	var Wstarr = {};
	var Ustarr = {};
	var Vstarr = {};

	var Wstark = {};
	var Ustark = {};
	var Vstark = {};
	for(iCS in TCS_1){
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
	var deltaE = {};
	var R = {};
	for(iCS in TCS_1){
		if(TCS_1.hasOwnProperty(iCS)){
			deltaE[iCS] = Math.sqrt(Math.pow(Ustarr[iCS] - Ustark[iCS],2) + Math.pow(Vstarr[iCS] - Vstark[iCS],2) + Math.pow(Wstarr[iCS] - Wstark[iCS],2));
			R[iCS] = 100 - 4.6*deltaE[iCS];
		}
	}
	var Ra = (R.R01 + R.R02 + R.R03 + R.R04 + R.R05 + R.R06 + R.R07 + R.R08)/8;

	return Ra;
}
// CRI

// Gamut Area
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
	var TCS_1 = {};
	for(var iCS in TCS.color_standards){
		if(TCS.color_standards.hasOwnProperty(iCS)){
			TCS_1[iCS] = interp1(TCS.wavelength,arrayScalar(TCS.color_standards[iCS],1/1000),spd.wavelength,0);
		}
	}

	// Calculate u, v chromaticity coordinates of samples under test illuminant
	var xki = {};
	var yki = {};
	var uki = {};
	var vki = {};
	var ukiprime = {};
	var vkiprime = {};
	for(iCS in TCS_1){
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
	for(iCS in TCS_1){
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

	return gai;
}
// Gamut Area

// LXY
function Lxy23Sep05(spd){
	var result = {};

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
// LXY

// Melanopic Lux
function melanopicLux(spd, thickness){
	var cs;

	var wavelength = spd.wavelength;
	var value = spd.value;

	var efs = efficienyFunctions(wavelength, thickness);
	var deltaWavelength = createDelta(wavelength);

	var spdScone = sumproduct(value, arrayMul(deltaWavelength, efs.Scone));
	var spdVlambda = sumproduct(value, arrayMul(deltaWavelength, efs.Vlambda));
	var spdMelanopsin = sumproduct(value, arrayMul(deltaWavelength, efs.Melanopsin));
	var spdVprime = sumproduct(value, arrayMul(deltaWavelength, efs.Vprime));

	var rodSat1 = 35000;
	var retinalE = [1, 3, 10, 30, 100, 300, 1000, 3000, 10000, 30000, 100000];
	var pupilDiam = [7.1, 7, 6.9, 6.8, 6.7, 6.5, 6.3, 5.65, 5, 3.65, 2.3];
	var diam = interp1(retinalE,pupilDiam,rodSat1,0);
	var rodSat = rodSat1/(Math.pow(diam,2)/4*Math.PI)*Math.PI/1700;

	var a1 = 1;
	var b1 = 0.0;
	var a2 = 0.7000;
	var b2 = 0.0;
	var k = 0.2616;//0.2883;//0.2616;
	var a3 = 3.3000;

	cs = a1*spdMelanopsin-b1;
	if(cs < 0){
		cs = 0;
	}
	var cla = cs * 852;

	return cla;
}

function zeros(n){
	var result = [];
	for(var i = 0;i < n;i++){
		result[i] = 0;
	}
	return result;
}
// Melanopic Lux

// CLA SPD to Lux
function claspd2lux(cla, spd, thickness){
	//Define output
	var result;

	// Internal variables
	var csval = cla/1547.9;

	// Parse and normalize SPD input
	var spd1wavelength = spd.wavelength;
	var spd1value = spdNormalize(spd1wavelength,spd.value);
	//var spd1value = spd.value;

	// Load efficiency functions and create the delta wavelength
	var efs = efficienyFunctions(spd1wavelength, thickness);
	var deltaWavelength = createDelta(spd1wavelength);

	// Prep spd1efs
	var spd1Scone = sumproduct(spd1value, arrayMul(deltaWavelength, efs.Scone));
	var spd1Vlambda = sumproduct(spd1value, arrayMul(deltaWavelength, efs.Vlambda));
	var spd1Melanopsin = sumproduct(spd1value, arrayMul(deltaWavelength, efs.Melanopsin));
	var spd1Vprime = sumproduct(spd1value, arrayMul(deltaWavelength, efs.Vprime));

	// Prep rodSat
	var rodSat1 = 35000;
	var retinalE = [1, 3, 10, 30, 100, 300, 1000, 3000, 10000, 30000, 100000];
	var pupilDiam = [7.1, 7, 6.9, 6.8, 6.7, 6.5, 6.3, 5.65, 5, 3.65, 2.3];
	var diam = interp1(retinalE,pupilDiam,rodSat1,0);
	var rodSat = rodSat1/(Math.pow(diam,2)/4*Math.PI)*Math.PI/1700;

	// Create spd1efs
	var spd1efs = {
		Scone: spd1Scone,
		Vlambda: spd1Vlambda,
		Melanopsin: spd1Melanopsin,
		Vprime: spd1Vprime,
		rodSat: rodSat,
	};

	// Constants
	var consts = {
		a1: 1,
		b1: 0.0,
		a2: 0.7000,
		b2: 0.0,
		k: 0.2616,
		a3: 3.3000,
	};


	// Test B-Y
	if((spd1efs.Scone - consts.k*spd1efs.Vlambda) > 0){
		var lux0 = 0;
		var luxTest = 50.33;
		var spd1 = {
			wavelength: spd1wavelength,
			value: spd1value,
		};

		var test = {
			spd: spd1,
			csval: csval,
			consts: consts,
			spd1efs: spd1efs,
		};
		// Calculate lux
		result = fmin(claspd2luxmin,test,lux0);
		//result = claspd2luxmin(test, luxTest);
	}else{
		result = csval/(consts.a1*spd1efs.Melanopsin-consts.b1);
	}
	return result;
}

function claspd2luxmin(funcParams, lux){
	// Unbox funcParams
	var spd = funcParams.spd;
	var csval = funcParams.csval;
	var consts = funcParams.consts;
	var spd1efs = funcParams.spd1efs;

	// Calculate cs
	var cs1 = consts.a1*spd1efs.Melanopsin*lux - consts.b1;
	if(cs1 < 0){
		cs1 = 0;
	}
	var cs2 = consts.a2*(spd1efs.Scone*lux - consts.k*spd1efs.Vlambda*lux) - consts.b2;
	if(cs2 < 0){
		cs2 = 0;
	}
	var rod = consts.a3*(1-Math.exp(-spd1efs.Vprime*lux/spd1efs.rodSat));
	var cs = (cs1 + cs2 - rod);
	if(cs < 0){
		cs = 0;
	}

	// Set Result
	var result = Math.pow((csval - cs),2);
	//var result = cs;
	return result;
}

function claspd2lux2(cla, spd, thickness){
	//Define output
	var result;

	var lux0 = 0;
	var test = {
		claval: cla,
		spd: spd,
		thickness: thickness,
	};

	// Calculate lux
	result = fmin(claspd2lux2min,test,lux0);

	return result;
}

function claspd2lux2min(funcParams, lux){
	// Unbox funcParams
	var claval = funcParams.claval;
	var spd = funcParams.spd;
	var thickness = funcParams.thickness;

	// convert spd to abs spd
	spd.value = arrayScalar(spd.value,lux);

	// Calculate cla
	var cla = CLAcalc(spd, thickness);

	// Set Result
	var result = Math.abs(claval - cla);
	return result;
}
// CLA SPD to Lux


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