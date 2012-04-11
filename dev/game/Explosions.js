
function Explosion(x, y, z, scene, renderer, explosion_type) { //plus other vars
    //will need multiple systems for the different textures of explosion
    this.explosion = {
        type: explosion_type,
        contents: [], //used to hold this explosion's particle systems/sprites
    };

    this.scene = scene;
    this.renderer = renderer;
    this.done = false;
    this.maxDuration;
    this.currentDuration;


    switch(explosion_type) {
        case EXPLOSION_SMALL: {
            this.maxDuration = 500;
            this.currentDuration = 0;
            var sprite, sCount, sSize;

            this.fire_sprite_container = new THREE.Object3D();
            this.fire_sprite_container.radius = 75; //max size per sprite
            this.fire_sprite_container.crt_size = 0;
            this.fire_sprite_container.growth_rate = 0.025; //growth rate per sprite
            this.fire_sprite_container.crt_displacement = 0.0; //current displacement from center
            this.fire_sprite_container.max_displacement = 0.025;
            this.fire_sprite_container.displacement_speed = 0.0025;
            this.fire_sprite_container.fade_factor = 0.01;

            var fire_texture = THREE.ImageUtils.loadTexture("textures/explosions/exp1.png");
            
            sCount = 20;
            sSize = 10;
            for(var i = 0; i < sCount; i++) {
                sprite = new THREE.Sprite({
                    map: fire_texture,
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

            this.explosion.contents.push(this.fire_sprite_container);
            this.scene.add(this.fire_sprite_container);

            break;
        }

        case EXPLOSION_LARGE: {
            this.maxDuration = 4000;
            this.currentDuration = 0;
            //spark shader attributes/uniforms
            this.spark_uniforms = {
                texture: {type: "t", value: 0, texture: THREE.ImageUtils.loadTexture("textures/explosions/spark1.png")},
                color: {type: "c", value: new THREE.Color(0xffffff)},
            };

            this.spark_attributes = {
                size: {type: "f", value: []},
                displacement: {type: "f", value: []},
                angle: {type: "f", value: []},
                customColor: {type: "c", value: []},
                direction: {type: "v3", value: []},
                opacity: {type: "f", value: []},
            };

            var spark_shader_material = new THREE.ShaderMaterial({
                uniforms: this.spark_uniforms,
                attributes: this.spark_attributes,
                vertexShader: explosion_large_shader['vertexShader'],
                fragmentShader: explosion_large_shader['fragmentShader'],
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                transparent: true
            });

            //particle system initialization
            var pCount, particle_geometry, particle_position;

            //small particles
            pCount = 400;
            radius = 250;
            particle_geometry = new THREE.Geometry();
            for(var i = 0; i < pCount; i++) {
                particle_position = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
                particle_position.multiplyScalar(radius);
                particle_geometry.vertices.push(new THREE.Vertex(particle_position));
            }
            this.spark_container = new THREE.ParticleSystem(particle_geometry, spark_shader_material);
            this.spark_container.fade_factor = 0.0015;
            this.spark_container.max_displacement = 1.5;
            this.spark_container.displacement_speed = 0.0125
            this.spark_container.position.set(x, y, z);

            for(var i = 0; i < this.spark_container.geometry.vertices.length; i++) {
                this.spark_attributes.size.value[i] = 50;
                this.spark_attributes.displacement.value[i] = 0.0;
                this.spark_attributes.customColor.value[i] = new THREE.Color(0xffaa00);
                this.spark_attributes.angle.value[i] = 1.0;
                this.spark_attributes.direction.value[i] = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
                this.spark_attributes.opacity.value[i] = 1.0;
            }

            this.explosion.contents.push(this.spark_container);
            this.scene.add(this.spark_container);


            // ============= sprites =============== //
            var sprite, sCount, sSize;

            //fire sprite
            this.fire_sprite_container = new THREE.Object3D();
            this.fire_sprite_container.radius = 800; //max size per sprite
            this.fire_sprite_container.crt_size = 0;
            this.fire_sprite_container.growth_rate = 0.025; //growth rate per sprite
            this.fire_sprite_container.crt_displacement = 0.0; //current displacement from center
            this.fire_sprite_container.max_displacement = 0.45;
            this.fire_sprite_container.displacement_speed = 0.085;
            this.fire_sprite_container.fade_factor = 0.003;
            var fire_texture = THREE.ImageUtils.loadTexture("textures/explosions/exp1.png");

            sCount = 25;
            sSize = 15;
            for(var i = 0; i < sCount; i++) {
                sprite = new THREE.Sprite({
                    map: fire_texture,
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

            this.explosion.contents.push(this.fire_sprite_container);
            this.scene.add(this.fire_sprite_container);

            //smoke sprites
            this.smoke_sprite_container = new THREE.Object3D();
            this.smoke_sprite_container.radius = 600; //max size
            this.smoke_sprite_container.crt_size = 0;
            this.smoke_sprite_container.growth_rate = 0.015;
            this.smoke_sprite_container.crt_displacement = 0.0; //displacement from center
            this.smoke_sprite_container.max_displacement = 0.10;
            this.smoke_sprite_container.displacement_speed = 0.085;
            this.smoke_sprite_container.fade_factor = 0.002;
            var smoke_texture = THREE.ImageUtils.loadTexture("textures/explosions/smoke1.png");

            sCount = 10;
            sSize = 10;
            for(var i = 0; i < sCount; i++) {
                sprite = new THREE.Sprite({
                    map: smoke_texture, 
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

            this.explosion.contents.push(this.smoke_sprite_container);
            this.scene.add(this.smoke_sprite_container);
        }
    }

    this.deleteExplosion = function() {
        for(var i = this.explosion.contents.length - 1; i >= 0; i--) {
            if(typeof fire_texture != 'undefined') {
                this.renderer.deallocateTexture(fire_texture);
            }
            if(typeof smoke_texture != 'undefined') {
                this.renderer.deallocateTexture(smoke_texture);
            }
            if(typeof spark_shader_material != 'undefined') {
                this.renderer.deallocateTexture(spark_shader_material);
            }
            if(this.hasOwnProperty('fire_sprite_container')) {
                this.renderer.deallocateObject(this.fire_sprite_container);
            }
            if(this.hasOwnProperty('smoke_sprite_container')) {
                this.renderer.deallocateObject(this.smoke_sprite_container);
            }
            this.scene.remove(this.explosion.contents[i]);
            delete this.explosion.contents[i];
            this.explosion.contents.length--;
        }
        //console.log("explosion deleted");
    }
}

Explosion.prototype.updateExplosion = function() {

    switch(this.explosion.type) {
        case EXPLOSION_SMALL: {
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
                fsprites.children[i].rotation += 0.0002 * i ;
                //increase transparency over time
                if(fsprites.children[i].opacity > 0.0) {
                    fsprites.children[i].opacity -= fsprites.fade_factor;
                }
            }
            fsprites.crt_displacement += fsprites.displacement_speed * (fsprites.max_displacement - fsprites.crt_displacement);

            //check if explosion is done
            this.currentDuration += 5;
            if(this.currentDuration == this.maxDuration) {
                this.deleteExplosion();
                this.done = true;
            }
            break;
        }


        case EXPLOSION_LARGE: {

            //update small particle system
            var sparks = this.spark_container;

            for(var i = 0; i < sparks.geometry.vertices.length; i++) {
                this.spark_attributes.angle.value[i] = i * 0.05;
                this.spark_attributes.displacement.value[i] += sparks.displacement_speed * (sparks.max_displacement - this.spark_attributes.displacement.value[i]);
                this.spark_attributes.opacity.value[i] -= sparks.fade_factor;
            }

            this.spark_attributes.angle.needsUpdate = true;
            this.spark_attributes.displacement.needsUpdate = true;
            this.spark_attributes.opacity.needsUpdate = true;

            //update fire sprites
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
                fsprites.children[i].rotation += 0.0002 * i ;
                //increase transparency over time
                if(fsprites.children[i].opacity > 0.0) {
                    fsprites.children[i].opacity -= fsprites.fade_factor;
                }

            }
            fsprites.crt_displacement += fsprites.displacement_speed * (fsprites.max_displacement - fsprites.crt_displacement);

            //update smoke sprites
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
                ssprites.children[i].rotation += 0.0005 * i;
                if(ssprites.children[i].opacity > 0.0) {
                    ssprites.children[i].opacity -= ssprites.fade_factor;
                }
            }
            ssprites.crt_displacement += ssprites.displacement_speed * (ssprites.max_displacement - ssprites.crt_displacement);

            //check if explosion is done
            this.currentDuration += 5;
            if(this.currentDuration == this.maxDuration) {
                this.deleteExplosion();
                this.done = true;
            }
        }
    }

}
