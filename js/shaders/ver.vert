attribute float displacement;
attribute vec3 colors;
varying lowp vec4 vColor;
varying vec2 vUv;
varying vec3 passNormal;

uniform float dis;
		 
void main() {
				vUv = uv;
		    	passNormal = normalize(normal);
		        vec3 newPosition = position +  vec3(0,0,0);
		        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
		        vColor = vec4(colors,1);
		    }