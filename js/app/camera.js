define( ["three", "container"], function ( THREE, container ) {
  
  
  console.log(container.width + " " + container.height);
  var sizeX = 90;
  var sizeY = 50;
  var camera = new THREE.OrthographicCamera( -sizeX, sizeX,sizeY,-sizeY, 0.1, 100000 );
  camera.position.z = 70;
  camera.position.y = 0;

  var updateSize = function () {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener( 'resize', updateSize, false );
  updateSize();

  return camera;
} );
