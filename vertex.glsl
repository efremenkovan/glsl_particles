precision highp float;

uniform float time;
uniform float rotation;
uniform float size;
uniform vec3 center;
uniform float progress;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 sphere;

float PI = 3.14159265;

varying vec2 vUv;
varying mat4 vPosition;
varying vec3 vColor;

void main() {
    mat4 projection = mat4(
        vec4(1., 0., 0., 0.),
        vec4(0., 1., 0., 0.),
        vec4(0., 0., 1., 0.),
        vec4(0., 0., 0., 1.)
    );

    mat4 rotateY = mat4(
        vec4(cos(rotation), 0., sin(rotation), 0.),
        vec4(0., 1., 0., 0.),
        vec4(-sin(rotation), 0., cos(rotation), 0.),
        vec4(0., 0., 0., 1.)
    );

    mat4 vPosition = projection * rotateY;

    vec3 cube = position + center + cos(position.y + time*PI*2.)*cos(position.x - time*PI*2.) * 0.3;
    vec3 result = position*progress + (1. - progress)*sphere;
    vColor = vec3(1.,1.,1.);
    vec4 mvPosition = modelViewMatrix * vPosition * vec4( result, 1. );
    gl_PointSize = size * ( 1. / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}