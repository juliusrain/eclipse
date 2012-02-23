


function Explosion(x, y, z, scene, duration) { //plus other vars
    //will need multiple systems for the different textures of explosion
    this.container = new THREE.Object3D();
    this.container.name = "ps";

    this.pCounter = 0;
    this.currentDuration = 0;
    this.maxDuration = duration;

    this.scene = scene;

    var pCount = 50;

    this.uniforms = {
        texture: {type: "t", value: 0, texture: THREE.ImageUtils.loadTexture("temp/spark1.png")},
        color: {type: "c", value: new THREE.Color(0xffffff)},
    };

    this.attributes= {
        size: {type: "f", value: []},
        angle: {type: "f", value: []},
        customColor: {type: "c", value: []},
        direction: {type: "v3", value: []},
        time: {type: "f", value: []}
    };

    var particle_shader = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        attributes: this.attributes,
        vertexShader: document.getElementById('vertexShader_explosion_large').textContent,
        fragmentShader: document.getElementById('fragmentShader_explosion_large').textContent,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });

    var particle_geometry = new THREE.Geometry(),
        particle_material,
        particle_system,
        particle_position;
    for(var i = 0; i < pCount; i++) {
        particle_position = new THREE.Vector3(Math.random()*20-10, Math.random()*20-10, Math.random()*20-10);
        particle_position.multiplyScalar(5);
        particle_geometry.vertices.push(new THREE.Vertex(particle_position));
    }

    particle_system = new THREE.ParticleSystem(particle_geometry, particle_shader);

    for(var i = 0; i < particle_system.geometry.vertices.length; i++) {
        this.attributes.size.value[i] = 100;
        this.attributes.customColor.value[i] = new THREE.Color(0xffaa00);
        this.attributes.angle.value[i] = 1.0;
        this.attributes.direction.value[i] = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
        this.attributes.time.value[i] = 1.0;
    }

    this.container.add(particle_system);
    sceneElements.explosions.push(this);
    this.scene.add(particle_system);
}

Explosion.prototype.updateExplosion = function(index) {
    var time = Date.now() * 0.005;

    for(var i = 0; i < this.attributes.size.value.length; i++) {
        //attributes.size.value[i] = 10 + 13 * Math.sin(0.1*i+time);
        //attributes.size.value[i] = distance * 1.0;
        this.attributes.angle.value[i] = 3*Math.sin(i+time*0.2);

        this.attributes.time.value[i] = this.pCounter;
    }
    if(this.pCounter > 0.4475) {
        this.pCounter += 0.0001 * this.pCounter;
    } else {
        this.pCounter += 0.025 * (0.45-this.pCounter);
    }

    this.attributes.size.needsUpdate = true;
    this.attributes.angle.needsUpdate = true;
    //attributes.direction.needsUpdate = true;
    this.attributes.time.needsUpdate = true;

}