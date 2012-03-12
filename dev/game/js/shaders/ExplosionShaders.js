var explosion_large_shader = {
    vertexShader: [
        "uniform float maxDuration;",

        "attribute float angle;",
        "attribute float size;",
        "attribute float displacement;",
        "attribute vec3 customColor;",
        "attribute vec3 direction;",
        "attribute float opacity;",

        "varying vec3 vColor;",
        "varying float vAngle;",
        "varying float vMaxDuration;",
        "varying float vOpacity;",

        "void main() {",
            "float newsize;",
            "vec3 nDirection = direction;",
            "vAngle = angle;",
            "vColor = customColor;",
            "vOpacity = opacity;",
            "nDirection = normalize(direction);",
            "mat3 trmat = mat3(  0.0, 0.0, displacement * nDirection.x,",
            "                    0.0, 0.0, displacement * nDirection.y,",
            "                    0.0, 0.0, displacement * nDirection.z);",
            "vec3 newposition = position * trmat;",
            "vec4 mvPosition = modelViewMatrix * vec4(newposition, 1.0);",
            "newsize = size;",
            "gl_PointSize = newsize * (50.0 / length(mvPosition.xyz));",
            "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),

    fragmentShader: [
        "uniform sampler2D texture;",
        "uniform  vec3 color;",

        "varying vec3 vColor;",
        "varying float vAngle;",
        "varying float vMaxDuration;",
        "varying float vOpacity;",

        "void main() {",
            "float cosx, sinx;",
            "sinx = sin(vAngle);",
            "cosx = cos(vAngle);",
            "mat2 rotmat = mat2( cosx, -sinx,",
            "                    sinx, cosx);",
            "vec2 pc = (gl_PointCoord - vec2(0.5, 0.5)) * rotmat; //to rotate texture sprite",
            "pc += vec2(0.5, 0.5); //to center texture on sprite",
            "vec4 c = vec4(color * vColor, vOpacity);",

            "gl_FragColor = c * texture2D(texture, pc);",
        "}"
    ].join("\n")
};
