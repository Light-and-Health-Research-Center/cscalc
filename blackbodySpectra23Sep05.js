function blackbodySpectra23Sep05(Tc, wave){
	/* Black Body Spectra
	 Calculates the Planktian black body spectrum of given color temperature, Tc.
	% Function arguements are:
	%	Tc - color temperature in Kelvin
	%	wave - column vector specifiying the wavelength values at which the spd is evaluated */

	// 2002 CODATA recommended values
	var h = 6.6260693e-34;
	var c = 299792458;
	var k = 1.3806505e-23;

	var c1 = 2*Math.PI*h*Math.pow(c,2);
	var c2 = h*c/k;
	var e9 = 1e-9;

	//var spdBlackBody = arrayDiv(arrayScalar(arrayBase(arrayScalar(wave,e9),-5),c1),(Math.exp(arrayScalar(arrayInverse(arrayScalar(arrayScalar(wave,e9),Tc)),c2) - 1)));
	var calc1 = arrayScalar(arrayBase(arrayScalar(wave,e9),-5),c1);
	var calc2 = arrayAdd2(arrayPow(Math.exp(1),arrayScalar(arrayInverse(arrayScalar(arrayScalar(wave,e9),Tc)),c2)), - 1);
	
	var spdBlackBody = arrayDiv(calc1, calc2);
	
	return spdBlackBody;
}