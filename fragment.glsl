precision highp float;

uniform float time;
uniform sampler2D dot;

varying vec2 vUv;
varying mat4 vPosition;
varying vec3 vColor;

void main() {
    vec4 color = texture2D(dot,gl_PointCoord);
    gl_FragColor = vec4(vColor, 1.)*color;
}