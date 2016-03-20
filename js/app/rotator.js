define( ["three", "scene"], function ( THREE, scene )
Rotator = function ()
{
	this.axis = 0;
	this.speed = 0;
	this.object = 0;
	this.ended = false;
	
	this.setUp = function(startAxis,changeAngle,affectedObject)
	{
		this.axis = startAxis.normalize();
		this.speed = changeAngle;
		this.object = affectedObject;
	}
	
	this.update = function(dt)
	{
		this.object.rotateOnAxis(this.axis,this.speed*dt);
	}
});