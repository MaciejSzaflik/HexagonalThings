define( ["three", "container"], function ( THREE, container ) {
  
  
  console.log(container.width + " " + container.height);
  var sizeX = 40;
  var sizeY = 50;
  var camera = new THREE.PerspectiveCamera( sizeX, sizeX/sizeY, 0.01, 10000 );
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
