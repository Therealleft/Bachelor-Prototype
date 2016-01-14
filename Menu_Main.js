public var buttonStart : boolean = false;
public var buttonQuit : boolean = false;

private var music : GameObject;

function Start () {
	music = GameObject.Find("MusicPlayer");
	musicPlayer();
}

function Update () {
	if (!music.GetComponent(AudioSource).audio.isPlaying){
		musicPlayer();
	}
}

function OnMouseEnter() {
	guiText.material.color = Color.grey;  
}

function OnMouseExit() {
    guiText.material.color = Color.white;
}

function OnMouseUp(){
	if(buttonStart){
		buttonAudio();
		Application.LoadLevel(1);
	}  
	else if(buttonQuit){
		buttonAudio();
		Application.Quit();
	}  
}

function buttonAudio(){
	var soundInst : GameObject = Instantiate (Resources.Load("Prefabs/Audio_menu1", GameObject));
	soundInst.transform.parent = transform;
	soundInst.GetComponent(AudioSource).audio.Play();
}

function musicPlayer(){
	var rand = Random.value;
	if(rand >= 0.666){		
		music.GetComponent(AudioSource).audio.clip = Resources.Load("Music/01 - Stellardrone - A Moment Of Stillness", AudioClip);
	}
	else if(rand < 0.333){
		music.GetComponent(AudioSource).audio.clip = Resources.Load("Music/02 - Stellardrone - Billions And Billionss", AudioClip);
	}
	else {
		music.GetComponent(AudioSource).audio.clip = Resources.Load("Music/03 - Stellardrone - Maia Nebula", AudioClip);
	}
	music.GetComponent(AudioSource).audio.Play();
}
