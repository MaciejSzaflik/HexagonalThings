define( ["three", "camera", "renderer", 
"scene","dat","KeyboardState","creator"],
function ( THREE, camera, renderer, scene,creator) {
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
	clock : 0,
			
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
		creator = new Creator();
        this.initializeGUI();
	    this.keyboardInteraction = new THREEx.KeyboardState();
	 	this.text.push(creator.createText(10,10,10,10));
        this.text[0].innerHTML = "hello"
        projector = new THREE.Projector();
	    renderer.setClearColor( 0xff0000, 1 );
	    
		var size = 4;
		creator.createHexMap(new THREE.Vector3(-50,-24),size,8,12,0,scene);
	 
	   window.requestAnimationFrame( app.animate );
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
	
	
    
    			

	
  };
  return app;
} );
