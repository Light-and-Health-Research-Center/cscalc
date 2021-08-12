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

function pchip(x, y, xx) {
  var h = arrayDiff(x);
  var del = arrayDiv(arrayDiff(y), h);
  var n = x.length;

  // First derivatives
  var d = pchipslopes(x, y, del);

  // Piecewise polynomial coefficients
  var d1 = d.slice(0, n - 1);
  var d2 = d.slice(1, n);
  var a1 = arrayScalar(d1, 2);
  var a = arrayDiv(
    arraySub(arraySub(arrayScalar(del, 3), arrayScalar(d1, 2)), d2),
    h
  );
  var b = arrayDiv(
    arrayAdd(arraySub(d1, arrayScalar(del, 2)), d2),
    arrayBase(h, 2)
  );

  // Find Subinterval indicies
  var k = arrayRep(1, xx.length);
  for (var j = 1; j < x.length; j++) {
    for (var i = 0; i < xx.length; i++) {
      if (x[j] <= xx[i]) {
        k[i] = j;
      }
    }
  }

  // Evaluate inerpolant
  var s = arraySub(xx, arrayEval(x, k));
  var v = arrayAdd(
    arrayEval(y, k),
    arrayMul(
      arrayAdd(
        arrayEval(d, k),
        arrayMul(arrayAdd(arrayEval(a, k), arrayMul(arrayEval(b, k), s)), s)
      ),
      s
    )
  );

  return v;
}

function pchipslopes(x, y, del) {
  var n = x.length;
  var d = arrayRep(0, y.length);
  var h = arrayDiff(x);

  // k = find(sign(del(1:n-2)).*sign(del(2:n-1)) > 0);
  var signDel = arrayDiv(del, arrayAbs(del));
  var signDel1 = signDel.slice(0, n - 1);
  var signDel2 = signDel.slice(1, n);
  var signDelTest = arrayMul(signDel1, signDel2);
  var k = [];
  var kIndex = 0;
  for (var i = 0; i < signDelTest.length; i++) {
    if (signDelTest[i] > 0) {
      k[kIndex] = i;
      kIndex = kIndex + 1;
    }
  }

  for (i = 0; i < k.length; i++) {
    var hs = h[k[i]] + h[k[i] + 1];
    var w1 = (h[k[i]] + hs) / (3 * hs);
    var w2 = (h[k[i] + 1] + hs) / (3 * hs);
    var dmax = Math.max(Math.abs(del[k[i]]), Math.abs(del[k[i] + 1]));
    var dmin = Math.min(Math.abs(del[k[i]]), Math.abs(del[k[i] + 1]));
    d[k[i] + 1] =
      dmin / (w1 * (del[k[i]] / dmax) + w2 * (del[k[i] + 1] / dmax));
  }

  d[0] = ((2 * h[0] + h[1]) * del[0] - h[0] * del[1]) / (h[0] + h[1]);
  if (d[0] * del[0] < 0) {
    d[0] = 0;
  } else if (del[0] * del[1] < 0 && Math.abs(d[0]) > Math.abs(del[0] * 3)) {
    d[0] = 3 * del[0];
  }
  d[n - 1] =
    ((2 * h[n - 2] + h[n - 3]) * del[n - 2] - h[n - 2] * del[n - 3]) /
    (h[n - 2] + h[n - 3]);
  if (d[n - 1] * del[n - 1] < 0) {
    d[n - 1] = 0;
  } else if (
    del[n - 2] * del[n - 3] < 0 &&
    Math.abs(d[n - 1]) > Math.abs(3 * del[n - 2])
  ) {
    d[n - 1] = 3 * del[n - 2];
  }
  return d;
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

// modified from https://github.com/protobi/lambertw under GNU General Public License v3.0
function lambertw(x) {
  const GSL_DBL_EPSILON = 2.2204460492503131e-16;

  function halley_iteration(x, w_initial, max_iters) {
    var w = w_initial,
      i;

    for (i = 0; i < max_iters; i++) {
      var tol;
      var e = Math.exp(w);
      var p = w + 1.0;
      var t = w * e - x;

      if (w > 0) {
        t = t / p / e;
        /* Newton iteration */
      } else {
        t /= e * p - (0.5 * (p + 1.0) * t) / p;
        /* Halley iteration */
      }

      w -= t;

      tol = GSL_DBL_EPSILON * Math.max(Math.abs(w), 1.0 / (Math.abs(p) * e));

      if (Math.abs(t) < tol) {
        return {
          val: w,
          err: 2.0 * tol,
          iters: i,
          success: true,
        };
      }
    }
    /* should never get here */

    return {
      val: w,
      err: Math.abs(w),
      iters: i,
      success: false,
    };
  }

  /* series which appears for q near zero;
   * only the argument is different for the different branches
   */
  function series_eval(r) {
    const c = [
      -1.0, 2.331643981597124203363536062168, -1.812187885639363490240191647568,
      1.936631114492359755363277457668, -2.353551201881614516821543561516,
      3.066858901050631912893148922704, -4.17533560025817713885498417746,
      5.858023729874774148815053846119, -8.401032217523977370984161688514,
      12.250753501314460424, -18.100697012472442755, 27.02904479901056165,
    ];

    const t_8 = c[8] + r * (c[9] + r * (c[10] + r * c[11]));
    const t_5 = c[5] + r * (c[6] + r * (c[7] + r * t_8));
    const t_1 = c[1] + r * (c[2] + r * (c[3] + r * (c[4] + r * t_5)));
    return c[0] + r * t_1;
  }

  function gsl_sf_lambert_W0_e(x) {
    const one_over_E = 1.0 / Math.E;
    const q = x + one_over_E;

    var result = {};

    if (x == 0.0) {
      result.val = 0.0;
      result.err = 0.0;
      result.success = true;
      return result;
    } else if (q < 0.0) {
      /* Strictly speaking this is an error. But because of the
       * arithmetic operation connecting x and q, I am a little
       * lenient in case of some epsilon overshoot. The following
       * answer is quite accurate in that case. Anyway, we have
       * to return GSL_EDOM.
       */
      result.val = -1.0;
      result.err = Math.sqrt(-q);
      result.success = false; // GSL_EDOM
      return result;
    } else if (q == 0.0) {
      result.val = -1.0;
      result.err = GSL_DBL_EPSILON;
      /* cannot error is zero, maybe q == 0 by "accident" */
      result.success = true;
      return result;
    } else if (q < 1.0e-3) {
      /* series near -1/E in sqrt(q) */
      const r = Math.sqrt(q);
      result.val = series_eval(r);
      result.err = 2.0 * GSL_DBL_EPSILON * Math.abs(result.val);
      result.success = true;
      return result;
    } else {
      const MAX_ITERS = 100;
      var w;

      if (x < 1.0) {
        /* obtain initial approximation from series near x=0;
         * no need for extra care, since the Halley iteration
         * converges nicely on this branch
         */
        const p = Math.sqrt(2.0 * Math.E * q);
        w = -1.0 + p * (1.0 + p * (-1.0 / 3.0 + (p * 11.0) / 72.0));
      } else {
        /* obtain initial approximation from rough asymptotic */
        w = Math.log(x);
        if (x > 3.0) w -= Math.log(w);
      }

      return halley_iteration(x, w, MAX_ITERS, result);
    }
  }

  return gsl_sf_lambert_W0_e(x).val;
}
