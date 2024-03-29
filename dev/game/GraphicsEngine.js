var HUDElements = [];
/*
 *  Create and initialize Threejs elements.
 *  Rendering will take place within 'this' object (singleton)
 */
function GraphicsEngine() {

    if(!Detector.webgl) Detector.addGetWebGLMessage();

    this.objID = 0; //used to assign id numbers to enemy ai to be drawn on minimap
    this.scene_loaded = false;
    this.isRunning = false;

    this.glow = false; //EXPERIMENTAL
    this.show_stats = false;

    //Get div for rendering
    this.container = document.getElementById('main');
    this.canvas_width = parseInt($('#main').css('width'));
    this.canvas_height = parseInt($('#main').css('height'));

    //MAIN THREEJS RENDERER
    //main renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canvas_width, this.canvas_height);
    this.renderer.autoClear = false;
    this.container.appendChild(this.renderer.domElement);

    //MAIN SCENE
    //threejs scene elements for gameplay
    this.gameplay_scene = new THREE.Scene();
    this.gameplay_camera = new THREE.PerspectiveCamera(60, this.canvas_width/this.canvas_height, 0.1, 1e8);
    this.gameplay_camera.direction = new THREE.Vector3(0, 0, -1);
    this.gameplay_scene.add(this.gameplay_camera);
    this.gameplay_controls = new THREE.FlyControls(this.gameplay_camera);
    this.gameplay_controls_factor = 1; //used to represent camera sensitivity, replaced by player ship's turnFactor parameter later in initialization

    //EXPERIMENTAL
    if(this.glow) {
        //GLOW SCENE
        //glow scene elements
        this.gameplay_glow_scene = new THREE.Scene();

        //antialiasing via shader
        this.effectFXAA = new THREE.ShaderPass(THREE.ShaderExtras["fxaa"]);
        this.effectFXAA.uniforms['resolution'].value.set(1/this.canvas_width, 1/this.canvas_height);

        //bloom shader
        var effectBloom = new THREE.BloomPass(10.0);

        var renderTargetParameters = {  minFilter: THREE.LinearFilter,
                                        magFilter: THREE.LinearFilter,
                                        format: THREE.RGBAFormat };

        //render glow scene to texture
        this.renderTargetGlow = new THREE.WebGLRenderTarget(this.canvas_width, this.canvas_height, renderTargetParameters);
        var renderModelGlow = new THREE.RenderPass(this.gameplay_glow_scene, this.gameplay_camera);

        //effect composer for fbo
        this.glow_composer = new THREE.EffectComposer(this.renderer, this.renderTargetGlow);
        this.glow_composer.addPass(renderModelGlow);
        this.glow_composer.addPass(effectBloom);

        blend_shader.uniforms['tGlow'].texture = this.glow_composer.renderTarget2;

        //render texture to screen with rest of scene (alpha blended)
        this.renderTargetScreen = new THREE.WebGLRenderTarget(this.canvas_width, this.canvas_height, renderTargetParameters);
        var renderModel = new THREE.RenderPass(this.gameplay_scene, this.gameplay_camera);
        var blend_pass = new THREE.ShaderPass(blend_shader);
        blend_pass.needsSwap = true;
        blend_pass.renderToScreen = true;

        //effect composer for screen rendering
        this.blend_composer = new THREE.EffectComposer(this.renderer, this.renderTargetScreen);
        this.blend_composer.addPass(renderModel);
        this.blend_composer.addPass(this.effectFXAA);
        this.blend_composer.addPass(blend_pass);
    }



    //create minimap
    this.minimap = new Minimap(this.gameplay_controls, this.gameplay_camera);
    this.minimap.objectType = MINIMAP;
    HUDElements.push(this.minimap);

    //creat jumpmap
    this.jumpmap = new Jumpmap();
    this.jumpmap.loadJumpmap();


    //internal function to dynamically assign IDs to renderable objects
    this.assignID = function() {
        var ret = this.objID;
        this.objID++;
        return ret;
    }


    if(this.show_stats) {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.container.appendChild(this.stats.domElement);
    }


}

    /*
     *  Resizing function.
     */
    GraphicsEngine.prototype.resizePlayWindow = function() {
        this.canvas_width = parseInt($('#main').css('width'));
        this.canvas_height = parseInt($('#main').css('height'));
        this.renderer.setSize(this.canvas_width, this.canvas_height);
        this.gameplay_camera.aspect = (this.canvas_width/this.canvas_height);
        this.gameplay_camera.updateProjectionMatrix();

        if(this.glow) {
            this.effectFXAA.uniforms['resolution'].value.set(1/this.canvas_width, 1/this.canvas_height);
            this.renderTargetGlow.width = this.canvas_width;
            this.renderTargetGlow.height = this.canvas_height;
            this.renderTargetScreen.width = this.canvas_width;
            this.renderTargetScreen.height = this.canvas_height;

            this.blend_composer.reset();
        }
        this.minimap.resizeMinimap();
    }


//=======================================================================
//==================== Loading Functions ===============================

    /*
     *  Input: Array of gameObjects following specified format.
     */
    GraphicsEngine.prototype.loadGameplayObjects = function(objects) {
        this.scene_loaded = true;

        //load models/game objects from 'objects' array passed into function
        var self = this;
        for(var i = 0; i < objects.length; i++) {
            self.addGameObject(objects[i]);
        }
        //populate minimap with appropriate objects
        this.minimap.loadMinimap();

        //add scene lights
        var dirlight2 = new THREE.DirectionalLight(0xaaaaaa);
        dirlight2.position.set(0, -500, 0).normalize();
        this.gameplay_scene.add(dirlight2);

        var dirlight3 = new THREE.DirectionalLight(0xaaaaaa);
        dirlight3.position.set(500, 0, 0).normalize();
        this.gameplay_scene.add(dirlight3);

        var dirlight4 = new THREE.DirectionalLight(0xaaaaaa);
        dirlight4.position.set(-500, 0, 0).normalize();
        this.gameplay_scene.add(dirlight4);

        var dirlight5 = new THREE.DirectionalLight(0xaaaaaa);
        dirlight5.position.set(0, 0, -500).normalize();
        this.gameplay_scene.add(dirlight5);

        var dirlight6 = new THREE.DirectionalLight(0xaaaaaa);
        dirlight6.position.set(0, 0, 500).normalize();
        this.gameplay_scene.add(dirlight6);

        var amblight = new THREE.AmbientLight(0xffffff);
        this.gameplay_scene.add(amblight);
    }

    /*
     *  Delete everything in the scene.
     */
    GraphicsEngine.prototype.deleteScene = function() {

        var sceneChildren = this.gameplay_scene.children,
            sceneChild,
            i = 0;

        //delete elements from gameplay_scene
        while(i < sceneChildren.length) {
            sceneChild = sceneChildren[i];
            if(sceneChild instanceof THREE.Camera) {
                i++;
                continue;
            }
            this.gameplay_scene.remove(sceneChild);
            this.renderer.deallocateObject(sceneChild);
        }
        if(this.glow) {
            //delete elements from gameplay_glow_scene
            sceneChildren = this.gameplay_glow_scene.children;
            i = 0;
            while(i < sceneChildren.length) {
                sceneChild = sceneChildren[i];
                if(sceneChild instanceof THREE.Camera) {
                    i++;
                    continue;
                }
                this.gameplay_glow_scene.remove(sceneChild);
                this.renderer.deallocateObject(sceneChild);
            }
        }

        //reset minimap
        this.minimap.deleteMinimap();

        //clean sceneElements array
        sceneElements.mainShip = null;
        for(i = sceneElements.AIShips.length - 1; i >= 0; i--) {
            delete sceneElements.AIShips[i];
            sceneElements.AIShips.length--;
        }
        for(i = sceneElements.netShips.length - 1; i >= 0; i--) {
            delete sceneElements.netShips[i];
            sceneElements.netShips.length--;
        }
        for(i = sceneElements.env_objects.length - 1; i >= 0; i--) {
            delete sceneElements.env_objects[i];
            sceneElements.env_objects.length--;
        }
        for(i = sceneElements.explosions.length - 1; i >= 0; i--) {
            delete sceneElements.explosions[i];
            sceneElements.explosions.length--;
        }
        for(i = sceneElements.env_objects.length - 1; i >= 0; i--) {
            delete sceneElements.env_objects[i];
            sceneElements.env_objects.length--;
        }
        for(i = sceneElements.lasers.length - 1; i >= 0; i--) {
            delete sceneElements.lasers[i];
            sceneElements.lasers.length--;
        }
        for(i = sceneElements.missiles.length - 1; i >= 0; i--) {
            delete sceneElements.missiles[i];
            sceneElements.missiles.length--;
        }

        this.scene_loaded = false;
        this.objectCount = 0;
    }

//=================================================================
//================= Scene manipulation functions ==================

    /*
     *  Input: objectID of object to be removed.
     */
    GraphicsEngine.prototype.removeSceneObject = function(OID) {
        this.minimap.removeMinimapObject(OID);

        var target;
        for(var i = 0; i < this.gameplay_scene.children.length; i++) {
            target = this.gameplay_scene.children[i];
            //remove lasers
            if(target.objectID == OID) {
                if(target.lasers !== undefined) {
                    //remove lasers from scene
                    this.renderer.deallocateObject(target.lasers);
                    this.gameplay_scene.remove(target.lasers);
                    target.lasers = null;
                    //remove lasers from array
                    for(var j = 0; j < sceneElements.lasers.length; j++) {
                        if(sceneElements.lasers[j].parentID == target.objectID) {
                            delete sceneElements.lasers[j];
                            sceneElements.lasers.splice(j, 1);
                        }

                    }
                }

                //remove spheres
                if(target.spheres !== undefined) {
                    this.renderer.deallocateObject(target.spheres);
                    this.gameplay_scene.remove(target.spheres);
                    if(target.spheres.inner !== undefined) {
                        for(var j = 0; j < target.spheres.inner.length; j++) {
                            delete target.spheres.inner[j];
                            target.spheres.inner.splice(j, 1);
                        }
                    }
                    target.spheres = null;
                }

                //remove ship from scene
                this.renderer.deallocateObject(target);
                this.gameplay_scene.remove(target);

                //remove ship from array
                for(var j = 0; j < sceneElements.AIShips.length; j++) {
                    if(sceneElements.AIShips[j].objectID == target.objectID) {
                        delete sceneElements.AIShips[j];
                        sceneElements.AIShips.splice(j, 1);
                    }
                }
                for(var j = 0; j < sceneElements.netShips.length; j++) {
                    if(sceneElements.netShips[j].objectID == target.objectID) {
                        delete sceneElements.netShips[j];
                        sceneElements.netShips.splice(j, 1);
                    }
                }
            }

        }


        //remove object from glow scene if applicable 
        for(var i = 0; i < this.gameplay_glow_scene.children.length; i++) {
            target = this.gameplay_glow_scene.children[i];
            if(target.objectID == OID) {
                this.renderer.deallocateObject(target);
                this.gameplay_glow_scene.remove(target);
            }

        }

    }


    /*
     *  Add object to scene to be rendered. Format must follow specified JSON format.
     *  Input: gameObject following specified JSON format.
     */
    GraphicsEngine.prototype.addGameObject = function(gameObject) {
        var jloader = new THREE.JSONLoader();
        var self = this;

        switch(gameObject.type) {
            case SKYBOX: { //if skybox
                loadSkybox(gameObject, this.gameplay_scene);
                break;
            }
            case PLAYER_SHIP: {
                loadShip(gameObject, this.gameplay_scene);
                loadCrosshair(gameObject, this.gameplay_scene);

                //set camera turning and movement speed based on main ship's parameters
                this.gameplay_controls_factor = gameObject.gameParameters.engine.turnFactor;
                this.gameplay_controls.movementSpeed = gameObject.gameParameters.engine.speed;
                this.gameplay_controls.autoForward = true;
                break;
            }
            case AI_SHIP: {
                loadShip(gameObject, this.gameplay_scene);
                break;
            }
            case NET_SHIP: {
                loadShip(gameObject, this.gameplay_scene);
                break;
            }
            case ASTEROID_FIELD: {
                loadAsteroidField(gameObject, this.gameplay_scene);
                break;
            }
        }

        function loadCrosshair(gameObject, scene) {
            var quad = new THREE.PlaneGeometry(2, 2),
                material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(gameObject.drawParameters.crosshair),
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    transparent: true
                });
            var quadMesh = new THREE.Mesh(quad, material);
            quadMesh.useQuaternion = true;
            quadMesh.objectType = CROSSHAIR;
            quadMesh.name = "crosshair";
            quadMesh.currentXOffset = 0;
            quadMesh.currentYOffset = 0;
            HUDElements.push(quadMesh);
            scene.add(quadMesh);
        }

        /*
         *  Load skybox.
         */
        function loadSkybox(gameObject, scene) {
            var shader = THREE.ShaderUtils.lib["cube"];
            shader.uniforms["tCube"].texture = THREE.ImageUtils.loadTextureCube(gameObject.parameters.textures);
            var skyboxMaterial = new THREE.ShaderMaterial({
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,
                depthWrite: false
            });
            var skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(1e7, 1e7, 1e7), skyboxMaterial);
            skyboxMesh.flipSided = true;
            skyboxMesh.name = gameObject.parameters.name;
            skyboxMesh.objectType = gameObject.type;
            scene.add(skyboxMesh);
        }


        /*
         *  Load ship.
         */
        function loadShip(gameObject, scene) {
            var callback = function(geometry) {loadJSON(geometry, gameObject, scene)};
            jloader.load(gameObject.drawParameters.geometry, callback);
        }

        function loadAsteroidField(gameObject, scene) {
            var callback = function(geometry) {loadJSON(geometry, gameObject, scene)};
            jloader.load(gameObject.drawParameters.geometry, callback);
        }


        /*
         *  Load model from JSON
         *      gameObject: gameObject to be loaded from model
         *      scene: scene to add model to
         */
        var sg = new THREE.SphereGeometry(10, 3, 2);
        function loadJSON(geometry, gameObject, scene) {
            switch(gameObject.type) {
                case PLAYER_SHIP: {
                    if(gameEngine.player_state == null) {
                        gameEngine.player_state = gameObject.gameParameters;
                    }

                    var modelMesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());

                    //set mesh parameters
                    modelMesh.useQuaternion = true;
                    modelMesh.receiveShadow = true;
                    modelMesh.direction = new THREE.Vector3(0, 0, -1);
                    modelMesh.name = gameObject.gameParameters.name;
                    modelMesh.objectType = gameObject.type;
                    modelMesh.objectID = self.assignID();
                    if(self.glow) {
                        var modelMeshDark = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('temp/black.png'), ambient: 0xffffff, color: 0x000000}));
                        //sync positions/rotations of normal and dark meshes (for rendering object that occlude glow)
                        modelMeshDark.useQuaternion = true;
                        modelMeshDark.name = gameObject.gameParameters.name + " dark";
                        modelMeshDark.objectID = modelMesh.objectID;
                        modelMeshDark.position = modelMesh.position;
                        modelMeshDark.quaternion = modelMesh.quaternion;
                    }

                    modelMesh.gameParameters = gameObject.gameParameters;
                    modelMesh.drawParameters = gameObject.drawParameters;

                    //for 3rd person ship positioning
                    modelMesh.currentRoll = 0;
                    modelMesh.currentXOffset = 0;
                    modelMesh.currentYOffset = 0;

                    loadLasers(modelMesh, scene);
                    sceneElements.mainShip = modelMesh

                    //randomize starting position of main player upon initialization
                    self.gameplay_camera.position.set((Math.random()*3000+1000)*(1-Math.round(Math.random())*2), (Math.random()*3000+1000)*(1-Math.round(Math.random())*2), (Math.random()*3000+1000)*(1-Math.round(Math.random())*2));
                    scene.add(modelMesh);
                    if(self.glow) {
                        self.gameplay_glow_scene.add(modelMeshDark);
                    }

                    //create hit spheres for main player ship
                    var s = new THREE.Object3D();
                    s.useQuaternion = true;
                    s.position = modelMesh.position;
                    s.quaternion = modelMesh.quaternion;

                    //outer
                    var s0 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s0.tposition = new THREE.Vector3();
                    s0.scale.set(3, 3, 3);
                    s0.position.r = 30;
                    s0.tposition.r = 30;
                    s0.translateZ(5);
                    s0.material.wireframe = true;
                    s.add(s0);

                    //middle inner
                    var s1 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s1.tposition = new THREE.Vector3();
                    s1.translateZ(10);
                    s1.position.r = 10;
                    s1.tposition.r = 10;
                    s1.material.wireframe = true;
                    s.add(s1);

                    //left inner
                    var s2 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s2.tposition = new THREE.Vector3();
                    s2.scale.set(0.6, 0.6, 0.6);
                    s2.position.r = 6;
                    s2.tposition.r = 6;
                    s2.translateZ(12);
                    s2.translateX(-15);
                    s2.material.wireframe = true;
                    s.add(s2);

                    //right inner
                    var s3 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s3.tposition = new THREE.Vector3();
                    s3.scale.set(0.6, 0.6, 0.6);
                    s3.position.r = 6;
                    s3.tposition.r = 6;
                    s3.translateZ(12);
                    s3.translateX(15);
                    s3.material.wireframe = true;
                    s.add(s3);

                    //left inner far
                    var s4 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s4.tposition = new THREE.Vector3();
                    s4.scale.set(0.3, 0.3, 0.3);
                    s4.position.r = 3;
                    s4.tposition.r = 3;
                    s4.translateZ(14);
                    s4.translateX(-22);
                    s4.material.wireframe = true;
                    s.add(s4);

                    //right inner far
                    var s5 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s5.tposition = new THREE.Vector3();
                    s5.scale.set(0.3, 0.3, 0.3);
                    s5.position.r = 3;
                    s5.tposition.r = 3;
                    s5.translateZ(14);
                    s5.translateX(22);
                    s5.material.wireframe = true;
                    s.add(s5);

                    //inner middle close
                    var s6 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s6.tposition = new THREE.Vector3();
                    s6.scale.set(0.6, 0.6, 0.6);
                    s6.position.r = 6;
                    s6.tposition.r = 6;
                    s6.translateZ(-3);
                    s6.material.wireframe = true;
                    s.add(s6);

                    //inner middle mid
                    var s7 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s7.tposition = new THREE.Vector3();
                    s7.scale.set(0.4, 0.4, 0.4);
                    s7.position.r = 4;
                    s7.tposition.r = 4;
                    s7.translateZ(-12);
                    s7.material.wireframe = true;
                    s.add(s7);

                    //inner middle far
                    var s8 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s8.tposition = new THREE.Vector3();
                    s8.scale.set(0.3, 0.3, 0.3);
                    s8.position.r = 3;
                    s8.tposition.r = 3;
                    s8.translateZ(-20);
                    s8.material.wireframe = true;
                    s.add(s8);

                    modelMesh.spheres = s;
                        s.outer = s0;
                    s.inner = [s1, s2, s3, s4, s5, s6, s7, s8];

                    s.outer.visible = false;
                    for(var i = 0; i < s.inner.length; i++) {
                        s.inner[i].visible = false;
                    }

                    self.gameplay_scene.add(s);
                    break;
                }
                case AI_SHIP: {
                    var modelMesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());

                    //set mesh parameters
                    modelMesh.useQuaternion = true;
                    modelMesh.receiveShadow = true;
                    modelMesh.direction = new THREE.Vector3(0, 0, -1);
                    modelMesh.name = gameObject.gameParameters.name;
                    modelMesh.objectType = gameObject.type;
                    modelMesh.objectID = self.assignID();
                    if(self.glow) {
                        var modelMeshDark = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('temp/black.png'), ambient: 0xffffff, color: 0x000000}));
                        //sync positions/rotations of normal and dark meshes
                        modelMeshDark.useQuaternion = true;
                        modelMeshDark.name = gameObject.gameParameters.name + " dark";
                        modelMeshDark.objectID = modelMesh.objectID;
                        modelMeshDark.position = modelMesh.position;
                        modelMeshDark.quaternion = modelMesh.quaternion;
                    }

                    modelMesh.gameParameters = gameObject.gameParameters;
                    modelMesh.drawParameters = gameObject.drawParameters;
                    loadLasers(modelMesh, scene);

                    //objects used for ship transformations within 3D scene
                    modelMesh.tempDir = new THREE.Vector3(0, 0, 0);
                    modelMesh.targetPos = new THREE.Vector3(0, 0, 0);
                    modelMesh.tempQuat = new THREE.Quaternion();
                    modelMesh.tempMat = new THREE.Matrix4();
                    modelMesh.FORWARD = new THREE.Vector3(0, 0, -1);
                    modelMesh.UP = new THREE.Vector3(0, 1, 0);

                    var mesh = modelMesh;
                    modelMesh.turn = function(x, y, z) {

                        mesh.targetPos.set(x,y,z);
                         
                        //get new look direction vector
                        mesh.tempDir.set(x, y, z);

                        //copy inverse rotation and apply to direction to get new look in local coords
                        mesh.tempQuat.copy(mesh.quaternion).inverse();
                        mesh.tempQuat.multiplyVector3(mesh.tempDir, mesh.tempDir);
                        mesh.tempDir.normalize();

                        //calculate roll based on look dir and new dir (in local coords)
                        mesh.tempQuat.setFromAxisAngle(mesh.FORWARD, (Math.PI * 0.25) * mesh.tempDir.x);

                        //calculate new look quaternion in world coords
                        mesh.tempMat.lookAt(mesh.position, mesh.targetPos, mesh.up);
                        mesh.quaternion.setFromRotationMatrix(mesh.tempMat);

                        //apply roll calculated earlier
                        mesh.quaternion.multiplySelf(mesh.tempQuat);

                        //update look direction
                        mesh.quaternion.multiplyVector3(mesh.FORWARD, mesh.direction);

                        //update up direction
                        mesh.quaternion.multiplyVector3(mesh.UP, mesh.up);
                    }

                    sceneElements.AIShips.push(modelMesh);
                    self.minimap.addMinimapObject(AI_SHIP, modelMesh.objectID);

                    //set initial AI ship starting position
                    modelMesh.position.set(modelMesh.drawParameters.position.x, modelMesh.drawParameters.position.y, modelMesh.drawParameters.position.z);
                    scene.add(modelMesh);
                    if(self.glow) {
                        self.gameplay_glow_scene.add(modelMeshDark);
                    }

                    //create AI ship hit spheres
                    var s = new THREE.Object3D();
                    s.useQuaternion = true;
                    s.position = modelMesh.position;
                    s.quaternion = modelMesh.quaternion;

                    //outer
                    var s0 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s0.tposition = new THREE.Vector3();
                    s0.scale.set(3, 3, 3);
                    s0.position.r = 30;
                    s0.tposition.r = 30;
                    s0.translateZ(5);
                    s0.material.wireframe = true;
                    s0.useQuaternion = true;
                    s.add(s0);

                    //middle inner
                    var s1 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s1.tposition = new THREE.Vector3();
                    s1.translateZ(10);
                    s1.position.r = 10;
                    s1.tposition.r = 10;
                    s1.material.wireframe = true;
                    s1.useQuaternion = true;
                    s.add(s1);

                    //left inner
                    var s2 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s2.tposition = new THREE.Vector3();
                    s2.scale.set(0.6, 0.6, 0.6);
                    s2.position.r = 6;
                    s2.tposition.r = 6;
                    s2.translateZ(12);
                    s2.translateX(-15);
                    s2.material.wireframe = true;
                    s2.useQuaternion = true;
                    s.add(s2);

                    //right inner
                    var s3 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s3.tposition = new THREE.Vector3();
                    s3.scale.set(0.6, 0.6, 0.6);
                    s3.position.r = 6;
                    s3.tposition.r = 6;
                    s3.translateZ(12);
                    s3.translateX(15);
                    s3.material.wireframe = true;
                    s3.useQuaternion = true;
                    s.add(s3);

                    //left inner far
                    var s4 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s4.tposition = new THREE.Vector3();
                    s4.scale.set(0.3, 0.3, 0.3);
                    s4.position.r = 3;
                    s4.tposition.r = 3;
                    s4.translateZ(14);
                    s4.translateX(-22);
                    s4.material.wireframe = true;
                    s4.useQuaternion = true;
                    s.add(s4);

                    //right inner far
                    var s5 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s5.tposition = new THREE.Vector3();
                    s5.scale.set(0.3, 0.3, 0.3);
                    s5.position.r = 3;
                    s5.tposition.r = 3;
                    s5.translateZ(14);
                    s5.translateX(22);
                    s5.material.wireframe = true;
                    s5.useQuaternion = true;
                    s.add(s5);

                    //inner middle close
                    var s6 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s6.tposition = new THREE.Vector3();
                    s6.scale.set(0.6, 0.6, 0.6);
                    s6.position.r = 6;
                    s6.tposition.r = 6;
                    s6.translateZ(-3);
                    s6.material.wireframe = true;
                    s6.useQuaternion = true;
                    s.add(s6);

                    //inner middle mid
                    var s7 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s7.tposition = new THREE.Vector3();
                    s7.scale.set(0.4, 0.4, 0.4);
                    s7.position.r = 4;
                    s7.tposition.r = 4;
                    s7.translateZ(-12);
                    s7.material.wireframe = true;
                    s7.useQuaternion = true;
                    s.add(s7);

                    //inner middle far
                    var s8 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s8.tposition = new THREE.Vector3();
                    s8.scale.set(0.3, 0.3, 0.3);
                    s8.position.r = 3;
                    s8.tposition.r = 3;
                    s8.translateZ(-20);
                    s8.material.wireframe = true;
                    s8.useQuaternion = true;
                    s.add(s8);

                    modelMesh.spheres = s;
                    s.outer = s0;
                    s.inner = [s1, s2, s3, s4, s5, s6, s7, s8];

                    s.outer.visible = false;
                    for(var i = 0; i < s.inner.length; i++) {
                        s.inner[i].visible = false;
                    }

                    self.gameplay_scene.add(s);
                    break;
                }
                case NET_SHIP: {
                    var modelMesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());

                    //set mesh parameters
                    modelMesh.useQuaternion = true;
                    modelMesh.receiveShadow = true;
                    modelMesh.direction = new THREE.Vector3(0, 0, -1);
                    modelMesh.name = gameObject.gameParameters.name;
                    modelMesh.objectType = gameObject.type;
                    modelMesh.objectID = self.assignID();
                    if(self.glow) {
                        var modelMeshDark = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('temp/black.png'), ambient: 0xffffff, color: 0x000000}));
                        //sync positions/rotations of normal and dark meshes
                        modelMeshDark.useQuaternion = true;
                        modelMeshDark.name = gameObject.gameParameters.name + " dark";
                        modelMeshDark.objectID = modelMesh.objectID;
                        modelMeshDark.position = modelMesh.position;
                        modelMeshDark.quaternion = modelMesh.quaternion;
                    }

                    modelMesh.gameParameters = gameObject.gameParameters;
                    modelMesh.drawParameters = gameObject.drawParameters;
                    loadLasers(modelMesh, scene);

                    sceneElements.netShips.push(modelMesh);
                    self.minimap.addMinimapObject(NET_SHIP, modelMesh.objectID);

                    modelMesh.position.set(modelMesh.drawParameters.position.x, modelMesh.drawParameters.position.y, modelMesh.drawParameters.position.z);
                    scene.add(modelMesh);
                    if(self.glow) {
                        self.gameplay_glow_scene.add(modelMeshDark);
                    }

                    //create net ship hit spheres
                    var s = new THREE.Object3D();
                    s.useQuaternion = true;
                    s.position = modelMesh.position;
                    s.quaternion = modelMesh.quaternion;

                    //outer
                    var s0 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s0.tposition = new THREE.Vector3();
                    s0.scale.set(3, 3, 3);
                    s0.position.r = 30;
                    s0.tposition.r = 30;
                    s0.translateZ(5);
                    s0.material.wireframe = true;
                    s0.useQuaternion = true;
                    s.add(s0);

                    //middle inner
                    var s1 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s1.tposition = new THREE.Vector3();
                    s1.translateZ(10);
                    s1.position.r = 10;
                    s1.tposition.r = 10;
                    s1.material.wireframe = true;
                    s1.useQuaternion = true;
                    s.add(s1);

                    //left inner
                    var s2 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s2.tposition = new THREE.Vector3();
                    s2.scale.set(0.6, 0.6, 0.6);
                    s2.position.r = 6;
                    s2.tposition.r = 6;
                    s2.translateZ(12);
                    s2.translateX(-15);
                    s2.material.wireframe = true;
                    s2.useQuaternion = true;
                    s.add(s2);

                    //right inner
                    var s3 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s3.tposition = new THREE.Vector3();
                    s3.scale.set(0.6, 0.6, 0.6);
                    s3.position.r = 6;
                    s3.tposition.r = 6;
                    s3.translateZ(12);
                    s3.translateX(15);
                    s3.material.wireframe = true;
                    s3.useQuaternion = true;
                    s.add(s3);

                    //left inner far
                    var s4 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s4.tposition = new THREE.Vector3();
                    s4.scale.set(0.3, 0.3, 0.3);
                    s4.position.r = 3;
                    s4.tposition.r = 3;
                    s4.translateZ(14);
                    s4.translateX(-22);
                    s4.material.wireframe = true;
                    s4.useQuaternion = true;
                    s.add(s4);

                    //right inner far
                    var s5 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s5.tposition = new THREE.Vector3();
                    s5.scale.set(0.3, 0.3, 0.3);
                    s5.position.r = 3;
                    s5.tposition.r = 3;
                    s5.translateZ(14);
                    s5.translateX(22);
                    s5.material.wireframe = true;
                    s5.useQuaternion = true;
                    s.add(s5);

                    //inner middle close
                    var s6 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s6.tposition = new THREE.Vector3();
                    s6.scale.set(0.6, 0.6, 0.6);
                    s6.position.r = 6;
                    s6.tposition.r = 6;
                    s6.translateZ(-3);
                    s6.material.wireframe = true;
                    s6.useQuaternion = true;
                    s.add(s6);

                    //inner middle mid
                    var s7 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s7.tposition = new THREE.Vector3();
                    s7.scale.set(0.4, 0.4, 0.4);
                    s7.position.r = 4;
                    s7.tposition.r = 4;
                    s7.translateZ(-12);
                    s7.material.wireframe = true;
                    s7.useQuaternion = true;
                    s.add(s7);

                    //inner middle far
                    var s8 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                    s8.tposition = new THREE.Vector3();
                    s8.scale.set(0.3, 0.3, 0.3);
                    s8.position.r = 3;
                    s8.tposition.r = 3;
                    s8.translateZ(-20);
                    s8.material.wireframe = true;
                    s8.useQuaternion = true;
                    s.add(s8);

                    modelMesh.spheres = s;
                    s.outer = s0;
                    s.inner = [s1, s2, s3, s4, s5, s6, s7, s8];

                    s.outer.visible = false;
                    for(var i = 0; i < s.inner.length; i++) {
                        s.inner[i].visible = false;
                    }

                    self.gameplay_scene.add(s);
                    break;
                }
                case ASTEROID_FIELD: {
                    var asteroid_container = new THREE.Object3D();
                    asteroid_container.num_asteroids = gameObject.drawParameters.count;
                    asteroid_container.name = gameObject.gameParameters.name;
                    asteroid_container.objectType = gameObject.type;

                    var asteroid_mesh;
                    var s, s0, s1, s2, s3;
                    var merged_asteroids_geometry = new THREE.Geometry();
                    var merged_asteroids_mesh = new THREE.Object3D();
                    for(var i = 0; i < asteroid_container.num_asteroids; i++) {
                        asteroid_mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
                        asteroid_mesh.receiveShadow = true;
                        asteroid_mesh.useQuaternion = true;
                        asteroid_mesh.type = asteroid_container.objectType;
                        asteroid_mesh.objectID = self.assignID();

                        asteroid_mesh.position.set(gameObject.drawParameters.positions[i].x, gameObject.drawParameters.positions[i].y, gameObject.drawParameters.positions[i].z);
                        asteroid_mesh.quaternion.setFromEuler({x:gameObject.drawParameters.positions[i].rx, y:gameObject.drawParameters.positions[i].ry, z:gameObject.drawParameters.positions[i].rz});

                        s = new THREE.Object3D();
                        s.useQuaternion = true;
                        s.position = asteroid_mesh.position;
                        s.quaternion = asteroid_mesh.quaternion;

                        //hit spheres for each asteroid
                        //outer
                        s0 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                        s0.tposition = new THREE.Vector3();
                        s0.scale.set(4, 4, 4);
                        s0.position.r = 40;
                        s0.tposition.r = 40;
                        s0.translateX(10);
                        s0.translateZ(10);
                        s0.material.wireframe = true;
                        s0.visible = false;
                        s.add(s0);

                        s1 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                        s1.tposition = new THREE.Vector3();
                        s1.scale.set(3, 3, 3);
                        s1.position.r = 30;
                        s1.tposition.r = 30;
                        s1.translateX(10);
                        s1.translateY(5);
                        s1.translateZ(25);
                        s1.material.wireframe = true;
                        s1.visible = false;
                        s.add(s1);

                        s2 = new THREE.Mesh(sg, new THREE.MeshNormalMaterial());
                        s2.tposition = new THREE.Vector3();
                        s2.scale.set(3, 3, 3);
                        s2.position.r = 30;
                        s2.tposition.r = 30;
                        s2.translateX(3);
                        s2.translateY(-5);
                        s2.translateZ(-5);
                        s2.material.wireframe = true;
                        s2.visible = false;
                        s.add(s2);

                        asteroid_mesh.spheres = s;
                        s.outer = s0;
                        s.inner = [s1, s2];

                        asteroid_container.add(asteroid_mesh);
                        self.gameplay_scene.add(s);

                    }

                    sceneElements.env_objects.push(asteroid_container);
                    scene.add(asteroid_container);

                    break;
                }
            }

        }

        /*
         *  Creates lasers for a given ship (sceneObject).
         *      Input: parentShip: sceneObject that represents parent ship that lasers belong to
         *             scene: scene to add lasers to
         */
        function loadLasers(parentShip, scene) { //called after initial parent JSON has been loaded, where parentShip is sceneObject
            var callback = function(geometry) {loadJSONLasers(geometry, parentShip, scene)};
            jloader.load("models/lasers/lasertest.js", callback);
        }

        /*
         *  Creates mesh based on model, fills in parameters based on parentShip's parameters,
         *  fills in parameters necessary for drawing and computations, and populates container.
         *  (called by loadLasers only)
         *      Input: parentShip: sceneObject representing parent ship the lasers belong to
         *             laserContainer: Object3D to hold individual lasers
         */
        function loadJSONLasers(geometry, parentShip, scene) {
            var laserContainer = new THREE.Object3D();
            //when deleting, make sure to null pointers
            parentShip.lasers = laserContainer; //assign pointer from parent ship to its lasers'
            laserContainer.parentShip = parentShip;

            laserContainer.name = parentShip.gameParameters.name + " " + "lasers";
            laserContainer.parentID = parentShip.objectID;

            for(var i = 0; i < parentShip.gameParameters.weapons.lasers.amount; i++) {
                laserMesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
                laserMesh.overdraw = true;
                laserMesh.type = parentShip.gameParameters.weapons.lasers.type;
                laserMesh.damage = parentShip.gameParameters.weapons.lasers.damage;
                laserMesh.maxDistance = parentShip.gameParameters.weapons.lasers.range;
                laserMesh.speed = parentShip.gameParameters.weapons.lasers.speed;
                laserMesh.parentID = parentShip.objectID

                laserMesh.spheres = {outer: {x: 0,
                                             y: 0,
                                             z: 0,
                                             r: 10},
                                     inner: []
                }

                laserMesh.useQuaternion = true;
                laserMesh.fired = false;
                laserMesh.currentDistance = 0;
                laserMesh.visible = false;

                laserContainer.add(laserMesh);
            }

            sceneElements.lasers.push(laserContainer);
            if(self.glow) {
                self.gameplay_glow_scene.add(laserContainer);
            } else {
                scene.add(laserContainer);
            }

            //laser firing function to be called to fire laser for a given ship
            parentShip.fireLaser = function() {
                for(var i = 0; i < laserContainer.children.length; i++) {
                    if(!laserContainer.children[i].fired) {
                        laserContainer.children[i].fired = true;
                        laserContainer.children[i+1].fired = true;
                        laserContainer.children[i].currentDistance += 1;
                        laserContainer.children[i+1].currentDistance += 1;
                        laserContainer.children[i].visible = true;
                        laserContainer.children[i+1].visible = true;
                        break;
                    }
                }
            }

            var container = laserContainer;
            laserContainer.update = function() {
                for(var i = 0; i < container.children.length; i+=2) {
                    if(container.children[i].currentDistance >= container.children[i].maxDistance || container.children[i].hit) {
                        container.children[i].currentDistance = 0;
                        container.children[i+1].currentDistance = 0;
                        container.children[i].fired = false;
                        container.children[i+1].fired = false;
                        container.children[i].hit = false;
                        container.children[i+1].hit = false;
                        container.children[i].visible = false;
                        container.children[i+1].visible = false;
                    }
                    if(!container.children[i].fired) {
                        container.children[i].quaternion.copy(container.parentShip.quaternion);
                        container.children[i+1].quaternion.copy(container.parentShip.quaternion);

                        container.children[i].position.copy(container.parentShip.position);
                        container.children[i+1].position.copy(container.parentShip.position);

                        container.children[i].translateX(-10);
                        container.children[i+1].translateX(10);
                        container.children[i].translateZ(20);
                        container.children[i+1].translateZ(20);

                    } else {
                        container.children[i].translateZ(-container.children[i].speed);
                        container.children[i+1].translateZ(-container.children[i+1].speed);

                        container.children[i].currentDistance += 1;
                        container.children[i+1].currentDistance += 1;
                    }
                }
            }
        }
    }

    /* 
     *  Creates a large explosion used for ship explostions.
     *  Input: x, y, z coordinats.
     */
    GraphicsEngine.prototype.addExplosionLarge = function(x, y, z) {
        var e = new Explosion(x, y, z, this.gameplay_scene, this.renderer, EXPLOSION_LARGE);
        sceneElements.explosions.push(e);
    }

    /* 
     *  Creates a small explosion to be used for laser impacts.
     *  Input: x, y, z coordinats.
     */
    GraphicsEngine.prototype.addExplosionSmall = function(x, y, z) {
        var e = new Explosion(x, y, z, this.gameplay_scene, this.renderer, EXPLOSION_SMALL);
        sceneElements.explosions.push(e);
    }



//=================================================================


//=============================================================
//================== Rendering functions ======================


    /* 
     *  Toggles cursor on/off.
     */
    GraphicsEngine.prototype.toggleCursor = function(param) {
        if(typeof param == "boolean"){
            this.gameplay_controls.dragToLook = param;
        } else {
            this.gameplay_controls.dragToLook = !this.gameplay_controls.dragToLook;
        }
        console.log("mouse lock");
    }

    /*
     *  Check whether a scene is currently loaded.
     */
    GraphicsEngine.prototype.getSceneStatus = function() {
        return this.scene_loaded;
    }
    GraphicsEngine.prototype.getRunningStatus = function() {
        return this.isRunning;
    }

    /*
     *  Stops rendering.
     */
    GraphicsEngine.prototype.stopEngine = function() {
        this.isRunning = false;
        console.log("stopping");
    }

    /*
     *  Start rendering
     */
   GraphicsEngine.prototype.startEngine = function() {
        if(this.getRunningStatus()) {
            console.log("already running");
            return;
        } else {
            this.isRunning = true;
            console.log("starting");
        }
        var self = this,
            tempVec,
            tempQuat,
            tempMat,
            tempVecForward,
            tempVecUp,
            tempVecDir;

        initMathStructures();
        animate();

        function animate() {
            if(self.isRunning) {
                requestAnimationFrame(animate);
            } else {
                return;
            }

//            try {
                render();
//            } catch(err) {
//                console.warn("CAUGHT: " + err);
//                return;
//            }
        }


        function render() { //can have a separate function to update scene
            self.gameplay_controls.update(self.gameplay_controls_factor);
            if(this.show_stats) {
                self.stats.update();
            }

            if(self.getSceneStatus()) {
                //update main scene elements with respect to positions and animations
                updateMainShip();
                updateHUD(); //includes minimap
                ai.react();
                if(typeof gameEngine == "object" && typeof gameEngine.update == "function"){
                    gameEngine.update(); //increment laser and ship position
                }
                updateLasers();
                updateExplosions();

                //animate jumpmap
                if(self.jumpmap.isVisible) {
                    self.jumpmap.updateJumpmap();
                }

            }
            if(self.glow) {
                self.glow_composer.render();
                self.blend_composer.render();
            } else {
                self.renderer.clear();
                self.renderer.render(self.gameplay_scene, self.gameplay_camera); //actual game scene
            }
        }

        //initialize objects used for computing 3D transformations and rotations.
        function initMathStructures() {
            tempVec = new THREE.Vector3();
            tempVecDir = new THREE.Vector3();
            tempVecForward = new THREE.Vector3(0, 0, -1); //don't overwrite
            tempVecUp = new THREE.Vector3(0, 1, 0); //don't overwrite
            tempQuat = new THREE.Quaternion();
            tempMat = new THREE.Matrix4();
        }

        var sceneObject, diff, speed,
            maxRoll, negRoll,
            maxXOffset, maxYOffset, negX, negY;
        //update position of main player ship
        function updateMainShip() {
            sceneObject = sceneElements.mainShip;
            speed = sceneObject.gameParameters.engine.speed;
            if(self.gameplay_controls.moveState.forward == 1) {
                self.gameplay_controls.movementSpeed = speed * 1.5;
            } else {
                self.gameplay_controls.movementSpeed = speed;
            }
            sceneObject.position.copy(self.gameplay_camera.position);
            //tilt left or right depending on roll
            if(self.gameplay_controls.moveState.rollRight == 1) {
                if(sceneObject.drawParameters.tiltRotationCurrent < sceneObject.drawParameters.tiltRotationMax) {
                    diff = sceneObject.drawParameters.tiltRotationMax - sceneObject.drawParameters.tiltRotationCurrent;
                    sceneObject.drawParameters.tiltRotationCurrent += 0.05 * diff;
                    if(sceneObject.drawParameters.tiltRotationCurrent > sceneObject.drawParameters.tiltRotationMax) {
                        sceneObject.drawParameters.tiltRotationCurrent = sceneObject.drawParameters.tiltRotationMax;
                    }
                }
            }
            if(self.gameplay_controls.moveState.rollLeft == 1) {
                if(sceneObject.drawParameters.tiltRotationCurrent > -sceneObject.drawParameters.tiltRotationMax) {
                    diff = sceneObject.drawParameters.tiltRotationMax + sceneObject.drawParameters.tiltRotationCurrent;
                    sceneObject.drawParameters.tiltRotationCurrent -= 0.05 * diff;
                    if(sceneObject.drawParameters.tiltRotationCurrent < -sceneObject.drawParameters.tiltRotationMax) {
                        sceneObject.drawParameters.tiltRotationCurrent = -sceneObject.drawParameters.tiltRotationMax;
                    }
                }
            }
            if(self.gameplay_controls.moveState.rollRight == 0) {
                if(sceneObject.drawParameters.tiltRotationCurrent > 0) {
                    sceneObject.drawParameters.tiltRotationCurrent -= 0.05 * sceneObject.drawParameters.tiltRotationCurrent
                    if(sceneObject.drawParameters.tiltRotationCurrent < 0) {
                        sceneObject.drawParameters.tiltRotationCurrent = 0;
                    }
                }
            }
            if(self.gameplay_controls.moveState.rollLeft == 0) {
                if(sceneObject.drawParameters.tiltRotationCurrent < 0) {
                    sceneObject.drawParameters.tiltRotationCurrent -= 0.05 * sceneObject.drawParameters.tiltRotationCurrent
                    if(sceneObject.drawParameters.tiltRotationCurrent > 0) {
                        sceneObject.drawParameters.tiltRotationCurrent = 0;
                    }
                }
            }

            //tilt left or right depending on turn
            sceneObject.quaternion.copy(self.gameplay_camera.quaternion);

            //set ship direction
            sceneObject.quaternion.multiplyVector3(tempVecForward, sceneObject.direction);

            //rotate ship based on roll
            tempQuat.setFromAxisAngle(tempVecForward, sceneObject.drawParameters.tiltRotationCurrent);
            sceneObject.quaternion.multiplySelf(tempQuat);

            //rotate ship based on turn (delaying turns to smooth animation)
            maxRoll = -self.gameplay_controls.rotationVector.y * 0.45;
            diff = Math.abs(maxRoll - sceneObject.currentRoll);
            if(maxRoll < sceneObject.currentRoll) {
                sceneObject.currentRoll -= 0.045 * diff;
                if(sceneObject.currentRoll < maxRoll) sceneObject.currentRoll = maxRoll;
            } else {
                sceneObject.currentRoll += 0.045 * diff;
                if(sceneObject.currentRoll > maxRoll) sceneObject.currentRoll = maxRoll;
            }

            tempQuat.setFromAxisAngle(tempVecForward, sceneObject.currentRoll);
            sceneObject.quaternion.multiplySelf(tempQuat);

            //translate ship according to turn
            maxXOffset = self.gameplay_controls.rotationVector.y * 10;
            diff = Math.abs(maxXOffset - sceneObject.currentXOffset);
            if(maxXOffset < sceneObject.currentXOffset) {
                sceneObject.currentXOffset -= 0.05 * diff;
                if(sceneObject.currentXOffset < maxXOffset) sceneObject.currentXOffset = maxXOffset;
            } else {
                sceneObject.currentXOffset += 0.05 * diff;
                if(sceneObject.currentXOffset > maxXOffset) sceneObject.currentXOffset = maxXOffset;
            }
            sceneObject.translateX(sceneObject.currentXOffset);

            maxYOffset = -self.gameplay_controls.rotationVector.x * 5 - 20;
            diff = Math.abs(maxYOffset - sceneObject.currentYOffset);
            if(maxYOffset < sceneObject.currentYOffset) {
                sceneObject.currentYOffset -= 0.025 * diff;
                if(sceneObject.currentYOffset < maxYOffset) sceneObject.currentYOffset = maxYOffset;
            } else {
                sceneObject.currentYOffset += 0.025 * diff;
                if(sceneObject.currentYOffset > maxYOffset) sceneObject.currentYOffset = maxYOffset;
            }
            sceneObject.translateY(sceneObject.currentYOffset);

            sceneObject.translateZ(-95); //(distance from camera)
        }

        var HUDObject;
        //update HUD
        function updateHUD() { //includes crosshair, ring around mainship to show other ships,
            //draw crosshair
            for(var i = 0; i < HUDElements.length; i++) {
                HUDObject = HUDElements[i];
                switch(HUDElements[i].objectType) {
                    case CROSSHAIR: {
                        HUDObject.position.copy(self.gameplay_camera.position);
                        HUDObject.quaternion.copy(self.gameplay_camera.quaternion);
                        HUDObject.translateX(-self.gameplay_controls.rotationVector.y * 10);
                        HUDObject.translateY(self.gameplay_controls.rotationVector.x * 10);
                        HUDObject.translateZ(-100);
                        HUDObject.translateY(-2);
                        break;
                    }
                    case MINIMAP: {
                        HUDObject.updateMinimap();
                        break;
                    }
                }
            }
        }

        //update laser positions in scene if fired
        function updateLasers() {
            var sceneLasers = sceneElements.lasers;
            for(var i = 0; i < sceneLasers.length; i++) {
                sceneLasers[i].update();
            }
        }

        //update explosions in scene if any explosions are currently being rendered
        function updateExplosions() {
            for(var i = sceneElements.explosions.length - 1; i >= 0 && sceneElements.explosions[i] instanceof Explosion; i--) {
                sceneElements.explosions[i].updateExplosion();
                if(sceneElements.explosions[i].done) {
                    delete sceneElements.explosions[i];
                    sceneElements.explosions.splice(i, 1);
                }
            }
        }
    }
