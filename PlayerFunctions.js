private var registry : Component;

private var funcActive : int = 0; //0 = no function active
private var functionMsg1 : String = "scanning.."; 
private var functionMsg2 : String = "hacking..";
private var functionMsg3 : String = "engine busy..";

public var hackSpeed : float = 0.1;
public var detectSpeed : float = 2;
public var hackRange : float = 50; //meters
private var inHackRange : boolean = false;
private var hacking : boolean = false;
private var hackType : int = 0; //0 = none, 1 = data, 2 = analysis, 3 = manipulation
private var hackLast : float = 0;
private var hackTimer : float = 0;
private var percentReady : float;
private var percentCaught : float;

public var optRange : float = 300; //meters
private var targetObject : Transform;
private var targetDist : float;
private var objects : GameObject[];
private var found : boolean = false;
private var ray : Ray;
private var hit : RaycastHit;

public var textFiles : TextAsset[];
private var achievedDocs = new Array();
private var hackAudio : GameObject;

function Start () {
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);	
	objects = GameObject.FindGameObjectsWithTag("scanVisible");
	
	hackAudio = Instantiate (Resources.Load("Prefabs/Audio_hack1", GameObject));
	hackAudio.transform.parent = transform;
}

function Update () {
	ray = Camera.main.ScreenPointToRay(Vector3(Screen.width/2,Screen.height/2,0));
	changeHUDonRay();
	
	//target
	if(Input.GetKeyDown(KeyCode.Mouse0) && !registry.control.getBusy()){
		lockTarget();
	}	
		
	//get distance to target + is it in hackrange?
	inHackRange = false;
	if(targetObject != null){
		targetDist = Vector3.Distance(targetObject.transform.position,transform.position)-3;
		if (targetDist <= hackRange){
			inHackRange = true;
		}
	}
	
	//lose target when too far or destroyed
	if(targetObject != null && (targetDist > optRange || !targetObject.gameObject.active)){
		targetObject = null;
		registry.questC.alert(22);		
	}


	//start hacking
	if (!registry.questC.blockKeyR && !registry.control.getSteerMode() && Input.GetKeyDown(KeyCode.R) && targetObject != null && targetObject.GetComponent(ObjectBasic).canHack && inHackRange && checkFunc(2)){
		if(funcActive == 0){switchHack(true);}
		else if(funcActive == 2){switchHack(false);}
	}
	
	//target gets out of range? -> abort hacking
	if(targetObject != null && targetDist > hackRange && hacking){
		switchHack(false);
		registry.questC.alert(36);
	}
	
	//hacking progression
	if(hacking){
		hackTarget();
	}	
	
	//open/close inventory
	if(!registry.questC.blockKeyI && !registry.control.getSteerMode() && Input.GetKeyDown(KeyCode.I)){
		switchInventory();
	}
	
	functionToHUD();	
}

//find target on center of screen
function lockTarget(){
	var tweenTarget : Transform;
	for (var go : GameObject in objects){
		if(go.GetComponent(Collider).Raycast(ray,hit,optRange)){
			tweenTarget = go.GetComponent(Transform);				
		}
	}
	if(targetObject != tweenTarget && tweenTarget != null){registry.questC.alert(21);}
	targetObject = tweenTarget;
}

//start hacking or reset variables
function switchHack(start : boolean){
	if(start){
		funcActive = 2;	
		Screen.showCursor = true;	
	}
	else {
		funcActive = 0;		
		percentReady = 0;
		percentCaught = 0;	
		registry.hud.hideFunction();
		hackType = 0;
		hacking = false;
		hackAudio.GetComponent(AudioSource).audio.Stop();
	}
	hackLast = 0;
	registry.hideCursor.enabled = !start;
	registry.hud.switchHackBox();
	registry.control.setBusy(!registry.control.getBusy());
}

function startHackProgress(num : int){
	hacking = true;
	hackType = num;
}

function hackTarget(){
	if(!hackAudio.GetComponent(AudioSource).audio.isPlaying){
		hackAudio.GetComponent(AudioSource).audio.Play();
	}

	var targetBasic = targetObject.GetComponent(ObjectBasic);
	var severity : int = targetBasic.severity+1;
	var hackTypeMod : float = 1;
	hackLast += Time.deltaTime;
	if(hackType == 2){
		hackTypeMod = 0.4; 
	}
	percentReady += hackSpeed * hackTypeMod * registry.hud.modifier * Time.deltaTime;
	
	if(hackTimer - Time.time <0){
		var max = targetDist/hackRange * registry.hud.modifier * severity * detectSpeed + hackLast/2;
		percentCaught = Random.Range(max/2,max);
		hackTimer = Time.time+0.1;
	}	

	//success
	if(percentReady >= 100){
		if(hackType == 1){ //get all documents
			addDocAchieved(targetBasic.documents[targetBasic.getOpenDocs()]);
			targetBasic.adOpenDocs();		
			if(targetBasic.getOpenDocs() < targetBasic.documents.length){
				percentReady = 0;
			}
			else {				
				switchHack(false);
			}			
		}
		else if (hackType == 2){ //get analysis
			addDocAchieved(targetBasic.analyseDoc);
			targetBasic.setAnalysed();
			switchHack(false);
		}
	}
	
	//failure
	if(percentCaught >= 100){
		targetBasic.adDetections();
		if(targetBasic.getDetections() < targetBasic.getMaxDetect()){
			percentCaught = 0;
		}
		else {
			registry.questC.alert(37);
			targetBasic.setAttention(targetBasic.getAttention()+1);
			switchHack(false);			
		}
	}
}

//check if available document is already property or adds it
function addDocAchieved(achieved:int){
	var okay : boolean = true;
	for(var a:int = 0; a<achievedDocs.length; a++){
		if(achieved == achievedDocs[a]){
			okay = false;
		}
	}
	if(okay){
		achievedDocs.Push(achieved);
		registry.questC.alert(31);
	}
	else {
		registry.questC.alert(34);
	}
}

//check function status
function checkFunc(num:int){
	if(funcActive == num || funcActive == 0){
		return true;
	}
	return false;
}

//show active function on HUD
function functionToHUD(){
	switch(funcActive) {
		case 0: if(!registry.hud.getFuncHide()){registry.hud.hideFunction();} break;
		case 1: registry.hud.showFunction(functionMsg1);break;
		case 2: registry.hud.showFunction(functionMsg2);break;
		case 3: registry.hud.showFunction(functionMsg3);break;
	}	
}

//change crosshair if possible target on center
function changeHUDonRay(){
	found = false;
	if(GameObject.Find("shaft").GetComponent(Collider).Raycast(ray,hit,10)){
		found = true;
	}
	for (var obj : GameObject in objects){		
		if(obj.GetComponent(Collider).Raycast(ray,hit,optRange)){
			found = true;		
		}		
	}

	if(found) {
		registry.hud.controlTexture = Resources.Load("Textures/cross4-2", Texture2D);		
	}
	else{
		registry.hud.controlTexture = Resources.Load("Textures/cross4", Texture2D);
	}
}

//show/hide inventory
function switchInventory(){
	registry.hud.switchInventory();
	Screen.showCursor = true;
	registry.hideCursor.enabled = !registry.hideCursor.enabled;
	registry.control.setBusy(!registry.control.getBusy());
}

function getRay():Ray{return ray;}
function getTarget():Transform{return targetObject;}
function getTargetDist():float{return targetDist;}
function getFuncAc():int{return funcActive;}
function setFuncAc(num:int){funcActive = num;}

function getHacking():boolean{return hacking;}
function setHacking(bool:boolean){hacking = bool;hackTimer = Time.time+0.1;}
function getHackType():int{return hackType;}
function getHackLast():float {return hackLast;}
function getHackRange():float{return hackRange;}
function getInHackRange():boolean{return inHackRange;}
function getAchievedDocs():Array{return achievedDocs;}