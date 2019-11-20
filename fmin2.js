function fmin2(func, funcParams, xin){
	// Initialize Parameters
	var rho = 1;
	var chi = 2;
	var psi = 0.5;
	var sigma = 0.5;
	var two2np1 = 2;
	var one2n = 1;
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
	if(y != 0){
		y = (1 + usual_delta)*y;
	}else{
		y = zero_term_delta;
	}
	v[1] = y;
	fv[1] = func(funcParams,y);
	
	// Sort so v[0] has the lowest function value
	if(fv[0] > fv[1]){
		fv.reverse();
		v.reverse();
	}
	itercount += 1;
	func_evals = 2;
	
	// Main loop
	while(func_evals < maxfun && itercount < maxiter){
		// Insert break test here
		if(isNaN(fv[0]) || fv[0] < 0.00001){
			break;
		}
		
		// Compute the reflection point
		var xbar = v[0];
		var xr = (1 + rho)*xbar - rho*v[1];
		x = xr;
		var fxr = func(funcParams,x);
		func_evals += 1;
		
		// conditional section
		if(fxr < fv[0]){
			// Calculate the expansion point
			var xe = (1 + rho*chi)*xbar - rho*chi*v[1];
			x = xe;
			var fxe = func(funcParams,x);
			func_evals += 1;
			
			if(fxe < fxr){
				v[1] = xe;
				fv[1] = fxe;
			}else{
				v[1] = xr;
				fv[1] = fxr;
			}
		}else{
			// Perform contraction
			if(fxr < fv[1]){
				// Perform an outside contraction
				var xc = (1 + psi*rho)*xbar - psi*rho*v[1];
				x = xc;
				var fxc = func(funcParams,x);
				func_evals += 1;
				
				if(fxc <= fxr){
					v[1] = xc;
					fv[1] = fxc;
				}else{
					// Perform shrink
					toShrink = true;
				}
			}else{
				// Perform an inside contraction
				var xcc = (1 - psi)*xbar + psi*v[1];
				x = xcc;
				fxcc = func(funcParams, x);
				
				if(fxcc < fv[1]){
					v[1] = xcc;
					fv[1] = fxcc;
				}else{
					// Perform Shrink
					toShrink = true;
				}
			}
			if(toShrink){
				v[1] = v[0] + sigma*(v[1] - v[0]);
				x = v[1];
				fv[1] = func(funcParams,x);
				func_evals += 1;
			}
		}
		// Sort so v[0] has the lowest function value
		if(fv[0] > fv[1]){
			fv.reverse();
			v.reverse();
		}
		itercount += 1;
	}
	x = v[0];
	var fval = fv[0];
	return x;
}

