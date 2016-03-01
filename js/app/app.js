define( ["three", "camera", "renderer", 
"scene","dat","KeyboardState","creator","rotator","rotateAround"],
function ( THREE, camera, renderer, scene,creator,rotator,rotateAround) {
  var app = {
  
    GuiVarHolder : null,
			
	camera,
	scene, 
	renderer,
	creator,

	projector : null,
    keyboardInteraction : null,
	text : [],
	sceneObjects : [],
	transformations : [],
	clock : 0,
	clockFrame : null,
	time : null,
	delta : null,
	
	lastX : 0,
	lastY : 0,
	divX : 0,
	divY : 0,
	angleX : 0,
	angleY : -Math.PI*0.1,
	currentForward : new THREE.Vector3(1,0,0),
	currentUp : new THREE.Vector3(0,0,1),
			
	FizzyText :function()
	{
	    this.message = 'dat.gui';	
		
	},
			
	randomIntFromInterval : function(min,max)
	{
		return Math.floor(Math.random()*(max-min+1)+min);
	},
	randomFloatFromInterval : function(min,max)
	{
		return Math.random()*(max-min+1)+min;
	},

	
	initializeGUI : function()
	{
		var guiImg = new dat.GUI();			  
	    this.GuiVarHolder = new this.FizzyText();
	        var gui = new dat.GUI();  		
	},
	

    init: function () 
    {
		clockFrame = new THREE.Clock();
		creator = new Creator();
        this.initializeGUI();
	    this.keyboardInteraction = new THREEx.KeyboardState();
	 	this.text.push(creator.createText(10,10,10,10));
        this.text[0].innerHTML = "hello"
        projector = new THREE.Projector();
	    renderer.setClearColor( 0xff0000, 1 );
	    
		//document.addEventListener("mousemove", this.moveCallback, false);
		
		var size = 4;
		//creator.createHexMap(new THREE.Vector3(0,-24),size,8,12,0,scene);
	    
	    window.requestAnimationFrame( app.animate );
		
		var sun = creator.createIcoheadreon(new THREE.Vector3(0,0,0),scene,1.5);
		var planet = creator.createIcoheadreon(new THREE.Vector3(10,0,0),scene,1);	
		var moon = creator.createIcoheadreon(new THREE.Vector3(-5,0,0),scene,0.5);
		
		this.addRotator(planet,new THREE.Vector3(2,1,3),3);
		this.addRotator(sun,new THREE.Vector3(0,1,0),1);
		this.addRotator(moon,new THREE.Vector3(0,1,0),1);
		
		this.addRotateAround(sun,planet,15,0.01);
		this.addRotateAround(planet,moon,6,0.03);
	
    },
		
	addRotator : function(object,axis,speed)
	{
		var rotator = new Rotator();
		rotator.setUp(axis,speed,object);
		this.transformations.push(rotator);
		return rotator;
	},
	addRotateAround : function(center,orbiting,radius,speed)
	{
		var rotateAround = new RotateAround();
		rotateAround.setUp(radius,center,speed,orbiting);
		this.transformations.push(rotateAround);
		return rotateAround;
	},

	render :function ()
	{
		renderer.render( scene, camera );
		this.keyboardInfo();
		app.clock+=1;
		
	},
	
	keyboardInfo : function ()
    {
    },
    
    animate: function () 
    {
		delta = clockFrame.getDelta();
		
		for(var i = 0;i<app.transformations.length;i++)
		{
			app.transformations[i].update(delta);
		}
		
        window.requestAnimationFrame( app.animate );
		app.render();	
    },	
    
    getBezierPosition: function(x1,x2,x3,x4,y1,y2,y3,y4,t)
    {
        var point = function()
        { 
            this.x = 0;
            this.y = 0;
        }
        point.x = Math.pow(1 - t,3)*x1 + Math.pow(1 - t,2)*t*3*x2 +(1 -t)*Math.pow(t,2)*x3*3 + x4*Math.pow(t,3);
        
        point.y = Math.pow(1 -t,3)*y1 + Math.pow(1 -t,2)*t*3*y2 + (1 -t)*Math.pow(t,2)*y3*3 + y4*Math.pow(t,3);
        
        return point;
    },
	
	moveCallback : function(e)
	{
		if(app)
		{

		var movementX = e.movementX ||
			  e.mozMovementX        ||
			  e.webkitMovementX     ||
			  0,
			movementY = e.movementY ||
			  e.mozMovementY        ||
			  e.webkitMovementY     ||
			  0;
		
		
		app.calculateCameraRotation(movementX,movementY);
		}	
	},	
			
	calculateCameraRotation : function(movementX,movementY)
	{
		var x = movementX/app.renderer.domElement.width;
		var y = movementY/app.renderer.domElement.height;	
				
		app.angleX -= Math.atan(x)*1.0;
		app.angleY -= Math.atan(y)*1.0;
				
		var frontDirection = new THREE.Vector3(0,0,0)
		frontDirection.copy(app.cameraLookDir(camera));
		frontDirection.sub(camera.position);
		frontDirection.normalize();
		
		var quatX = new THREE.Quaternion();
		var quatY = new THREE.Quaternion();
		quatX.setFromAxisAngle( new THREE.Vector3(0,1,0), app.angleX);
		quatY.setFromAxisAngle( new THREE.Vector3(1,0,0), app.angleY);
		camera.quaternion.multiplyQuaternions(quatX,quatY);
		
	},	
	cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    },
	getStrafeDirection: function() {
		var strafeDirection = new THREE.Vector3();
		strafeDirection.crossVectors(forwardDirection,camera.up);
		return strafeDirection
	},
	keyboardInfo:function ()
	{		
		var forwardDirection = this.cameraLookDir(camera);
		var strafeDirection = new THREE.Vector3();
		strafeDirection.crossVectors(forwardDirection,camera.up);
	
		var forwardScale = 0.0;
		forwardScale += this.keyboardInteraction.pressed("w") ? 1.0 : 0.0;
		forwardScale -= this.keyboardInteraction.pressed("s") ? 1.0 : 0.0;
		
		var strafeScale = 0.0;
		strafeScale += this.keyboardInteraction.pressed("d") ? 1.0 : 0.0;
		strafeScale -= this.keyboardInteraction.pressed("a") ? 1.0 : 0.0;
			 
		forwardDirection.multiplyScalar(forwardScale);
		strafeDirection.multiplyScalar(strafeScale);
		
		camera.position.add(forwardDirection);
		camera.position.add(strafeDirection);

		if(this.keyboardInteraction.pressed("e"))
			app.calculateCameraRotation(10,0);
		if(this.keyboardInteraction.pressed("q"))
			app.calculateCameraRotation(-10,0);
		if(this.keyboardInteraction.pressed("z"))
			app.calculateCameraRotation(0,10);
		if(this.keyboardInteraction.pressed("c"))
			app.calculateCameraRotation(0,-10);
		
	},	
	tryToInitPointLock :function()
	{
		var havePointerLock = 'pointerLockElement' in document ||
		'mozPointerLockElement' in document ||
		'webkitPointerLockElement' in document;
		
		if(havePointerLock)
		{
			var element = document.getElementById( 'threejs-container' );
			
			element.requestPointerLock = element.requestPointerLock ||
					 element.mozRequestPointerLock ||
					 element.webkitRequestPointerLock;
					 
			element.requestPointerLock();

			if(document.pointerLockElement === element ||
			  document.mozPointerLockElement === element ||
			  document.webkitPointerLockElement === element) {
				console.log('The pointer lock status is now locked');
			} else {
				console.log('The pointer lock status is now unlocked');  
			}
			
		}
	}
	
  };
  return app;
} );
