private var registry : Component;

private var screenshotName : String;
private var ScreenString = "";
private var count = 0;
private var additional :boolean = false;

public var controlTexture : Texture2D;
public var hudStyle : GUIStyle = new GUIStyle();
public var hudStyleRight : GUIStyle = new GUIStyle();
public var hudStyleRed : GUIStyle = new GUIStyle();
public var hudStyleRightRed : GUIStyle = new GUIStyle();
public var diaStyle : GUIStyle = new GUIStyle();
public var boxStyle : GUIStyle = new GUIStyle();
public var msgStyle : GUIStyle = new GUIStyle();
public var funcStyle : GUIStyle = new GUIStyle();
public var loaderBoxStyle : GUIStyle = new GUIStyle();
public var loaderFillStyle : GUIStyle = new GUIStyle();
public var loaderFillRedStyle : GUIStyle = new GUIStyle();
public var successFillStyle : GUIStyle = new GUIStyle();

private var shieldStyle : GUIStyle = hudStyle;
private var engineStyle : GUIStyle = hudStyleRight;

private var timeA : float; 
private var fps : int;
private var lastFPS : int;

private var warnEnergy : boolean = false;
private var warnShield : boolean = false;
private var warnBool : boolean = false;
private var warnTimer : float;

private var conPartner : String = "";
private var conImage : Texture = null;
private var conText : String = "";
private var diaActive : boolean = true;
private var diaEndTime : float = 0;

private var msgActive : boolean = false;
private var msgEndTime : float = 0;
private var msgText : String = "";
private var msg1 : String = "";
private var msg2 : String = "";
private var msg3 : String = "";
private var msg4 : String = "";
private var msg5 : String = "";

private var funcActive : boolean = false;
private var funcEndTime : float = 0;
private var funcHide : boolean = false;
private var funcText : String = "";

private var hackActive : boolean = false;
private var hackStart : boolean = false;
private var percentReady : float = 0;
private var percentCaught : float = 0;
private var modifier : float = 55;
private var hackTypeStr1 : String = "access data storage";
private var hackTypeStr2 : String = "analyse target";
private var hackTypeStr3 : String = "manipulate target";

private var invActive : boolean = false;
private var invDetail : boolean = false;
private var invStatus : int = 0;
private var invText : String;

private var stringShield : String;
private var distAdd : String ;
public var texture : Texture;

function Start(){
	timeA = Time.timeSinceLevelLoad;
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
}

function Update () {
	stringShield = changeShieldView();
	
	if(registry.pAtt.getShieldStatus()){ shieldStyle = hudStyle;}
	else {shieldStyle = hudStyleRed;}
	if(registry.pAtt.getEngineStatus()){engineStyle = hudStyleRight;}
	else {engineStyle = hudStyleRightRed;}

	if(Input.GetKeyDown(KeyCode.F2)){
		additional = !additional;
	}

	// create Screenshots without overwriting
	if (Input.GetKeyDown(KeyCode.F12)) {    
	    do{
	    	count++;
	    	screenshotName = "screenshot" + count + ".png";	
	    } while (System.IO.File.Exists(screenshotName));
	
	    Application.CaptureScreenshot(System.IO.Directory.GetCurrentDirectory()+ "\\" + screenshotName);
	    ScreenString = screenshotName;
		resetScreenString();
	}	
	
	//calculate fps
	if(Time.timeSinceLevelLoad - timeA <= 1){fps++;}
	else{
		lastFPS = fps + 1;
		timeA = Time.timeSinceLevelLoad ;
		fps = 0;
	}
	
	warnTimer += Time.deltaTime;
	if(warnTimer >= 0.3) { warnBool = !warnBool; warnTimer = 0;}
	
	//warning icons
	if(registry.pAtt.getShield() <= 25 && warnBool){ warnShield = true; }
	else {warnShield = false;}
	if(registry.pAtt.getEnergy() <= registry.pAtt.getEnergyStart()/4 && warnBool){ warnEnergy = true; }
	else {warnEnergy = false;}
	
	//close dialog window
	if(diaActive && diaEndTime - Time.time < 0){
		diaActive = false;
		var dialogbg =  GameObject.Find("AudioPlayer_dia2").GetComponent(AudioSource);
		if(dialogbg.audio.isPlaying){
			dialogbg.audio.Stop();
		}
	}
	
	//delete messages
	msgText = msg1 + "\n" + msg2 + "\n" + msg3 + "\n" + msg4 + "\n" + msg5 + "\n";
	if(msgEndTime - Time.time < 0){
		pushMessage("",true);
	}
	
	//delete active function
	if(funcHide && funcEndTime - Time.time < 0){
		funcActive = false;
	}
	
	//hackingBox
	if(hackActive){	
		percentReady = registry.pFunc.percentReady;
		percentCaught = registry.pFunc.percentCaught;
	}	
}

// clear display Screenshot
function resetScreenString(){
	yield WaitForSeconds(5.0);
    ScreenString = "";  
}

//draw GUI
function OnGUI() {
	GUI.depth = 1;
	
	//misc	
	if(additional){
		GUI.Label (Rect (10, 10, 100, 20),"FPS: " + lastFPS.ToString());
		GUI.Label (Rect (120, 10, 200, 20),"Time: " + Mathf.Round(Time.timeSinceLevelLoad));
		GUI.Label (Rect (230, 10, 100, 20), ScreenString);
	}
	
	//attributes
	if(registry.pAtt.getEngineStatus()){
		GUI.Label (Rect (80,120, 250, 30), "Energy " + Mathf.Round(registry.pAtt.getEnergyPerc()) + " %", hudStyle);
		GUI.Label (Rect (80,150, 250, 30), "Shield " + Mathf.Round(registry.pAtt.getShield()) + " %", shieldStyle);
		GUI.Label (Rect (80,180, 250, 30), "Plating " + Mathf.Round(registry.pAtt.getPlating()) + " %", hudStyle);
		
		if(warnEnergy){	GUI.Label (Rect (Screen.width-65,250, 30, 30), Resources.Load("Textures/energy_button", Texture2D));}
		if(warnShield){	GUI.Label (Rect (Screen.width-65,290, 30, 30), Resources.Load("Textures/shield_button", Texture2D));}
		if(registry.pFunc.getInHackRange()){ GUI.Label (Rect (Screen.width-65,330, 30, 30), Resources.Load("Textures/hack_button", Texture2D));}
		
		//target
		if(registry.pFunc.getTarget() != null){
			GUI.Label (Rect (Screen.width-55,152, 20, 20), Resources.Load("Textures/RedQuadS2", Texture2D));
			GUI.Label (Rect (Screen.width-365,150, 300, 30), registry.pFunc.getTarget().GetComponent(ObjectBasic).hudname, hudStyleRight);
			GUI.Label (Rect (Screen.width-220,180, 180, 30), Mathf.Round(registry.pFunc.getTargetDist()) + " Dist.", hudStyleRight);
		}
	}
	
	GUI.Label (Rect (80, Screen.height-120, 250, 30), "Radar " + translateBoolean(registry.radar.getRadarStatus(),1), hudStyle);	
	if(registry.radar.getRadarMax() != 0){GUI.Label (Rect (80, Screen.height-150, 250, 30), "Res " + registry.radar.getRadarMax(), hudStyle);}
	
	GUI.Label (Rect (Screen.width-240, Screen.height-180, 200, 30), Mathf.Round(registry.control.getVelo() * 3.6)  + " km/h Speed", hudStyleRight);
	GUI.Label (Rect (Screen.width-240, Screen.height-150, 200, 30), registry.pAtt.getSignature() + " Signature", hudStyleRight);
	GUI.Label (Rect (Screen.width-240, Screen.height-120, 200, 30), "Engine " + translateBoolean(registry.pAtt.getEngineStatus(),0), engineStyle);
	
	//crosshair
	if(!hackActive && !invActive){	
		GUI.Label (Rect (Screen.width/2.0-64, Screen.height/2.0-64, 128, 128), controlTexture);
	}
	
	//dialog
	if(diaActive){	
		GUI.BeginGroup (Rect (Screen.width/2-200,10,400,120), boxStyle);
			GUI.DrawTexture (Rect (10,10,100,100), conImage);
			GUI.Label (Rect (120,10,270,20), conPartner, diaStyle);
			GUI.Label (Rect (120,40,270,80), conText, diaStyle);
		GUI.EndGroup ();
	}
	
	//functionbox
	if(funcActive){
		GUI.TextArea (Rect (80,230,300,40), funcText, funcStyle);
	}
	
	//messagebox
	if(msgActive){		
		GUI.TextArea (Rect (80,280,350,110), msgText, msgStyle);
	}
	
	//hackingbox - options
	if(hackActive && !hackStart && registry.pFunc.getTarget()){
		var targetBasic = registry.pFunc.getTarget().GetComponent(ObjectBasic);
		GUI.BeginGroup (Rect (Screen.width/2-120,Screen.height/2-90,240,180), boxStyle);
			GUI.Label (Rect (20,20,200,20), "Hacking", diaStyle);
			if(GUI.Button(Rect(20,50,200,30), hackTypeStr1)){
				buttonAudio();
				if(targetBasic.documents.length == 0){
					registry.questC.alert(32);
				}
				else if(targetBasic.getOpenDocs == targetBasic.documents.length){
					registry.questC.alert(33);
				}
				else {
					registry.pFunc.startHackProgress(1);
					hackStart = true;
				}
			}
			if(GUI.Button(Rect(20,90,200,30), hackTypeStr2)){
				buttonAudio();
				if(targetBasic.getAnalysed()){
					registry.questC.alert(33);
				}
				else {
					registry.pFunc.startHackProgress(2);
					hackStart = true;
				}
			}
			if(GUI.Button(Rect(20,130,200,30), hackTypeStr3)){
				buttonAudio();
				if(!targetBasic.canManipulate){
					registry.questC.alert(35);
				}
				else {
					registry.pFunc.startHackProgress(3);
					hackStart = true;
				}
			}
		GUI.EndGroup ();
	}
	
	//hackingbox
	if(hackActive && hackStart){		
		GUI.BeginGroup (Rect (Screen.width/2-300,Screen.height/2-120,600,240), boxStyle);
			var hackTypeStr = "hacking progression";
			if(registry.pFunc.getHackType() == 1){
				hackTypeStr = hackTypeStr1;
			}
			else if(registry.pFunc.getHackType() == 2){
				hackTypeStr = hackTypeStr2;
			}
			else if(registry.pFunc.getHackType() == 3){
				hackTypeStr = hackTypeStr3;
			}		
		
			GUI.Label (Rect (40,20,300,20), hackTypeStr, hudStyle);
			GUI.Label (Rect (40,50,300,20), "hacking " + registry.pFunc.getTarget().GetComponent(ObjectBasic).hudname, diaStyle);
			GUI.Label (Rect (320,50,240,20), "progress", diaStyle);
			
			GUI.Box (Rect (40,70,240,20), "", loaderBoxStyle);
			GUI.Box (Rect (40,70,percentReady/100*240,20), "", loaderFillStyle);
			GUI.Box (Rect (320,70,240,20), "", loaderBoxStyle);
						
			if(registry.pFunc.getHackType() == 1){
				var allDocs : int = registry.pFunc.getTarget().GetComponent(ObjectBasic).documents.length;
				if(allDocs > 0){
					var width = (240-(allDocs+1)*3)/allDocs;
					for(var i = 0; i < allDocs; i++){
						var style : GUIStyle;
						if(i < registry.pFunc.getTarget().GetComponent(ObjectBasic).getOpenDocs()){
							style = loaderFillStyle;
						}
						else {
							style = successFillStyle;
						}
						GUI.Box (Rect (320+3*(i+1)+width*i,73,width,14), "", style);
					}	
				}
			}
			else if (registry.pFunc.getHackType() == 2){
				GUI.Box (Rect (320+3*(i+1)+234*i,73,234,14), "", successFillStyle);
			}
	
			
			GUI.Label (Rect (40,110,240,20), "detection", diaStyle);
			GUI.Label (Rect (320,110,240,20), "alarmed", diaStyle);
			
			GUI.Box (Rect (40,130,240,20), "", loaderBoxStyle);
			GUI.Box (Rect (40,130,percentCaught/100*240,20), "", loaderFillRedStyle);
			GUI.Box (Rect (320,130,240,20), "", loaderBoxStyle);
			var num : int = registry.pFunc.getTarget().GetComponent(ObjectBasic).getMaxDetect();
			var width2 = (240-(num+1)*3)/num;
			for(var a = 0; a < num; a++){
				var style2 : GUIStyle;
				if(a < registry.pFunc.getTarget().GetComponent(ObjectBasic).getDetections()){
					style2 = loaderFillRedStyle;
				}
				else {
					style2 = successFillStyle;
				}
				GUI.Box (Rect (320+3*(a+1)+width2*a,133,width2,14), "", style2);
			}
			modifier = GUI.HorizontalSlider(Rect (40,180,520,20), modifier, 10, 100);
			GUI.Label (Rect (40,210,240,20), "distance: " + Mathf.Round(registry.pFunc.getTargetDist()) + " of " + registry.pFunc.getHackRange(), diaStyle);
			GUI.Label (Rect (320,210,240,20), "progresstime: " + registry.pFunc.getHackLast(), diaStyle);
		GUI.EndGroup ();
	}
	else {
		modifier = 55;
	}
	
	//inventorybox - options
	if(invActive && !invDetail){
		var yheight = 80+registry.pFunc.getAchievedDocs().length*50;
		GUI.BeginGroup (Rect (Screen.width/2-120,Screen.height/2-yheight/2,240,yheight), boxStyle);
			GUI.Label (Rect (20,20,200,20), "inventory", hudStyle);
			if(registry.pFunc.getAchievedDocs.length == 0){
				GUI.Label (Rect (20,50,200,20), "- no Files found -", diaStyle);
			}
			else {
				for(var e = 0; e<registry.pFunc.getAchievedDocs.length; e++){
					var arr = registry.pFunc.getAchievedDocs;
					if(GUI.Button(Rect(20,80+e*50,200,30), registry.pFunc.textFiles[arr[e]].name)){
						buttonAudio();
						invDetail = true; 
						invText = registry.pFunc.textFiles[arr[e]].text;
					}
				}
			}
		GUI.EndGroup ();
	}
	
	//inventorybox
	if(invActive && invDetail){
		var xheight = diaStyle.CalcHeight(new GUIContent(invText),240);
		GUI.BeginGroup (Rect (Screen.width/2-150,Screen.height/2-xheight/2+45,300,xheight+90), boxStyle);
			GUI.TextArea (Rect (20,20,240,xheight), invText, diaStyle);			
			if(GUI.Button(Rect(20,xheight+40,100,30), "return")){
				buttonAudio();
				invDetail = false;
			}
		GUI.EndGroup ();
	}
}

//show dialogbox
function activateDialog(t:float, who:String, whoImage:Texture, what:String, sameDialog:boolean){
	diaActive = true;
	diaEndTime = Time.time + t;
	conPartner = who;
	conImage = whoImage;
	conText = what;
	if(!sameDialog){GameObject.Find("AudioPlayer_dia1").GetComponent(AudioSource).audio.Play();}
	GameObject.Find("AudioPlayer_dia2").GetComponent(AudioSource).audio.Play();
}

//add new message to messagebox
function pushMessage(newMsg:String,clear:boolean){
	if(!clear){
		if(msg1 == ""){msg1 = newMsg;}
		else if(msg2 == ""){msg2 = newMsg;}
		else if(msg3 == ""){msg3 = newMsg;}
		else if(msg4 == ""){msg4 = newMsg;}
		else if(msg5 == ""){msg5 = newMsg;}
		else {msg1 = msg2; msg2 = msg3; msg3 = msg4; msg4 = msg5; msg5 = newMsg;}
	}
	else {msg1 = msg2; msg2 = msg3; msg3 = msg4; msg4 = msg5; msg5 = newMsg;}
	
	if(msg1==""){msgActive = false;}
	else {msgActive = true;}
	
	msgEndTime = Time.time + 4;
}

//show and hide active function in functionbox
function showFunction(func:String){
	funcText = func;
	funcActive = true;
	funcHide = false;	
}
function hideFunction(){
	funcText += " DONE";
	funcHide = true;
	funcEndTime = Time.time + 2;
}

//display shield in |||||||| instead of numbers
function changeShieldView() : String{
	var shield = Mathf.Round(registry.pAtt.getShield());
	var str = "";
	for(var i=0;i<=shield;i+=2){
		str +="|";
	}
	return str;
}

//manage display of booleans
function translateBoolean(bool:boolean,vari:int):String{
	if(vari == 0) {
		if(bool){return "on";}
		else {return "off";}
	}
	if(vari == 1) {
		if(bool){return "active";}
		else {return "passive";}
	}
	return "";
}

//activate hacking + window
function switchHackBox(){
	hackStart = false;
	hackActive = !hackActive;
	percentReady = 0;
	percentCaught = 0;
}

function setModifier(x:float){
	modifier = x;
}

function switchInventory(){
	invActive = !invActive;
	invDetail = false;
}

function buttonAudio(){
	var soundInst : GameObject = Instantiate (Resources.Load("Prefabs/Audio_menu1", GameObject));
	soundInst.transform.parent = transform;
	soundInst.GetComponent(AudioSource).audio.Play();
}

function getFuncHide(){return funcHide;}
function setHackStart(bool:boolean){hackStart=bool;}