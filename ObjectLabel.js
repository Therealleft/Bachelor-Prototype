private var registry : Component;

public var target : Transform;		// Object that this label should follow
public var offset = Vector3.up;	// Units in world space to offset; 1 unit above object by default
public var clampToScreen = false;	// If true, label will be visible even if object is off screen
public var clampBorderSize = .05;	// How much viewport space to leave at the borders when a label is being clamped
public var playerTarget : boolean = false;
public var clampTexture : boolean = false;
public var textureX : Texture2D;
public var textureY : Texture2D;
public var textureXY : Texture2D;

private var oldTexture : Texture2D;
private var pixelOffsetX : float;
private var pixelOffsetY : float;

private var cam : Camera;
private var thisTransform : Transform;
private var camTransform : Transform;
 
function Start () {
	registry = GameObject.Find("SpaceShipController").GetComponent(Registry);	
	
	oldTexture = gameObject.GetComponent(GUITexture).texture;
	
	if(GetComponentInChildren(GUIText)){
		pixelOffsetX = GetComponentInChildren(GUIText).pixelOffset.x;
		pixelOffsetY = GetComponentInChildren(GUIText).pixelOffset.y;
	}
	thisTransform = transform;
	cam = Camera.main;
	camTransform = cam.transform;
}
 
function Update () {
	if(playerTarget){target = registry.pFunc.getTarget();}
	else {target = transform.parent.transform;}
	
	if (target != null){
		gameObject.GetComponent(GUITexture).enabled = true;
		if (clampToScreen) {
			var relativePosition = camTransform.InverseTransformPoint(target.position);
			relativePosition.z = Mathf.Max(relativePosition.z, 1.0);
			thisTransform.position = cam.WorldToViewportPoint(camTransform.TransformPoint(relativePosition + offset));
			thisTransform.position = Vector3(Mathf.Clamp(thisTransform.position.x, clampBorderSize, 1.0-clampBorderSize),
											 Mathf.Clamp(thisTransform.position.y, clampBorderSize, 1.0-clampBorderSize),
											 thisTransform.position.z);
		}
		else {
			thisTransform.position = cam.WorldToScreenPoint(target.position + offset);
		}
	}
	else {
		gameObject.GetComponent(GUITexture).enabled = false;
	}
	
	if(clampTexture){
		//texture position left or right
		if((thisTransform.position.x == 0 || thisTransform.position.x == 1) && !(thisTransform.position.y == 0 || thisTransform.position.y == 1)){
			gameObject.GetComponent(GUITexture).texture = textureX;
			if(GetComponentInChildren(GUIText)){
				GetComponentInChildren(GUIText).pixelOffset.y = 0;
				if(thisTransform.position.x == 0){
					GetComponentInChildren(GUIText).pixelOffset.x = 64;
				}
				else if(thisTransform.position.x == 1){
					GetComponentInChildren(GUIText).pixelOffset.x = -64;					
				}				
			}
		}
		//texture position top
		else if(thisTransform.position.y == 1 && !(thisTransform.position.x == 0 || thisTransform.position.x == 1)){
			gameObject.GetComponent(GUITexture).texture = textureY;
			GetComponentInChildren(GUIText).pixelOffset.x = 0;
			GetComponentInChildren(GUIText).pixelOffset.y = -44;		
		}
		//texture position corner
		else if((thisTransform.position.y == 0 && (thisTransform.position.x == 0 || thisTransform.position.x == 1)) || (thisTransform.position.y == 1 && (thisTransform.position.x == 0 || thisTransform.position.x == 1))){
			gameObject.GetComponent(GUITexture).texture = textureXY;
			if(thisTransform.position.y == 0){
				GetComponentInChildren(GUIText).pixelOffset.y = 33;
				if(thisTransform.position.x == 0){GetComponentInChildren(GUIText).pixelOffset.x = 48;}
				else{GetComponentInChildren(GUIText).pixelOffset.x = -48;}
			}
			else if(thisTransform.position.y == 1){
				GetComponentInChildren(GUIText).pixelOffset.y = -30;
				if(thisTransform.position.x == 0){GetComponentInChildren(GUIText).pixelOffset.x = 51;}
				else{GetComponentInChildren(GUIText).pixelOffset.x = -51;}
			}
		}
		//texture position inside screen or bottom
		else{
			gameObject.GetComponent(GUITexture).texture = oldTexture;
			GetComponentInChildren(GUIText).pixelOffset.x = pixelOffsetX;
			GetComponentInChildren(GUIText).pixelOffset.y = pixelOffsetY;
		}
	}
}