// Defined in ../json/consts.json
let cie, TCS, isoTempLines, Vlambda, Vprime, Scone, Macula, Melanopsin, CIE_S_cone_opic, CIE_M_cone_opic, CIE_L_cone_opic, CIE_Rhodopic, CIE_Melanopic, setwavelength;

let thickness = 1;
let _thickness = 1;
let _mpod = 0.5,
  _t = 1,
  _d = 1,
  _p = 0;

const arod1 = 2.3;
const arod2 = 1.6;
const a_bminusY = 0.21;
const g1 = 1;
const g2 = 0.16;
const k = 0.2616;
const rodSat = 6.5215;

const a1= 1;
const b1= 0.0;
const a2= 0.7;
const b2= 0.0;
const a3= 3.3;

var combinedValues;

function CCTcalc() {
  // Base math
  x =
    combinedValues.X / (combinedValues.X + combinedValues.Y + combinedValues.Z);
  y =
    combinedValues.Y / (combinedValues.X + combinedValues.Y + combinedValues.Z);
  u = (4 * x) / (-2 * x + 12 * y + 3);
  v = (6 * y) / (-2 * x + 12 * y + 3);

  // Find adjacent lines to (us,vs)
  var index = 0;
  var d1 =
    (v - isoTempLines.vt[1] - isoTempLines.tt[1] * (u - isoTempLines.ut[1])) /
    Math.sqrt(1 + isoTempLines.tt[1] * isoTempLines.tt[1]);
  var d2;
  for (var i = 1; i < isoTempLines.T.length; i++) {
    d2 =
      (v - isoTempLines.vt[i] - isoTempLines.tt[i] * (u - isoTempLines.ut[i])) /
      Math.sqrt(1 + isoTempLines.tt[i] * isoTempLines.tt[i]);
    if (d1 / d2 < 0) {
      index = i;
      break;
    } else {
      d1 = d2;
    }
  }

  // Calc Tc
  var Tc;
  if (index == 0) {
    Tc = NaN; //-1;
  } else {
    Tc =
      1 /
      (1 / isoTempLines.T[index - 1] +
        (d1 / (d1 - d2)) *
          (1 / isoTempLines.T[index] - 1 / isoTempLines.T[index - 1]));
  }
  return Tc;
}

function CLAcalc() {
  var rod_mel =
    combinedValues.vprime /
    (combinedValues.vlambda + g1 * combinedValues.scone);
  var rod_bminusY =
    combinedValues.vprime /
    (combinedValues.vlambda + g2 * combinedValues.scone);

  var bminusY = combinedValues.scone - k * combinedValues.vlambda;
  var cs1 = combinedValues.melanopsin;
  if (cs1 < 0) {
    cs1 = 0;
  }
  var cs2, cs;
  var rod =
    arod2 * rod_bminusY * (1 - Math.exp(-combinedValues.vprime / rodSat));
  var rodmel =
    arod1 * rod_mel * (1 - Math.exp(-combinedValues.vprime / rodSat));
  if (bminusY >= 0) {
    cs2 = a_bminusY * bminusY;
    if (cs2 < 0) {
      cs2 = 0;
    }
    var cs = cs1 + cs2 - rod - rodmel;
  } else {
    cs = cs1 - rodmel;
  }
  if (cs < 0) {
    cs = 0;
  }
  cla = cs * 1548;
  return cla;
}

function cla2cs() {
  return (
    0.7 *
    (1 - 1 / (1 + Math.pow((combinedValues.CLA * _t * _d) / 355.7, 1.1026)))
  );
}

function cs2cla(cs) {
  return (355.7 / (_t * _d)) * Math.pow(1 / (1 - cs / 0.7) - 1, 1 / 1.1026);
}

function blackbodySpectra() {
  // 2002 CODATA recommended values
  var h = 6.6260693e-34;
  var c = 299792458;
  var k = 1.3806505e-23;

  var c1 = 2 * Math.PI * h * Math.pow(c, 2);
  var c2 = (h * c) / k;
  var e9 = 1e-9;

  var calc1 = arrayScalar(
    arrayBase(arrayScalar(combinedValues.relativeSPD.wavelength, e9), -5),
    c1
  );
  var calc2 = arrayAdd2(
    arrayPow(
      Math.exp(1),
      arrayScalar(
        arrayInverse(
          arrayScalar(
            arrayScalar(combinedValues.relativeSPD.wavelength, e9),
            combinedValues.CCT
          )
        ),
        c2
      )
    ),
    -1
  );

  var spdBlackBody = arrayDiv(calc1, calc2);

  return spdBlackBody;
}

function CIEDaySpectra() {
  var v = NaN;
  if (combinedValues.CCT <= 25000) {
    var cieDaySn = {
      wavelength: [
        300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430,
        440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570,
        580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710,
        720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830,
      ],
      S0: [
        0.04, 6, 29.6, 55.3, 57.3, 61.8, 61.5, 68.8, 63.4, 65.8, 94.8, 104.8,
        105.9, 96.8, 113.9, 125.6, 125.5, 121.3, 121.3, 113.5, 113.1, 110.8,
        106.5, 108.8, 105.3, 104.4, 100, 96, 95.1, 89.1, 90.5, 90.3, 88.4, 84,
        85.1, 81.9, 82.6, 84.9, 81.3, 71.9, 74.3, 76.4, 63.3, 71.7, 77, 65.2,
        47.7, 68.6, 65, 66, 61, 53.3, 58.9, 61.9,
      ],
      S1: [
        0.02, 4.5, 22.4, 42, 40.6, 41.6, 38, 42.4, 38.5, 35, 43.4, 46.3, 43.9,
        37.1, 36.7, 35.9, 32.6, 27.9, 24.3, 20.1, 16.2, 13.2, 8.6, 6.1, 4.2,
        1.9, 0, -1.6, -3.5, -3.5, -5.8, -7.2, -8.6, -9.5, -10.9, -10.7, -12,
        -14, -13.6, -12, -13.3, -12.9, -10.6, -11.6, -12.2, -10.2, -7.8, -11.2,
        -10.4, -10.6, -9.7, -8.3, -9.3, -9.8,
      ],
      S2: [
        0, 2, 4, 8.5, 7.8, 6.7, 5.3, 6.1, 3, 1.2, -1.1, -0.5, -0.7, -1.2, -2.6,
        -2.9, -2.8, -2.6, -2.6, -1.8, -1.5, -1.3, -1.2, -1, -0.5, -0.3, 0, 0.2,
        0.5, 2.1, 3.2, 4.1, 4.7, 5.1, 6.7, 7.3, 8.6, 9.8, 10.2, 8.3, 9.6, 8.5,
        7, 7.6, 8, 6.7, 5.2, 7.4, 6.8, 7, 6.4, 5.5, 6.1, 6.5,
      ],
    };
    var xd;
    if (combinedValues.CCT <= 7000) {
      xd =
        -4.607e9 / Math.pow(combinedValues.CCT, 3) +
        2.9678e6 / Math.pow(combinedValues.CCT, 2) +
        0.09911e3 / combinedValues.CCT +
        0.244063;
    } else {
      xd =
        -2.0064e9 / Math.pow(combinedValues.CCT, 3) +
        1.9018e6 / Math.pow(combinedValues.CCT, 2) +
        0.24748e3 / combinedValues.CCT +
        0.23704;
    }

    var yd = -3.0 * xd * xd + 2.87 * xd - 0.275;
    var M1 =
      (-1.3515 - 1.7703 * xd + 5.9114 * yd) /
      (0.0241 + 0.2562 * xd - 0.7341 * yd);
    var M2 =
      (0.03 - 31.4424 * xd + 30.0717 * yd) /
      (0.0241 + 0.2562 * xd - 0.7341 * yd);
    var spdDay = arrayAdd(
      cieDaySn.S0,
      arrayAdd(arrayScalar(cieDaySn.S1, M1), arrayScalar(cieDaySn.S2, M2))
    );

    v = pchip(
      cieDaySn.wavelength,
      spdDay,
      combinedValues.relativeSPD.wavelength
    );
    for (var i = 0; i < v.length; i++) {
      if (isNaN(v[i])) {
        v[i] = 0;
      }
    }
  }
  return v;
}

function TCS_1calc() {
  let ret = {}
  for (var iCS in TCS.color_standards) {
    if (TCS.color_standards.hasOwnProperty(iCS)) {
      ret[iCS] = interp1(
        TCS.wavelength,
        arrayScalar(TCS.color_standards[iCS], 1 / 1000),
        combinedValues.relativeSPD.wavelength,
        0
      );
    }
  }
  return ret;
}

function CRIcalc() {
  // Calculate Reference Source Spectrum, spdref
  var spdref = [];
  if (combinedValues.CCT < 5000 && combinedValues.CCT > 0) {
    spdref = blackbodySpectra(
      combinedValues.CCT,
      combinedValues.relativeSPD.wavelength
    );
  } else {
    if (combinedValues.CCT <= 25000) {
      spdref = CIEDaySpectra(
        combinedValues.CCT,
        combinedValues.relativeSPD.wavelength
      );
    }
  }  

  // Calculate u, v chromaticity coordinates of samples
  //test illuminant, uk, vk
  var Yknormal = 100 / combinedValues.Y;
  var uk =
    (4 * combinedValues.X) /
    (combinedValues.X + 15 * combinedValues.Y + 3 * combinedValues.Z);
  var vk =
    (6 * combinedValues.Y) /
    (combinedValues.X + 15 * combinedValues.Y + 3 * combinedValues.Z);

  //reference illuminant, ur, vr.
  let X_ref = sumproduct(
    spdref,
    arrayMul(combinedValues.deltaWavelength, combinedValues.xbar)
  );
  let Y_ref = sumproduct(
    spdref,
    arrayMul(combinedValues.deltaWavelength, combinedValues.ybar)
  );
  let Z_ref = sumproduct(
    spdref,
    arrayMul(combinedValues.deltaWavelength, combinedValues.zbar)
  );
  var Yrnormal = 100 / Y_ref;
  var ur = (4 * X_ref) / (X_ref + 15 * Y_ref + 3 * Z_ref);
  var vr = (6 * Y_ref) / (X_ref + 15 * Y_ref + 3 * Z_ref);

  // color standards, uri, vri
  var Yki = {};
  var uki = {};
  var vki = {};
  var Yri = {};
  var uri = {};
  var vri = {};
  for (iCS in combinedValues.TCS_1) {
    if (combinedValues.TCS_1.hasOwnProperty(iCS)) {
      //test illuminant, uki, vki
      let X_TCS = sumproduct(
        arrayMul(combinedValues.relativeSPD.value, combinedValues.TCS_1[iCS]),
        arrayMul(combinedValues.deltaWavelength, combinedValues.xbar)
      );
      let Y_TCS = sumproduct(
        arrayMul(combinedValues.relativeSPD.value, combinedValues.TCS_1[iCS]),
        arrayMul(combinedValues.deltaWavelength, combinedValues.ybar)
      );
      let Z_TCS = sumproduct(
        arrayMul(combinedValues.relativeSPD.value, combinedValues.TCS_1[iCS]),
        arrayMul(combinedValues.deltaWavelength, combinedValues.zbar)
      );
      Yki[iCS] = Y_TCS * Yknormal;
      uki[iCS] = (4 * X_TCS) / (X_TCS + 15 * Y_TCS + 3 * Z_TCS);
      vki[iCS] = (6 * Y_TCS) / (X_TCS + 15 * Y_TCS + 3 * Z_TCS);

      //reference illuminant, uri, vri
      let X_ref_TCS = sumproduct(
        arrayMul(spdref, combinedValues.TCS_1[iCS]),
        arrayMul(combinedValues.deltaWavelength, combinedValues.xbar)
      );
      let Y_ref_TCS = sumproduct(
        arrayMul(spdref, combinedValues.TCS_1[iCS]),
        arrayMul(combinedValues.deltaWavelength, combinedValues.ybar)
      );
      let Z_ref_TCS = sumproduct(
        arrayMul(spdref, combinedValues.TCS_1[iCS]),
        arrayMul(combinedValues.deltaWavelength, combinedValues.zbar)
      );
      Yri[iCS] = Y_ref_TCS * Yrnormal;
      uri[iCS] = (4 * X_ref_TCS) / (X_ref_TCS + 15 * Y_ref_TCS + 3 * Z_ref_TCS);
      vri[iCS] = (6 * Y_ref_TCS) / (X_ref_TCS + 15 * Y_ref_TCS + 3 * Z_ref_TCS);
    }
  }

  // Apply adaptive (perceived) color shift
  var ck = (4 - uk - 10 * vk) / vk;
  var dk = (1.708 * vk + 0.404 - 1.481 * uk) / vk;
  var cr = (4 - ur - 10 * vr) / vr;
  var dr = (1.708 * vr + 0.404 - 1.481 * ur) / vr;

  var cki;
  var dki;
  var ukip = {};
  var vkip = {};
  for (iCS in combinedValues.TCS_1) {
    if (combinedValues.TCS_1.hasOwnProperty(iCS)) {
      cki = (4 - uki[iCS] - 10 * vki[iCS]) / vki[iCS];
      dki = (1.708 * vki[iCS] + 0.404 - 1.481 * uki[iCS]) / vki[iCS];
      ukip[iCS] =
        (10.872 + ((0.404 * cr) / ck) * cki - ((4 * dr) / dk) * dki) /
        (16.518 + ((1.481 * cr) / ck) * cki - (dr / dk) * dki);
      vkip[iCS] = 5.52 / (16.518 + ((1.481 * cr) / ck) * cki - (dr / dk) * dki);
    }
  }

  // Transformation into 1964 Uniform space coordinates
  var Wstarr = {};
  var Ustarr = {};
  var Vstarr = {};

  var Wstark = {};
  var Ustark = {};
  var Vstark = {};
  for (iCS in combinedValues.TCS_1) {
    if (combinedValues.TCS_1.hasOwnProperty(iCS)) {
      Wstarr[iCS] = 25 * Math.pow(Yri[iCS], 0.333333) - 17;
      Ustarr[iCS] = 13 * Wstarr[iCS] * (uri[iCS] - ur);
      Vstarr[iCS] = 13 * Wstarr[iCS] * (vri[iCS] - vr);

      Wstark[iCS] = 25 * Math.pow(Yki[iCS], 0.333333) - 17;
      Ustark[iCS] = 13 * Wstark[iCS] * (ukip[iCS] - ur);
      Vstark[iCS] = 13 * Wstark[iCS] * (vkip[iCS] - vr);
    }
  }

  // Determination of resultant color shift, delta E
  var deltaE = {};
  var R = {};
  for (iCS in combinedValues.TCS_1) {
    if (combinedValues.TCS_1.hasOwnProperty(iCS)) {
      deltaE[iCS] = Math.sqrt(
        Math.pow(Ustarr[iCS] - Ustark[iCS], 2) +
          Math.pow(Vstarr[iCS] - Vstark[iCS], 2) +
          Math.pow(Wstarr[iCS] - Wstark[iCS], 2)
      );
      R[iCS] = 100 - 4.6 * deltaE[iCS];
    }
  }
  var Ra = (R.R01 + R.R02 + R.R03 + R.R04 + R.R05 + R.R06 + R.R07 + R.R08) / 8;

  return Ra;
}

function GAIcalc() {
  // Calculate u, v chromaticity coordinates of samples under test illuminant
  var xki = {};
  var yki = {};
  var uki = {};
  var vki = {};
  var ukiprime = {};
  var vkiprime = {};
  for (iCS in combinedValues.TCS_1) {
    if (combinedValues.TCS_1.hasOwnProperty(iCS)) {
      //test illuminant, uki, vki
      xki[iCS] =
        combinedValues.X /
        (combinedValues.X + combinedValues.Y + combinedValues.Z);
      yki[iCS] =
        combinedValues.Y /
        (combinedValues.X + combinedValues.Y + combinedValues.Z);
      uki[iCS] =
        (4 * combinedValues.X) /
        (combinedValues.X + 15 * combinedValues.Y + 3 * combinedValues.Z);
      vki[iCS] =
        (6 * combinedValues.Y) /
        (combinedValues.X + 15 * combinedValues.Y + 3 * combinedValues.Z);
      ukiprime[iCS] = uki[iCS];
      vkiprime[iCS] = vki[iCS] * 1.5;
    }
  }

  // Select sources 1 - 8
  var iSource = 0;
  var ukprimeArray = [];
  var vkprimeArray = [];
  for (iCS in combinedValues.TCS_1) {
    if (combinedValues.TCS_1.hasOwnProperty(iCS)) {
      ukprimeArray[iSource] = ukiprime[iCS];
      vkprimeArray[iSource] = vkiprime[iCS];
      iSource = iSource + 1;
    }
  }
  ukprimeArrayS = ukprimeArray.slice(0, 8);
  vkprimeArrayS = vkprimeArray.slice(0, 8);

  // Calculate area with selected sources
  var ukprimeArraySR1 = ukprimeArrayS.slice(1, 8);
  ukprimeArraySR1.push(ukprimeArrayS[0]);
  var vkprimeArraySR1 = vkprimeArrayS.slice(1, 8);
  vkprimeArraySR1.push(vkprimeArrayS[0]);

  var area = Math.abs(
    arrayMul(
      arraySub(ukprimeArraySR1, ukprimeArrayS),
      arrayAdd(vkprimeArraySR1, vkprimeArrayS)
    ).sum() / 2
  );

  var gai = (area / 0.007354) * 100;

  return gai;
}

function chromaticityCoordinatesCalc() {
  var result = {};

  result = {
    x:
      combinedValues.X /
      (combinedValues.X + combinedValues.Y + combinedValues.Z),
    y:
      combinedValues.Y /
      (combinedValues.X + combinedValues.Y + combinedValues.Z),
  };

  return result;
}

function PFcalc() {
  return arrayDiv(
    combinedValues.absoluteSPD.value,
    arrayInverse(
      arrayScalar(
        combinedValues.absoluteSPD.wavelength,
        1e-9 / 1.9865275648e-25
      )
    )
  ).sum() * 2;
}

function EMLcalc() {
  var cs;

  var spdMelanopsin = sumproduct(
    combinedValues.absoluteSPD.value,
    arrayMul(combinedValues.deltaWavelength, combinedValues.efs.CIE_Melanopsin)
  );

  cs = a1 * spdMelanopsin - b1;
  if (cs < 0) {
    cs = 0;
  }
  var eml = cs * 852;

  var scalar = 0.885;

  return eml * scalar;
}

function DuvCalc() {
  var uk =
    (4 * combinedValues.X) /
    (combinedValues.X + 15 * combinedValues.Y + 3 * combinedValues.Z);
  var vk =
    (6 * combinedValues.Y) /
    (combinedValues.X + 15 * combinedValues.Y + 3 * combinedValues.Z);

  // Calculate Lfp
  var Lfp = Math.sqrt(Math.pow(uk - 0.292, 2) + Math.pow(vk - 0.24, 2));

  // Calculate Lbb
  var a = Math.acos((uk - 0.292) / Lfp);
  var k = [
    -0.471106, 1.925865, -2.4243787, 1.5317403, -0.5179722, 0.0893944,
    -0.00616793,
  ];
  var Lbb =
    k[6] * Math.pow(a, 6) +
    k[5] * Math.pow(a, 5) +
    k[4] * Math.pow(a, 4) +
    k[3] * Math.pow(a, 3) +
    k[2] * Math.pow(a, 2) +
    k[1] * Math.pow(a, 1) +
    k[0];

  // Calculate Duv
  var Duv = Lfp - Lbb;
  return Duv;
}

function cla2lux() {
}

function generateCircadianSpectralResponceForSPD(rod) {
  var specRespMinusRod;

  var spdScone = sumproduct(
    combinedValues.relativeSPD.value,
    arrayMul(combinedValues.deltaWavelength, combinedValues.efs.Scone)
  );
  var spdVlambda = sumproduct(
    combinedValues.relativeSPD.value,
    arrayMul(combinedValues.deltaWavelength, combinedValues.efs.Vlambda)
  );

  var cool = false;

  console.log({a3, rod});

  if (spdScone - k * spdVlambda > 0) {
    specRespMinusRod = arraySub2(
      arrayAdd(
        arraySub2(arrayScalar(combinedValues.efs.Melanopsin, a1), b1),
        arraySub2(
          arraySub2(
            arrayScalar(combinedValues.efs.Scone, a2),
            arrayScalar(combinedValues.efs.Vlambda, k)
          ),
          b2
        )
      ),
      arrayScalar(combinedValues.efs.Vprime, a3 * rod)
    ); //(a1*spdMelanopsin - b1) + (a2*spdScone - k*spdVlambda - b2) - a3*rod*spdVprime;
    cool = true;
  } else {
    specRespMinusRod = arraySub2(arrayScalar(combinedValues.efs.Melanopsin, a1), b1); //a1*spdMelanopsin - b1;
    cool = false;
  }

  var result = {
    specRespMinusRod: specRespMinusRod,
    cool: cool,
  };

  return result;
}

function prepGenerateCircadianSpectralResponceForSPD(funcParams, rod) {
  var resultObj = generateCircadianSpectralResponceForSPD(rod);
  return resultObj.responseDiff;
}

function efficiencyFunctions() {
  var macularT = arrayPow(10, arrayScalar(Macula.value, -thickness));
  var macularTi = interp1(
    Macula.wavelength,
    macularT,
    combinedValues.absoluteSPD.wavelength,
    1
  );

  var VprimeInt1 = interp1(
    Vprime.wavelength,
    Vprime.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var VprimeInt = arrayNormalize(VprimeInt1);

  var MelanopsinInt1 = interp1(
    Melanopsin.wavelength,
    Melanopsin.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var MelanopsinInt = arrayNormalize(MelanopsinInt1);

  var CIE_MelanopsinInt1 = interp1(
    CIE_Melanopic.wavelength,
    CIE_Melanopic.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var CIE_MelanopsinInt = arrayNormalize(CIE_MelanopsinInt1);

  var SconeInt1 = interp1(
    Scone.wavelength,
    Scone.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var SconeInt2 = arrayDiv(SconeInt1, macularTi);
  var SconeInt = arrayNormalize(SconeInt2);

  var VlambdaInt1 = interp1(
    Vlambda.wavelength,
    Vlambda.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var VlambdaInt2 = arrayDiv(VlambdaInt1, macularTi);
  var VlambdaInt = arrayNormalize(VlambdaInt2);

  var PhotopicInt = arrayNormalize(VlambdaInt1);

  var CIE_S_cone_int1 = interp1(
    CIE_S_cone_opic.wavelength,
    CIE_S_cone_opic.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var CIE_S_cone_int = arrayNormalize(CIE_S_cone_int1);

  var CIE_M_cone_int1 = interp1(
    CIE_M_cone_opic.wavelength,
    CIE_M_cone_opic.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var CIE_M_cone_int = arrayNormalize(CIE_M_cone_int1);

  var CIE_L_cone_int1 = interp1(
    CIE_L_cone_opic.wavelength,
    CIE_L_cone_opic.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var CIE_L_cone_int = arrayNormalize(CIE_L_cone_int1);

  var CIE_Rhodopic_int1 = interp1(
    CIE_Rhodopic.wavelength,
    CIE_Rhodopic.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var CIE_Rhodopic_int = arrayNormalize(CIE_Rhodopic_int1);

  var CIE_Melanopic_int1 = interp1(
    CIE_Melanopic.wavelength,
    CIE_Melanopic.value,
    combinedValues.absoluteSPD.wavelength,
    0
  );
  var CIE_Melanopic_int = arrayNormalize(CIE_Melanopic_int1);

  return {
    Vlambda: VlambdaInt,
    Vprime: VprimeInt,
    Scone: SconeInt,
    CIE_Melanopsin: CIE_MelanopsinInt,
    Melanopsin: MelanopsinInt,
    Photopic: PhotopicInt,
    CIE_S_cone: CIE_S_cone_int,
    CIE_M_cone: CIE_M_cone_int,
    CIE_L_cone: CIE_L_cone_int,
    CIE_Rhodopic: CIE_Rhodopic_int,
    CIE_Melanopic: CIE_Melanopic_int,
  };
}

function ssAbsoluteSPDCalc() {
  var result = {
    absoluteIll: 0,
    absoluteSPD: {
      wavelength: setwavelength,
      value: arrayScalar(setwavelength, 0),
    },
  };
  for (var i = 0; i < sourcelist.length; i++) {
    if (sourcelist[i].isSelected) {
      result.absoluteIll =
        result.absoluteIll + sourcelist[i].selectedSource.illuminance;
      result.absoluteSPD.value = arrayAdd(
        result.absoluteSPD.value,
        sourcelist[i].selectedSource.absoluteSPD
      );
    }
  }
  return result;
}

$(document).ready(function () {
  function importConsts() {
    $.ajax({
    mimeType: "application/json",
    url: "json/consts.json",
    async: false,
    dataType: "json",
    success: function (results) {
      CIE_L_cone_opic = results.CIE_L_cone_opic
      CIE_M_cone_opic = results.CIE_M_cone_opic
      CIE_Melanopic = results.CIE_Melanopic
      CIE_Rhodopic = results.CIE_Rhodopic;
      CIE_S_cone_opic = results.CIE_S_cone_opic;
      Macula = results.Macula;
      Melanopsin = results.Melanopsin;
      Scone = results.Scone;
      TCS = results.TCS;
      Vlambda = results.Vlambda;
      Vprime = results.Vprime;
      cie = results.cie;
      isoTempLines = results.isoTempLines;
      setwavelength = results.setwavelength;
      loadCharts();
    },
  });
  }

  importConsts();
  
});