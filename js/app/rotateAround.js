define( ["three", "scene"], function ( THREE, scene ){
RotateAround = function ()
{
	this.center = 0;
	this.angle = 0;
	this.angleSum = 0;
	this.object = 0;
	this.r = 0;
	
	this.vec1 = 0;
	this.vec2 = 0;
	this.ended = false;
	
	this.setUp = function(radius,point,angleStep,affectedObject,axisX,axisY)
	{
		this.r = radius;
		this.center = point;
		this.angle = angleStep;
		this.object = affectedObject;
		
		this.vec1 = axisX.normalize();
		this.vec2 = axisY.normalize();
	}
	
	this.update = function(dt)
	{
		this.angleSum+=this.angle;
		
		var sinVal = this.r*Math.sin(this.angleSum);
		var cosVal = this.r*Math.cos(this.angleSum);
		
		var x = this.vec1.x*cosVal + this.vec2.x*sinVal + this.center.position.x;
		var y = this.vec1.y*cosVal + this.vec2.y*sinVal + this.center.position.y;
		var z = this.vec1.z*cosVal + this.vec2.z*sinVal + this.center.position.z;
		
		//console.log(x + " " +y + " " + z);
		this.object.position.set(x,y,z); 
	}
}});