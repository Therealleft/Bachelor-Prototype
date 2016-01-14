private var registry : Component;

public var energyStart : float = 250;
private var energy : float;
private var energyReload : float = 3;
private var shieldDemands : float = 10;
private var motorDemands : float = 1;

public var shieldTime : float = 10; //time to wait for reload
private var shieldStatus = true;
private var shieldStayStatus = true;
private var shieldCurTime : float = 0;
private var shield : float = 100.0;
private var shieldLoader : boolean = true;
private var shieldStart : float;

private var plating : float = 100;
private var signature : int = 0;

private var engineStatus : boolean = true;
private var engineChanging : boolean = false;
private var engineWait : float = 0;
private var engineWaitTime : float = 3;
private var engineAccess : boolean = true;

function Start() {
	energy = energyStart;
	shieldStart = Time.time;
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
}

function Update() {
	//recharge energy
	if(energy < energyStart){
		energy += energyReload * Time.deltaTime;
	}
	else if (energy > energyStart){ energy = energyStart;}		

	//recharge shield
	if (shieldLoader){
		if (shieldCurTime > 0){ shieldCurTime -= Time.deltaTime;}
		if (shieldStatus && shieldCurTime <= 0 && shield != 100 && energy >= shieldDemands * Time.deltaTime){ 
			energy -= shieldDemands * Time.deltaTime;
			shield += Mathf.Pow(2,(Time.time-shieldStart)*0.5) * Time.deltaTime * 0.1;			
			if(shield > 100){shield = 100;}
		}
	}
	else{
		shieldCurTime = shieldTime;
		shieldStart = Time.time;
		shieldLoader = true;
	}
	
	//turn shield on/off
	if (!registry.questC.blockKeyT && !registry.control.getSteerMode() && Input.GetKeyDown(KeyCode.T)){switchShield();}
	
	//turn motor on/off
	if (!registry.questC.blockKeyQ && Input.GetKeyDown(KeyCode.Q) && engineAccess){switchEngine();}
	//motor changing status
	if (engineWait != 0 && Time.time - engineWait > engineWaitTime){changeEngine();}
	if (engineChanging && registry.pFunc.checkFunc(0)){registry.pFunc.setFuncAc(3);}

	//energy demand
	if (engineStatus){
		if(energy >= (motorDemands+1) * Time.deltaTime){energy -= motorDemands * Time.deltaTime;}
		else if(!registry.questC.blockKeyQ){switchEngine();}
	}	
	
	if (plating == 0 && !registry.questC.gameOverStatus){		
		die();
	}	
	
	signature = updateSignature();
}

function needEnergy(demand : float) : boolean{
	if(energy - demand >= 0) {energy -= demand; return true;}
	else {return false;}
}

function damage(dmg : float) {
	if (shield-dmg > 0){
		shield -= dmg;
	}
	else {
		damagePlate((dmg-shield)*4);
		shield = 0;
	}
	shieldLoader = false;
}

function damagePlate(dmg : float){
	plating -= dmg;
	if(plating < 0){plating = 0;}	
}

// get all signature modifiers
function updateSignature():int{
	var newSignature = 0;
	if (engineStatus){newSignature++;}
	if (shieldStatus){newSignature++;}
	if (registry.control.getAccelerate()){newSignature++;}
	if (registry.radar.getRadarStatus()){newSignature++;}
	if (registry.radar.getRadarActive()){newSignature++;}
	return newSignature;
}

//switch shield on/off
function switchShield(){
	shield = 0;
	shieldStatus = !shieldStatus;
	shieldStart = Time.time - shieldTime;
}

//switch engine on/off
function switchEngine(){
	engineChanging = true;
	if(engineStatus){
		engineWaitTime = 1;
		registry.radar.setRadarStatus(false);
		shieldStayStatus = shieldStatus;
		if(shieldStatus){switchShield();}
	}
	else {
		engineWaitTime = 3;
	}
	engineWait = Time.time;	
	engineAccess = false;
}
function changeEngine(){
	if(!engineStatus){
		if(shieldStayStatus){switchShield();}
	}
	engineWait = 0;
	engineChanging = false;
	registry.pFunc.setFuncAc(0);
	engineStatus = !engineStatus;
	engineAccess = true;
}

function die(){
	GetComponentInChildren(ParticleEmitter).emit = true;
	var soundInst : GameObject = Instantiate (Resources.Load("Prefabs/Audio_explode1", GameObject));
	soundInst.GetComponent(AudioSource).audio.Play();
	registry.questC.gameEnd();
}

//getter
function getEnergy() : float {return energy;}
function getEnergyPerc() : float {return 100/energyStart*energy;}
function getEnergyStart(): float {return energyStart;}
function getShield() : float {return shield;}
function getShieldStatus() : boolean {return shieldStatus;}
function getPlating() : float {return plating;}
function getSignature() : float {return signature;}
function getEngineStatus() : boolean {return engineStatus;}