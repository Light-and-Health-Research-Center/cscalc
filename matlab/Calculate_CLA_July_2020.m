function CLA = Calculate_CLA_July_2020(spd)

%% Equation parameters

arod1 = 2.3;   
arod2 = 1.6;
a_bminusY = 0.21;
g1 = 1.00;    
g2 = 0.16;
k =  0.2616;        

%% Input absolute SPD (not relative)

wavelength_spd = spd(:,1);
spd = spd(:,2);


%% Initiating photoreceptor functions and removing inherent MPOD of 0.5 from Vlambda and Scone
    
Vlamda = load('Vlamda.txt');
Vlambda = interp1(Vlamda(:,1),Vlamda(:,2),wavelength_spd,'linear',0.0);

Vprime = load('Vprime.txt');
Vprime = interp1(Vprime(:,1),Vprime(:,2),wavelength_spd,'linear',0.0);
Vprime = Vprime/max(Vprime);

Scone = load('Scone.txt');
Scone = interp1(Scone(:,1),Scone(:,2),wavelength_spd,'linear',0.0);

Macula = load('MacularPigmentODfromSnodderly.txt');
thickness = 1.0; % macular thickness factor
macularT = 10.^(-Macula(:,2)*thickness);
macularTi = interp1(Macula(:,1),macularT,wavelength_spd,'linear',1.0);

Scone = Scone./macularTi;
Scone = Scone/(max(Scone));

Vlambda = Vlambda./macularTi;
Vlambda = Vlambda/max(Vlambda);

Melanopsin = load('MelanopsinWlensBy2nm_02Oct2012.txt'); % lens data from Wyszecki and Stiles Table 1(2.4.6) Norren and Vos(1974) data
M = interp1(Melanopsin(:,1),Melanopsin(:,2),wavelength_spd,'linear',0.0);
M = M/max(M);

%% Pre-calculating photoreceptor responses and rod threshold terms
vl_response = trapz(wavelength_spd,Vlambda.*spd);
scone_response = trapz(wavelength_spd,Scone.*spd);
rod_response = trapz(wavelength_spd,Vprime.*spd);

rod_mel = (rod_response./(vl_response + g1*scone_response));           
rod_BminusY = (rod_response./(vl_response + g2*scone_response));   

%% Calculating rodsat % TIP: could simply use fixed value of 6.5 instead of calculating every time

rodSat = 35000; % Scotopic Trolands
retinalE = [1 3 10 30 100 300 1000 3000 10000 30000 100000];
pupilDiam = [7.1 7 6.9 6.8 6.7 6.5 6.3 5.65 5 3.65 2.3];
diam = interp1(retinalE,pupilDiam,rodSat,'linear');
rodSat = rodSat/(diam^2/4*pi)*pi/1700;  % could simply use fixed value of 6.5

%% Main calculation for CLA

BminusY = scone_response-k*vl_response;
        
        if BminusY >= 0                         % COOL SOURCES
            CS1 = trapz(wavelength_spd,M.*spd);

            if CS1 < 0
                CS1(CS1 < 0) = 0; 
            end
            CS2 = a_bminusY*(BminusY);
            if CS2 < 0
                CS2(CS2 < 0) = 0; 
            end
            Rod = (arod2.*(rod_BminusY.*((1-exp(-trapz(wavelength_spd,Vprime.*spd)/rodSat))))); 
            Rodmel = (arod1.*(rod_mel.*((1-exp(-trapz(wavelength_spd,Vprime.*spd)/rodSat)))));
            
            CS = (CS1 + CS2 - Rod - Rodmel);
            
            if CS < 0
                CS(CS < 0) = 0; % Rod inhibition cannot make the CS less than zero
            end
            %disp('(B-Y) > 0')
            
        else            % WARM SOURCES
            CS1 = trapz(wavelength_spd,M.*spd);
            Rodmel = (arod1.*(rod_mel.*((1-exp(-trapz(wavelength_spd,Vprime.*spd)/rodSat)))));
            CS = (CS1 - Rodmel);
            
            if CS < 0
                CS(CS < 0) = 0; 
            end
        end
        
CLA = CS*1548; 

% CS_final = 0.7*(1-(1/(1+(CLA/355.7)^1.1026)));
