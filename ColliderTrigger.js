private var registry : Component;
private var shaker : Component;

function Start () {
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
	shaker = Camera.main.GetComponent(Shaker);
}

function Update () {
}

function OnTriggerEnter(other : Collider){	
	registry.pAtt.damage(registry.control.getSpeedX()*0.5);
	registry.control.setSpeedX(-registry.control.getVelo()*0.1);
	registry.control.setMoveVector(Vector3.zero);
	registry.control.setBumping(true);
	registry.control.setCollidingObject(gameObject);	
	shaker.shake(0.5);
}

function OnTriggerStay(other : Collider){
	registry.pAtt.damage(100 * Time.deltaTime);
	registry.control.setColliding(true);
}

function OnTriggerExit(other : Collider){
	registry.control.setColliding(false);
}