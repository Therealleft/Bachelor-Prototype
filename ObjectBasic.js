private var registry : Component;

public var hudname : String = " "; //name displayed on hud when targeted
public enum severitys {easy, medium, tough}
public var severity : severitys = severitys.medium;
private var attention : int = 0; //0 = not alerted, 1 = checking environment, 2 = alerted

public var scanVisible : boolean = true; //show on Radar
private var scanID : int;

public var canHack : boolean = true;
public var canManipulate : boolean = false;
public var documents : int[]; //put numbers of containing docs
public var analyseDoc : int; //put Number of analysis-document
private var openDocs : int = 0;
private var maxDetect : int = 0;
private var detections : int = 0;
private var gotDocs : boolean = false;
private var analysed : boolean = false;

function Start () {
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
	
	var toughness : int = severity;
	maxDetect = 6-toughness*2;
}

function Update () {
	if(!gotDocs && openDocs != documents.length){
		gotDocs = true;
	}
}

function die(){
	var soundInst : GameObject = Instantiate (Resources.Load("Prefabs/Audio_explode1", GameObject));
	soundInst.GetComponent(AudioSource).audio.Play();
	GetComponentInChildren(ParticleEmitter).emit = true;
	registry.radar.reportDeath(scanID);
	gameObject.active = false;
}

function calm(){
	attention = 0;
	detections = 0;
}

function setAttention(num : int){if(num < 0) {num = 0;} else if(num > 3) {num = 3;} attention = num;}
function getAttention() : int {return attention;}

function setScanID(id : int){scanID = id;}
function getScanID() : int {return scanID;}

function adOpenDocs(){openDocs++;}
function getOpenDocs() : int {return openDocs;}
function adDetections(){detections++;}
function getDetections() : int {return detections;}
function getMaxDetect() : int {return maxDetect;}

function setHacked(bool : boolean){hacked = bool;}
function getAnalysed() : boolean {return analysed;}
function setAnalysed(){analysed = true;}