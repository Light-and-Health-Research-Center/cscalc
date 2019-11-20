function jpButtonToggle(){
	if(configSPD.data.datasets.length < 4 || configSPD.data.datasets.length > 5){
		$('#jpButton').hide();
	}else{
		$('#jpButton').show();
		if(configSPD.data.datasets.length ==4){
			$('.sc').hide();
			$('#saname').html(configSPD.data.datasets[2].label);
			$('#sbname').html(configSPD.data.datasets[3].label);
		}else{
			$('.sc').show();
			$('#scname').html(configSPD.data.datasets[4].label);
		}
	}
}

function jpColorBlend(cct, netIll, source1spd, source2spd, source1ill){
	// Calculate source 2 illuminance
	var source2ill = netIll - source1ill;
	
	// Calculate Absolute SPDs
	var absSource1spd = arrayScalar(spdNormalize(source1spd.wavelength,source1spd.value),source1ill);
	var absSource2spd = arrayScalar(spdNormalize(source2spd.wavelength,source2spd.value),source2ill);
	
	// Calculate Combined Absolute SPD
	var absCombinedSPD = {
		wavelength: source1spd.wavelength,
		value: arrayAdd(absSource1spd,absSource2spd),
	}
	
	// Calculate Combined CCT
	var combinedCCT = CCTcalc(absCombinedSPD); 
	
	// Calculate CCT diff
	var cctDiff = Math.abs(cct - combinedCCT);
	
	return cctDiff;
}

function jpColorBlendCS(source1spd, source1ill, source2spd, source2ill){
	// Calculate Absolute SPDs
	var absSource1spd = arrayScalar(spdNormalize(source1spd.wavelength,source1spd.value),source1ill);
	var absSource2spd = arrayScalar(spdNormalize(source2spd.wavelength,source2spd.value),source2ill);
	
	// Calculate Combined Absolute SPD
	var absCombinedSPD = {
		wavelength: source1spd.wavelength,
		value: arrayAdd(absSource1spd,absSource2spd),
	}
	
	// Calculate Combined CCT
	var combinedCla = CLAcalc(absCombinedSPD, 1.0);
	
	// Calculate CCT diff
	var combinedCS = cla2cs(combinedCla);
	
	return combinedCS;
}

function prepJPColorBlend(funcParams, source1ill){
	// Ungroup funcParams
	var cct = funcParams.cct;
	var netIll = funcParams.netIll;
	var source1spd = funcParams.source1spd;
	var source2spd = funcParams.source2spd;
	
	// Run jpColorBlend
	var result = jpColorBlend(cct, netIll, source1spd, source2spd, source1ill);
	return result;
}

function resetJPColorBlendModal(){
	// Reset Illuminance Input
	$('#netIll').val("");
	
	// Reset Source Names
	$('.sn').each(function(){
		$(this).html('Source');
	});
	
	// Reset All Source tables
	$('.sa').each(function(){
		$(this).html('N/A');
	});
	$('.sb').each(function(){
		$(this).html('N/A');
	});
	$('.sc').each(function(){
		$(this).html('N/A');
	});
	
	// Reset CS table values
	$('.csT').each(function(){
		$(this).html('NaN');
	});
	
	return;
}