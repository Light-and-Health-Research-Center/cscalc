function xyz2uv(xyz){
	/* 
	Function converts CIE1931 xyz color coordinates to CIE1960 uv cooredinates
	Input: xyz:= Relative tristimulus Values
	Output: uv:= CIE 1960 color coordinates
	*/ 

	var x = xyz[0];
	var y = xyz[1];
	var uv = {
		u: 4*x/(-2*x + 12*y + 3),
		v: 6*y/(-2*x + 12*y + 3),
	};
	return uv;
}

function XYZ2uprimevprime(XYZ){
	/*
	Function calculates Lu'v' coordinates from CIE 1931 XYZ
	Input: XYZ:= CIE 1931 tristumulus values [X Y Z]
	Output: uprimevprime:= CIE 1976 UCS coordinates u'v'
	*/
	
	var uprimevprime = {
		uprime: 4*XYZ[0]/(XYZ[0] + 15*XYZ[1] + 3*XYZ[2]),
		vprime: 9*XYZ[1]/(XYZ[0] + 15*XYZ[1] + 3*XYZ[2]),
	}
	return uprimevprime;
}

