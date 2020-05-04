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

// Page Action Functions
$(document).ready(function(){

	$(this).scrollTop(0);

	$(".step-title-container").on("click",function(e){
		$('html, body').animate({
			scrollTop: $('#content').offset().top - 25
		}, 800);
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
});
