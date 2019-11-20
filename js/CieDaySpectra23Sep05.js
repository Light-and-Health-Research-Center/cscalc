function cieDaySpectra23Sep05(Tc,wave){
	if(Tc <= 25000){
		var cieDaySn  = {
			wavelength: [300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,650,660,670,680,690,700,710,720,730,740,750,760,770,780,790,800,810,820,830],
			S0: [0.04,6,29.6,55.3,57.3,61.8,61.5,68.8,63.4,65.8,94.8,104.8,105.9,96.8,113.9,125.6,125.5,121.3,121.3,113.5,113.1,110.8,106.5,108.8,105.3,104.4,100,96,95.1,89.1,90.5,90.3,88.4,84,85.1,81.9,82.6,84.9,81.3,71.9,74.3,76.4,63.3,71.7,77,65.2,47.7,68.6,65,66,61,53.3,58.9,61.9],
			S1: [0.02,4.5,22.4,42,40.6,41.6,38,42.4,38.5,35,43.4,46.3,43.9,37.1,36.7,35.9,32.6,27.9,24.3,20.1,16.2,13.2,8.6,6.1,4.2,1.9,0,-1.6,-3.5,-3.5,-5.8,-7.2,-8.6,-9.5,-10.9,-10.7,-12,-14,-13.6,-12,-13.3,-12.9,-10.6,-11.6,-12.2,-10.2,-7.8,-11.2,-10.4,-10.6,-9.7,-8.3,-9.3,-9.8],
			S2: [0,2,4,8.5,7.8,6.7,5.3,6.1,3,1.2,-1.1,-0.5,-0.7,-1.2,-2.6,-2.9,-2.8,-2.6,-2.6,-1.8,-1.5,-1.3,-1.2,-1,-0.5,-0.3,0,0.2,0.5,2.1,3.2,4.1,4.7,5.1,6.7,7.3,8.6,9.8,10.2,8.3,9.6,8.5,7,7.6,8,6.7,5.2,7.4,6.8,7,6.4,5.5,6.1,6.5]
		};
		//var cieDaySn = cieDaySn();
		var xd;
		if(Tc <= 7000){
			xd = -4.6070e9 / Math.pow(Tc,3) + 2.9678e6 / Math.pow(Tc,2) + 0.09911e3 / Tc + 0.244063;
		}else{
			xd = -2.0064e9 / Math.pow(Tc,3) + 1.9018e6 / Math.pow(Tc,2) + 0.24748e3 / Tc + 0.237040;
		}
		
		var yd = -3.000*xd*xd + 2.870*xd - 0.275;
		var M1 = (-1.3515 - 1.7703*xd + 5.9114*yd) / (0.0241 + 0.2562*xd - 0.7341*yd);
		var M2 = (0.0300 - 31.4424*xd + 30.0717*yd) / (0.0241 + 0.2562*xd - 0.7341*yd);
		var spdDay = arrayAdd(cieDaySn.S0,arrayAdd(arrayScalar(cieDaySn.S1,M1),arrayScalar(cieDaySn.S2,M2)));
		
		var v = pchip(cieDaySn.wavelength, spdDay, wave);
		for(var i = 0;i < v.length;i++){
			if(isNaN(v[i])){
				v[i] = 0;
			}			
		}
	}else{
		v = NaN;
	}
	return v;
}

function pchip(x, y, xx){
	var h = arrayDiff(x);
	var m = 1;
	var del = arrayDiv(arrayDiff(y),h);
	var n = x.length;
	
	// First derivatives
	var d = pchipslopes(x,y,del);
	
	// Piecewise polynomial coefficients
	var d1 = d.slice(0,n-1);
	var d2 = d.slice(1,n);
	var a1 = arrayScalar(d1,2);
	var a = arrayDiv(arraySub(arraySub(arrayScalar(del,3),arrayScalar(d1,2)),d2),h);
	var b = arrayDiv(arrayAdd(arraySub(d1,arrayScalar(del,2)),d2),arrayBase(h,2));
	
	// Find Subinterval indicies
	var k = arrayRep(1,xx.length);
	for(var j = 1;j < x.length;j++){
		for(var i = 0;i < xx.length;i++){
			if(x[j] <= xx[i]){
				k[i] = j;
			}
		}
	}
	
	// Evaluate inerpolant
	var s = arraySub(xx,arrayEval(x,k));
	var v = arrayAdd(arrayEval(y,k),arrayMul(arrayAdd(arrayEval(d,k),arrayMul(arrayAdd(arrayEval(a,k),arrayMul(arrayEval(b,k),s)),s)),s));
	
	return v;
}

function pchipslopes(x, y, del){
	var n = x.length;
	var d = arrayRep(0,y.length);
	var h = arrayDiff(x);
	
	// k = find(sign(del(1:n-2)).*sign(del(2:n-1)) > 0);
	var signDel = arrayDiv(del,arrayAbs(del));
	var signDel1 = signDel.slice(0,n-1);
	var signDel2 = signDel.slice(1,n);
	var signDelTest = arrayMul(signDel1,signDel2);
	var k = [];
	var kIndex = 0;
	for(var i = 0;i < signDelTest.length;i++){
		if(signDelTest[i] > 0){
			k[kIndex] = i;
			kIndex = kIndex + 1;
		}
	}
	
	for(var i = 0;i < k.length; i++){
		var hs = h[k[i]] + h[k[i]+1];
		var w1 = (h[k[i]] + hs)/(3*hs);
		var w2 = (h[k[i]+1] + hs)/(3*hs);
		var dmax = Math.max(Math.abs(del[k[i]]),Math.abs(del[k[i]+1]));
		var dmin = Math.min(Math.abs(del[k[i]]),Math.abs(del[k[i]+1]));
		d[k[i]+1] = dmin/(w1 * (del[k[i]]/dmax) + w2 * (del[k[i]+1]/dmax));
	}
	
	d[0] = ((2*h[0]+h[1])*del[0] - h[0]*del[1])/(h[0]+h[1]);
	if(d[0]*del[0] < 0){
		d[0] = 0;
	}else if((del[0]*del[1] < 0) && (Math.abs(d[0]) > Math.abs(del[0]*3))){
		d[0] = 3*del[0];
	}
	d[n-1] = ((2*h[n-2]+h[n-3])*del[n-2] - h[n-2]*del[n-3])/(h[n-2]+h[n-3]);
	if(d[n-1]*del[n-1] < 0){
		d[n-1] = 0;
	}else if((del[n-2]*del[n-3] < 0) && (Math.abs(d[n-1]) > Math.abs(3*del[n-2]))){
		d[n-1] = 3*del[n-2];
	}
	return d;
}