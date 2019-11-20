// Page Action Functions
$(document).ready(function(){
	// Poll selected search options
	$('.sortSource').change( function () {
		for(var i = 0;i < sourcelist.length; i++){
			$("#source_"+i).hide();
		}
		$("#noAvailableSources").show();
				
		var manSelected = $('#manufacterer option:selected').text();
		var cctSelected = $('#cct option:selected').text();
		var lampSelected = $('#lamp option:selected').text();
		
		var searchVal = ($('#searchSource').val()).toLocaleLowerCase();
					
		for(var i = 0;i < sourcelist.length;i++){
			// Sort using the dropdown menus
			var manTest = manSelected == "Any" || sourcelist[i].manufacturer == manSelected;
			var cctTest = cctSelected == "Any" || sourcelist[i].cct == cctSelected;
			var lampTest = lampSelected == "Any" || sourcelist[i].lamp == lampSelected;
			
			// Sort using the keyword box
			var searchTest = false;
			if(notEmpty(searchVal)){
				// Initialize Search Test
				var searchTest = false;
				
				// Split the search string
				var searchValArray = searchVal.split(" ");
				
				// Search ID
				var sourceIDArray = ((sourcelist[i].id).toLocaleLowerCase()).split(" ");
				for(var j = 0; j < sourceIDArray.length; j++){
					var isSourceID = true;
					for(var k = 0; k < searchValArray.length; k++){
						isSourceID = isSourceID & (sourceIDArray[j].search(searchValArray[k]) == 0);
					}
					if(isSourceID){
						searchTest = true
						break
					}
				}
				
				// Search Manufacturer
				if(!searchTest){
					var sourceManArray = ((sourcelist[i].manufacturer).toLocaleLowerCase()).split(" ");
					for(var j = 0; j < sourceManArray.length; j++){
						var isSourceMan = true;
						for(var k = 0; k < searchValArray.length; k++){
							isSourceMan = isSourceMan & (sourceManArray[j].search(searchValArray[k]) == 0);
						}
						if(isSourceMan){
							searchTest = true
							break
						}
					}
				}
				
				// Search CCTs
				if(!searchTest){
					var sourceCCTArray =((sourcelist[i].cct).toLocaleLowerCase()).split(" ");
					for(var j = 0; j < sourceCCTArray.length; j++){
						var isSourceCCT = true;
						for(var k = 0; k < searchValArray.length; k++){
							isSourceCCT = isSourceCCT & (sourceCCTArray[j].search(searchValArray[k]) == 0);
						}
						if(isSourceCCT){
							searchTest = true
							break
						}
					}
				}
				
				// Search Lamps
				if(!searchTest){
					var sourceLampArray = ((sourcelist[i].lamp).toLocaleLowerCase()).split(" ");
					for(var j = 0; j < sourceLampArray.length; j++){
						var isSourceLamp = true;
						for(var k = 0; k < searchValArray.length; k++){
							isSourceLamp = isSourceLamp & (sourceLampArray[j].search(searchValArray[k]) == 0);
						}
						if(isSourceLamp){
							searchTest = true
							break
						}
					}
				}
				
				/*
				for(var j = 0; j < searchValArray.length; j++){
					var searchIDTest = ((sourcelist[i].id).toLocaleLowerCase()).search(searchValArray[j]) == 0;
					var searchManTest = ((sourcelist[i].manufacturer).toLocaleLowerCase()).search(searchValArray[j]) == 0;
					var searchCCTTest = ((sourcelist[i].cct).toLocaleLowerCase()).search(searchValArray[j]) == 0;
					var searchLampTest = ((sourcelist[i].lamp).toLocaleLowerCase()).search(searchValArray[j]) == 0;
					
					if(searchIDTest | searchManTest | searchCCTTest | searchLampTest){
						searchTest = true;
						break;
					}
				}
				*/
				
			}else{
				searchTest = true;
			}
			
			/*
			var searchIDTest = !notEmpty(searchVal) || ((sourcelist[i].id).toLocaleLowerCase()).search(searchVal) >= 0;
			var searchManTest = !notEmpty(searchVal) || ((sourcelist[i].manufacturer).toLocaleLowerCase()).search(searchVal) >= 0;
			var searchCCTTest = !notEmpty(searchVal) || ((sourcelist[i].cct).toLocaleLowerCase()).search(searchVal) >= 0;
			var searchLampTest = !notEmpty(searchVal) || ((sourcelist[i].lamp).toLocaleLowerCase()).search(searchVal) >= 0;
			
			var searchTest = searchIDTest | searchManTest | searchCCTTest | searchLampTest;
			*/
			
			if(manTest & cctTest & lampTest & searchTest){
				$("#source_"+i).show();
				$("#noAvailableSources").hide();
			}
		}
		
		// Update the size lengths of the columns
		/*
		$('.box').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {

			// code to execute after transition ends
			jQuery.fn.matchHeight._update();
		});
		*/
	}); 
	
	// Reset search options
	$('#reset').on("click",function(){
		document.getElementById("manufacterer").selectedIndex = 0;
		document.getElementById("cct").selectedIndex = 0; 
		document.getElementById("lamp").selectedIndex = 0; 
		document.getElementById("searchSource").value = '';
		$('.sortSource').trigger('change');
		var manSelected = $('#manufacterer option:selected').text();
		
		// Update the size lengths of the columns
		/*
		$('.box').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {

			// code to execute after transition ends
			jQuery.fn.matchHeight._update();
		});
		*/
	});
	
	$(document).on('click','.addSource',function(){
		//Get Source data
		var modalId = ($(this).closest(".modal").prop("id"));
		var sourceIdx = modalId.split("_")[1];
			
		// Create selected source object
		sourcelist[sourceIdx].isSelected = true;
		
		// Create HTML
		var tr = document.createElement("tr");
		tr.setAttribute('id','SelectedSource_'+sourceIdx);
		var tdSource = document.createElement("td");
		tdSource.innerHTML = sourcelist[sourceIdx].id;
		tr.appendChild(tdSource);
		var tdIll = document.createElement("td");
		var tdIllInput = document.createElement("input");
		tdIllInput.setAttribute('id','ssIll_'+sourceIdx);
		tdIllInput.setAttribute('class','form-control ssIll');
		//tdIllInput.setAttribute('type','number');
		tdIllInput.setAttribute('placeholder',sourcelist[sourceIdx].selectedSource.illuminance);
		//tdIllInput.setAttribute('min',0);
		//tdIllInput.setAttribute('step',0.01);
		tdIll.appendChild(tdIllInput);
		tr.appendChild(tdIll);
		var tdRemove = document.createElement("td");
		var tdRemoveButton = document.createElement("button");
		tdRemoveButton.setAttribute('type','button');
		tdRemoveButton.setAttribute('class','btn btn-default btn-sm removeSource');
		var tdRemoveButtonSpan = document.createElement("span");
		tdRemoveButtonSpan.setAttribute('class','glyphicon glyphicon-trash');
		tdRemoveButton.appendChild(tdRemoveButtonSpan);
		tdRemove.appendChild(tdRemoveButton);
		tr.appendChild(tdRemove);
		$("#selected-sources")[0].appendChild(tr);
		
		// Disable sourcelist button
		$("#source_"+sourceIdx).addClass('disabled');
		$("#source_"+sourceIdx).prop('disabled',true);
		updateResults();
		
		// Update chart dataset array
		addSourceDataset(sourcelist[sourceIdx]);
		jpButtonToggle();
		
		// Update the size lengths of the columns
		/*
		$('.box').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {

			// code to execute after transition ends
			jQuery.fn.matchHeight._update();
		});
		*/
	});
	
	$(document).on('click','.removeSource',function(){
		// Get Source data index
		var rowId = ($(this).closest("tr").prop("id"));
		var sourceIdx = rowId.split("_")[1];			
					
		// Remove selected source
		$("#SelectedSource_"+sourceIdx).remove();
		sourcelist[sourceIdx].isSelected = false;
		sourcelist[sourceIdx].selectedSource.illuminance = 0;
		sourcelist[sourceIdx].selectedSource.absoluteSPD =  arrayScalar(sourcelist[sourceIdx].selectedSource.relativeSPD,sourcelist[sourceIdx].selectedSource.illuminance);
		
		// Enable source in sourcelist array
		$("#source_"+sourceIdx).removeClass('disabled');
		$("#source_"+sourceIdx).prop('disabled',false);
		updateResults();
		removeSourceDataset(sourcelist[sourceIdx]);
		jpButtonToggle();
		
		// Update the size lengths of the columns
		/*
		$('.box').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {

			// code to execute after transition ends
			jQuery.fn.matchHeight._update();
		});
		*/
	});
	
	$(document).on('keydown','.ssIll',function(e){
        // Allow: backspace, delete, tab, escape, enter and .
		if(!(e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39)){
			var tester = this;
			var testString = (this.value).slice(0,this.selectionStart).concat(e.key).concat(this.value.slice(this.selectionEnd,this.value.length));
			console.log(testString);
			console.log(/^\d*\.?(\d{1,2})?$/.test(testString));
			if(!(/^\d*\.?(\d{1,2})?$/.test(testString))){ //(!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8 || e.keyCode == 110 || e.keyCode == 190 || e.keyCode == 46)) {
				return false;
			}
		}
    });
	
	$(document).on('keydown','.ssIll',function(e){
        // Trigger change on enter
        if(e.keyCode == 13) {
			$('.ssIll').trigger('change');
		}
    });
	
	$(document).on('change','.ssIll',function(){
		var sourceIdx = this.id.split("_")[1];
		if(this.value == ''){
			this.value = '0';
		}else if(/^\.\d*$/.test(this.value)){
			this.value = "0".concat(this.value);
		}
		if(/^\d*\.$/.test(this.value)){
			this.value = this.value.concat("0");
		}
		sourcelist[sourceIdx].selectedSource.illuminance = parseFloat(this.value);
		sourcelist[sourceIdx].selectedSource.absoluteSPD =  arrayScalar(sourcelist[sourceIdx].selectedSource.relativeSPD,sourcelist[sourceIdx].selectedSource.illuminance);
		updateResults();
		
	});
	
	$(document).on('keydown','#csInput',function(e){
        // Allow: backspace, delete, tab, escape, enter and .
		if(!(e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39)){
			console.log(document.getElementById("csInput").valueAsString);
			var testString = (this.value).slice(0,this.selectionStart).concat(e.key).concat(this.value.slice(this.selectionEnd,this.value.length));
			console.log(/(^0$)|(^0?\.(\d{1,3})?$)/.test(testString));
			if(!(/(^0$)|(^0?\.(\d{1,3})?$)/.test(testString))){ //(!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8 || e.keyCode == 110 || e.keyCode == 190 || e.keyCode == 46)) {
				return false;
			}
		}
    });
	
	$(document).on('keydown','#csInput',function(e){
        // Trigger change on enter
        if(e.keyCode == 13) {
			$('#csInput').trigger('change');
		}
    });
	
	$(document).on('change','#csInput',function(){
		var sourceIdx = this.id.split("_")[1];
		if(this.value == ''){
			this.value = '0';
		}
		if(/^\.\d*$/.test(this.value)){
			this.value = "0".concat(this.value);
		}
		if(/^0.$/.test(this.value)){
			this.value = this.value.concat("0");
		}
		var cla = cs2cla(parseFloat(this.value));
		
		var testSPD = {
			wavelength: setwavelength,
			value: arrayScalar(setwavelength,0)
		}
		
		for(var i = 0;i < sourcelist.length;i++){
			if(sourcelist[i].isSelected){
				testSPD.value = sourcelist[i].selectedSource.relativeSPD;
				break;
			}
		}
		var lux = claspd2lux(cla,testSPD,thickness*2);
		//console.log(document.getElementsByClassName('ssIll')[0].value);
		document.getElementsByClassName('ssIll')[0].value = (lux).toFixed(2).toString();
		$('.ssIll').trigger('change');
	});
	
	$('#mpod_sel').on('change', function(){
		$('#mpod').html(this.value);
		thickness = Number(this.value);
		updateResults();
		
	});
	
	function isTextSelected(input) {
    if (typeof input.selectionStart == "number") {
        return input.selectionStart == 0 && input.selectionEnd == input.value.length;
    } else if (typeof document.selection != "undefined") {
        input.focus();
        return document.selection.createRange().text == input.value;
    }
}
	
	$('#helpMaster').on('click',function(){
		var test = $('#helpBadge').html();
		if(test == 'off'){
			$('.help').addClass('in');
			$('.help').removeClass('in');
			$('#helpBadge').html('on');
		}else{
			$('.help').addClass('in');
			$('#helpBadge').html('off');
		}
		
		// Update the size lengths of the columns
		/*
		$('.box').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {

			// code to execute after transition ends
			jQuery.fn.matchHeight._update();
		});
		*/
		
	});
	/*
	$('.accordion-toggle').on('click',function(){
		// Update the size lengths of the columns
		$('.box').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {

			// code to execute after transition ends
			jQuery.fn.matchHeight._update();
		});
	});
	*/
});