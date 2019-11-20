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
