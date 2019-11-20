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
