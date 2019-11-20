function arrayScalar(array,scalar){
	var result = [];
	for(var i = 0;i < array.length; i++){
		result[i] = array[i] * scalar;
	}
	return result;
}

function arrayAdd(array1,array2){
	var result = [];
	if(array1.length != array2.length){
		result = NaN;
	}else{
		for(var i = 0;i < array1.length;i++){
			result[i] = array1[i] + array2[i];
		}
	}
	return result;
}

function arraySub(array1,array2){
	var result = [];
	if(array1.length != array2.length){
		result = NaN;
	}else{
		for(var i = 0;i < array1.length;i++){
			result[i] = array1[i] - array2[i];
		}
	}
	return result;
}

function arrayAdd2(array1,value){
	var result = [];
	if(Array.isArray(value)){
		if(array1.length != value.length){
			result = NaN;
		}else{
			for(var i = 0;i < array1.length;i++){
				result[i] = array1[i] + value[i];
			}
		}
	}else{
		for(var i = 0;i < array1.length;i++){
			result[i] = array1[i] + value;
		}
	}
	return result;
}

function arraySub2(array1,value){
	var result = [];
	if(Array.isArray(value)){
		if(array1.length != value.length){
			result = NaN;
		}else{
			for(var i = 0;i < array1.length;i++){
				result[i] = array1[i] - value[i];
			}
		}
	}else{
		for(var i = 0;i < array1.length;i++){
			result[i] = array1[i] - value;
		}
	}
	return result;
}

function arrayNormalize(array){
	var result = [];
	var max = Math.max.apply(null,array);
	if(max != 0){
		var factor = 1/max;
		result = arrayScalar(array,factor);
	}else{
		result = arrayScalar(array,NaN);
	}
	return result;
}

function arrayPow(base, array){
	var result = [];
	for(var i = 0;i < array.length;i++){
		var exponent = array[i] * 1.0;
		result[i] = Math.pow(base, exponent);
	}
	return result;
}

function arrayBase(array, value){
	var result = [];
	for(var i = 0;i < array.length;i++){
		result[i] = Math.pow(array[i], value);
	}
	return result;
}

function arrayInverse(array){
	var result = [];
	for(var i = 0;i < array.length;i++){
		result[i] = 1/array[i];
	}
	return result;
}

function arrayDiv(array1, array2){
	var result = [];
	for(var i = 0;i < array1.length;i++){
		result[i] = array1[i]/array2[i];
	}
	return result;
}

function arrayMul(array1, array2){
	var result = [];
	for(var i = 0;i < array1.length;i++){
		result[i] = array1[i] * array2[i];
	}
	return result;
}

function arrayDiff(array){
	var result = [];
	if(array.length > 1){
		for(var i = 0;i < array.length-1;i++){
			result[i] = array[i+1] - array[i];
		}
	}else{
		result[0] = NaN;
	}
	return result;
}

function arrayRep(value, length){
	var result = [];
	for(var i = 0;i < length;i++){
		result[i] = value;
	}
	return result;
}

function arrayAbs(array){
	var result = [];
	for(var i = 0;i < array.length;i++){
		result[i] = Math.abs(array[i]);
	}
	return result;
}

function lessthanequal(val1, val2){
	var result = [];
	result = val1 <= val2;
	return result;
}

function findx1index(x, array){
	var result = [];
	array.reverse();
	//var rindex = array.findIndex(function(a) {return lessthanequal(a, x);});
	var rindex = -1;
	for(var i = 0;i < array.length;i++){
		if(array[i] <= x){
			rindex = i;
			break;
		}
	} 
	result = array.length - (rindex + 1);
	array.reverse();
	return result;
}

function lerp(x, x1, x2, y1, y2){
	var result = [];
	result = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
	return result;
}

function linearInterp(xarray, yarray, x, value){
	var result;
	var xmax = Math.max.apply(null, xarray);
	var xmin = Math.min.apply(null, xarray);
	if(x < xmin){
		result = value;
	}else if(x > xmax){
		result = value;
	}else if(x == xmax){
		var yendindex = (yarray.length) - 1;
		result = yarray[yendindex];
	}else{
		var x1index = findx1index(x, xarray);
		var x1 = xarray[x1index];
		var x2 = xarray[x1index + 1];
		var y1 = yarray[x1index];
		var y2 = yarray[x1index + 1];
			
		result = lerp(x, x1, x2, y1, y2);
	}
	return result;
}

function interp1(xarray, yarray, array, value){
	var result = [];
	if(Array.isArray(array)){
		for(var i = 0;i < array.length;i++){
			var x = array[i];
			result[i] = linearInterp(xarray, yarray, x, value);
		}
	}else{
		var x = array;
		result[0] = linearInterp(xarray, yarray, x, value);
	}
	return result;
}

function sumproduct(array1, array2){
	var result = 0;
	for(var i = 0;i < array1.length;i++){
		result += (array1[i] * array2[i]);
	}
	return result;
}

function createDelta(wavelength){
	var result = [];
	for(var i = 0;i < wavelength.length;i++){
		if(i == 0){
			result[i] = (wavelength[i+1] - wavelength[i])/2;
		}else if(i == (wavelength.length - 1)){
			result[i] = (wavelength[i] - wavelength[i-1])/2;
		}else{
			result[i] = ((wavelength[i] - wavelength[i-1])/2 + (wavelength[i+1] - wavelength[i])/2);
		}
	}
	return result;
}

function spdNormalize(wavelength,value){
	var result = [];

	//var efs = efficienyFunctions(wavelength);
	var cie = cie31by1();
	var ybar = interp1(cie.wavelength,cie.ybar,wavelength,0);
	var deltaWavelength = createDelta(wavelength);
	//var spdPhotopic = sumproduct(value, arrayMul(deltaWavelength, efs.Photopic));
	var spdPhotopic = sumproduct(value, arrayMul(deltaWavelength, ybar))
	var factor = 1/(683*spdPhotopic);
	var result = arrayScalar(value,factor);
	return result;
}

Array.prototype.toEnd = function(el){
	var i = this.indexOf(el);
	if(i >= 0){
		this.splice(i,1);
	}
	this.push(el);
}

Array.prototype.toFront = function(el){
	var i = this.indexOf(el);
	if(i >= 0){
		this.splice(i,1);
	}
	this.unshift(el);
}

function uniqueId(objArray, newId){
	var result = true;
	for(var i = 0;i < objArray.length;i++){
		if(objArray[i].id == newId){
			result = false;
			break;
		}
	}
	return result;
}

Array.prototype.indicies = function(array){
	var result = [];
	for(var i = 0;i < array.length;i++){
		result[i] = this[array[i]];
	}
	return result;
}

Array.prototype.sum = function(){
	var result = 0;
	for(var i = 0; i < this.length;i++){
		result += this[i];
	}
	return result;
}

function arrayEval(array1, array2){
	var result = [];
	for(var i = 0;i < array2.length;i++){
		var idx = array2[i];
		result[i] = array1[idx];
	}
	return result;
}