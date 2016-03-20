define( ["three", "scene","creator","scaler"], function ( THREE, scene,creator,ScaleTranform)
GrassObject = function ()
{
	this.object = null;
	this.addToArray = null;
	this.isDisappearing = false;
	this.scaleUp = new THREE.Vector3(2.5,2.5,2.5);
	this.scaleDown = new THREE.Vector3(0.1,0.1,0.1);
	this.init = function(creator,scene,parent,radius,angleY,angleX,addToArray)
	{
		var createdOnSphere = creator.createIcoheadreon(new THREE.Vector3(0,0,0),scene,1);
		this.object = createdOnSphere;
		this.addToArray = addToArray;
		this.object.visible = false;
		this.isDisappearing = true;
		creator.placeObjectOnSphere(createdOnSphere,parent,radius,angleY,angleX);
		return createdOnSphere;
	}
	this.checkDistance = function(positionToReact,distanceCheck)
	{
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(this.object.matrixWorld );
		var dist = vector.distanceTo(positionToReact);
		if(!this.object.visible && dist<distanceCheck)
		{
			this.object.visible = true;
			this.isDisappearing = false;
			this.addScaleTransform(this.scaleDown.clone(),this.scaleUp.clone(),1.0,this.object,true);
		}
		else if(dist>distanceCheck && !this.isDisappearing)
		{
			this.isDisappearing = true;
			this.addScaleTransform(this.scaleUp.clone(),this.scaleDown.clone(),2.5,this.object,false);

		}
	}
	this.addScaleTransform = function(start,end,speed,object,hide)
	{
		var scaler = new Scaler();
		scaler.setUp(start,end,speed,object,function(){this.object.visible = hide},hide);
		if(this.addToArray!=null)
			this.addToArray(scaler)
	}
});