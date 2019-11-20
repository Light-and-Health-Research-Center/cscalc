function CLAcalc(spd, thickness){
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
	
	if((spdScone - k*spdVlambda) > 0){
		var cs1 = a1*spdMelanopsin - b1;
		if(cs1 < 0){
			cs1 = 0;
		}
		var cs2 = a2*(spdScone - k*spdVlambda) - b2;
		if(cs2 < 0){
			cs2 = 0;
		}
		var rod = a3*(1-Math.exp(-spdVprime/rodSat));
		cs = (cs1 + cs2 - rod);
		if(cs < 0){
			cs = 0;
		}
	}else{
		cs = a1*spdMelanopsin-b1;
		if(cs < 0){
			cs = 0;
		}
	}
	var cla = cs * 1547.9;
	
	return cla;
}

function cla2cs(cla){
	return .7*(1-(1/(1+Math.pow((cla/355.7),1.1026))));
}

function cs2cla(cs){
	return 355.7*Math.pow((1/(1-(cs/0.7))-1),(1/1.1026));
}

function zeros(n){
	var result = [];
	for(var i = 0;i < n;i++){
		result[i] = 0;
	}
	return result;
}