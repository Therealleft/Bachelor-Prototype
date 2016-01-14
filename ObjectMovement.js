public var rotationSpeed : float = 20;
public var movingSpeed : float = 0.5;
public var rotation : boolean = true;
public var movement : boolean = true;

private var rot : Vector3;
private var pos : Vector3;

private var rnd1 : float;
private var rnd2 : float;
private var rnd3 : float;
private var rnd4 : float;
private var rnd5 : float;
private var rnd6 : float;

function Start () {
	rnd1 = Random.Range(-1.0, 1.0);
	rnd2 = Random.Range(-1.0, 1.0);
	rnd3 = Random.Range(-1.0, 1.0);
	rnd4 = Random.Range(-1.0, 1.0);
	rnd5 = Random.Range(-1.0, 1.0);
	rnd6 = Random.Range(-1.0, 1.0);
}

function Update(){
	if(rotation) {
		rot = Vector3.forward * rnd1 + Vector3.right * rnd2 + Vector3.up * rnd3;
		transform.Rotate(rot / transform.lossyScale.x * rotationSpeed * Time.deltaTime);
	}
	
	if(movement) {
		pos = Vector3.forward * rnd4 + Vector3.right * rnd5 + Vector3.up * rnd6;
		transform.position += pos * movingSpeed * Time.deltaTime;
	}
}