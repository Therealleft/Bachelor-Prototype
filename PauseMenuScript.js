var newSkin : GUISkin;
var logoTexture : Texture2D;

function thePauseMenu() {
	GUI.depth = 0;

    GUI.BeginGroup(Rect(Screen.width / 2 - 150, Screen.height / 2 -125, 300, 250));
	    GUI.Box(Rect(0, 0, 300, 250), "");
	    GUI.Label(Rect(15, 10, 300, 68), logoTexture);
	    
	    //resume button
	    if(GUI.Button(Rect(55, 100, 180, 40), "Resume")) {
	    	buttonAudio();
		    Time.timeScale = 1.0;
		    var script1 = GetComponent("PauseMenuScript"); 
		    script1.enabled = false;
		    var script2 = GetComponent("HideCursorScript"); 
		    script2.enabled = true; 
	    }
	    
	    //main menu return button (level 0)
	    if(GUI.Button(Rect(55, 150, 180, 40), "Main Menu")) {
	    	buttonAudio();
		    Time.timeScale = 1.0;
		    Application.LoadLevel(0);
	    }
	    
	    //quit button
	    if(GUI.Button(Rect(55, 200, 180, 40), "Quit")) {
	    	buttonAudio();
	    	Application.Quit();
	    }
    GUI.EndGroup(); 
}

function OnGUI () {
    GUI.skin = newSkin;
    Screen.showCursor = true;
    thePauseMenu();
}

function buttonAudio(){
	var soundInst : GameObject = Instantiate (Resources.Load("Prefabs/Audio_menu1", GameObject));
	soundInst.transform.parent = transform;
	soundInst.GetComponent(AudioSource).audio.Play();
}