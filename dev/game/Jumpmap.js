

function Jumpmap() {

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

    this.jumpmap_camera.position.z = this.maxZoomZ;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.autoClear = false;
    this.renderer.setSize(this.map_width, this.map_height);

    this.container.appendChild(this.renderer.domElement);

    //unique id's assigned to each system created
    this.ssID = 0;

    this.tempVec = new THREE.Vector3();
    this.ray = new THREE.Ray(this.jumpmap_camera.position);
    this.projector = new THREE.Projector();
    this.intersects;

    this.selected = null;

    //////////////
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild(this.stats.domElement);


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
    function onMouseDown(event) {
        self.mouse.x = event.clientX - self.container.offsetLeft;
        self.mouse.y = event.clientY - self.container.offsetTop;
        mouseX = ((event.clientX - self.container.offsetLeft) / self.map_width) * 2 - 1;
        mouseY = -((event.clientY - self.container.offsetTop) / self.map_height) * 2 + 1;
//            console.log(self.mouse.x, self.mouse.y);
      
        self.tempVec.set(mouseX, mouseY, 0.5);
        self.projector.unprojectVector(self.tempVec, self.jumpmap_camera);

        self.ray.direction.copy(self.tempVec.subSelf(self.jumpmap_camera.position).normalize());
        self.intersects = self.ray.intersectObjects(self.jumpmap_scene.children);
        if(self.intersects.length > 0) {
            self.zoomed_in = !self.zoomed_in;
//            console.log(self.zoomed_in);
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


    Jumpmap.prototype.loadJumpmap = function() {

        var sphereGeometry = new THREE.SphereGeometry(20, 20, 20);
        var mat = new THREE.MeshNormalMaterial();

        var ss, p;
        var system, planet;
        for(var i = 0; i < sector.length; i++) {
            ss = sector[i];
            system = new THREE.Mesh(sphereGeometry, mat);
            system.position.set(ss.x, ss.y, -100);
            system.scale.set(1.5, 1.5, 1.5);
            system.name = ss.name;
            system.systemID = this.assignID();
            system.isParent = true;
            this.jumpmap_scene.add(system);
            
            for(var j = 0; j < ss.planets.length; j++) {
                p = ss.planets[j];
                planet = new THREE.Mesh(sphereGeometry, mat);
                planet.position.set(system.position.x + p.x, system.position.y + p.y, system.position.z + p.z);
                planet.parentCoords = new THREE.Vector3(system.position.x, system.position.y, system.position.z);
                planet.scale.set(p.radius, p.radius, p.radius);
                planet.name = p.name;
                planet.parentID = system.systemID;
                planet.isParent = false;
                this.jumpmap_scene.add(planet);
            }

        }
    }

    Jumpmap.prototype.updateJumpmap = function() {

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

        if(this.selected != null) {
            this.selected.rotation.y += 0.025;
            $('#jumpinfobox').fadeIn('fast');
            $('#jumpinfobox').html(this.selected.name);
            $('#jumpinfobox').css('left', this.mouse.x);
            $('#jumpinfobox').css('top', this.mouse.y);
        } else {
            $('#jumpinfobox').empty();
            $('#jumpinfobox').hide();
        }

        this.stats.update();

        this.renderer.clear();
        this.renderer.render(this.jumpmap_scene, this.jumpmap_camera);


    }
