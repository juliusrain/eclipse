
/*
 *  Created by Graphics Engine. Used to render the Jumpmap.
 */
function Jumpmap() {
    this.visible = false;

    this.show_stats = false;

    this.maxZ = 1000;
    this.minZ = 300;
    this.currentZ = this.maxZ;
    this.maxX;
    this.currentX = 0;
    this.maxY;
    this.currentY = 0;

    this.zoomed_in = false;

    this.container = document.getElementById('jumpmapbox');

    this.map_width = parseInt($('#jumpmapbox').css('width'));
    this.map_height = parseInt($('#jumpmapbox').css('height'));

    this.jumpmap_scene = new THREE.Scene();
    this.jumpmap_camera = new THREE.PerspectiveCamera(45, this.map_width/this.map_height, 0.1, 1e7);

    this.jumpmap_scene.add(this.jumpmap_camera);

    this.jumpmap_camera.position.z = this.maxZ;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.autoClear = false;
    this.renderer.setSize(this.map_width, this.map_height);

    this.container.appendChild(this.renderer.domElement);

    var render_model = new THREE.RenderPass(this.jumpmap_scene, this.jumpmap_camera);
    var effect_bloom = new THREE.BloomPass(1);
    var effect_film = new THREE.FilmPass(0.35, 0.95, 2048, false);

    effect_film.renderToScreen = true;
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(render_model);
    this.composer.addPass(effect_bloom);
    this.composer.addPass(effect_film);

    this.tempVec = new THREE.Vector3();
    this.ray = new THREE.Ray(this.jumpmap_camera.position);
    this.projector = new THREE.Projector();
    this.intersects;

    this.selected = null;
    this.suns = [];
    if(this.show_stats) {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.container.appendChild(this.stats.domElement);
    }

    //unique id's assigned to each system created
    this.ssID = 0;
    this.assignID = function() {
        var ret = this.ssID;
        this.ssID++;
        return ret;
    }

    
    this.container.addEventListener('mousedown', onMouseDown, false);
    this.container.addEventListener('mousemove', onMouseMove, false);

        this.mouse = {x: 0, y: 0};

    var self = this;
    var mouseX, mouseY;
    //mouse event listner to register clicks
    function onMouseDown(event) {
        self.mouse.x = event.clientX - self.container.offsetLeft;
        self.mouse.y = event.clientY - self.container.offsetTop;
        mouseX = ((event.clientX - self.container.offsetLeft) / self.map_width) * 2 - 1;
        mouseY = -((event.clientY - self.container.offsetTop) / self.map_height) * 2 + 1;
      
        self.tempVec.set(mouseX, mouseY, 0.5);
        self.projector.unprojectVector(self.tempVec, self.jumpmap_camera);

        self.ray.direction.copy(self.tempVec.subSelf(self.jumpmap_camera.position).normalize());
        self.intersects = self.ray.intersectObjects(self.jumpmap_scene.children);
        if(self.intersects.length > 0) {
            //if clicking on sun, zoom in and out
            if(self.intersects[0].object.isParent) {
                self.zoomed_in = !self.zoomed_in;
            } else if(!self.intersects[0].object.isParent && self.zoomed_in) { //else if is a regular planet, assign a function to it
                if(self.intersects[0].object.type == GAS_GIANT) {
                    gameEngine.jump(0, GAS_GIANT);
                } else if(self.intersects[0].object.type == ROCK_PLANET) {
                    gameEngine.jump(0, ROCK_PLANET);
                }
            }
            if(!self.zoomed_in) {
                self.selected = null;
            }
            if(self.intersects[0].object.isParent) {
                self.maxX = self.intersects[0].object.position.x;
                self.maxY = self.intersects[0].object.position.y;
            } else {
                self.maxX = self.intersects[0].object.parentCoords.x;
                self.maxY = self.intersects[0].object.parentCoords.y;
            }
        }
    }

    //mouse event listener to register mouse movement
    function onMouseMove(event) {
        self.mouse.x = event.clientX - self.container.offsetLeft;
        self.mouse.y = event.clientY - self.container.offsetTop;
        mouseX = ((event.clientX - self.container.offsetLeft) / self.map_width) * 2 - 1,
        mouseY = -((event.clientY - self.container.offsetTop) / self.map_height) * 2 + 1;
        
        self.tempVec.set(mouseX, mouseY, 0.5);
        self.projector.unprojectVector(self.tempVec, self.jumpmap_camera);

        self.ray.direction.copy(self.tempVec.subSelf(self.jumpmap_camera.position).normalize());
        self.intersects = self.ray.intersectObjects(self.jumpmap_scene.children);
        if(self.intersects.length > 0) {
            if(self.zoomed_in) {
                if(self.selected != self.intersects[0].object) {
                    self.selected = self.intersects[0].object;
                }
            }
        } else {
            self.selected = null;
        }

    }

}

    /*
     *  Populate Jumpmap. Reads data from global JSON file.
     */
    Jumpmap.prototype.loadJumpmap = function() {
        var sphereGeometry = new THREE.SphereGeometry(20, 20, 20);
        var rock_map = new THREE.ImageUtils.loadTexture("textures/planets/planet_texture_rock.jpg");
        var gas_map = THREE.ImageUtils.loadTexture("textures/planets/planet_texture_gas.jpg");
        var sun_map = THREE.ImageUtils.loadTexture("textures/planets/sunmap.jpg");
        var normal_material = new THREE.MeshNormalMaterial();
        var rock_material = new THREE.MeshLambertMaterial({
            map: rock_map,
            color: 0xaaaaff
        });
        var gas_material = new THREE.MeshLambertMaterial({
            map: gas_map
        });
        var sun_material = new THREE.MeshLambertMaterial({
            map: sun_map
        });
        var ss, p;
        var system, planet;
        //create sectors (ie stars)
        for(var i = 0; i < sector.length; i++) {
            ss = sector[i];
            system = new THREE.Mesh(sphereGeometry, sun_material);
            system.position.set(ss.x, ss.y, -100);
            system.scale.set(3.0, 3.0, 3.0);
            system.name = ss.name;
            system.systemID = this.assignID();
            system.isParent = true;
            this.jumpmap_scene.add(system);
            this.suns.push(system);
            
            //create planets around parent star
            for(var j = 0; j < ss.planets.length; j++) {
                p = ss.planets[j];
                if(p.type == ROCK_PLANET) {
                    planet = new THREE.Mesh(sphereGeometry, rock_material);
                } else if(p.type == GAS_GIANT) {
                    planet = new THREE.Mesh(sphereGeometry, gas_material);
                }
                planet.position.set(system.position.x + p.x, system.position.y + p.y, system.position.z + p.z);
                planet.parentCoords = new THREE.Vector3(system.position.x, system.position.y, system.position.z);
                planet.scale.set(p.radius, p.radius, p.radius);
                planet.name = p.name;
                planet.parentID = system.systemID;
                planet.isParent = false;
                planet.type = p.type;
                this.jumpmap_scene.add(planet);
            }

        }

        //add lights to jump scene
        var dirlight = new THREE.DirectionalLight(0xaaaaaa);
        dirlight.position.set(0, 0, 100).normalize();
        this.jumpmap_scene.add(dirlight);

        var dirlight1= new THREE.DirectionalLight(0x222222);
        dirlight1.position.set(100, 0, 0).normalize();
        this.jumpmap_scene.add(dirlight1);

        var dirlight2= new THREE.DirectionalLight(0x222222);
        dirlight2.position.set(-100, 0, 0).normalize();
        this.jumpmap_scene.add(dirlight2);
    }

    /*
     *  Sets jumpmap status to visible.
     *      Input: boolean variable.
     */
    Jumpmap.prototype.setVisible = function(b) {
        this.visible = b;
        if(!this.visible) {
            this.jumpmap_camera.position.set(0, 0, this.maxZ)
            this.zoomed_in = false;
        }
    }
    /*
     *  Gets visibility status of jump map.
     */
    Jumpmap.prototype.isVisible = function() {
        return this.visible;
    }

    /*
     *  Update jumpmap animations when visible.
     */
    Jumpmap.prototype.updateJumpmap = function() {
        if(this.visible) {

            var out_factor = 0.075;
                in_factor = 0.1;
            if(!this.zoomed_in) {
                //z
                this.currentZ += out_factor * (this.maxZ - this.currentZ);

                //x
                this.currentX -= out_factor * this.currentX;

                //y
                this.currentY -= out_factor * this.currentY;
            } else {
                //z
                this.currentZ -= in_factor * (this.currentZ - this.minZ);

                //x
                this.currentX -= in_factor * (this.currentX - this.maxX);

                //y
                this.currentY -= in_factor * (this.currentY - this.maxY);
            }
            this.jumpmap_camera.position.set(this.currentX, this.currentY, this.currentZ);

            if(this.selected != null && !this.selected.isParent) {
                this.selected.rotation.y += 0.025;
                $('#jumpinfobox').fadeIn('fast');
                $('#jumpinfobox').html(this.selected.name);
                $('#jumpinfobox').css('left', this.mouse.x);
                $('#jumpinfobox').css('top', this.mouse.y);
            } else {
                $('#jumpinfobox').empty();
                $('#jumpinfobox').hide();
            }

            for(var i = 0; i < this.suns.length; i++) {
                this.suns[i].rotation.y += 0.005;
            }
                
            if(this.show_stats) {
                this.stats.update();
            }

            this.renderer.clear();
            this.composer.render(0.01);
        }
    }
