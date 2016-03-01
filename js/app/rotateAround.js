define( ["three", "scene"], function ( THREE, scene )
RotateAround = function ()
{
	this.center = 0;
	this.angle = 0;
	this.angleSum = 0;
	this.object = 0;
	this.r = 0;
	
	this.setUp = function(radius,point,angleStep,affectedObject)
	{
		this.r = radius;
		this.center = point;
		this.angle = angleStep;
		this.object = affectedObject;
	}
	
	this.update = function(dt)
	{
		this.angleSum+=this.angle;
		var x = this.r*Math.cos(this.angleSum) + this.center.position.x;
		var y = this.r*Math.sin(this.angleSum) + this.center.position.y;
		
		
		this.object.position = new THREE.Vector3(x,y,0); 
	}
});