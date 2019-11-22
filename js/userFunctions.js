function resetInputs(){
	// Remove form-group aura
	$('#userIDFormGroup').removeClass('has-error');
	$('#userIDFormGroup').removeClass('has-success');

	$('#userSPDFormGroup').removeClass('has-error');
	$('#userSPDFormGroup').removeClass('has-success');

	// Reset Glyphicon
	$('#userIDSpan').addClass('glyphicon-pencil');
	$('#userIDSpan').removeClass('glyphicon-remove');
	$('#userIDSpan').removeClass('glyphicon-ok');

	$('#userSPDSpan').addClass('glyphicon-pencil');
	$('#userSPDSpan').removeClass('glyphicon-remove');
	$('#userSPDSpan').removeClass('glyphicon-ok');

	// Reset Status text
	$('#userSPDStatus').text('');

	// Reset Input values
	$("#userID").attr("placeholder", "Enter Unique Source ID").val("");
	$('#userMan').val('Other');
	$('#userCCT').val('Other');
	$('#userLamp').val('Other');
	$('#userSPD').val('');

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
		console.log(sourcelist[i].id + ' ' + newSourceID);
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
	$("#userID").attr("placeholder", "Invalid Source Name").val("")
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

	}
	return result;
}

function validateSubmit(){
	if(validateUserID() & validateUserSPD()){
		$('#userSourceSubmit').removeClass('disabled');
		$('#userSourceSubmit').prop('disabled',false);
	}else{
		$('#userSourceSubmit').addClass('disabled');
		$('#userSourceSubmit').prop('disabled',true);
	}
}

function readUserSPD(){
	var result = new Object;
	var validSPD = true;
	var wavelength = [];
	var value = [];
	var newSPD = $('#userSPD').val();
	var newSPDRows = newSPD.split('\n');
	var newSPDRowsClean = cleanSPDRows(newSPDRows);
	var newSPDRowArray = [];
	var alertText;
	if(newSPDRowsClean.length == 2){
		//alert("UserSPD is Horizontal");
		wavelength = newSPDRowsClean[0].split(/\s*[\s|,]\s*/);//(/[\s,]+/);
		value = newSPDRowsClean[1].split(/\s*[\s|,]\s*/);//(/[\s,]+/);
	}else if(newSPDRowsClean.length > 2){
		//alert("UserSPD is vertical");
		for(var i = 0;i < newSPDRowsClean.length;i++){
			newSPDRowArray = newSPDRowsClean[i].split(/\s*[\s|,]\s*/);//(/\s*,?\s+/);
			if(newSPDRowArray.length < 2){
				alertText = 'Error: not enough Columns';
				validSPD = false;
				break;
			}else if(newSPDRowArray.length > 2){
				alertText = 'Error: Too many Columns';
				validSPD = false;
				break;
			}else{
				wavelength[i] = newSPDRowArray[0];
				value[i] = newSPDRowArray[1];
			}
		}
	}else{
		alertText = 'Error: not enough rows.';
		validSPD = false;
	}
	$('#userSPD').val(newSPDRowsClean.join('\n'));

	// Validate the arrays
	var spd = {
		wavelength: [],
		value: []
	};
	if(wavelength.length == 0 & value.length == 0){
		alertText = '';
	}else if(wavelength.length < 3){
		alertText = 'Error: Not enough entries';
		validSPD = false;
	}else if(wavelength.length != value.length){
		alertText = 'Error: Arrays not the same length';
		validSPD = false;
	}else if(wavelength.some(notNumeric)){
		alertText = 'Error: Wavelength array contains non-numeric entry';
		validSPD = false;
	}else if(value.some(notNumeric)){
		alertText = 'Error: Value array contains non-numeric entry';
		validSPD = false;
	}else{
		alertText = '';
		spd.wavelength = arrayParseFloat(wavelength);
		spd.value = arrayParseFloat(value);
	}
	result = {
		valid: validSPD,
		spd: spd
	};

	//alert(alertText);
	$('#userSPDStatus').text(alertText);
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
	applyNewSource(sourcelist.length, newSource);
	updateSortSource();
	sourcelist.push(newSource);
	$('#myModal').modal('toggle');
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
		info: "User loaded source"
	};
	return result;
}

// Page Action Functions
$(document).ready(function(){
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

	$("#myModal").on("hidden.bs.modal", function () {
		// put your default event here
		resetInputs();
	});

	$(".userSortSource").change(function() {
		var sourceVal = $(this).val();
		if(!notEmpty(sourceVal)){
			$(this).val('Other');
		}
	});

	$("#userSPD").change(function(){
		if(validateUserSPD()){
			userSPDValid();
		}else{
			userSPDInvalid();
		}
		validateSubmit();
	});
});
