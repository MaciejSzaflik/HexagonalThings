VertexColorHeight = {

	uniforms: {},

	vertexShader: [

		"void main() {",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"void main() {",

			"gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );",

		"}"

	].join("\n")

};