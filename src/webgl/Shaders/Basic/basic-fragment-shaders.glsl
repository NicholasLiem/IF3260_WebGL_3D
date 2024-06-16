precision mediump float;
uniform vec4 uLightColor;
uniform vec4 uColor;
uniform bool uUseVertexColor;

varying lowp vec4 vColor;

void main() {
    vec4 baseColor = uColor * uLightColor;

    if (uUseVertexColor) {
        baseColor *= vColor;
    }

    gl_FragColor = baseColor;
}
