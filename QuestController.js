private var registry : Component;

private var timeSinceLastProgress : float;

private var p1 : String;
private var p2 : String;

private var p1Image : Texture;
private var p2Image : Texture;

private var p1Txt1 : String;
private var p1Txt2 : String;
private var p1Txt3 : String;
private var p1Txt4 : String;
private var p1Txt5 : String;
private var p1Txt6 : String;
private var p1Txt7 : String;
private var p1Txt8 : String;
private var p1Txt9 : String;
private var p1Txt10 : String;
private var p1Txt11 : String;
private var p1Txt12 : String;
private var p1Txt13 : String;
private var p1Txt14 : String;
private var p1Txt15 : String;
private var p1Txt16 : String;
private var p1Txt17 : String;
private var p2Txt1 : String;
private var p2Txt2 : String;
private var p2Txt3 : String;
private var p2Txt4 : String;
private var p2Txt5 : String;
private var p2Txt6 : String;
private var p2Txt7 : String;
private var p2Txt8 : String;
private var p2Txt9 : String;
private var p2Txt10 : String;
private var p2Txt11 : String;
private var p2Txt12 : String;
private var p2Txt13 : String;
private var p2Txt14 : String;
private var p2Txt15 : String;
private var p2Txt16 : String;

private var msgText1_1 : String = "[R] unknown object detected";
private var msgText1_2 : String = "[R] set new nav-point";
private var msgText2_1 : String = "[T] optical seeker - target set";
private var msgText2_2 : String = "[T] optical seeker - target lost";
private var msgText3_1 : String = "[H] added new document to inventory";
private var msgText3_2 : String = "[H] no documents available";
private var msgText3_3 : String = "[H] section has already been hacked";
private var msgText3_4 : String = "[H] document already existing";
private var msgText3_5 : String = "[H] no manipulation possible";
private var msgText3_6 : String = "[H] target out of Range";
private var msgText3_7 : String = "[H] disconnected by target";
private var msgText4_1 : String = "hold [right mouse] on joystick to turn ship";
private var msgText4_2 : String = "use [W] to accelerate, [S] to stop";
private var msgText4_3 : String = "use [A] and [D] to roll ship";
private var msgText4_4 : String = "use [F] to start active scan";
private var msgText4_5 : String = "use [H] to change scan resolution";
private var msgText4_6 : String = "use [Q] to switch engine status";
private var msgText4_7 : String = "use [G] for passive radar mode";
private var msgText4_8 : String = "use [T] to switch shield status";
private var msgText4_9 : String = "[left mouse] to lock target on crosshair";
private var msgText4_10 : String = "use [R] to hack current target";
private var msgText4_11 : String = "use [I] to enter inventory";
private var msgText4_12 : String = "end of tutorial - feel free to explore";

private var progress : int = 0;
private var winCondition1 : boolean = false;
private var winCondition2 : boolean = false;
private var winCondition3 : boolean = false;
private var winCondition4 : boolean = false;
private var winCondition5 : boolean = false;
private var gameOverStatus : boolean = false;

public var navBool1 : boolean = true;
public var navBool2 : boolean = false;
public var navBool3 : boolean = false;
private var navPoint1 : GameObject;
private var navPoint2 : GameObject;
private var navPoint3 : GameObject;
private var targetPos1 : Vector3;
private var targetPos2 : Vector3;
private var targetPos3 : Vector3;

public var blockKeyRight : boolean = false;
public var blockKeyQ : boolean = false;
public var blockKeyT : boolean = false;
public var blockKeyF : boolean = false;
public var blockKeyG : boolean = false;
public var blockKeyH : boolean = false;
public var blockKeyR : boolean = false;
public var blockKeyI : boolean = false;

private var music : GameObject;
private var pos : Vector3;
private var specialmine : GameObject;

function Start () {
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
	specialmine = GameObject.Find("spacemine_broken");

	p1 = "Commander Ford";
	p2 = "Emma Woods";
	
	p1Image = Resources.Load("Textures/character/commander_100", Texture);
	p2Image = Resources.Load("Textures/character/emma_100", Texture);
	
	p1Txt1 = "So, here we are, Vegas.";	
	p1Txt2 = "You still know how to fly a tracer, right?";
	  p2Txt1 = "Don't worry, he's always that offish. You'll get used to it.";
	p1Txt3 = "I am detecting an anomaly.\nCheck out the nav-point.";	
	p1Txt4 = "Vegas, report! I wanted you to investigate that nav-point.";
	  p2Txt2 = "Here isn't anything. How disappointing.";
	  p2Txt3 = "I'm registering a bunch of objects.\nJust head for the second nav-point.";
	  p2Txt4 = "Meet ya there, sweetheart.";
	p1Txt5 = "Emma, we are measuring an energy source. I am sending you the coordinates.";
	  p2Txt5 = "Oh c'mon!";
	  p2Txt6 = "Right. I'll check your damn source.";
	  p2Txt7 = "Asteroids. Crazy stuff, yo.\nThis is more than i can find here.";
	p1Txt6 = "Vegas, it is a good time to make a scan at your location.\nJust to be sure.";
	p1Txt7 = "Change the scan resolution, if you have not tried it yet.";
	  p2Txt8 = "Woah, you see that? You see that?\nI almost thought our commander is already paranoid.";
	p1Txt8 = "I am pretty sure that i am not, Lieutenant Woods.";
	p1Txt9 = "Now, Vegas, get to that red dot on your radar.";
	  p2Txt9 = "Itchy, itchy red dot. Oh my.";
	  p2Txt10 = "Commander, i've got a dead satellite here.\nSeems abandoned.";
	  p2Txt11 = "Nevermind, this scrap metal is just a lost artifact from a bygone time.";
	p1Txt10 = "Vegas stop your movement!\nIt seems like we have a kurakiin spacemine there.";
	p1Txt11 = "I want you to approach the mine and hack it.\nWe need to know from where it got here.";
	  p2Txt12 = "Yeah, just turn off your engine, it won't explode as long as you don't touch it.";
	  p2Txt13 = "You really shouldn't touch it.";
	p1Txt12 = "To decrease your signature switch your radar to passive mode\n..and turn off your shield.";
	  p2Txt14 = "How exciting. Sweety please do not explode, yeah?";
	p1Txt13 = "Now approach the mine.\nYour ship should be able to hack within a range of 50 meters.";
	  p2Txt15 = "Alrighty! And now get away from that little blow-you-up.";
	p1Txt14 = "The data from the spacemine seem not to be good news.";
	p1Txt15 = "Make a new scan at mid-range resolution immediately.";
	  p2Txt16 = "Holy pink jesus! Outta nowhere!";
	p1Txt16 = "Distressing. Okay, come home. This is going to be far too dangerous.";
	p1Txt17 = "Those mines ought not to be as easy to hack as the defect mine.";	
	
	navPoint1 = GameObject.Find("NavPoint1");
	navPoint2 = GameObject.Find("NavPoint2");
	navPoint3 = GameObject.Find("NavPoint3");
	
	music = GameObject.Find("MusicPlayer");
	musicPlayer();
}

function Update () {
	timeSinceLastProgress += Time.deltaTime;

	if (!music.GetComponent(AudioSource).audio.isPlaying){
		musicPlayer();
	}
	
	pos = gameObject.transform.position;
	targetPos1 = navPoint1.transform.position;
	targetPos2 = navPoint2.transform.position;
	targetPos3 = navPoint3.transform.position;
	
	if(!specialmine.active && !specialmine.GetComponent(ObjectBasic).getAnalysed()){
		gameEnd();
	}
	
	checkNavPoints();	
	dialogProgress();	
}

function alert(msgNr:int){
	var msgText : String;
	switch(msgNr){
	case 11: msgText = msgText1_1;break;
	case 12: msgText = msgText1_2;break;
	case 21: msgText = msgText2_1;break;
	case 22: msgText = msgText2_2;break;
	case 31: msgText = msgText3_1;break;
	case 32: msgText = msgText3_2;break;
	case 33: msgText = msgText3_3;break;
	case 34: msgText = msgText3_4;break;
	case 35: msgText = msgText3_5;break;
	case 36: msgText = msgText3_6;break;
	case 37: msgText = msgText3_7;break;
	case 41: msgText = msgText4_1;break;
	case 42: msgText = msgText4_2;break;
	case 43: msgText = msgText4_3;break;
	case 44: msgText = msgText4_4;break;
	case 45: msgText = msgText4_5;break;
	case 46: msgText = msgText4_6;break;
	case 47: msgText = msgText4_7;break;
	case 48: msgText = msgText4_8;break;
	case 49: msgText = msgText4_9;break;
	case 410: msgText = msgText4_10;break;
	case 411: msgText = msgText4_11;break;
	case 412: msgText = msgText4_12;break;
	}
	registry.hud.pushMessage(msgText,false);
	
	var soundInst : GameObject = Instantiate (Resources.Load("Prefabs/Audio_hud1", GameObject));
	soundInst.transform.parent = transform;
	soundInst.GetComponent(AudioSource).audio.Play();
}

function addProgress(num:int,setDirect:boolean){
	if(setDirect){progress = num;}	
	else {progress += num;}
	timeSinceLastProgress = 0;
}

//not used in prototype level
function gameWin(){
	if(winCondition1 && winCondition2 && winCondition3 && winCondition4 && winCondition5){
		registry.control.setInMenu(!registry.control.getInMenu());
		registry.hideCursor.enabled = !registry.hideCursor.enabled;
	}
}

function gameEnd(){
	gameOverStatus = true;
	Camera.main.GetComponent("FadeInOut").fadeOut();	
	yield WaitForSeconds(2);	
	Application.LoadLevel(1);
}

//any detections? -> winCondition3
function checkRadar(){
	var arr = registry.radar.getClones();
	for(var i:int = 0; i<arr.length; i++){
		if(arr[i].active){
			winCondition3 = true;
		}
	}
}

//hacked mine? -> winCondition4
function hackedMine(){
	if(GameObject.Find("spacemine_broken")){
		if(specialmine.GetComponent(ObjectBasic).getAnalysed()){
			var mines : GameObject[] = GameObject.FindGameObjectsWithTag("activateMine");
	    	for (var mine : GameObject in mines){
		    	mine.transform.parent.gameObject.GetComponent(ObjectBasic).scanVisible = true;
	    	}
	    	winCondition4 = true;
		}
	}
}

function checkRadarMultiple(){
	var arr = registry.radar.getClones();
	var counter :int = 0;
	for(var i:int = 0; i<arr.length; i++){
		if(arr[i].active){
			counter++;
		}
	}
	if(counter > 3){
		winCondition5 = true;		
	}
}

function dialogProgress(){
	switch(progress){
		case 0: if(timeSinceLastProgress > 10){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt1,false);
					addProgress(1,false);
				}break;
		case 1: if(timeSinceLastProgress > 5){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt2,true);
					addProgress(1,false);
				}break;
		case 2: if(timeSinceLastProgress > 6){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt1,false);
					addProgress(1,false);			
				}break;
		case 3: if(timeSinceLastProgress > 5){
					blockKeyRight = false;
					alert(41);
					addProgress(1,false);
				}break;
		case 4: if(timeSinceLastProgress > 4){
					alert(42);
					addProgress(1,false);
				}break;
		case 5: if(timeSinceLastProgress > 4){
					alert(43);
					addProgress(1,false);
				}break;
		case 6: if(timeSinceLastProgress > 10){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt3,false);										
					navBool1 = true;
					alert(12);
					addProgress(1,false);	
				}break;
		case 7: if(!winCondition1 && timeSinceLastProgress > 90){
					registry.hud.activateDialog(4,p1,p1Image,p1Txt4,false);
					addProgress(1,false);
				}
		case 8: if(Vector3.Distance(pos,targetPos1)<=20){
					winCondition1 = true;
					navBool1 = false;
					addProgress(9,true);
				}break;
		case 9: if(timeSinceLastProgress > 4){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt2,false);
					addProgress(1,false);
				}break;
		case 10: if(timeSinceLastProgress > 7){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt3,false);
					addProgress(1,false);
					navBool2 = true;
					alert(12);
				}break;
		case 11: if(timeSinceLastProgress > 5){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt4,true);					
					addProgress(1,false);
				}break;
		case 12: if(Vector3.Distance(pos,targetPos2)<=1500){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt5,false);					
					addProgress(1,false);
				}break;
		case 13: if(timeSinceLastProgress > 7){
					registry.hud.activateDialog(3,p2,p2Image,p2Txt5,false);					
					addProgress(1,false);
				}break;
		case 14: if(timeSinceLastProgress > 3){
					registry.hud.activateDialog(4,p2,p2Image,p2Txt6,true);					
					addProgress(1,false);
				}break;
		case 15: if(Vector3.Distance(pos,targetPos2)<=20){
					winCondition2 = true;
					navBool2 = false;
					addProgress(1,false);
				}break;
		case 16: if(timeSinceLastProgress > 2){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt7,false);					
					addProgress(1,false);
				}break;
		case 17: if(timeSinceLastProgress > 7){
					registry.hud.activateDialog(7,p1,p1Image,p1Txt6,false);			
					addProgress(1,false);
				}break;
		case 18: if(timeSinceLastProgress > 7){
					blockKeyF = false;
					alert(44);					
					addProgress(1,false);
				}break;
		case 19: if(timeSinceLastProgress > 1){
					blockKeyH = false;
					alert(45);				
					addProgress(1,false);
				}break;
		case 20: if(timeSinceLastProgress > 16){		
					registry.hud.activateDialog(5,p1,p1Image,p1Txt7,false);						
					addProgress(1,false);
				}
		case 21: checkRadar();		
				if(winCondition3){
					registry.hud.activateDialog(7,p2,p2Image,p2Txt8,false);							
					addProgress(22,true);
				}break;
		case 22: if(timeSinceLastProgress > 9){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt8,false);							
					addProgress(1,false);
				}break;
		case 23: if(timeSinceLastProgress > 5){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt9,true);							
					addProgress(1,false);
				}break;
		case 24: if(timeSinceLastProgress > 7){
					registry.hud.activateDialog(4,p2,p2Image,p2Txt9,false);							
					addProgress(1,false);
				}break;
		case 25: if(Vector3.Distance(pos,targetPos3)<=1500){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt10,false);					
					addProgress(1,false);
				}break;
		case 26: if(timeSinceLastProgress > 10){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt11,false);					
					addProgress(1,false);
				}break;
		case 27: if(Vector3.Distance(pos,targetPos3)<=500){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt10,false);					
					addProgress(1,false);
				}break;
		case 28: if(timeSinceLastProgress > 5){
					registry.hud.activateDialog(7,p1,p1Image,p1Txt11,true);					
					addProgress(1,false);
				}break;
		case 29: if(timeSinceLastProgress > 9){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt12,false);					
					addProgress(1,false);
				}break;
		case 30: if(timeSinceLastProgress > 5){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt13,true);					
					addProgress(1,false);
				}break;
		case 31: if(timeSinceLastProgress > 5){
					blockKeyQ = false;
					alert(46);				
					addProgress(1,false);
				}break;
		case 32: if(timeSinceLastProgress > 10){
					registry.hud.activateDialog(7,p1,p1Image,p1Txt12,false);					
					addProgress(1,false);
				}break;
		case 33: if(timeSinceLastProgress > 9){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt14,false);					
					addProgress(1,false);
				}break;
		case 34: if(timeSinceLastProgress > 5){
					blockKeyG = false;
					alert(47);				
					addProgress(1,false);
				}break;
		case 35: if(timeSinceLastProgress > 1){
					blockKeyT = false;
					alert(48);				
					addProgress(1,false);
				}break;

		case 36: if(timeSinceLastProgress > 7){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt13,false);					
					addProgress(1,false);
				}break;
		case 37: if(timeSinceLastProgress > 5){
					alert(49);				
					addProgress(1,false);
				}break;
		case 38: if(timeSinceLastProgress > 1){
					blockKeyR = false;
					alert(410);				
					addProgress(1,false);
				}break;
		case 39: hackedMine();
				if(winCondition4){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt15,false);			
					addProgress(1,false);
				}break;
		case 40: if(timeSinceLastProgress > 5){
					blockKeyI = false;
					alert(411);				
					addProgress(1,false);
				}break;
		case 41: if(timeSinceLastProgress > 7){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt14,false);					
					addProgress(1,false);
				}break;
		case 42: if(timeSinceLastProgress > 5){
					registry.hud.activateDialog(5,p1,p1Image,p1Txt15,true);					
					addProgress(1,false);
				}break;
		case 43: checkRadarMultiple();
				if(winCondition5){
					registry.hud.activateDialog(5,p2,p2Image,p2Txt16,false);
					addProgress(1,false);
				}break;
		case 44: if(timeSinceLastProgress > 7){
					registry.hud.activateDialog(7,p1,p1Image,p1Txt16,false);					
					addProgress(1,false);
				}break;
		case 45: if(timeSinceLastProgress > 7){
					registry.hud.activateDialog(7,p1,p1Image,p1Txt17,true);					
					addProgress(1,false);
				}break;
		case 46: if(timeSinceLastProgress > 7){
					alert(412);				
					addProgress(1,false);
				}break;
	}
}

//de/activate children recursivly in unity4
function checkNavPoints(){
	if(navBool1){
		navPoint1.transform.Find("Cube").gameObject.active = true;
		navPoint1.transform.Find("GUINavPoint").gameObject.active = true;		
		navPoint1.transform.Find("GUINavPoint/GUIText").gameObject.active = true;		
	}
	else {
		navPoint1.transform.Find("Cube").gameObject.active = false;
		navPoint1.transform.Find("GUINavPoint").gameObject.active = false;	
		navPoint1.transform.Find("GUINavPoint/GUIText").gameObject.active = false;		
	}
	if(navBool2){
		navPoint2.transform.Find("Cube").gameObject.active = true;
		navPoint2.transform.Find("GUINavPoint").gameObject.active = true;		
		navPoint2.transform.Find("GUINavPoint/GUIText").gameObject.active = true;
	}
	else {
		navPoint2.transform.Find("Cube").gameObject.active = false;
		navPoint2.transform.Find("GUINavPoint").gameObject.active = false;		
		navPoint2.transform.Find("GUINavPoint/GUIText").gameObject.active = false;
	}
	if(navBool3){
		navPoint3.transform.Find("Cube").gameObject.active = true;
		navPoint3.transform.Find("GUINavPoint").gameObject.active = true;		
		navPoint3.transform.Find("GUINavPoint/GUIText").gameObject.active = true;
	}
	else {
		navPoint3.transform.Find("Cube").gameObject.active = false;
		navPoint3.transform.Find("GUINavPoint").gameObject.active = false;		
		navPoint3.transform.Find("GUINavPoint/GUIText").gameObject.active = false;
	}
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