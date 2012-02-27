var vShader_explosion_large = [
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
    ].join("\n");

var fShader_explosion_large = [
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
    ].join("\n");

function Explosion(x, y, z, scene, duration) { //plus other vars
    //will need multiple systems for the different textures of explosion
    this.contents = []; //used to hold this explosion's particle systems

    this.scene = scene;
    this.maxDuration = duration;
    this.currentDuration = 0;
    this.done = false;

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
        opacity: {type: "f", value: []},
    };

/*
    this.fire_sprite_uniforms = {
        texture: {type: "t", value: 0, texture: THREE.ImageUtils.loadTexture("temp/sprite0.png")},
        color: {type: "c", value: new THREE.Color(0xffffff)},
        maxDuration: {type: "f", value: duration},
    };
    this.fire_sprite_attributes = {
        size: {type: "f", value: []},
        displacement: {type: "f", value: []},
        angle: {type: "f", value: []},
        customColor: {type: "c", value: []},
        direction: {type: "v3", value: []},
        currentDuration: {type: "f", value: []},

    };

    this.smoke_sprite_uniforms = {
        texture: {type: "t", value: 0, texture: THREE.ImageUtils.loadTexture("temp/sprite1.png")},
        color: {type: "c", value: new THREE.Color(0xffffff)},
        maxDuration: {type: "f", value: duration},
    };
    this.smoke_sprite_attributes = {
        size: {type: "f", value: []},
        displacement: {type: "f", value: []},
        angle: {type: "f", value: []},
        customColor: {type: "c", value: []},
        direction: {type: "v3", value: []},
        currentDuration: {type: "f", value: []},
    }
*/

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

/*
    var fire_sprite_shader = new THREE.ShaderMaterial({
        uniforms: this.fire_sprite_uniforms,
        attributes: this.fire_sprite_attributes,
        vertexShader: vShader_explosion_large,
        fragmentShader: fShader_explosion_large,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });

    var smoke_sprite_shader = new THREE.ShaderMaterial({
        uniforms: this.smoke_sprite_uniforms,
        attributes: this.smoke_sprite_attributes,
        vertexShader: vShader_explosion_large,
        fragmentShader: fShader_explosion_large,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });
*/

    //particle system initialization
    var pCount,
        particle_geometry,
        particle_system,
        particle_position;

        //small particles
    pCount = 1000;
    radius = 125;
    particle_geometry = new THREE.Geometry();
    for(var i = 0; i < pCount; i++) {
        particle_position = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        particle_position.multiplyScalar(radius);
        particle_geometry.vertices.push(new THREE.Vertex(particle_position));
    }
    particle_system = new THREE.ParticleSystem(particle_geometry, particle_shader);
    particle_system.position.set(x, y, z);

    for(var i = 0; i < particle_system.geometry.vertices.length; i++) {
        this.particle_attributes.size.value[i] = 25;
        this.particle_attributes.displacement.value[i] = 0.0;
        this.particle_attributes.customColor.value[i] = new THREE.Color(0xffaa00);
        this.particle_attributes.angle.value[i] = 1.0;
        this.particle_attributes.direction.value[i] = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        this.particle_attributes.opacity.value[i] = 1.0;
    }

    this.contents.push(particle_system);
    this.scene.add(particle_system);

    // ============= sprites =============== //
    var sprite, sCount, sSize;
    
    //fire sprite
    this.fire_sprite_container = new THREE.Object3D();
    this.fire_sprite_container.radius = 550; //max size per sprite
    this.fire_sprite_container.crt_size = 0;    
    this.fire_sprite_container.displacement = 0.0;
    this.fire_sprite_container.maxDuration = 800;
    this.fire_sprite_container.currentDuration = 0;
    
    sCount = 10;
    sSize = 10;
    for(var i = 0; i < sCount; i++) {
        sprite = new THREE.Sprite({
            map: THREE.ImageUtils.loadTexture("temp/sprite0.png"),
            useScreenCoordinates: false,
            scaleByViewport: true,
            size: sSize,
            blending: THREE.AdditiveBlending,
        });
        sprite.direction = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        sprite.crt_size = 0;
        sprite.position.set(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        sprite.rotation = Math.random()*Math.PI;
        
        this.fire_sprite_container.add(sprite);
    }
    
    this.fire_sprite_container.position.set(x, y, z);
    
    this.contents.push(this.fire_sprite_container);
    this.scene.add(this.fire_sprite_container);
    
    //smoke sprites
    this.smoke_sprite_container = new THREE.Object3D();
    this.smoke_sprite_container.radius = 300; //max size
    this.smoke_sprite_container.crt_size = 0;    
    this.smoke_sprite_container.displacement = 0.0;
    this.smoke_sprite_container.maxDuration = 1000;
    this.smoke_sprite_container.currentDutation = 0;
    
    sCount = 20;
    sSize = 10;
    for(var i = 0; i < sCount; i++) {
        sprite = new THREE.Sprite({
            map: THREE.ImageUtils.loadTexture("temp/sprite1.png"),
            useScreenCoordinates: false,
            scaleByViewport: true,
            size: sSize,
            blending: THREE.AdditiveBlending,
        });
        sprite.direction = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        sprite.crt_size = 0;
        sprite.position.set(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        sprite.rotation = Math.random()*Math.PI;
        
        this.smoke_sprite_container.add(sprite);
    }
    
    this.smoke_sprite_container.position.set(x, y, z);
    
    this.contents.push(this.smoke_sprite_container);
    this.scene.add(this.smoke_sprite_container);

/*
        //fire sprite0
    pCount = 50;
    radius = 50;
    particle_geometry = new THREE.Geometry();
    for(var i = 0; i < pCount; i++) {
        particle_position = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        particle_position.multiplyScalar(radius);
        particle_geometry.vertices.push(new THREE.Vertex(particle_position));
    }
    this.particle_system_fire = new THREE.ParticleSystem(particle_geometry, fire_sprite_shader);

    for(var i = 0; i < particle_system.geometry.vertices.length; i++) {
        this.fire_sprite_attributes.size.value[i] = 2000;
        this.fire_sprite_attributes.displacement.value[i] = 0.0;
        this.fire_sprite_attributes.customColor.value[i] = new THREE.Color(0xffffff);
        this.fire_sprite_attributes.angle.value[i] = 1.0;
        this.fire_sprite_attributes.direction.value[i] = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        this.fire_sprite_attributes.currentDuration.value[i] = 0.0;
    }

    this.contents.push(this.particle_system_fire);
    this.scene.add(this.particle_system_fire);

        //smoke sprites
    pCount = 20;
    radius = 80;
    particle_geometry = new THREE.Geometry();
    for(var i = 0; i < pCount; i++) {
        particle_position = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        particle_position.multiplyScalar(radius);
        particle_geometry.vertices.push(new THREE.Vertex(particle_position));
    }
    particle_system = new THREE.ParticleSystem(particle_geometry, smoke_sprite_shader);

    for(var i = 0; i < particle_system.geometry.vertices.length; i++) {
        this.smoke_sprite_attributes.size.value[i] = 300;
        this.smoke_sprite_attributes.displacement.value[i] = 0.0;
        this.smoke_sprite_attributes.customColor.value[i] = new THREE.Color(0xffffff);
        this.smoke_sprite_attributes.angle.value[i] = 1.0;
        this.smoke_sprite_attributes.direction.value[i] = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        this.smoke_sprite_attributes.currentDuration.value[i] = 0.0;
    }

    this.contents.push(particle_system);
    this.scene.add(particle_system);
*/

    this.deleteExplosion = function() {
    
        for(var i = this.contents.length - 1; i >= 0; i--) {
            this.scene.remove(this.contents[i]);
            delete this.contents[i];
            this.contents.length--;
        }
    }
    
}

Explosion.prototype.updateExplosion = function(index) {
    var time = Date.now() * 0.005;

    //update small particle system
    for(var i = 0; i < this.particle_attributes.size.value.length; i++) {
        this.particle_attributes.angle.value[i] = 3*Math.sin(i + time * 0.2);
        this.particle_attributes.displacement.value[i] += 0.015 * (1 - this.particle_attributes.displacement.value[i]);
        this.particle_attributes.opacity.value[i] -= 0.0025;
    }
    
    this.particle_attributes.angle.needsUpdate = true;
    this.particle_attributes.displacement.needsUpdate = true;
    this.particle_attributes.opacity.needsUpdate = true;

/*
    //update fire sprite particle system
    for(var i = 0; i < this.fire_sprite_attributes.size.value.length; i++) {
        this.fire_sprite_attributes.angle.value[i] = 3 * Math.cos(i + time * 0.01);
        this.fire_sprite_attributes.displacement.value[i] = this.slowdownCounter;
        this.fire_sprite_attributes.size.value[i] += 0.5;
    }
    this.fire_sprite_attributes.angle.needsUpdate = true;
    this.fire_sprite_attributes.displacement.needsUpdate = true;
    this.fire_sprite_attributes.size.needsUpdate = true;
    this.fire_sprite_attributes.currentDuration.needsUpdate = true;
*/
    var fsprites = this.fire_sprite_container;
    fsprites.crt_size += 0.005 * (fsprites.radius - fsprites.crt_size);
    for(var i = 0; i < fsprites.children.length; i++) {
        //grow
        fsprites.children[i].scale.set(fsprites.crt_size, fsprites.crt_size, 1.0);
        //disperse
        fsprites.children[i].position.x += fsprites.children[i].direction.x * fsprites.displacement;
        fsprites.children[i].position.y += fsprites.children[i].direction.y * fsprites.displacement;
        fsprites.children[i].position.z += fsprites.children[i].direction.z * fsprites.displacement;
        //rotate
        fsprites.children[i].rotation += time * i;
        if(fsprites.currentDuration > fsprites.maxDuration && fsprites.children[i].opacity > 0.0) {
            fsprites.children[i].opacity -= 0.005;
        }
        
    }
    fsprites.displacement += 0.085 * (0.065 - fsprites.displacement);
    fsprites.currentDuration += 5;

    
    var ssprites = this.smoke_sprite_container;
    ssprites.crt_size += 0.0005 * (ssprites.radius - ssprites.crt_size);
    for(var i = 0; i < ssprites.children.length; i++) {
        //grow
        ssprites.children[i].scale.set(ssprites.crt_size, ssprites.crt_size, 1.0);
        //disperse
        ssprites.children[i].position.x += ssprites.children[i].direction.x * ssprites.displacement;
        ssprites.children[i].position.y += ssprites.children[i].direction.y * ssprites.displacement;
        ssprites.children[i].position.z += ssprites.children[i].direction.z * ssprites.displacement;
        //rotate
        ssprites.children[i].rotation += time * i;
        if(fsprites.currentDuration > fsprites.maxDuration && ssprites.children[i].opacity > 0.0) {
            ssprites.children[i].opacity -= 0.005;
        }
    }
    ssprites.displacement += 0.085 * (0.065 - ssprites.displacement);

    this.currentDuration += 5;
    if(this.currentDuration == this.maxDuration) {
        this.deleteExplosion();
        this.done = true;
    }

}