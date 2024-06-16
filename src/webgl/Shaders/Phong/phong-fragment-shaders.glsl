precision mediump float;

uniform vec3 uLightDirection;
uniform vec4 uLightColor;
uniform vec3 uLightPosition;
uniform float uLightRadius;

uniform vec4 uDiffuseColor;
uniform vec4 uAmbientColor;
uniform vec4 uSpecularColor;

uniform sampler2D uDiffuseMap;
uniform sampler2D uSpecularMap;
uniform sampler2D uNormalMap;
uniform sampler2D uDisplacementMap;

uniform float uShininess;
uniform float uAmbientCoef;
uniform float uSpecularCoef;


uniform bool uUseDiffuseMap;
uniform bool uUseSpecularMap;
uniform bool uUseNormalMap;
uniform bool uUseDisplacementMap;
uniform bool uUseVertexColor;

uniform vec3 uPointLightPosition; // Position of the point light
uniform vec4 uPointLightColor;    // Color of the point light
uniform float uPointLightIntensity; // Intensity of the point light
uniform float uPointLightRadius;   // Radius of the point light

varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec3 vTangent;
varying vec3 vBitangent;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightDirection);

    // Apply normal map
    if (uUseNormalMap) {
        vec3 texNormal = texture2D(uNormalMap, vTexCoord).xyz * 2.0 - 1.0;
        mat3 TBN = mat3(normalize(vTangent), normalize(vBitangent), normal);
        normal = normalize(TBN * texNormal);
    }

    vec4 lightColor = uLightColor;

    // Ambient lighting
    float ambientStrength = uAmbientCoef;
    vec4 ambient = ambientStrength * uAmbientColor;

    // Diffuse lighting
    float diff = max(dot(normal, lightDir), 0.0);
    vec4 diffuse = diff * uDiffuseColor;

    // Specular lighting
    float specularStrength = uSpecularCoef;
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec4 specular = specularStrength * spec * uSpecularColor;

    // Apply textures
    vec4 texDiffuse = vec4(1.0);
    if (uUseDiffuseMap) {
        texDiffuse = texture2D(uDiffuseMap, vTexCoord);
    }

    vec4 texSpecular = vec4(1.0);
    if (uUseSpecularMap) {
        texSpecular = texture2D(uSpecularMap, vTexCoord);
        specular *= texSpecular;
    }

    // Point light contribution
    vec3 lightDirPoint = normalize(uLightPosition - vPosition);
    float distanceToPointLight = length(uLightPosition - vPosition);
    //float attenuation = 1.0 / (1.0 + 0.1 * distanceToPointLight + 0.01 * distanceToPointLight * distanceToPointLight); // Modify the attenuation equation as needed
    float attenuation = 1.0 / (1.0 + (distanceToPointLight / uLightRadius) * (distanceToPointLight / uLightRadius)); // Attenuation with radius
    vec4 pointLightDiffuse = max(dot(normal, lightDirPoint), 0.0) * uLightColor * uLightRadius * attenuation;

    // Combine lighting components
    vec4 result = (ambient + diffuse + specular + pointLightDiffuse) * texDiffuse;
    result = clamp(result, 0.0, 1.0);

    if (uUseVertexColor) {
        result *= vColor;
    }

    gl_FragColor = result;
}
