define( ["three", "scene","creator"], function ( THREE, scene ,creator ) {
MoveArc = function ()
{	
	this.startPosition = 0;
	this.endPosition = 0;
	this.center = 0;
	this.progress = 0;
	this.speed = 0;
	this.object = null;
	this.eclapsedTime = 0;
	this.ended = false;
	this.callBack = null;
	
	this.setUp = function(startPosition,endPosition,center,speed,affectedObject,callBack)
	{
		this.progress = 0;
		this.startPosition = startPosition;
		this.endPosition = endPosition;
		this.center = center;
		this.speed = speed;
		this.object = affectedObject;
		this.object.position.set(startPosition.x,startPosition.y,startPosition.z);
		this.callBack = callBack;
		
		creator = new Creator();
		
		//var ray = new THREE.Ray(this.center,endPosition.normalize());
		//creator.createLine(this.center,ray.at(50),'red',scene);
		
	}
	
	this.update = function(dt)
	{
		this.eclapsedTime+=dt;
		if(this.eclapsedTime<=this.speed)
		{
			var currentS = new THREE.Vector3().lerpVectors(this.startPosition,this.endPosition,Math.min(this.easeOutQuad(this.eclapsedTime/this.speed),1));
			
			var dir = (new THREE.Vector3().subVectors(this.center,currentS));
			
			var ray = new THREE.Ray(this.center,dir.normalize().negate());
			var newVector = ray.at(50);
			this.object.position.set(newVector.x,newVector.y,newVector.z);
		
		}
		else
		{
			if(!this.ended && this.callBack!=null)
			{
				this.callBack();
				this.ended = true;
			}
			this.ended = true;
		}
	}
	
	this.easeOutQuad = function (t) { return t*(2-t) }
	
}});