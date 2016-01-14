public var number : int = 0;

private var soundInst : GameObject;

function Start () {
	soundInst = Instantiate (Resources.Load("Prefabs/Audio_nav1", GameObject));
	soundInst.transform.position = transform.position;
	soundInst.transform.parent = transform;
	soundInst.GetComponent(AudioSource).audio.Play();
}

function Update () {
	if(!gameObject.transform.FindChild("GUINavPoint").gameObject.active){
		soundInst.GetComponent(AudioSource).audio.Stop();
	}
	else if(!soundInst.GetComponent(AudioSource).audio.isPlaying){
		soundInst.GetComponent(AudioSource).audio.Play();
	}
}

