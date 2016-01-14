public var player : GameObject;

public var control : Component;
public var pAtt : Component;
public var questC : Component;
public var pFunc : Component;

public var hud : Component;
public var radar : Component;
public var hideCursor : Component;

function Start(){
	player = gameObject;

	control = GetComponent(SpaceController);
	pAtt = GetComponent(PlayerAttributes);
	questC = GetComponent(QuestController);
	pFunc = GetComponent(PlayerFunctions);
	
	hud = GetComponentInChildren(HUD);
	radar = GetComponentInChildren(Radar);
	hideCursor = GetComponentInChildren(HideCursorScript);
}