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

$(document).on('keydown','#netIll',function(e){
    // Allow: backspace, delete, tab, escape, enter and .
    if(e.keyCode == 13) {
		$(this).focus().blur();
	}
});

$('.jpClass').on('hidden.bs.modal', function () {
	// put your default event here
	alert('Here');
	resetJPColorBlendModal();
});

$(document).on('change','#netIll',function(){
	//alert(this.value);
	// Create selected spd array
	var spdArray = [];
	var spdCCTArray = [];
	for(var i = 0;i < sourcelist.length;i++){
		if(sourcelist[i].isSelected){
			spdArray.push(sourcelist[i].spd);
			spdCCTArray.push(CCTcalc(sourcelist[i].spd));
		}
	}
	// If 2 sources
	if(spdArray.length == 2){
		// Sort the spdArrays by CCT
		var reversed = false;
		if(spdCCTArray[0] < spdCCTArray[1]){
			spdCCTArray.reverse();
			spdArray.reverse();
			reversed = true;
		}
		// cctArray loop
		var cctArray = [2700, 3000, 3500, 4000, 4100, 5000, 6500];
		for(var j = 0;j < cctArray.length;j++){
			// throw out outside values
			if(cctArray[j] > spdCCTArray[0] || cctArray[j] < spdCCTArray[1]){
				//alert([cctArray[j].toString() + ' NaN']);
				$('#sa' + cctArray[j].toString()).html('N/A');
				$('#sb' + cctArray[j].toString()).html('N/A');
				$('#cs' + cctArray[j].toString()).html('NaN');
			}else{
				// Create funcParams obj

				var funcParams = {
					cct: cctArray[j],
					netIll: Number(this.value),
					source1spd: spdArray[0],
					source2spd: spdArray[1],
				};

				var source1ill0 = Math.floor(Number(this.value));

				// optimize for CCT
				if(reversed){
					var source2ill = fmin(prepJPColorBlend,funcParams,source1ill0);
					var source1ill = Number(this.value) - source2ill;
				}else{
					var source1ill = fmin(prepJPColorBlend,funcParams,source1ill0);
					var source2ill = Number(this.value) - source1ill;
				}


				//alert([cctArray[j].toString() + ' ' + source1ill.toString()]);

				//alert([cctArray[j].toString() + " Run optimization"]);
				//var source1ill = Number(this.value)*(cctArray[j] - CCTcalc(spdArray[1]))/(CCTcalc(spdArray[0]) - CCTcalc(spdArray[1]));
				//var source2ill = Number(this.value) - source1ill;
				$('#sa' + cctArray[j].toString()).html(source1ill.toFixed());
				$('#sb' + cctArray[j].toString()).html(source2ill.toFixed());
				var csVal = jpColorBlendCS(spdArray[0], source1ill, spdArray[1], source2ill);
				$('#cs' + cctArray[j].toString()).html(csVal.toFixed(3));
			}
		}
	}
});

$(document).on('change','#cctCustom',function(){
	// Create selected spd array
	var spdArray = [];
	var spdCCTArray = [];
	for(var i = 0;i < sourcelist.length;i++){
		if(sourcelist[i].isSelected){
			spdArray.push(sourcelist[i].spd);
			spdCCTArray.push(CCTcalc(sourcelist[i].spd));
		}
	}
	// If 2 sources
	if(spdArray.length == 2){
		// Sort the spdArrays by CCT
		var reversed = false;
		if(spdCCTArray[0] < spdCCTArray[1]){
			spdCCTArray.reverse();
			spdArray.reverse();
			reversed = true;
		}
		var taco = $('#netIll').val();
		// Create funcParams
		var funcParams = {
			cct: Number(this.value),
			netIll: Number($('#netIll').val()),
			source1spd: spdArray[0],
			source2spd: spdArray[1],
		};

		// Optimize for CCT
		var source1ill0 = Math.floor(funcParams.netIll/2);
		var source1ill = fmin(prepJPColorBlend,funcParams,source1ill0);
		var source2ill = funcParams.netIll - source1ill;

		// Update table
		$('#saCustom').html(source1ill.toFixed());
		$('#sbCustom').html(source2ill.toFixed());
		var csVal = jpColorBlendCS(spdArray[0], source1ill, spdArray[1], source2ill);
		$('#csCustom').val(csVal.toFixed(3));
	}
});
