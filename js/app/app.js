define( ["three", "camera", "renderer", 
"scene","dat","KeyboardState","creator","rotator","rotateAround","scaler","grassObject","shader!glowVert.vert", "shader!glowFrag.frag","sinMove","moveArc"],
function ( THREE, camera, renderer, scene,creator,rotator,rotateAround,ScaleTranform, grassObject,glowVert,glowFrag,sinMove) {
  var app = {
  
    GuiVarHolder : null,
			
	camera,
	scene, 
	renderer,
	creator,

    keyboardInteraction : null,
	text : [],
	sceneObjects : [],
	transformations : [],
	clock : 0,
	clockFrame : null,
	time : null,
	delta : null,
	aniamtion : null,
	cameraLocked : false,
	mixer : null,
	grassObjects : [],
	objects : [],
	lights : [],
	lightColorsParams : {rotating1: "#ff0055",rotating2: "#22aaff",ambient: "#220022",near: "#00ffcc" },
	
	lastX : 0,
	lastY : 0,
	divX : 0,
	divY : 0,
	angleX : 0,
	angleY : -Math.PI*0.1,
	currentForward : new THREE.Vector3(1,0,0),
	currentUp : new THREE.Vector3(0,0,1),
	mainCharacter : null,
	sun : null,
	glowMaterial : null,
	modelY : 0,
			
	FizzyText :function()
	{
	    this.message = 'dat.gui';	
		this.tryToLock = function()
		{		  
			app.tryToInitPointLock();
		}
		this.walk = function()
		{		  
			app.characterWalk();
		}
		this.wave = function()
		{		  
			app.characterWave();
		}
		
		this.blendAnims = function()
		{		  
			app.mixer._actions[0].weight = 1;
			app.mixer._actions[1].weight = 3;
		}	
		
		this.changeRotY = function()
		{		  
			app.mainCharacter.rotation.y = app.modelY;
		}
		
		this.changeLightsColors = function()
		{		  
			app.lights["rotating1"].color = new THREE.Color(app.lightColorsParams["rotating1"]);
			app.lights["rotating2"].color = new THREE.Color(app.lightColorsParams["rotating2"]);
			app.lights["ambient"].color = new THREE.Color(app.lightColorsParams["ambient"]);
			app.lights["companion"].color = new THREE.Color(app.lightColorsParams["near"]);
		}
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
	    this.GuiVarHolder = new this.FizzyText();
	    var gui = new dat.GUI(); 
		gui.add(this.GuiVarHolder, 'tryToLock');	
		gui.add(this.GuiVarHolder, 'walk');
		gui.add(this.GuiVarHolder, 'wave');
		gui.add(this.GuiVarHolder, 'blendAnims');
		gui.add(app,'modelY',0,Math.PI*2).onChange(this.GuiVarHolder.changeRotY);
		gui.addColor(app.lightColorsParams,'rotating1').onChange(this.GuiVarHolder.changeLightsColors);
		gui.addColor(app.lightColorsParams,'rotating2').onChange(this.GuiVarHolder.changeLightsColors);
		gui.addColor(app.lightColorsParams,'ambient').onChange(this.GuiVarHolder.changeLightsColors);
		gui.addColor(app.lightColorsParams,'near').onChange(this.GuiVarHolder.changeLightsColors);
	},
	
	characterWalk: function()
	{
		app.mixer._actions[0].weight = 1;
		app.mixer._actions[1].weight = 0;
	},
	
	characterWave: function()
	{
		app.mixer._actions[0].weight = 0;
		app.mixer._actions[1].weight = 1;
	},
	
    init: function () 
    {
		clockFrame = new THREE.Clock();
		creator = new Creator();
        this.initializeGUI();
	    this.keyboardInteraction = new THREEx.KeyboardState();
	    
		document.addEventListener('pointerlockchange', this.changeCallback, false);
	    document.addEventListener('mozpointerlockchange', this.changeCallback, false);
	    document.addEventListener('webkitpointerlockchange', this.changeCallback, false);

		document.addEventListener("click", this.mouseClick, false)
	    document.addEventListener("mousemove", this.moveCallback, false);
	    
	    window.requestAnimationFrame( app.animate );
		
		this.createCustomMaterial();
		this.createLightsAndMain();
		this.createOrbiting();
		this.createGrassObjects();
		this.createStars();
		this.loadMainCharacter();
		
    },
	
	createCustomMaterial : function()
	{
		//console.log(glowFrag);
		/*glowMaterial = new THREE.ShaderMaterial( 
		{
			uniforms: 
			{ 
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 1.4 },
				glowColor: { type: "c", value: new THREE.Color(0xffff00) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader:  glow.value,
			fragmentShader: glow.value,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );*/
	},
	
	createLightsAndMain : function()
	{
		app.sun = creator.createIco (new THREE.Vector3(0,-35.5,0),20.5,3,scene);
		app.sun.material.shading = THREE.FlatShading;
		var light = new THREE.PointLight( 0xff0055, 4, 500 );
		var ambientLight = new THREE.AmbientLight( 0x220022 ); 
		app.sun.name = "Sun";
		var light2 = new THREE.PointLight( 0x22aaff, 3, 500 );
		this.addRotateAround(app.sun,light,200,0.005,new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0));
		this.addRotateAround(app.sun,light2,200,0.015,new THREE.Vector3(0,1,0),new THREE.Vector3(0.1,0.1,1));
		scene.add( ambientLight );
		scene.add( light );
		scene.add( light2 );
		
		app.lights["rotating1"] = light;
		app.lights["ambient"] = ambientLight;
		app.lights["rotating2"] = light2;
		
		this.objects.push(app.sun);
	},
	createGrassObjects : function()
	{
		var loader = new THREE.TextureLoader();
		loader.load('./texture/11_5GrassAlpha.jpg', function ( texture ) {
			var material = new THREE.MeshPhongMaterial(); 
			material.alphaMap = texture;
			material.transparent = true;
			for(var i = 0;i<Math.PI;i+=Math.PI*0.05)
			{
				for(var j = 0;j<Math.PI*2;j+=Math.PI*0.05)
				{
					var grassObject = new GrassObject();
					grassObject.init(
						material,
						creator,
						scene,
						app.sun
						,19
						,i + app.getRR(-0.04,0.04)
						,j + app.getRR(-0.04,0.04)
						,function(alfa){app.transformations.push(alfa);});
					
					app.grassObjects.push(grassObject);
				}
			}
			
			//app.addRotator(app.sun,new THREE.Vector3(-1,0,0),0.6);
		});
	},
	createStars : function()
	{
		var loader = new THREE.TextureLoader();
		loader.load('./texture/particle.png', function ( texture ) {
			var pMaterial = new THREE.PointsMaterial({
				  color: 0xFFFFFF,
				  size: 2,
				  vertexColors : THREE.VertexColors,
				  map : texture,
				  transparent : true
			});
			var pointCloud = creator.createPointsCloud(pMaterial,10000,400,scene);
			app.addRotator(pointCloud,new THREE.Vector3(1,1,0),0.15);
			var pointCloud = creator.createPointsCloud(pMaterial,5000,800,scene);
			app.addRotator(pointCloud,new THREE.Vector3(0,1,1),0.1);
		});
	},
	
	createOrbiting : function()
	{
		var material = new THREE.MeshPhongMaterial();
		for(var i = 0;i<20;i++)
		{
			var planet = creator.createIcoheadreon(material,new THREE.Vector3(10,0,0),scene,this.getRR(1.0,1.5));
			planet.position.set(100,10,10);
			this.addRotator(planet,new THREE.Vector3(2,1,3),3);
			
			var axisX = this.getRV(0,1,0,1,0,1).multiplyScalar(i%2==1?1:-1);
			var axisY = this.getRV(0,1,0,1,0,1).multiplyScalar(i%2==0?1:-1);
			this.addRotateAround(	app.sun,planet,this.getRR(100,120) + i,this.getRR(0.001,0.01),axisX,axisY);
			var numberOfMoons = this.getRR(0,3);
			for(var j = 0;j<numberOfMoons;j++)
			{
				var moon = creator.createIcoheadreon(material,new THREE.Vector3(-5,0,0),scene,this.getRR(0.2,0.6));
				
				this.addRotator(moon,new THREE.Vector3(0,1,0),1);
				axisX = this.getRV(0,1,0,1,0,1);
			    axisY = this.getRV(0,1,0,1,0,1);
				this.addRotateAround(planet,moon,this.getRR(10,15),this.getRR(0.01,0.01),axisX,axisY)
			}
		}
	},
	
	
	loadMainCharacter :function()
	{
		var loader = new THREE.JSONLoader;
		var animation;
		var action = {},mixer;
		loader.load('./models/trying_mirror.json', function (geometry, materials) {
			materials[0].skinning = true;
			materials[0].side = THREE.DoubleSide;
			materials[0].shading = THREE.FlatShading;
			app.mainCharacter = new THREE.SkinnedMesh(geometry,materials[0],false);
			
			scene.add(app.mainCharacter);
				
			app.mainCharacter.position.set(0, -6, 0);
			app.mainCharacter.scale.set(2.8, 2.8, 2.8);
		
			app.mixer = new THREE.AnimationMixer( app.mainCharacter );
			
			app.mixer.clipAction( app.mainCharacter.geometry.animations[ 1 ],0 ).play();
			app.mixer.clipAction( app.mainCharacter.geometry.animations[ 3 ],0 ).play();
			app.mixer._actions[0].weight = 0;
			app.mixer._actions[1].weight = 1;
			
			var light = new THREE.PointLight( 0x00ffcc,2, 70 );
			app.lights["companion"] = light;
			var littleLight = creator.createIcoheadreon(new THREE.MeshPhongMaterial(),new THREE.Vector3(10,0,0),scene,0.3);
			littleLight.material = new THREE.MeshBasicMaterial();
			littleLight.parent = app.mainCharacter;
			littleLight.position.set(8,3,0);
			
			light.position.set(0,0,0);
			scene.add(littleLight);
			scene.add(light);
			light.parent = littleLight;
			app.addSinMove(2,new THREE.Vector3(1,2,0),littleLight);
			app.addRotator(littleLight,new THREE.Vector3(0,1,0),3);
			
		});
	},
	
	getRR :function(min, max) 
	{
		return Math.random() * (max - min) + min;
	},
	getRV :function(minX, maxX,minY, maxY,minZ, maxZ) 
	{
		return new THREE.Vector3(this.getRR(minX,maxX),this.getRR(minY,maxY),this.getRR(minZ,maxZ));
	},
	getRand : function(constV,mulV)
	{
		return constV + Math.random()*mulV;
	},
	getRadVec : function(constX,mulX,constY,mulY,constZ,mulZ)
	{
		return new THREE.Vector3(constX + mulX*Math.random(),constY + mulY*Math.random(),constZ + mulZ*Math.random());
	},
	
	addSinMove : function(speed,offset,object)
	{
		var sinMove = new SinMove();
		sinMove.setUp(speed,offset,object);
		this.transformations.push(sinMove);
		return sinMove;
	},
	addRotator : function(object,axis,speed)
	{
		var rotator = new Rotator();
		rotator.setUp(axis,speed,object);
		this.transformations.push(rotator);
		return rotator;
	},
	addMoveArc : function(object,pointA,pointB,speed,cb)
	{
		var mover = new MoveArc();
		mover.setUp(pointA,pointB,app.sun.position,speed,object,cb);
		this.transformations.push(mover);
		return mover;
	},
	addScaleTransform : function(start,end,speed,object)
	{
		var scaler = new Scaler();
		scaler.setUp(start,end,speed,object);
		this.transformations.push(scaler);
		return scaler;
	},
	addRotateAround : function(center,orbiting,radius,speed,axisX,axisY)
	{
		var rotateAround = new RotateAround();
		rotateAround.setUp(radius,center,speed,orbiting,axisX,axisY);
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
		if( app.mixer ) app.mixer.update( delta );
		for(var i = 0;i<app.transformations.length;i++)
		{
			app.transformations[i].update(delta);
		}
		app.transformations = app.transformations.filter(function (e) {return !e.ended;});
		if(app.mainCharacter!=null)
		{
			for(var i = 0;i<app.grassObjects.length;i++)
			{
				app.grassObjects[i].checkDistance(app.mainCharacter.position,20);
			}
		}
		
		
        window.requestAnimationFrame( app.animate );
		app.render();	
    },	
	
	distanceCheck : function()
	{
		
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
		if(app && this.cameraLocked)
		{
			var vec = app.parseEvent(e);
			app.calculateCameraRotation(vec.x,vec.y);
		}	
	},

	parseEvent : function(e)
	{
		var movementX = e.movementX ||
			  e.mozMovementX        ||
			  e.webkitMovementX     ||
				  0,
			movementY = e.movementY ||
			  e.mozMovementY        ||
		      e.webkitMovementY     ||
				  0;
		
		return new THREE.Vector2(movementX,movementY);
	},
	
	mouseClick : function(e)
	{
		var mouse = new THREE.Vector2();
		mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
		
		raycaster = new THREE.Raycaster();
		raycaster.linePrecision = 3;
		
		raycaster.setFromCamera( mouse, camera );
		var intersects = raycaster.intersectObject(app.sun, false);
		if(intersects.length>0)
		{
			var obj = creator.createIco (intersects[0].point,2.5,1,scene);
		    app.addMoveArc(app.mainCharacter,app.mainCharacter.position.clone(),intersects[0].point,3, app.characterWave);
			app.characterWalk();
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
	changeCallback :function()
	{
		var canvas = document.getElementById( 'threejs-container' );
		
		if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
             document.webkitPointerLockElement === canvas) {
		
			this.cameraLocked = true;
		}
		else
			this.cameraLocked = false;
			
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
				this.cameraLocked = true;
			} else {
				this.cameraLocked = true; 
			}
			
		}
	}
	
  };
  return app;
} );
