function spectralEfficiencyFunction(spd, thickness){
	var sef;
	
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
	
	var specRespMinusRod = [];
	
	if((spdScone - k*spdVlambda) >= 0){
		specRespMinusRod = arrayAdd(efs.Melanopsin,arraySub(arraySub(arrayScalar(efs.Scone,a2),arrayScone(efs.Vlambda,k)),arrayScalar(efs.Vprime,a3*rodStat)));
	}else{
		specRespMinusRod = efs.Melanopsin;
	}
	var responseCalc = sumproduct(value, arrayMul(deltaWavelength, specRespMinusRod)) * 1547.9;
	
	return cla;
}