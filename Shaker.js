public var shakeSpeed : float = 50;
public var shakePower : float = 0.1;
public var shakeTime : float = 0;
private var currentShakeTime : float;
public var previousPos : Vector3;
public var nextPos : Vector3;
public var origPos : Vector3;

function Start(){
	previousPos = gameObject.transform.localPosition;
	nextPos = gameObject.transform.localPosition + Random.insideUnitSphere * shakePower;
	origPos = gameObject.transform.localPosition;
}

function Update(){
	if(!(shakeTime - Time.time < 0)){
		currentShakeTime += Time.deltaTime * shakeSpeed;
		transform.localPosition = Vector3.Lerp(previousPos, nextPos, currentShakeTime);
		
		if(currentShakeTime >= 1)
		{
		    previousPos = nextPos;
		    nextPos = gameObject.transform.localPosition + Random.insideUnitSphere * shakePower;
		    currentShakeTime = 0;
		}
	}
	else if(shakeTime - Time.time < 0 && shakeTime - Time.time > -Time.deltaTime){
		transform.localPosition = origPos;
	}
}

function shake(time : float){
	shakeTime = time + Time.time;
}