function Update () {
	transform.LookAt(transform.position + Camera.main.transform.rotation * Vector3.up,Camera.main.transform.rotation * Vector3.back);
}

