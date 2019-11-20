function generateCircadianSpectralResponceForSPD(spd, thickness, rod){
	/*
		% Revised May 11, 2011
		% Revised September 26, 2014: 
		%   Conforms to Corrigendum, Lighting Res. Technol. 2012; 44: 516
		%   for the publication: Rea MS, Figueiro MG, Bierman A, Hamner R.
		%   Modeling the spectral sensitivity of the human circadian system.
		%   Lighting Research and Technology 2012; 44(4): 386–396. 

		% Calculates the circadian stimulus for the given spd
		% spd is assumed to be in units of W/m^2
		% CS is scaled to be equal to lux for illuminanct A (2856 K)
		% spd is two column matrix with wavelength (nm) in the first column
		% and spectral irradiance (W/(m^2 nm) in the second column
		% OR spd is a column vector and start, end and increment wavelength values
		% are specified as additional arguements (e.g. f(spd,400,700,10))
	*/
	
	var resultObj = new Object;
	var cs;
	var specResp;
	var specRespMinusRod;
	
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
	var cool = false;
	
	if((spdScone - k*spdVlambda) > 0){
		var cs1 = a1*spdMelanopsin - b1;
		if(cs1 < 0){
			cs1 = 0;
		}
		var cs2 = a2*(spdScone - k*spdVlambda) - b2;
		if(cs2 < 0){
			cs2 = 0;
		}
		var Rod = a3*(1-Math.exp(-spdVprime/rodSat));
		cs = (cs1 + cs2 - Rod);
		if(cs < 0){
			cs = 0;
		}
		specResp = arrayAdd(arraySub2(arrayScalar(efs.Melanopsin,a1),b1),arrayScalar(arraySub2(arraySub2(efs.Scone,arrayScalar(efs.Vlambda,k)),b2),a2)); //(a1*spdMelanopsin - b1) + a2*(spdScone - k*spdVprime - b2);
		specRespMinusRod = arraySub2(arrayAdd(arraySub2(arrayScalar(efs.Melanopsin,a1),b1),arraySub2(arraySub2(arrayScalar(efs.Scone,a2),arrayScalar(efs.Vlambda,k)),b2)),arrayScalar(efs.Vprime,a3*rod)); //(a1*spdMelanopsin - b1) + (a2*spdScone - k*spdVlambda - b2) - a3*rod*spdVprime;
		cool = true;
	}else{
		cs = a1*spdMelanopsin-b1;
		if(cs < 0){
			cs = 0;
		}
		specResp = arraySub2(arrayScalar(efs.Melanopsin,a1),b1); //a1*spdMelanopsin - b1;
		specRespMinusRod = arraySub2(arrayScalar(efs.Melanopsin,a1),b1); //a1*spdMelanopsin - b1;
		cool = false;
	}
	var cla = cs * 1547.9;
	var responseDiff = Math.abs(cla - 1547.9 * sumproduct(value, arrayMul(deltaWavelength, specRespMinusRod)));
	
	//return responseDiff;
	
	var result = {
		responseDiff: responseDiff,
		specRespMinusRod: specRespMinusRod,
		cla: cla,
		cool: cool,
	};
	
	return result;
}

function prepGenerateCircadianSpectralResponceForSPD(funcParams, rod){
	var spd = funcParams.spd;
	var thickness = funcParams.thickness;
	
	var resultObj =  generateCircadianSpectralResponceForSPD(spd, thickness, rod);
	return resultObj.responseDiff;
}