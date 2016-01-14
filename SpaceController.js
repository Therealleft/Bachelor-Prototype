private var registry : Component;

public enum RotationType { Normalized, Direct}
public var type : RotationType = RotationType.Direct;

public var pitchYawSpeed : float = 120;
public var rotationSpeed : float = 120;
public var accelerateSpeed : float = 10; //meters per second
public var startSpeed : int = 0; //ms
public var maxSpeedX : float = 52; //ms
public var minSpeedX : float = 0.5; //ms 
 
private var moveVector : Vector3;
private var mouseX : float;
private var mouseY : float;
private var rotationX : float;
private var rotationY : float;
private var rotationCurSpeed : float;
private var lastPos : Vector3;
private var newPos : Vector3;
public var velo : float;
private var veloVector : Vector3;
private var cockpit : Transform;

private var speedX : float;
private var RandomSpeed : float = 0;
private var speedDemand : float = 10;

private var accelerating : boolean = false;
private var stopping : boolean = false;
private var busy : boolean = false;
private var steerMode : boolean = false;
private var enterSteer : boolean = false;
private var bumping : boolean = false;
private var colliding : boolean = false;

private var rayHit : RaycastHit;
private var collidingObject : GameObject;
private var engineSound : GameObject;
public var fixedDeltaTime : float = 0.0;
private var fixedTimer :float;
private var fixedTime :boolean = false;

function Start(){
	lastPos = transform.position;
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
	moveVector += transform.forward * (startSpeed + minSpeedX * Random.value); //speed at start
	cockpit = transform.Find("cockpit3");
	
	engineSound = Instantiate (Resources.Load("Prefabs/Audio_engine1", GameObject));
	engineSound.transform.parent = transform;

	//fixedTimer = Time.time +0.5;
}

function Update () {
	//calcFixedTime();
	fixedDeltaTime = Time.deltaTime;
	velo = calcVelo();
	
	if(!registry.questC.blockKeyRight && Input.GetKeyDown(KeyCode.Mouse1) && GameObject.Find("shaft").GetComponent(Collider).Raycast(registry.pFunc.getRay(),rayHit,10)){
		enterSteer = true;
	}
	if(Input.GetKeyUp(KeyCode.Mouse1)){
		enterSteer = false;
	}
	steerMode = verifySteer();
	if(!stopping && !Input.GetAxis("Vertical")){accelerating = false;}
	
	// steering
	if (steerMode){
		steering();
		if (!stopping && !bumping && Input.GetKeyDown(KeyCode.S) ) {stopping = true; speedX = 0;}
		if (!bumping && Input.GetKeyDown(KeyCode.W)) {stopping = false; speedX = 0;}
	}
	//lerp cockpit to camera position
	if (type == 1){				
		cockpit.transform.rotation = Quaternion.Lerp (cockpit.transform.rotation,transform.rotation * Quaternion.Euler(0, 180, 0), 10 * Time.deltaTime);
	}
	
	// slowly reduce rolling
	if(registry.pAtt.getEngineStatus() && !Input.GetAxis("Horizontal") && rotationCurSpeed != 0){
		rotationCurSpeed -= Mathf.Sign(rotationCurSpeed) * Time.deltaTime;
		if (rotationCurSpeed < 0.1 && rotationCurSpeed > -0.1){ rotationCurSpeed = 0; }
	}
	
	// roll Camera
	if (rotationCurSpeed != 0){			
		transform.Rotate(Vector3.forward * -rotationCurSpeed * rotationSpeed * Time.deltaTime);
	}				

	// stopping movement
	if (stopping){stopMovement(false);}	
	if (bumping){stopMovement(true);}
	if (colliding){collideAway();}
	
	if(accelerating && engineSound.GetComponent(AudioSource).audio.volume == 0){	
		engineSound.GetComponent(AudioSource).audio.volume = 0.7;	
		engineSound.GetComponent(AudioSource).audio.Play();
	}
	else if(!accelerating && engineSound.GetComponent(AudioSource).audio.volume != 0){
		engineSound.GetComponent(AudioSource).audio.volume = 0;	
		//not using Stop() because of an annoying noise when stopping the sound
	}

	transform.position += moveVector * Time.deltaTime;
}

//stopping speed slowly
function stopMovement(accelerate : boolean){	
	if(registry.pAtt.needEnergy(speedDemand * Time.deltaTime)){
		accelerating = true;		
		if(!accelerate){
			if (RandomSpeed == 0){
				RandomSpeed = minSpeedX * Random.value;
			}
			if(velo < RandomSpeed){
				stopping = false;
			}
			moveVector -= moveVector * Time.deltaTime ;
		}
		else {
			speedX += accelerateSpeed * Time.deltaTime;
			if(speedX > minSpeedX){
				speedX = minSpeedX;
				bumping = false;
			}
			moveVector += veloVector * speedX * Time.deltaTime;
		}		
	}
}

function steering(){
	if (type == 0){		
		// Normalized mouse input
		mouseX = ((Input.mousePosition.x - Screen.width/2) / (Screen.width/2)); 
		mouseY = ((Input.mousePosition.y - Screen.height/2) / (Screen.height/2)); 
		
		// Pitch/Yaw Camera
		transform.Rotate(-Vector3.right * mouseY * pitchYawSpeed * Time.deltaTime);
		transform.Rotate(Vector3.up * mouseX * pitchYawSpeed * Time.deltaTime);			
	}
	else if (type == 1){			
		// Pitch/Yaw Camera
		transform.Rotate(-Vector3.right * Input.GetAxis("Mouse Y") * pitchYawSpeed * 2 * Time.deltaTime);
		transform.Rotate(Vector3.up * Input.GetAxis("Mouse X") * pitchYawSpeed * 2 * Time.deltaTime);

		// negative Pitch/Yaw Cockpit (rotating back to old position)
		cockpit.transform.Rotate(-Vector3.forward * Input.GetAxis("Mouse X") * 20 * Time.deltaTime);
		cockpit.transform.Rotate(Vector3.right * Input.GetAxis("Mouse Y") * 30 * Time.deltaTime);
	} 

	// get left/right Input for rolling
	if(Input.GetAxis("Horizontal")){
		rotationCurSpeed += Mathf.Sign(Input.GetAxis("Horizontal")) * Time.deltaTime;
		if(rotationCurSpeed > 1){
			rotationCurSpeed = 1;
		}
		else if(rotationCurSpeed < -1){
			rotationCurSpeed =- 1;
		}
	}		
	
	// Move forwards
	if(Input.GetAxis("Vertical") && velo < maxSpeedX && registry.pAtt.getEnergy() >= speedDemand * Time.deltaTime){
		if(registry.pAtt.needEnergy(speedDemand * Time.deltaTime)){
			speedX += Input.GetAxis("Vertical") * accelerateSpeed * Time.deltaTime;
			if (speedX > maxSpeedX) {speedX = maxSpeedX;}
			accelerating = true;
			moveVector += transform.forward * speedX * Time.deltaTime;
		}
	}
	else {accelerating = false;}
}

// push player in opposite direction of colliding object
function collideAway(){
	transform.position -= (collidingObject.transform.position - transform.position) * Time.deltaTime;
}

// player allowed to steer ship?
function verifySteer():boolean{
	var bool1 = enterSteer;
	var bool2 = registry.pAtt.getEngineStatus();
	var bool3 = !busy;
	if(bool1 && bool2 && bool3){return true;}
	else {return false;}
}

//get velocity
function calcVelo():float{
	newPos = transform.position;
	var tween = Vector3.Distance(lastPos, newPos);
	//veloVector = (lastPos - newPos) / Time.deltaTime;
	veloVector = (lastPos - newPos).normalized;
	lastPos = newPos;
	return tween / Time.deltaTime;
}

function calcFixedTime(){
	if(!fixedTime && fixedTimer-Time.time < 0){
		fixedDeltaTime = Time.deltaTime;
		fixedTime = true;
	}
}

//setter + getter
function setBusy(x : boolean) {busy = x;}
function getBusy() : boolean {return busy;}
function getAccelerate() : boolean {return accelerating;}
function getSteerMode() : boolean {return steerMode;}
function setSpeedX(x : float) {speedX = x;}
function getSpeedX() : float {return speedX;}
function setBumping(x : boolean) {bumping = x;}
function getBumping() : boolean {return bumping;}
function setColliding(x : boolean) {colliding = x;}
function getColliding() : boolean {return colliding;}
function setCollidingObject(x : GameObject) {collidingObject = x;}
function getVelo() : float {return velo;}
function setMoveVector(vec : Vector3) {moveVector = vec;}