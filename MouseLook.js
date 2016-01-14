private var registry : Component;

public var sensitivityX : float = 3;
public var sensitivityY : float = 5;

public var minimumX : float = -60;
public var maximumX : float = 60;

public var minimumY : float = -60;
public var maximumY : float = 60;

private var rotationY : float = 0F;
private var rotationX : float = 0F;

private var controller : Component;

function Start () {
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
}

function Update(){	
	if (!registry.control.getSteerMode() && !registry.control.getBusy() && Time.timeScale != 0)
	{
		//rotate Mouselook
		rotationX += Input.GetAxis("Mouse X") * sensitivityX;
		rotationX = Mathf.Clamp (rotationX, minimumX, maximumX);	
		
		rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
		rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);	
			
		transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
	}
	else if(!registry.control.getBusy()){
		//slowly rotate back to normal
		transform.rotation = Quaternion.Lerp (transform.rotation, transform.parent.rotation, 4 * Time.deltaTime);
		rotationY = transform.parent.rotation.y;
		rotationX = transform.parent.rotation.x;
	}
}
