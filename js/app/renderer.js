define( ["three", "container"], function ( THREE, container ) {
  container.innerHTML = "";
  var renderer = new THREE.WebGLRenderer( { clearColor: 0xffffffff,	alpha: true } );
  
  renderer.sortObjects = true;
  renderer.autoClear = true;
  //renderer.setFaceCulling(false,"cw");
  container.appendChild( renderer.domElement );

  var updateSize = function () {
    renderer.setSize( container.offsetWidth, container.offsetHeight );
  };
  window.addEventListener( 'resize', updateSize, false );
  updateSize();

  return renderer;
} );
