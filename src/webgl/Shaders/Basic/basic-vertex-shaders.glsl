attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;
attribute vec2 aTexCoord;

uniform mat4 uViewProjectionMatrix;
uniform mat4 uWorldMatrix;
uniform vec3 uLightPosition;

varying lowp vec3 vNormal;
varying lowp vec4 vColor;
varying lowp vec3 vPosition;

void main(void) {
    gl_Position = uViewProjectionMatrix * uWorldMatrix * aVertexPosition;
    vNormal = mat3(uWorldMatrix) * aVertexNormal;
    vColor = aVertexColor;
    vPosition = vec3(uWorldMatrix * aVertexPosition);
}
