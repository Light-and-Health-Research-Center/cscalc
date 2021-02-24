function CS_final = Calculate_CS_NEW_2020(spd, tar_E)

%% Equation parameters

arod1 = 2.30;
arod2 = 1.60;
a_bminusY = 0.21;

g1 = 1;
g2 = 0.16;
k =  0.2616;

t = 1.0; % User will have to enter exposure duration in hours - Range 0.5 to 3.0
d = 1.0; % User will have to enter a distribution scalar - Range 0.5 to 2.5


%% Input SPD

wavelengths = spd(:,1);
values = spd(:,2);
values = (values.* tar_E)/Lxy23Sep05([wavelengths,values]);


%% Initiating photoreceptor functions
    
Vlamda = load('Vlamda.txt');
Vlambda = interp1(Vlamda(:,1),Vlamda(:,2),wavelengths,'linear',0.0);

Vprime = load('Vprime.txt');
Vprime = interp1(Vprime(:,1),Vprime(:,2),wavelengths,'linear',0.0);
Vprime = Vprime/max(Vprime);

Scone = load('Scone.txt');
Scone = interp1(Scone(:,1),Scone(:,2),wavelengths,'linear',0.0);

Macula = load('MacularPigmentODfromSnodderly.txt');
thickness = 1.0; % macular thickness factor
macularT = 10.^(-Macula(:,2)*thickness);
macularTi = interp1(Macula(:,1),macularT,wavelengths,'linear',1.0);

Scone = Scone./macularTi;
Scone = Scone/(max(Scone));

Vlambda = Vlambda./macularTi;
Vlambda = Vlambda/max(Vlambda);

Melanopsin = load('MelanopsinWlensBy2nm_02Oct2012.txt'); % lens data from Wyszecki and Stiles Table 1(2.4.6) Norren and Vos(1974) data
M = interp1(Melanopsin(:,1),Melanopsin(:,2),wavelengths,'linear',0.0);
M = M/max(M);

% %----------------CHANGE HERE for MPOD---------------------------------------
p = 0.35; % Percent corneal stimulus passing through macula
MPOD = 0.2; % Estimated MPOD of the subject to  put in calculations
thickness_exp = 2*MPOD; % CHANGE MPOD THICKNESS HERE -------------------------
macularT_exp = 10.^(-Macula(:,2)*thickness_exp);
macularTi_exp = interp1(Macula(:,1),macularT_exp,wavelengths,'linear',1.0);
%---------------------------------------------------------------------------
values = p*values.*macularTi_exp + (1-p)*values;
%-------------------------------------------------------------------------

vl_response = trapz(wavelengths,Vlambda.*values);
scone_response = trapz(wavelengths,Scone.*values);
rod_response = trapz(wavelengths,Vprime.*values);

rod_over_brightness_mel = (rod_response./(g1*vl_response + g1*scone_response));           
rod_over_brightness_BminusY = (rod_response./(vl_response + g2*scone_response));   

%--------------------------------------------------------------------------------------------------------------------

rodSat = 35000; % Scotopic Trolands
retinalE = [1 3 10 30 100 300 1000 3000 10000 30000 100000];
pupilDiam = [7.1 7 6.9 6.8 6.7 6.5 6.3 5.65 5 3.65 2.3];
diam = interp1(retinalE,pupilDiam,rodSat,'linear');
rodSat = rodSat/(diam^2/4*pi)*pi/1700;


BminusY = scone_response-k*vl_response;
        
        if BminusY >= 0
                CS1 = trapz(wavelengths,M.*values);

            if CS1 < 0
                CS1(CS1 < 0) = 0; % remove negative values that are below threshold set by constant b1.
            end
            CS2 = a_bminusY*(BminusY);
            if CS2 < 0
                CS2(CS2 < 0) = 0; % This is the important diode operator, the (b-y) term cannot be less than zero
            end
            Rod = arod2.*(rod_over_brightness_BminusY.*((1-exp(-trapz(wavelengths,Vprime.*values)/rodSat)))); %*(1 - exp(-20*(trapz(wavelengths,Scone.*values)-k*trapz(wavelengths,V10.*values))));
            Rodmel = (arod1.*(rod_over_brightness_mel.*((1-exp(-trapz(wavelengths,Vprime.*values)/rodSat)))));
            
            CS = (CS1 + CS2 - Rod - Rodmel);
            
            if CS < 0
                CS(CS < 0) = 0; % Rod inhibition cannot make the CS less than zero
            end
            %disp('(B-Y) > 0')
        else
            CS1 = trapz(wavelengths,M.*values);
            Rodmel = (arod1.*(rod_over_brightness_mel.*((1-exp(-trapz(wavelengths,Vprime.*values)/rodSat)))));
            CS = (CS1 - Rodmel);
            
            if CS < 0
                CS(CS < 0) = 0; % Negative values mean stimulus is below threshold set by constant b1
            end
            %disp('(B-Y) < 0')
        end
        
CLA = CS*1548; 

CS_final = 0.7*(1-(1/(1+(CLA*t*d/355.7)^1.1026)));
