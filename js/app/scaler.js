define( ["three", "scene"], function ( THREE, scene ) {
Scaler = function ()
{	
	this.startScale = 0;
	this.endScale = 0;
	this.progress = 0;
	this.speed = 0;
	this.object = null;
	this.eclapsedTime = 0;
	this.ended = false;
	this.callBack = null;
	this.disableAtEnd = false;
	
	this.setUp = function(startScale,endScale,speed,affectedObject,callBack,disableAtEnd)
	{
		this.progress = 0;
		this.startScale = startScale;
		this.endScale = endScale;
		this.speed = speed;
		this.object = affectedObject;
		this.object.scale.set(startScale.x,startScale.y,startScale.z);
		this.callBack = callBack;
		this.disableAtEnd = disableAtEnd;
	}
	
	this.update = function(dt)
	{
		this.eclapsedTime+=dt;
		if(this.eclapsedTime<=this.speed)
		{
			var currentS = this.startScale.lerp(this.endScale,Math.min(this.easeOutQuad(this.eclapsedTime/this.speed),1));
			this.object.scale.set(currentS.x,currentS.y,currentS.z);
		}
		else
		{
			if(!this.ended && this.callBack!=null)
			{
				this.callBack();
				//if(this.disableAtEnd)
				//	this.affectedObject.visible = false;
				this.ended = true;
			}
			this.ended = true;
		}
	}
	
	this.easeOutQuad = function (t) { return t*(2-t) }
	
}});