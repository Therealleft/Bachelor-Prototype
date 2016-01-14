function Update () {
	if(Input.GetKey("escape")) {
	    //pause the game
	    Time.timeScale = 0;
	    //show the pause menu
	    var script1 = GetComponent("PauseMenuScript"); 
	    script1.enabled = true;
	    //disable the cursor hiding script
	    var script2 = GetComponent("HideCursorScript"); 
	    script2.enabled = false; 
	}
}