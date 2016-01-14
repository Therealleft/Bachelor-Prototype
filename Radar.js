//IMPORTANT! these functions only work if no gameobjects tagged "ScanVisible" are added/deleted on runtime

public var maxRange1 : float = 400; // meters
public var maxRange2 : float = 3000;
public var maxRange3 : float = 10000;
public var minRangeFull : float = 100; //minimum distance without interferences
public var scanTime : float = 1; //time in seconds to show a single detected object
private var maxRange : float; //maximum distance of detection = edge of radarsphere
private var radarRange : float;
private var changeRadar : int;

//private var changePos : float;
private var clones = new Array(); 
private var clones2 = new Array();
private var positions = new Array();
private var lines = new Array();
private var randoms = new Array();
private var scanObjects : GameObject[];

private var lines2 = new Array();
private var clones3 = new Array(); 
private var clones4 = new Array();
private var navPoints : GameObject[];

private var scanning : boolean = false;
private var timer : float = 0;
private var run : int = 0;
private var disMin : float = 0;
private var displayedObj = new Array();
private var statusActive : boolean = false;

private var registry : Component;

function Start () {
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);
	maxRange = maxRange2;
	changeRadar = 3;
	radarRange = Mathf.Round(transform.lossyScale.x)/2;
	//changePos = maxRange/10;
	
	//create instance for every scannable object
	var id : int = 0;
    scanObjects = GameObject.FindGameObjectsWithTag("scanVisible");
    for (var object : GameObject in scanObjects){
    	object.GetComponent(ObjectBasic).setScanID(id);
    
		//red dot at relative position
		var clone : GameObject = Instantiate (Resources.Load("Prefabs/RedDotPrefab", GameObject));
		clone.transform.parent = transform;
		positions.Push(object.transform.position);
		randoms.Push(Vector3(Random.Range(-1.0,1.0),Random.Range(-1.0,1.0), Random.Range(-1.0,1.0)));
		//randoms.Push(Vector3(changePos * Random.Range(-1,1) + changePos, changePos * Random.Range(-1,1) + changePos, changePos * Random.Range(-1,1) + changePos));
		clone.active = false;
		clones.Push(clone);
		
		//white dot at player plain
		var clone2 : GameObject = Instantiate (Resources.Load("Prefabs/WhiteDotPrefab", GameObject));
		clone2.transform.parent = transform; 
		clone2.active = false;
		clones2.Push(clone2);
		
		//line between red and white dots
		var lineObj : GameObject = Instantiate (Resources.Load("Prefabs/LineRenderer", GameObject));
		lineObj.transform.parent = transform; 
		lineObj.active = false;
		lines.Push(lineObj);
		
		id++;
	}
	
	//create instance for every navigation point
    navPoints = GameObject.FindGameObjectsWithTag("navpoint");
    for (var object : GameObject in navPoints){    
		//green dot at relative position
		var clone3 : GameObject = Instantiate (Resources.Load("Prefabs/GreenDotPrefab", GameObject));
		clone3.transform.parent = transform;
		clone3.active = false;
		clones3.Push(clone3);
		
		//white dot at player plain
		var clone4 : GameObject = Instantiate (Resources.Load("Prefabs/WhiteDotPrefab", GameObject));
		clone4.transform.parent = transform; 
		clone4.active = false;
		clones4.Push(clone4);
		
		//line between green and white dots
		var line2 : GameObject = Instantiate (Resources.Load("Prefabs/LineRenderer", GameObject));
		line2.transform.parent = transform; 
		line2.active = false;
		lines2.Push(line2);
	}	
}

function Update(){
	changePos = maxRange/10;

	//update position of dots and lines
	for (var i = 0; i < clones.length; i++){ 	
		//if active scan, find actual position
		var dist : float = Vector3.Distance(scanObjects[i].transform.position,transform.position);
		if(statusActive){
			positions[i] = scanObjects[i].transform.position;
			if(dist > minRangeFull){
				//positions[i] += randoms[i] * (dist-minRangeFull) / (maxRange-minRangeFull);
				positions[i] += randoms[i] * (dist-minRangeFull) / 10;
			}
		}	
		
        clones[i].transform.position = transform.position + (positions[i] - transform.parent.position) / maxRange * radarRange;      
        //hide dot, if out of range	
	   	if(Vector3.Distance(clones[i].transform.position,transform.position) > radarRange) {clones[i].GetComponent(MeshRenderer).enabled = false;}
	   	else {clones[i].GetComponent(MeshRenderer).enabled = true;}
	   	
	   	//if dot active and not hidden, activate second dot and line
		if(clones[i].active && clones[i].GetComponent(MeshRenderer).enabled){
	    	clones2[i].transform.localPosition = Vector3(clones[i].transform.localPosition.x,0,clones[i].transform.localPosition.z);
	    	if(Vector3.Distance(clones2[i].transform.position,clones[i].transform.position) < 0.01)	{clones2[i].active = false;lines[i].active = false;}
		   	else {clones2[i].active = true;lines[i].active = true;}
		   	
	    	var line = lines[i].GetComponent(LineRenderer); 
	     	line.SetPosition(0,clones[i].transform.position); 
	    	line.SetPosition(1,clones2[i].transform.position);	 
	    } 
	    else {clones2[i].active = false;lines[i].active = false;}	    
    }
    
    checkNavActive();
    //update position of navigation dots
    for (var o = 0; o < clones3.length; o++){ 	
        clones3[o].transform.position = transform.position + (navPoints[o].transform.position - transform.parent.position) / maxRange * radarRange;      
        //hide dot, if out of range	
	   	if(Vector3.Distance(clones3[o].transform.position,transform.position) > radarRange) {clones3[o].GetComponent(MeshRenderer).enabled = false;}
	   	else {clones3[o].GetComponent(MeshRenderer).enabled = true;}
	   	
	   	//if dot active and not hidden, activate second dot and line
		if(clones3[o].active && clones3[o].GetComponent(MeshRenderer).enabled){
	    	clones4[o].transform.localPosition = Vector3(clones3[o].transform.localPosition.x,0,clones3[o].transform.localPosition.z);
	    	if(Vector3.Distance(clones4[o].transform.position,clones3[o].transform.position) < 0.01)	{clones4[o].active = false;lines2[o].active = false;}
		   	else {clones4[o].active = true;lines2[o].active = true;}
		   	
	    	var line2 = lines2[o].GetComponent(LineRenderer); 
	     	line2.SetPosition(0,clones3[o].transform.position); 
	    	line2.SetPosition(1,clones4[o].transform.position);	 
	    } 
	    else {clones4[o].active = false;lines2[o].active = false;}	    
    }    
    
    //reset radar and start new scan
    if(!registry.questC.blockKeyF && !registry.control.getSteerMode() && Input.GetKeyDown(KeyCode.F) && registry.pFunc.checkFunc(1)){
    	registry.pFunc.setFuncAc(1);
    	statusActive = true;
    	for (var e = 0; e < clones.length; e++){clones[e].active = false;}    	
    	run = 0;    	
    	for (var object : GameObject in scanObjects){	
			if(!object.GetComponent(ObjectBasic).scanVisible){
				run++;
			}		
		}
    	displayedObj.Clear();
    	scanning = true;    		
    }
    
    //set radar to passive mode
    if(!registry.questC.blockKeyG && !registry.control.getSteerMode() && Input.GetKeyDown(KeyCode.G)){statusActive = false;}
    
    //change radar range
    if(!registry.questC.blockKeyH && !registry.control.getSteerMode() && Input.GetKeyDown(KeyCode.H)){
    	switch(changeRadar){
    		case 1: changeRadar++;
    				maxRange = maxRange1;
    				break;
    		case 2: changeRadar++;
    				maxRange = maxRange2;
    				break;
    		case 3: changeRadar = 1;
    				maxRange = maxRange3;
    				break;
    	}    	
    }
    
    if(scanning){ doScan();}
}

//object already detected?
function checkDisObj(compare : int):boolean{
	 for (var x : int in displayedObj){
	 	if(x == compare) {return true;}
	 }	 
	 return false;
}

//show all objects in range on radar in order of distance
function doScan(){
	var disOne : float = 0;
	var disTwo : float = maxRange;
	var curID : int;
	if(run < clones.length){
		if(timer >= scanTime){
			//find next nearest object
			for (var object : GameObject in scanObjects){	
				if(object.GetComponent(ObjectBasic).scanVisible){
					disOne = Vector3.Distance(object.transform.position,transform.parent.position);
					if(!checkDisObj(object.GetComponent(ObjectBasic).getScanID()) && disOne < disTwo) {
						disTwo = disOne;
						curID = object.GetComponent(ObjectBasic).getScanID();
					}
				}		
			}
			//randoms[curID] = Vector3(changePos * Random.Range(-1.0,1.0) + changePos, changePos * Random.Range(-1.0,1.0) + changePos, changePos * Random.Range(-1.0,1.0) + changePos);
			randoms[curID] = Vector3(Random.Range(-1.0,1.0),Random.Range(-1.0,1.0), Random.Range(-1.0,1.0));
			disMin = disTwo;
			//dot inside radar resolution?
			if(disMin < maxRange){				
				clones[curID].active = true;
				registry.questC.alert(11);
			}
			displayedObj.push(curID);
			timer = 0;
			run++;
		}
		else{timer += Time.deltaTime;}
	}
	else {
		scanning = false;
		registry.hud.hideFunction();
		registry.pFunc.setFuncAc(0);
	}
}

function checkNavActive(){
	clones3[1].active = registry.questC.navBool1;
	clones3[0].active = registry.questC.navBool2;
	clones3[2].active = registry.questC.navBool3;
}

function getRadarStatus(): boolean {return statusActive;}
function setRadarStatus(bool : boolean){statusActive = bool;}
function getRadarActive(): boolean {return scanning;}
function getRadarMax(): float {return maxRange;}
function reportDeath(id:int){clones[id].active =false;}
function getClones() : Array{return clones;}