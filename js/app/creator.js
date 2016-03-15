define( ["three", "scene"], function ( THREE, scene )
Creator = function ()
 {
    this.numCr = "alfa";
    this.createText =  function(sizeX,sizeY,posX,posY)
    {	
		var text2 = document.createElement('div');
		text2.style.position = 'absolute';
		text2.style.width = sizeX;
		text2.style.height = sizeY;
		text2.innerHTML = "hi there!";
		text2.style.top = posX + 'px';
		text2.style.left = posY + 'px';
		text2.style.color = "red";
		document.body.appendChild(text2);
		return text2;
    }
    this.createSphere = function(posX,posY,sceneToAdd)
	{
		var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 4, 2), new THREE.MeshNormalMaterial());
		
		sphere.position = new THREE.Vector3(posX,posY,0);	 
		sphere.name = " sphere_";
		sceneToAdd.add(sphere);	
		return sphere;
    }
	
	this.createLine = function(pointA,pointB,colorA,sceneToAdd)
	{
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({
				color: colorA
			});
	
		geometry.vertices.push(pointA);
		geometry.vertices.push(pointB); 
	
		var line = new THREE.Line(geometry, material);
		sceneToAdd.add(line);
		return line;
	}
	this.createLineArray = function(array,colorA,sceneToAdd)
	{
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({
				color: colorA
			});
			
		for(var i = 0;i<array.length;i++)
		{
			geometry.vertices.push(array[i]);
		}
	
		var line = new THREE.Line(geometry, material);
		sceneToAdd.add(line);
		return line
	}
	this.getFromCircle = function(r,angle)
	{
		rad = this.degreesToRadians(angle);
		return {x: Math.cos(rad)*r, y:Math.sin(rad)*r};
	}
	this.degreesToRadians = function(degrees)
	{
		return degrees * (Math.PI/180.0);

	}
	this.radiansToDegrees = function(radians)
	{
		return radians * (180/pi);
	}
	
	this.createHexTile = function(center,radius,sceneToAdd)
	{	
		var geom = new THREE.Geometry(); 

		geom.vertices.push(new THREE.Vector3(0,0,0));
		for(var i=0;i<6;i++){
			var point = this.getFromCircle(radius,60*i+90);
			geom.vertices.push(new THREE.Vector3(point["x"],point["y"],0));
			var ind_3 = ((i+2)%7);
			geom.faces.push( new THREE.Face3( 0, i+1, (ind_3==0?1:ind_3)));
		}
	
		geom.computeFaceNormals();	
		var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
		object.position = center;
		sceneToAdd.add(object);
		return object;		
	}
	
	this.createHexMap = function(startPoint,hexSize,col,row,diff,sceneToAdd)
	{
		for(var i=0;i<row;i++){
			for(var j=0;j<col;j++){
				var xP = startPoint.x + i*(hexSize*Math.sqrt(3)) + (j%2==1?hexSize*Math.sqrt(3)*0.5:0);
				var yP = startPoint.y + j*hexSize;
				var position = new THREE.Vector3(xP,yP,0);
				this.createHexTile(position,hexSize,sceneToAdd);
			}
		}
	}
	
	this.createIco = function(position,radius,detail,sceneToAdd)
	{
		var object = new THREE.Mesh(new THREE.IcosahedronGeometry(radius,detail), new THREE.MeshPhongMaterial() );
		object.position.set(position.x,position.y,position.z);
		sceneToAdd.add(object);
		return object;
	}
	
	this.createIcoheadreon = function(position,sceneToAdd,scale)
	{
		var t = (1.0 + Math.sqrt(5))/ 2.0;
		var geom = new THREE.Geometry();
		
		geom.vertices.push(new THREE.Vector3(-1, t, 0));
		geom.vertices.push(new THREE.Vector3( 1, t, 0));
		geom.vertices.push(new THREE.Vector3(-1,-t, 0));
		geom.vertices.push(new THREE.Vector3( 1,-t, 0));
		
		geom.vertices.push(new THREE.Vector3( 0,-1, t));
		geom.vertices.push(new THREE.Vector3( 0, 1, t));
		geom.vertices.push(new THREE.Vector3( 0,-1,-t));
		geom.vertices.push(new THREE.Vector3( 0, 1,-t));
		
		geom.vertices.push(new THREE.Vector3( t,0,-1));
		geom.vertices.push(new THREE.Vector3( t,0, 1));
		geom.vertices.push(new THREE.Vector3(-t,0,-1));
		geom.vertices.push(new THREE.Vector3(-t,0, 1));
		
		geom.faces.push( new THREE.Face3( 0,11, 5));
		geom.faces.push( new THREE.Face3( 0, 5, 1));
		geom.faces.push( new THREE.Face3( 0, 1, 7));
		geom.faces.push( new THREE.Face3( 0, 7,10));
		geom.faces.push( new THREE.Face3( 0,10,11));
		
		geom.faces.push( new THREE.Face3( 1, 5, 9));
		geom.faces.push( new THREE.Face3( 5,11, 4));
		geom.faces.push( new THREE.Face3(11,10, 2));
		geom.faces.push( new THREE.Face3(10, 7, 6));
		geom.faces.push( new THREE.Face3( 7, 1, 8));
		
		geom.faces.push( new THREE.Face3( 3, 9, 4));
		geom.faces.push( new THREE.Face3( 3, 4, 2));
		geom.faces.push( new THREE.Face3( 3, 2, 6));
		geom.faces.push( new THREE.Face3( 3, 6, 8));
		geom.faces.push( new THREE.Face3( 3, 8, 9));
		
		geom.faces.push( new THREE.Face3( 4, 9, 5));
		geom.faces.push( new THREE.Face3( 2, 4,11));
		geom.faces.push( new THREE.Face3( 6, 2,10));
		geom.faces.push( new THREE.Face3( 8, 6, 7));
		geom.faces.push( new THREE.Face3( 9, 8, 1));
		
		geom.computeFaceNormals();
		
		var object = new THREE.Mesh( geom, new THREE.MeshLambertMaterial() );
		object.position = position;
		object.scale = object.scale.multiplyScalar(scale);
		sceneToAdd.add(object);
		return object;
	}
	
  });

