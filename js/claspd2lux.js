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
