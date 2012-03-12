
function Explosion(x, y, z, scene, duration, explosion_type) { //plus other vars
    //will need multiple systems for the different textures of explosion
    this.contents = []; //used to hold this explosion's particle systems/sprites

    this.scene = scene;
    this.maxDuration = duration;
    this.currentDuration = 0;
    this.done = false;


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
    switch(explosion_type) {
        case EXPLOSION_LARGE: {
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

            //shader initialization
            var particle_shader = new THREE.ShaderMaterial({
                uniforms: this.particle_uniforms,
                attributes: this.particle_attributes,
                vertexShader: explosion_large_shader['vertexShader'],
                fragmentShader: explosion_large_shader['fragmentShader'],
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
                particle_position;

            this.spark_container;

            //small particles
            pCount = 1000;
            radius = 125;
            particle_geometry = new THREE.Geometry();
            for(var i = 0; i < pCount; i++) {
                particle_position = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
                particle_position.multiplyScalar(radius);
                particle_geometry.vertices.push(new THREE.Vertex(particle_position));
            }
            this.spark_container = new THREE.ParticleSystem(particle_geometry, particle_shader);
            this.spark_container.fade_factor = 0.0025;
            this.spark_container.position.set(x, y, z);

            for(var i = 0; i < this.spark_container.geometry.vertices.length; i++) {
                this.particle_attributes.size.value[i] = 25;
                this.particle_attributes.displacement.value[i] = 0.0;
                this.particle_attributes.customColor.value[i] = new THREE.Color(0xffaa00);
                this.particle_attributes.angle.value[i] = 1.0;
                this.particle_attributes.direction.value[i] = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
                this.particle_attributes.opacity.value[i] = 1.0;
            }

            this.contents.push(this.spark_container);
            this.scene.add(this.spark_container);

            // ============= sprites =============== //
            var sprite, sCount, sSize;

            //fire sprite
            this.fire_sprite_container = new THREE.Object3D();
            this.fire_sprite_container.radius = 850; //max size per sprite
            this.fire_sprite_container.crt_size = 0;
            this.fire_sprite_container.growth_rate = 0.025; //growth rate per sprite
            this.fire_sprite_container.crt_displacement = 0.0; //current displacement from center
            this.fire_sprite_container.max_displacement = 0.65;
            this.fire_sprite_container.displacement_speed = 0.085;
            this.fire_sprite_container.fade_factor = 0.007;

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
            this.smoke_sprite_container.radius = 700; //max size
            this.smoke_sprite_container.crt_size = 0;
            this.smoke_sprite_container.growth_rate = 0.015;
            this.smoke_sprite_container.crt_displacement = 0.0; //displacement from center
            this.smoke_sprite_container.max_displacement = 0.55;
            this.smoke_sprite_container.displacement_speed = 0.085;
            this.smoke_sprite_container.fade_factor = 0.005;

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
        }
    }

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

Explosion.prototype.updateExplosion = function() {
    var time = Date.now() * 0.005;

    //update small particle system
    var sparks = this.spark_container
    for(var i = 0; i < this.particle_attributes.size.value.length; i++) {
        this.particle_attributes.angle.value[i] = 3*Math.sin(i + time * 0.2);
        this.particle_attributes.displacement.value[i] += 0.015 * (1 - this.particle_attributes.displacement.value[i]);
        this.particle_attributes.opacity.value[i] -= sparks.fade_factor;
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
    fsprites.crt_size += fsprites.growth_rate * (fsprites.radius - fsprites.crt_size);
    for(var i = 0; i < fsprites.children.length; i++) {
        //grow
        fsprites.children[i].scale.set(fsprites.crt_size, fsprites.crt_size, 1.0);
        //disperse
        fsprites.children[i].position.x += fsprites.children[i].direction.x * fsprites.crt_displacement;
        fsprites.children[i].position.y += fsprites.children[i].direction.y * fsprites.crt_displacement;
        fsprites.children[i].position.z += fsprites.children[i].direction.z * fsprites.crt_displacement;
        //rotate
        fsprites.children[i].rotation += time * i;
        //increase transparency over time
        if(fsprites.children[i].opacity > 0.0) {
            fsprites.children[i].opacity -= fsprites.fade_factor;
        }

    }
    fsprites.crt_displacement += fsprites.displacement_speed * (fsprites.max_displacement - fsprites.crt_displacement);


    var ssprites = this.smoke_sprite_container;
    ssprites.crt_size += ssprites.growth_rate * (ssprites.radius - ssprites.crt_size);
    for(var i = 0; i < ssprites.children.length; i++) {
        //grow
        ssprites.children[i].scale.set(ssprites.crt_size, ssprites.crt_size, 1.0);
        //disperse
        ssprites.children[i].position.x += ssprites.children[i].direction.x * ssprites.crt_displacement;
        ssprites.children[i].position.y += ssprites.children[i].direction.y * ssprites.crt_displacement;
        ssprites.children[i].position.z += ssprites.children[i].direction.z * ssprites.crt_displacement;
        //rotate
        ssprites.children[i].rotation += time * i;
        if(ssprites.children[i].opacity > 0.0) {
            ssprites.children[i].opacity -= ssprites.fade_factor;
        }
    }
    ssprites.crt_displacement += ssprites.displacement_speed * (ssprites.max_displacement - ssprites.crt_displacement);

    this.currentDuration += 5;
    if(this.currentDuration == this.maxDuration) {
        this.deleteExplosion();
        this.done = true;
    }

}
