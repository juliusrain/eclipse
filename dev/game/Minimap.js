
/*
 *  Created by Graphics Engine upon loading a scene.
 *
 */

/*
 *  render to buffer, use as texture for quad,
 *
 *  draws based on contents of sceneElements array, uses graphics engine's renderer
 */

/*
 *
 */


function Minimap(game_controls, game_camera) {

    this.minimap_objects = [];
    this.minimap_grid = new THREE.Object3D();

    this.container = document.getElementById('minimap');

    this.map_width = parseInt($('#minimap').css('width'));
    this.map_height = parseInt($('#minimap').css('height'));

    var halfWidth = this.map_width / 2,
        halfHeight = this.map_height / 2;

    this.minimap_scene = new THREE.Scene();
    this.minimap_camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, -1000, 1000);
    //this.minimap_camera = new THREE.PerspectiveCamera(60, this.map_width/this.map_height, 0.1, 1e5);
    this.minimap_scene.add(this.minimap_camera);

    this.minimap_texture_scene = new THREE.Scene(); //scene for texture
    this.minimap_texture_camera = new THREE.PerspectiveCamera(15, this.map_width/this.map_height, 0.1, 1e5);
    this.minimap_texture_scene.add(this.minimap_texture_camera);

    this.minimap_texture = new THREE.WebGLRenderTarget(
        this.map_width, this.map_height,
        {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat}
    );

    this.game_controls = game_controls;
    this.game_camera = game_camera;

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.autoClear = false;
    this.renderer.setSize(this.map_width, this.map_height);

    this.container.appendChild(this.renderer.domElement);


/////////////////////////////
//     this.stats = new Stats();
//     this.stats.domElement.style.position = 'absolute';
//     this.stats.domElement.style.top = '0px';
//     this.container.appendChild(this.stats.domElement);
/////////////////////////////


    this.tempVec = new THREE.Vector3();
    this.tempVecForward = new THREE.Vector3(0, 0, -1);
    this.tempVecBackward = new THREE.Vector3(0, 0, 1);
    this.tempVecRight = new THREE.Vector3(1, 0, 0);
    this.tempVecUp = new THREE.Vector3(0, 1, 0);
    this.tempMat = new THREE.Matrix4();
    this.tempQuat = new THREE.Quaternion();

}

    Minimap.prototype.resizeMinimap = function() {
        this.map_width = this.container.clientWidth;
        this.map_height = this.container.clientHeight;
        this.renderer.setSize(this.map_width, this.map_height);

        this.minimap_camera.left = this.map_width / -2;
        this.minimap_camera.right = this.map_width / 2;
        this.minimap_camera.top = this.map_height / 2;
        this.minimap_camera.bottom = this.map_height / -2;
        this.minimap_camera.updateProjectionMatrix();

        this.minimap_texture_camera.aspect = this.map_width/this.map_height;
        this.minimap_texture_camera.updateProjectionMatrix();
    }


    Minimap.prototype.loadMinimap = function() {
        //addLights(this.minimap_texture_scene);

        this.minimap_texture_camera.position.z = 10;

        var self = this;

        drawCircle(this.minimap_texture_scene);


        //draw onto texture
        var plane_geometry = new THREE.PlaneGeometry(this.map_width, this.map_height);
        var sceneMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: this.minimap_texture});
        var quad = new THREE.Mesh(plane_geometry, sceneMaterial);
        quad.position.z = -500;

        this.minimap_scene.add(quad);


        function drawCircle(scene) { 
            var line_geometry = new THREE.Geometry();
            var line_material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                opacity: 0.5
            });

            var position;
            for(var i = 0; i <= 360; i++) {
                position = new THREE.Vector3(Math.cos(Math.PI*i/180), Math.sin(Math.PI*i/180), 0);
                line_geometry.vertices.push(new THREE.Vertex(position));
            }

            var circle = new THREE.Line(line_geometry, line_material);
            circle.name = "grid";

            scene.add(circle);
        }

        function addLights(tex_scene) {
            var dirLight = new THREE.DirectionalLight(0xffffff);
            dirLight.position.z = -1;
            tex_scene.add(dirLight);
        }

    }

    //takes constant representing what type of object to add
    Minimap.prototype.addMinimapObject = function(objectType, OID) {
        var minimap_object;
        switch(objectType) {
            case AI_SHIP: {
                minimap_object = new THREE.Sprite({
                    map: THREE.ImageUtils.loadTexture("textures/minimap/indicator_red.png"),
                    useScreenCoordinates: false,
                    scaleByViewport: true,
                    size: 10,
                    blending: THREE.AdditiveBlending,
                });
                minimap_object.objectType = AI_SHIP;
                minimap_object.objectID = OID;
                break;
             }
             case NET_SHIP: {
                 minimap_object = new THREE.Sprite({
                     map: THREE.ImageUtils.loadTexture("textures/minimap/indicator_red.png"),
                     useScreenCoordinates: false,
                     scaleByViewport: true,
                     size: 10,
                     blending: THREE.AdditiveBlending,
                 });
                 minimap_object.objectType = NET_SHIP;
                 minimap_object.objectID = OID;
                 break;
             }

        }
        this.minimap_texture_scene.add(minimap_object);
        this.minimap_objects.push(minimap_object);
    }

    Minimap.prototype.removeMinimapObject = function(objectID) {
        var target;
        //remove from scene
        for(var i = 0; i < this.minimap_texture_scene.children.length; i++) {
            target = this.minimap_texture_scene.children[i];
            if(objectID == target.objectID) {
                this.minimap_texture_scene.remove(target);
                this.renderer.deallocateObject(target);
                break;
            }
        }

        //remove from array
        for(var i = 0; i < this.minimap_objects.length; i++) {
            target = this.minimap_objects[i];
            if(target.objectID == objectID) {
                delete this.minimap_objects[i];
                this.minimap_objects.splice(i, 1);
            }

        }

    }


    //for each ship in sceneElements array, draw ship based on its position
    Minimap.prototype.updateMinimap = function() {

//         this.stats.update();
/*
        //take current quaternion, transform to reference, determine added rotation based on mouse along reference, apply added rotation to current
        this.tempQuat.copy(this.minimap_grid.quaternion).inverse();
        this.tempQuat.multiplyVector3(this.tempVecRight, this.tempVec);
        this.tempQuat.setFromAxisAngle(this.tempVec, this.game_controls.rotationVector.x*0.015);
        this.minimap_grid.quaternion.multiplySelf(this.tempQuat);

        this.tempQuat.copy(this.minimap_grid.quaternion).inverse();
        this.tempQuat.multiplyVector3(this.tempVecUp, this.tempVec);
        this.tempQuat.setFromAxisAngle(this.tempVec, -this.game_controls.rotationVector.y*0.015);
        this.minimap_grid.quaternion.multiplySelf(this.tempQuat);

        this.tempQuat.copy(this.minimap_grid.quaternion).inverse();
        this.tempQuat.multiplyVector3(this.tempVecBackward, this.tempVec);
        this.tempQuat.setFromAxisAngle(this.tempVec, this.game_controls.rotationVector.z*0.015);
        this.minimap_grid.quaternion.multiplySelf(this.tempQuat);
*/

        var self = this;
        update();

        this.renderer.clear();
        //render to texture
        this.renderer.render(this.minimap_texture_scene, this.minimap_texture_camera, this.minimap_texture, true);

        //render quad scene with texture applied
        this.renderer.render(this.minimap_scene, this.minimap_camera);


        function update() {
            var minimap_object, ship;
            //assumes that each ai ship has a corresponding object on minimap
            for(var i = 0; i < self.minimap_objects.length; i++) {
                minimap_object = self.minimap_objects[i];
                if(minimap_object.objectType == AI_SHIP) {
                    for(var j = 0; j < sceneElements.AIShips.length; j++) {
                        ship = sceneElements.AIShips[j];
                        if(ship.objectID == minimap_object.objectID) {
                            break;
                        }
                    }
                } else if(minimap_object.objectType == NET_SHIP) {
                    for(j = 0; j < sceneElements.netShips.length; j++) {
                        ship = sceneElements.netShips[j];
                        if(ship.objectID == minimap_object.objectID) {
                            break;
                        }
                    }
                }
                switch(minimap_object.objectType) {
                    case AI_SHIP: {
						if(typeof ship == 'undefined') {
							console.log('huzzah!');
						}
                        self.tempVec.set(ship.position.x - self.game_camera.position.x, ship.position.y - self.game_camera.position.y, ship.position.z - self.game_camera.position.z).normalize();
                        self.tempQuat.copy(self.game_camera.quaternion).inverse();
                        self.tempQuat.multiplyVector3(self.tempVec, self.tempVec);
                        
                        if(self.tempVec.z > 0) {
                            self.tempVec.z = 0;
                            self.tempVec.normalize();

                        }
                        minimap_object.position.set(self.tempVec.x, -self.tempVec.y, self.tempVec.z);
                    }
                    case NET_SHIP: {
                        self.tempVec.set(ship.position.x - self.game_camera.position.x, ship.position.y - self.game_camera.position.y, ship.position.z - self.game_camera.position.z).normalize();
                        self.tempQuat.copy(self.game_camera.quaternion).inverse();
                        self.tempQuat.multiplyVector3(self.tempVec, self.tempVec);
                        
                        if(self.tempVec.z > 0) {
                            self.tempVec.z = 0;
                            self.tempVec.normalize();

                        }
                        minimap_object.position.set(self.tempVec.x, -self.tempVec.y, self.tempVec.z);
                    }
                }
            }
        }
    }


