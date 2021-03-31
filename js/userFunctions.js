function resetInputs(){

	// Reset Status text
	$('#userSPDStatus').text('');

	// Reset Input values
	$("#userID").attr("placeholder", "Unique Source Name").val("");
	$('#userSPDValues').val('');
	$('#userSPDWavelengths').val('');
	$('#userMan').val('');
	$('#userCCT').val('');
	$('#userLamp').val('');
	$('#userDesc').val('');

	// Reset submit
	//validateSubmit();
	$('#userSourceSubmit').addClass('disabled');
	$('#userSourceSubmit').prop('disabled',true);
	return;
}

function notEmpty(id){
	return id != '';
}

function isUniqueSourceName(newSourceID){
	var result = true;
	for(var i in sourcelist){
		if(sourcelist[i].id == newSourceID){
			result = false;
			break;
		}
	}
	return result;
}

function userIDValid(){
	$('#userIDFormGroup').removeClass('has-error');
	$('#userIDFormGroup').addClass('has-success');

	$('#userIDSpan').removeClass('glyphicon-pencil');
	$('#userIDSpan').removeClass('glyphicon-remove');
	$('#userIDSpan').removeClass('glyphicon-ok');

	$('#userIDSpan').addClass('glyphicon-ok');
	return;
}

function userIDInvalid(){
	$("#userID").attr("placeholder", "Invalid Source Name").val("");
	$('#userIDFormGroup').removeClass('has-success');
	$('#userIDFormGroup').addClass('has-error');

	$('#userIDSpan').removeClass('glyphicon-pencil');
	$('#userIDSpan').removeClass('glyphicon-remove');
	$('#userIDSpan').removeClass('glyphicon-ok');

	$('#userIDSpan').addClass('glyphicon-remove');
	return;
}

function userSPDValid(){
	$('#userSPDFormGroup').removeClass('has-error');
	$('#userSPDFormGroup').addClass('has-success');

	$('#userSPDSpan').removeClass('glyphicon-pencil');
	$('#userSPDSpan').removeClass('glyphicon-remove');
	$('#userSPDSpan').removeClass('glyphicon-ok');

	$('#userSPDSpan').addClass('glyphicon-ok');
	return;
}

function userSPDInvalid(){
	$('#userSPDFormGroup').removeClass('has-success');
	$('#userSPDFormGroup').addClass('has-error');

	$('#userSPDSpan').removeClass('glyphicon-pencil');
	$('#userSPDSpan').removeClass('glyphicon-remove');
	$('#userSPDSpan').removeClass('glyphicon-ok');

	$('#userSPDSpan').addClass('glyphicon-remove');
	return;
}

function validateUserID(){
	var result = false;
	var newSourceID = $('#userID').val();
	if(notEmpty(newSourceID) & isUniqueSourceName(newSourceID)){
		result = true;
	}else{
		if ($('#userSPDValues').val()!= ''){
			$('#userSPDModalHelp').append('<li class="alert alert-danger"><strong>Error:</strong> Must enter a unique source name</li>');
		}
	}
	return result;
}

function validateSubmit(){
	if(validateUserID() && validateUserSPD()){
		$('#userSourceSubmit').removeClass('disabled');
		$('#userSourceSubmit').prop('disabled',false);
	}else{
		$('#userSourceSubmit').addClass('disabled');
		$('#userSourceSubmit').prop('disabled',true);
	}
}

function readUserSPD(){
	var result = {};
	var validSPD = true;
	var spd = {
		wavelength: [],
		value: []
	};
	var alertText = '';
	var userWL = cleanSPDRows($('#userSPDWavelengths').val().replace( /\n/g, " " ).split( " " ));
	var userV = cleanSPDRows($('#userSPDValues').val().replace( /\n/g, " " ).split( " " ));
	if (userWL.length != userV.length){
		if ($('#userSPDValues').val()!= ''){
			alertText += '<li class="alert alert-danger" role="alert"><strong>Error:</strong> There must be the same number of wavelengths and values</li>';
		}
		validSPD = false;
	}
	if (userWL.length < 3){
		if ($('#userSPDValues').val()!= ''){
			alertText += '<li class="alert alert-danger" role="alert"><strong>Error:</strong> Must enter at least 3 wavelength-value pairs</li>';
		}
		validSPD = false;
	}

	if(userWL.some(notNumeric) || userV.some(notNumeric)){
		if ($('#userSPDValues').val()!= ''){
			alertText += '<li class="alert alert-danger" role="alert"><strong>Error:</strong> Wavelengths and values must not contain non-numeric entries</li>';
		}
		validSPD = false;
	}

	spd.wavelength = arrayParseFloat(userWL);
	spd.value = arrayParseFloat(userV);

	result = {
		valid: validSPD,
		spd: spd
	};

	//alert(alertText);
	$('#userSPDModalHelp').html(alertText);
	return result;
}

function validateUserSPD(){
	var userSPDTest = readUserSPD();
	return userSPDTest.valid;
}

function loadUserSPD(){
	var userSPDTest = readUserSPD();
	return userSPDTest.spd;
}

function cleanSPDRows(spdRows){
	var result = [];
	for(var i = 0;i < spdRows.length;i++){
		if(isWhitespaceNotEmpty(spdRows[i])){
			result.push(spdRows[i]);
		}
	}
	return result;
}

function isWhitespaceNotEmpty(text) {
   var result =  text.length > 0 && !(!/[^\s]/.test(text));
   return result;
}

function notNumeric(n) {
  return !notEmpty(n) || !(!isNaN(n) && isFinite(n));
}

function submitUserSource(){
	var newSource = buildSourceObj();
	applyNewSource(sourcelist.length, newSource, true);
	updateSortSource();
	sourcelist.push(newSource);
}

function arrayParseFloat(array){
	var result = [];
	for(var i = 0; i < array.length; i++){
		result[i] = parseFloat(array[i]);
	}
	return result;
}

function buildSourceObj(){
	var result = {
		id: $('#userID').val(),
		manufacturer: $('#userMan').val(),
		cct: $('#userCCT').val(),
		lamp: $('#userLamp').val(),
		spd: loadUserSPD(),
		info: $('#userDesc').val()
	};
	return result;
}

function handlePlotBtns(){
	$(".plot-btn").on("click",function(){
		if(!$(this).hasClass('active')){
			$(".plot-btn").removeClass('active');
			$(this).addClass('active');
			let plotID = "#PlotArea" + $(this)[0].id.replace("plotBtn","");
			$('.plot-area').removeClass('d-block');
			$('.plot-area').addClass('d-none');
			$(plotID).addClass('d-block');
		}
	});
}

function handleSPDBtns(){
	$(".spd-button").on("click",function(){
		if(!$(this).hasClass('active')){
			$(".spd-button").removeClass('active');
			$(this).addClass('active');
			let containerID = "#" + $(this)[0].id.replace("Btn","") + "TableContainer";
			let titleWord;
			if($(this)[0].id.replace("SpdBtn","") == "Rel"){
				titleWord = "Relative";
			}else{
				titleWord = "Absolute";
			}
			$("#SPDModalTitleWord").html(titleWord);
			$(".spd-container").addClass("d-none");
			$(containerID).removeClass("d-none");
		}
	});
}

function handleHelpMenu(){
	$(".help-menu-list-item").on("click",function(){
		if(!$(this).hasClass("active")){
			$('.help-menu-list-item').removeClass('active');
			$(this).addClass('active');
			let sectionID = "#help-" + $(this).data("value");
			$(".help-section").addClass('d-none');
			$(sectionID).removeClass('d-none');
		}

	});
}

function createResultsJSON(){
	var str = '{"results" : \n\t{\n';

	// Date
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
	var d = new Date();
	var date = monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
  str += '\t\t"date" : "'+date+'",\n';

	//Sources
	str += '\t\t"sources" : {\n';
	$("#selected-sources").each(function(){
		$(this).find('tr').each(function(){
			var id = $(this).find('td:nth-of-type(1) p').html();
			str += '\t\t\t"' + id + '" : {\n';
			str += '\t\t\t\t"info" : {\n'
			for (var i = 0; i<sourcelist.length; i++){
				if (sourcelist[i].id == id){
					str += '\t\t\t\t\t"id" : "' + sourcelist[i].id + '",\n';
					str += '\t\t\t\t\t"manufacturer" : "' + sourcelist[i].manufacturer + '",\n';
					str += '\t\t\t\t\t"cct" : "' + sourcelist[i].cct + '",\n';
					str += '\t\t\t\t\t"lamp" : "' + sourcelist[i].lamp + '",\n';
					str += '\t\t\t\t\t"desc" : "' + sourcelist[i].info + '",\n';
					str += '\t\t\t\t\t"spd" : {\n';
					str += '\t\t\t\t\t\t"wavelengths" : ' + JSON.stringify(sourcelist[i].spd.wavelength) + ',\n';
					str += '\t\t\t\t\t\t"values" : ' + JSON.stringify(sourcelist[i].spd.value) + '\n';
					str += '\t\t\t\t\t}\n';
				}
			}
			str += '\t\t\t\t},\n';
			str += '\t\t\t\t"lux" : "' + $(this).find('td:nth-of-type(2) input').val() + '"\n';
			if ($(this)[0] == ($("#selected-sources").find('tr:last-child'))[0]){
				str += '\t\t\t}\n';
			}else{
				str += '\t\t\t},\n';
			}
		});
	});
	str += '\t\t},\n';

	// Misc Input Variables
	str += '\t\t"misc_variables" : {\n';
	str += '\t\t\t"mpod" : "' + $('#mpod_sel').val() + '",\n';
	str += '\t\t\t"exposure_duration" : "' + $('#time_sel').val() + '",\n';
	str += '\t\t\t"distribution_scalar" : "' + $('#scalar_sel').val() + '"\n';
	str += '\t\t},\n';

	// Combined Source Value Metrics
	str += '\t\t"combined_metrics" : {\n';
	var vals = [];
	$("#csvmbody").each(function(){
		$(this).find('tr').each(function(){
			vals.push('"'+$(this).find('td:nth-of-type(2)').html() + '"');
		});
	});
	str += '\t\t\t"cs" : ' + vals[0] + ',\n';
	str += '\t\t\t"cla" : ' + vals[1] + ',\n';
	str += '\t\t\t"illuminance" : ' + vals[2] + ',\n';
	str += '\t\t\t"irradiance" : ' + vals[3] + ',\n';
	str += '\t\t\t"flux" : ' + vals[4] + ',\n';
	str += '\t\t\t"eml" : ' + vals[5] + ',\n';
	str += '\t\t\t"cct" : ' + vals[6] + ',\n';
	str += '\t\t\t"duv" : ' + vals[7] + ',\n';
	str += '\t\t\t"cri" : ' + vals[8] + ',\n';
	str += '\t\t\t"gai" : ' + vals[9] + ',\n';
	str += '\t\t\t"color_coordinates" : ' + vals[10] + '\n';
	str += '\t\t},\n';

	// Combined spd's
	str += '\t\t"combined_spds" : {\n';
	str += '\t\t\t"relative" : {\n';
	var wl = [], val = [];
	$("#RelSpdTable").each(function(){
		$(this).find('tr').each(function(){
			wl.push(parseFloat($(this).find('td:nth-of-type(1)').html()));
			val.push(parseFloat($(this).find('td:nth-of-type(2)').html()));
		})
	});
	str += '\t\t\t\t"wavelengths" : [' + wl + '],\n';
	str += '\t\t\t\t"values" : [' + val + ']\n';
	str += '\t\t\t},\n';

	str += '\t\t\t"absolute" : {\n';
	var wl = [], val = [];
	$("#AbsSpdTable").each(function(){
		$(this).find('tr').each(function(){
			wl.push(parseFloat($(this).find('td:nth-of-type(1)').html()));
			val.push(parseFloat($(this).find('td:nth-of-type(2)').html()));
		})
	});
	str += '\t\t\t\t"wavelengths" : [' + wl + '],\n';
	str += '\t\t\t\t"values" : [' + val + ']\n';
	str += '\t\t\t}\n';
	str += '\t\t}\n';

	str += '\t}\n}';

  $('#jsondownload').attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(str));
  $('#jsondownload').attr('download', 'CSCalculator Results.json');
  $('#jsondownload')[0].click();
}

function resetInputVariables(){
	$("#mpod_sel").val("0.5");
	$("#time_sel").val("1.00");
	$("#scalar_sel").val("1.0");
	$("#attenuation_sel").val("0.0");
}


// Page Action Functions
$(document).ready(function(){

	// $(this).scrollTop(0);

	resetInputVariables();

	$("button.addSource").on("click",function(){
		if($("#stepChange2").hasClass("disabled")){
			$("#stepChange2").fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
			$("#stepChange2").removeClass("disabled");
		}
	});

	$(".step-title-container").on("click",function(e){
		// if ($('html').scrollTop() != Math.round($('#content').offset().top - 25)){
		// 	$('html').animate({
		// 		scrollTop: $('#content').offset().top - 25
		// 	}, 800);
		// }
		var step = $(this).attr("id").replace("stepChange","");
		$(".step-title-container").removeClass("active");
		$(this).addClass('active');
		$("[id^='stepContent']").removeClass("d-block");
		$("[id^='stepContent']").addClass("d-none");
		$("#stepContent" + step).removeClass("d-none");
		$("#stepContent" + step).addClass("d-block");
	});

	$('#userID').change(function () {
		if(validateUserID()){
			userIDValid();
		}else{
			userIDInvalid();
		}
		validateSubmit();
	});

	$('.userEnter').on('keydown', function(e){
		//Trigger change on enter
        if(e.keyCode == 13) {
			$(this).trigger('change');
			$(this).focus().blur();
		}
    });

	$(".userSortSource").change(function() {
		var sourceVal = $(this).val();
		if(!notEmpty(sourceVal)){
			$(this).val('Other');
		}
	});

	$("#newSourceCol").mousemove(function(){
		if(validateUserSPD()){
			userSPDValid();
		}else{
			userSPDInvalid();
		}
		validateSubmit();
	});

	$("#userSPDWavelengths").change(function(){
		if(validateUserSPD()){
			userSPDValid();
		}else{
			userSPDInvalid();
		}
		validateSubmit();
	});

	$("#userSPDValues").change(function(){
		if(validateUserSPD()){
			userSPDValid();
		}else{
			userSPDInvalid();
		}
		validateSubmit();
	});

	handlePlotBtns();

	handleSPDBtns();

	handleHelpMenu();

	$("#resultsDownload").click(createResultsJSON);
});
