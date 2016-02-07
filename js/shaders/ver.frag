varying lowp vec4 vColor;
varying vec3 passNormal;
uniform vec3 mainLight;
uniform vec3 lightColorDiffuse;
uniform vec3 ambient;
varying vec2 vUv;
uniform sampler2D texture;

void main() {
	            vec3 light = mainLight;
				light = normalize(light);
				float dProd = max(0.0, dot(passNormal, light));
				vec4 lightColor = vec4(dProd*lightColorDiffuse.x + ambient.x, 
									   dProd*lightColorDiffuse.y + ambient.y,
									   dProd*lightColorDiffuse.z+ + ambient.z, 
									   1.0);	
				gl_FragColor = lightColor*texture2D(texture, vUv);
}




