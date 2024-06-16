precision mediump float;

attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;
attribute vec2 aTexCoord;
attribute vec3 aTangent;

uniform mat4 uViewProjectionMatrix;
uniform mat4 uWorldMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec3 vTangent;
varying vec3 vBitangent;

uniform sampler2D uDisplacementMap;
uniform bool uUseDisplacementMap;
uniform float uDisplacementCoef;

void main(void) {
    vec3 displacedPosition = aVertexPosition.xyz;

    if (uUseDisplacementMap) {
        float displacement = texture2D(uDisplacementMap, aTexCoord).r;
        displacedPosition += aVertexNormal * displacement * -1.0 * uDisplacementCoef;
    }

    vec4 worldPosition = uWorldMatrix * vec4(displacedPosition, 1.0);
    gl_Position = uViewProjectionMatrix * worldPosition;

    vNormal = normalize(uNormalMatrix * aVertexNormal);
    vColor = aVertexColor;
    vPosition = worldPosition.xyz;
    vTexCoord = aTexCoord;
    vTangent = normalize(uNormalMatrix * aTangent);
    vBitangent = normalize(cross(vNormal, vTangent));
}
