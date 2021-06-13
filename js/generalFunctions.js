function arrayScalar(array, scalar) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    result[i] = array[i] * scalar;
  }
  return result;
}

function arrayAdd(array1, array2) {
  var result = [];
  if (array1.length != array2.length) {
    result = NaN;
  } else {
    for (var i = 0; i < array1.length; i++) {
      result[i] = array1[i] + array2[i];
    }
  }
  return result;
}

function arraySub(array1, array2) {
  var result = [];
  if (array1.length != array2.length) {
    result = NaN;
  } else {
    for (var i = 0; i < array1.length; i++) {
      result[i] = array1[i] - array2[i];
    }
  }
  return result;
}

function arrayAdd2(array1, value) {
  var result = [];
  var i;
  if (Array.isArray(value)) {
    if (array1.length != value.length) {
      result = NaN;
    } else {
      for (i = 0; i < array1.length; i++) {
        result[i] = array1[i] + value[i];
      }
    }
  } else {
    for (i = 0; i < array1.length; i++) {
      result[i] = array1[i] + value;
    }
  }
  return result;
}

function arraySub2(array1, value) {
  var result = [];
  var i;
  if (Array.isArray(value)) {
    if (array1.length != value.length) {
      result = NaN;
    } else {
      for (i = 0; i < array1.length; i++) {
        result[i] = array1[i] - value[i];
      }
    }
  } else {
    for (i = 0; i < array1.length; i++) {
      result[i] = array1[i] - value;
    }
  }
  return result;
}

function arrayNormalize(array) {
  var result = [];
  var max = Math.max.apply(null, array);
  if (max != 0) {
    var factor = 1 / max;
    result = arrayScalar(array, factor);
  } else {
    result = arrayScalar(array, NaN);
  }
  return result;
}

function arrayPow(base, array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var exponent = array[i] * 1.0;
    result[i] = Math.pow(base, exponent);
  }
  return result;
}

function arrayBase(array, value) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    result[i] = Math.pow(array[i], value);
  }
  return result;
}

function arrayInverse(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    result[i] = 1 / array[i];
  }
  return result;
}

function arrayDiv(array1, array2) {
  var result = [];
  for (var i = 0; i < array1.length; i++) {
    result[i] = array1[i] / array2[i];
  }
  return result;
}

function arrayMul(array1, array2) {
  var result = [];
  for (var i = 0; i < array1.length; i++) {
    result[i] = array1[i] * array2[i];
  }
  return result;
}

function arrayDiff(array) {
  var result = [];
  if (array.length > 1) {
    for (var i = 0; i < array.length - 1; i++) {
      result[i] = array[i + 1] - array[i];
    }
  } else {
    result[0] = NaN;
  }
  return result;
}

function arrayRep(value, length) {
  var result = [];
  for (var i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

function arrayAbs(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    result[i] = Math.abs(array[i]);
  }
  return result;
}

function lessthanequal(val1, val2) {
  var result = [];
  result = val1 <= val2;
  return result;
}

function findx1index(x, array) {
  var result = [];
  array.reverse();
  var rindex = -1;
  for (var i = 0; i < array.length; i++) {
    if (array[i] <= x) {
      rindex = i;
      break;
    }
  }
  result = array.length - (rindex + 1);
  array.reverse();
  return result;
}

function lerp(x, x1, x2, y1, y2) {
  var result = [];
  result = y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
  return result;
}

function linearInterp(xarray, yarray, x, value) {
  var result;
  var xmax = Math.max.apply(null, xarray);
  var xmin = Math.min.apply(null, xarray);
  if (x < xmin) {
    result = value;
  } else if (x > xmax) {
    result = value;
  } else if (x == xmax) {
    var yendindex = yarray.length - 1;
    result = yarray[yendindex];
  } else {
    var x1index = findx1index(x, xarray);
    var x1 = xarray[x1index];
    var x2 = xarray[x1index + 1];
    var y1 = yarray[x1index];
    var y2 = yarray[x1index + 1];

    result = lerp(x, x1, x2, y1, y2);
  }
  return result;
}

function interp1(xarray, yarray, array, value) {
  var result = [];
  var x;
  if (Array.isArray(array)) {
    for (var i = 0; i < array.length; i++) {
      x = array[i];
      result[i] = linearInterp(xarray, yarray, x, value);
    }
  } else {
    x = array;
    result[0] = linearInterp(xarray, yarray, x, value);
  }
  return result;
}

function sumproduct(array1, array2) {
  var result = 0;
  for (var i = 0; i < array1.length; i++) {
    result += array1[i] * array2[i];
  }
  return result;
}

function createDelta(wavelength) {
  var result = [];
  for (var i = 0; i < wavelength.length; i++) {
    if (i == 0) {
      result[i] = (wavelength[i + 1] - wavelength[i]) / 2;
    } else if (i == wavelength.length - 1) {
      result[i] = (wavelength[i] - wavelength[i - 1]) / 2;
    } else {
      result[i] =
        (wavelength[i] - wavelength[i - 1]) / 2 +
        (wavelength[i + 1] - wavelength[i]) / 2;
    }
  }
  return result;
}

function spdNormalize(wavelength, value) {
  var result = [];

  //var efs = efficiencyFunctions(wavelength);
  var ybar = interp1(cie.wavelength, cie.ybar, wavelength, 0);
  var deltaWavelength = createDelta(wavelength);
  var spdPhotopic = sumproduct(value, arrayMul(deltaWavelength, ybar));
  var factor = 1 / (683 * spdPhotopic);
  result = arrayScalar(value, factor);
  return result;
}

Array.prototype.toEnd = function (el) {
  var i = this.indexOf(el);
  if (i >= 0) {
    this.splice(i, 1);
  }
  this.push(el);
};

Array.prototype.toFront = function (el) {
  var i = this.indexOf(el);
  if (i >= 0) {
    this.splice(i, 1);
  }
  this.unshift(el);
};

function uniqueId(objArray, newId) {
  var result = true;
  for (var i = 0; i < objArray.length; i++) {
    if (objArray[i].id == newId) {
      result = false;
      break;
    }
  }
  return result;
}

Array.prototype.indicies = function (array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    result[i] = this[array[i]];
  }
  return result;
};

Array.prototype.sum = function () {
  var result = 0;
  for (var i = 0; i < this.length; i++) {
    result += this[i];
  }
  return result;
};

function arrayEval(array1, array2) {
  var result = [];
  for (var i = 0; i < array2.length; i++) {
    var idx = array2[i];
    result[i] = array1[idx];
  }
  return result;
}

function fmin(func, funcParams, xin) {
  var rho = 1;
  var chi = 2;
  var psi = 0.5;
  var sigma = 0.5;
  var maxfun = 200;
  var maxiter = 200;
  var toShrink = false;

  // Set up a simplex near the initial guess
  var v = [0, 0];
  var fv = [0, 0];
  fv[0] = func(funcParams, xin);
  var itercount = 0;
  var func_evals = 1;
  var usual_delta = 0.05;
  var zero_term_delta = 0.00025;

  // Continue setting up initial simplex
  var y = xin;
  if (y != 0) {
    y = (1 + usual_delta) * y;
  } else {
    y = zero_term_delta;
  }
  v[1] = y;
  fv[1] = func(funcParams, y);

  // Sort so v[0] has the lowest function value
  if (fv[0] > fv[1]) {
    fv.reverse();
    v.reverse();
  }
  itercount += 1;
  func_evals = 2;

  // Main loop
  while (func_evals < maxfun && itercount < maxiter) {
    // Insert break test here
    if (isNaN(fv[0]) || fv[0] < 0.0000001) {
      break;
    }

    // Compute the reflection point
    var xbar = v[0];
    var xr = (1 + rho) * xbar - rho * v[1];
    x = xr;
    var fxr = func(funcParams, x);
    func_evals += 1;

    // conditional section
    if (fxr < fv[0]) {
      // Calculate the expansion point
      var xe = (1 + rho * chi) * xbar - rho * chi * v[1];
      x = xe;
      var fxe = func(funcParams, x);
      func_evals += 1;

      if (fxe < fxr) {
        v[1] = xe;
        fv[1] = fxe;
      } else {
        v[1] = xr;
        fv[1] = fxr;
      }
    } else {
      // Perform contraction
      if (fxr < fv[1]) {
        // Perform an outside contraction
        var xc = (1 + psi * rho) * xbar - psi * rho * v[1];
        x = xc;
        var fxc = func(funcParams, x);
        func_evals += 1;

        if (fxc <= fxr) {
          v[1] = xc;
          fv[1] = fxc;
        } else {
          // Perform shrink
          toShrink = true;
        }
      } else {
        // Perform an inside contraction
        var xcc = (1 - psi) * xbar + psi * v[1];
        x = xcc;
        fxcc = func(funcParams, x);

        if (fxcc < fv[1]) {
          v[1] = xcc;
          fv[1] = fxcc;
        } else {
          // Perform Shrink
          toShrink = true;
        }
      }
      if (toShrink) {
        v[1] = v[0] + sigma * (v[1] - v[0]);
        x = v[1];
        fv[1] = func(funcParams, x);
        func_evals += 1;
      }
    }
    // Sort so v[0] has the lowest function value
    if (fv[0] > fv[1]) {
      fv.reverse();
      v.reverse();
    }
    itercount += 1;
  }
  x = v[0];
  return x;
}
