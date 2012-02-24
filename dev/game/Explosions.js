var vShader_explosion_large = [
        "attribute float angle;",
        "attribute float size;",
        "attribute float displacement;",
        "attribute vec3 customColor;",
        "attribute vec3 direction;",
        "attribute float maxDuration;",
        "attribute float currentDuration;",

        "varying vec3 vColor;",
        "varying float vAngle;",
        "varying float vMaxDuration;",
        "varying float vCurrentDuration;",

        "void main() {",
            "float newsize;",
            "vec3 nDirection = direction;",
            "vAngle = angle;",
            "vColor = customColor;",
            "vMaxDuration = maxDuration;",
            "vCurrentDuration = currentDuration;",
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
    ].join("\n");

var fShader_explosion_large = [
        "uniform sampler2D texture;",
        "uniform  vec3 color;",

        "varying vec3 vColor;",
        "varying float vAngle;",
        "varying float vMaxDuration;",
        "varying float vCurrentDuration;",

        "void main() {",
            "float cosx, sinx;",
            "float opacity;",
            "sinx = sin(vAngle);",
            "cosx = cos(vAngle);",
            "mat2 rotmat = mat2( cosx, -sinx,",
            "                    sinx, cosx);",
            "vec2 pc = (gl_PointCoord - vec2(0.5, 0.5)) * rotmat; //to rotate texture sprite",
            "pc += vec2(0.5, 0.5); //to center texture on sprite",
            "opacity = vMaxDuration - vCurrentDuration;",
            "opacity = clamp(opacity, 0.0, 1.0);",
            "vec4 c = vec4(color * vColor, opacity);",

            "gl_FragColor = c * texture2D(texture, pc);",
        "}"
    ].join("\n");

function Explosion(x, y, z, scene, duration) { //plus other vars
    //will need multiple systems for the different textures of explosion
    this.contents = []; //used to hold this explosion's particle systems

    this.slowdownCounter = 0;

    this.scene = scene;


    //shader attributes/uniforms
    this.particle_uniforms = {
        texture: {type: "t", value: 0, texture: THREE.ImageUtils.loadTexture("temp/spark1.png")},
        color: {type: "c", value: new THREE.Color(0xffffff)},
    };

    this.particle_attributes = {
        size: {type: "f", value: []},
        displacement: {type: "f", value: []},
        angle: {type: "f", value: []},
        customColor: {type: "c", value: []},
        direction: {type: "v3", value: []},
        maxDuration: {type: "f", value: []},
        currentDuration: {type: "f", value: []},
    };

    this.fire_sprite_uniforms = {
        texture: {type: "t", value: 0, texture: THREE.ImageUtils.loadTexture("temp/sprite0.png")},
        color: {type: "c", value: new THREE.Color(0xffffff)},
    };

    this.fire_sprite_attributes = {
        size: {type: "f", value: []},
        displacement: {type: "f", value: []},
        angle: {type: "f", value: []},
        customColor: {type: "c", value: []},
        direction: {type: "v3", value: []},
        maxDuration: {type: "f", value: []},
        currentDuration: {type: "f", value: []},

    };

    //shader initialization
    var particle_shader = new THREE.ShaderMaterial({
        uniforms: this.particle_uniforms,
        attributes: this.particle_attributes,
        vertexShader: vShader_explosion_large,
        fragmentShader: fShader_explosion_large,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });

    var fire_sprite_shader = new THREE.ShaderMaterial({
        uniforms: this.fire_sprite_uniforms,
        attributes: this.fire_sprite_attributes,
        vertexShader: vShader_explosion_large,
        fragmentShader: fShader_explosion_large,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });

    //particle system initialization
    var pCount,
        particle_geometry,
        particle_system,
        particle_position;

        //small particles
    pCount = 100;
    particle_geometry = new THREE.Geometry();
    for(var i = 0; i < pCount; i++) {
        particle_position = new THREE.Vector3(Math.random()*20-10, Math.random()*20-10, Math.random()*20-10);
        particle_position.multiplyScalar(5);
        particle_geometry.vertices.push(new THREE.Vertex(particle_position));
    }
    particle_system = new THREE.ParticleSystem(particle_geometry, particle_shader);

    for(var i = 0; i < particle_system.geometry.vertices.length; i++) {
        this.particle_attributes.size.value[i] = 50;
        this.particle_attributes.displacement.value[i] = 0.0;
        this.particle_attributes.customColor.value[i] = new THREE.Color(0xffaa00);
        this.particle_attributes.angle.value[i] = 1.0;
        this.particle_attributes.direction.value[i] = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
        this.particle_attributes.maxDuration.value[i] = duration;
        this.particle_attributes.currentDuration.value[i] = 0.0;
    }

    this.contents.push(particle_system);
    this.scene.add(particle_system);

        //fire sprite0
    pCount = 20;
    particle_geometry = new THREE.Geometry();
    for(var i = 0; i < pCount; i++) {
        particle_position = new THREE.Vector3(Math.random()*20-10, Math.random()*20-10, Math.random()*20-10);
        particle_position.multiplyScalar(4);
        particle_geometry.vertices.push(new THREE.Vertex(particle_position));
    }
    particle_system = new THREE.ParticleSystem(particle_geometry, fire_sprite_shader);

    for(var i = 0; i < particle_system.geometry.vertices.length; i++) {
        this.fire_sprite_attributes.size.value[i] = 300;
        this.fire_sprite_attributes.displacement.value[i] = 0.0;
        this.fire_sprite_attributes.customColor.value[i] = new THREE.Color(0xffffff);
        this.fire_sprite_attributes.angle.value[i] = 1.0;
        this.fire_sprite_attributes.direction.value[i] = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
        this.fire_sprite_attributes.maxDuration.value[i] = duration;
        this.fire_sprite_attributes.currentDuration.value[i] = 0.0;
    }

    this.contents.push(particle_system);
    this.scene.add(particle_system);


    sceneElements.explosions.push(this);
}

Explosion.prototype.updateExplosion = function(index) {
    var time = Date.now() * 0.005;

    //update small particle system
    for(var i = 0; i < this.particle_attributes.size.value.length; i++) {
        this.particle_attributes.angle.value[i] = 3*Math.sin(i+time*0.2);
        this.particle_attributes.displacement.value[i] += 0.02;
    }

    this.particle_attributes.angle.needsUpdate = true;
    this.particle_attributes.displacement.needsUpdate = true;
    this.particle_attributes.maxDuration.needsUpdate = true;
    this.particle_attributes.currentDuration.needsUpdate = true;


    //update fire sprite particle system
    for(var i = 0; i < this.fire_sprite_attributes.size.value.length; i++) {
        this.fire_sprite_attributes.angle.value[i] = 3*Math.cos(i+time*0.01);
        this.fire_sprite_attributes.displacement.value[i] = this.slowdownCounter;
    }
    this.fire_sprite_attributes.angle.needsUpdate = true;
    this.fire_sprite_attributes.displacement.needsUpdate = true;
    this.fire_sprite_attributes.maxDuration.needsUpdate = true;
    this.fire_sprite_attributes.currentDuration.needsUpdate = true;

    if(this.slowdownCounter > 0.4475) {
        this.slowdownCounter += 0.001 * this.slowdownCounter;
    } else {
        this.slowdownCounter += 0.025 * (0.45-this.slowdownCounter);
    }

}