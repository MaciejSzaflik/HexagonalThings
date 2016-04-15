define( ["three", "scene"], function ( THREE, scene )  {
SinScale = function ()
{
	this.speed = 0;
	this.progress = 0;
	this.offset = 0;
	this.offsetN = 0;
	this.startScale = 0;
	this.ended = false;
	this.object = null;
	
	this.setUp = function(speed,offset,affectedObject)
	{
		this.startScale = affectedObject.scale.clone(); 
		this.progress = 0;
		this.offset = offset;
		this.offsetN = offset.clone().negate();
		this.speed = speed;
		this.object = affectedObject;
	}
	
	this.update = function(dt)
	{
		var posC = this.startScale.clone();
		var min = new THREE.Vector3().addVectors(posC,this.offsetN);
		var max = new THREE.Vector3().addVectors(posC,this.offset);
		
		this.progress+=this.speed*dt;
		var lerpValue = Math.sin(this.progress)*0.5 + 0.5;
		var position = new THREE.Vector3().lerpVectors(min,max,lerpValue);
		this.object.scale.set(position.x,position.y,position.z);
		
	}
}}	);