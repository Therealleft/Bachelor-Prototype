public var rotateZ : float = 1;
public var rotateY : float = -1;

function Update () {
	transform.Rotate(Vector3.up * rotateZ * Time.deltaTime);
	transform.Rotate(Vector3.right * rotateY * Time.deltaTime);
}

