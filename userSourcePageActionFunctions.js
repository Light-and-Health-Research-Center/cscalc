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