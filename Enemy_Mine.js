private var registry : Component;

public var sensorRange : float = 50; // meters
public var explodeRange : float = 30; // meters - 0% damage at explodeRange
public var speedFactor : float = 0.5;
public var holdPosition : Vector3;
public var damage : int = 115; // damage at 0% of explodeRange = touching object
public var alarmedSignature = 2;

private var autoPos : Vector3;
private var distance : float;
private var dirVector : Vector3;
private var targetPlayer : boolean = false;

private var soundInst : GameObject;

function Start () {
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
	if (holdPosition != Vector3.zero){autoPos = holdPosition;}
	else {autoPos = transform.position;}
	
	soundInst = Instantiate (Resources.Load("Prefabs/Audio_mine1", GameObject));
	soundInst.transform.position = transform.position;
	soundInst.transform.parent = transform;
	soundInst.GetComponent(AudioSource).audio.Play();
}

function Update () {
	distance = Vector3.Distance(registry.player.transform.position,transform.position);	
	checkAttention();
	target();
	behave();
}

function OnTriggerEnter(other : Collider){	
	explode();
}

function follow(){
	GetComponent(ObjectMovement).enabled = false;
	transform.position += dirVector * speedFactor * Time.deltaTime;
}

function explode() {
	var damageObjects = GameObject.FindGameObjectsWithTag("canBeDamaged");
	//are there any other mines? let them die 
	for (var obj : GameObject in damageObjects){
		var mainObj : GameObject = obj.transform.parent.gameObject;
		if(mainObj != gameObject){			
			if(Vector3.Distance(mainObj.transform.position, transform.position) <= explodeRange){
				mainObj.GetComponent(ObjectBasic).die();		
			}
		}
	}
	//is player in Range? make damage
	if (Vector3.Distance(registry.player.transform.position, transform.position) <= explodeRange){
		registry.pAtt.damage(damage-damage*distance/explodeRange); // = (100-(100/explodeRange*distance)) * (damage/100)  really!
	}
	soundInst.GetComponent(AudioSource).audio.Stop();
	GetComponent(ObjectBasic).die();
}

function checkAttention(){
	var att : int = gameObject.GetComponent(ObjectBasic).getAttention();
	if(att > 0){
		alarmedSignature--;
	}
}

function behave(){
	if(targetPlayer){
		dirVector = registry.player.transform.position - transform.position;
		follow();
	}
	else {
		if(Vector3.Distance(autoPos,transform.position) > 0.5) {
			dirVector = autoPos - transform.position;
			follow();
		}	
		else{
			GetComponent(ObjectMovement).enabled = true;
			if(gameObject.GetComponent(ObjectBasic).getAttention() > 0){
				gameObject.GetComponent(ObjectBasic).calm();
			}
		}
	}
}

function target(){
	if(!targetPlayer && distance <= sensorRange && registry.pAtt.getSignature() > alarmedSignature){
		targetPlayer = true;
	}
	if(targetPlayer && distance > sensorRange){
		targetPlayer = false;
	}
}