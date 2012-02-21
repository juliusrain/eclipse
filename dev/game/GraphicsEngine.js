//game engine

//contains HUD elements, updated by graphics engine (crosshairs, etc...)
var HUDElements = [];

/* Create and initialize Threejs elements.
 * Rendering will take place through this object (singleton?)
 */
function GraphicsEngine() {

    if(!Detector.webgl) Detector.addGetWebGLMessage();


    this.scene_loaded = false;
    this.isRunning = false;

    this.container = document.getElementById('main');
    //container
    this.canvas_width = parseInt($('#main').css('width'));
    this.canvas_height = parseInt($('#main').css('height'));



    //threejs scene elements for gameplay
    this.gameplay_scene = new THREE.Scene();
    this.gameplay_camera = new THREE.PerspectiveCamera(60, this.canvas_width/this.canvas_height, 0.1, 1e8);
    this.gameplay_scene.add(this.gameplay_camera);
    this.gameplay_controls = new THREE.FlyControls(this.gameplay_camera);
    this.gameplay_controls_factor = 1; //used to represent camera sensitivity, ends up being replaced by player ship's turnFactor param

    //this.gameplay_controls.dragToLook = true;

    //threejs scene elements for map overlay (jump map)
    this.map_scene = new THREE.Scene();
    this.map_camera = new THREE.PerspectiveCamera(60, this.canvas_width/this.canvas_height, 0.1, 1e7);

    //main renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canvas_width, this.canvas_height);
    this.renderer.autoClear = false;
    this.container.appendChild(this.renderer.domElement);


    //create minimap
    this.minimap = new Minimap(this.gameplay_camera);
    this.minimap.objectType = MINIMAP;
    HUDElements.push(this.minimap);


    /////////////////////////////////
    //stats (TEMPORARY) or can leave in as option
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild(this.stats.domElement);
    ///////////////////////////////////


///////////////////////////////////

//TEMPORARY event listenrs
    var self = this;
    var removed = false;
    //document.addEventListener('mousedown', onMouseDown, false);
    function onMouseDown(event) {
        if(!removed) {
            //self.removeSceneObject(sceneElements.AIShips[0]);
            //self.addExplosion(-10, 0, 0);
            self.gameplay_controls.dragToLook = false;
        } else {
            //self.addSceneObject(sceneElements.AIShips[0]);
            self.gameplay_controls.dragToLook = true;
        }
        removed = !removed;
    }
///////////////////////////////////////
}


////////////////////////////////

//TEMPORARY
                //for testing purposes, remove for final
                var tempMaterial = new THREE.MeshNormalMaterial({
                });

                var sphereGeometry = new THREE.SphereGeometry(10,10,10);
                var tempSphere1 = new THREE.Mesh(sphereGeometry, tempMaterial);
                    tempSphere2 = new THREE.Mesh(sphereGeometry, tempMaterial);
                tempSphere1.name = "sphere1";
                tempSphere2.name = "sphere2"

                var infinityreverse = false;
                var axishelper = new THREE.AxisHelper();

//////////////////////////////



    //resizing function for index.html
    GraphicsEngine.prototype.resizePlayWindow = function() {
        this.canvas_width = parseInt($('#main').css('width'));
        this.canvas_height = parseInt($('#main').css('height'));
        this.renderer.setSize(this.canvas_width, this.canvas_height);
        this.gameplay_camera.aspect = (this.canvas_width/this.canvas_height);
        this.gameplay_camera.updateProjectionMatrix();

        this.minimap.resizeMinimap();
    }


//=======================================================================
//==================== Loading Functions ===============================

    /*
     *   Input: Array of gameObjects following specified format.
     */
    GraphicsEngine.prototype.loadGameplayObjects = function(objects) {
/////////////////////////////
        //this.gameplay_scene.add(axishelper);
        this.gameplay_scene.add(tempSphere1);
        this.gameplay_scene.add(tempSphere2);

////////////////////////////

        this.scene_loaded = true;

        //for loading models
        var loader = new THREE.JSONLoader();
        var self = this;
        var gameObject;
        for(var i = 0; i < objects.length; i++) {
            gameObject = objects[i];
            switch(gameObject.type) {
                case SKYBOX: { //if skybox
                    loadSkybox(gameObject, this.gameplay_scene);
                    break;
                }

                case PLAYER_SHIP: {
                    loadShip(gameObject, this.gameplay_scene);
                    loadCrosshair(gameObject, this.gameplay_scene);
                    //loadRing(gameObject, this.gameplay_scene);
                    //set camera turning and movement speed based on main ship's parameters
                    this.gameplay_controls_factor = gameObject.gameParameters.engine.turnFactor;
                    this.gameplay_controls.movementSpeed = gameObject.gameParameters.engine.speed;
                    break;
                }

                case AI_SHIP: {
                    loadShip(gameObject, this.gameplay_scene);
                    break;
                }
            }
        }

        this.minimap.loadMinimap();

        function loadCrosshair(gameObject, scene) {
            var quad = new THREE.PlaneGeometry(2, 2),
                material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(gameObject.drawParameters.crosshair),
                    blending: THREE.AdditiveBlending,
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

        function loadRing(gameObject, scene) { //pass gameobject to define radius maybe?
            var ringGeometry = new THREE.Geometry(),
                vertexPosition,
                i;

            for(i = 0; i <= 360; i++) {
                vertexPosition = new THREE.Vector3(Math.cos(2 * Math.PI * i / 360), 0, Math.sin(2 * Math.PI * i / 360)); //replace 2 with radius
                ringGeometry.vertices.push(new THREE.Vertex(vertexPosition));
            }

            var ringMaterial = new THREE.LineBasicMaterial({
                    color: 0xeeeeee,
                    opacity: 0.9,
                    linewidth: 2
            }),
            ringLine = new THREE.Line(ringGeometry, ringMaterial);

            ringLine.scale.set(20, 20, 20);
            ringLine.name = "ship ring";
            ringLine.objectType = RING;
            scene.add(ringLine);
            HUDElements.push(ringLine);
        }

        /*
         *  Load skybox. (gameObject)
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
         *  Load ship. (gameObject)
         *
         */
        function loadShip(gameObject, scene) {
            var callback = function(geometry) {loadJSON(geometry, gameObject, scene)};
            loader.load(gameObject.drawParameters.geometry, callback);
        }

        /*
         *  Load model from JSON
         *      gameObject: gameObject to be loaded from model
         *      scene: scene to add model to
         *
         *  (used only for gameObjects)
         */
        function loadJSON(geometry, gameObject, scene) {

            var modelMesh = new THREE.Mesh(geometry, tempMaterial);//(geometry, new THREE.MeshFaceMaterial());
            modelMesh.useQuaternion = true;
            modelMesh.direction = new THREE.Vector3(0, 0, -1);
            modelMesh.name = gameObject.gameParameters.name;
            modelMesh.objectType = gameObject.type;

            switch(modelMesh.objectType) {
                case PLAYER_SHIP: {
                    modelMesh.gameParameters = gameObject.gameParameters;
                    modelMesh.drawParameters = gameObject.drawParameters;
                    //for 3rd person ship positioning
                    modelMesh.currentRoll = 0;
                    modelMesh.currentXOffset = 0;
                    modelMesh.currentYOffset = 0;

                    loadLasers(modelMesh, scene);
                    sceneElements.mainShip = modelMesh;

                    break;
                }
                case AI_SHIP: {
                    modelMesh.gameParameters = gameObject.gameParameters;
                    modelMesh.drawParameters = gameObject.drawParameters;
                    loadLasers(modelMesh, scene);
                    sceneElements.AIShips.push(modelMesh);
                    self.minimap.addMinimapObject(AI_SHIP)
                    break;
                }
            }

            modelMesh.position.set(modelMesh.drawParameters.position.x, modelMesh.drawParameters.position.y, modelMesh.drawParameters.position.z);
            scene.add(modelMesh);
        }

        /*
         *  Creates lasers for a given ship (sceneObject).
         *      parentShip: sceneObject that represents parent ship that lasers belong to
         *      scene: scene to add lasers to
         */
        function loadLasers(parentShip, scene) { //called after initial parent JSON has been loaded, where parentShip is sceneObject
            var laserContainer = new THREE.Object3D(),
                callback = function(geometry) {loadJSONLasers(geometry, parentShip, laserContainer)};

            loader.load(parentShip.drawParameters.laserModel, callback);

            parentShip.lasers = laserContainer; //assign pointer from parent ship to its lasers'
            laserContainer.name = parentShip.gameParameters.name + " " + "lasers";
            laserContainer.parentShip = parentShip.drawParameters.shipID;
            sceneElements.lasers.push(laserContainer);
            scene.add(laserContainer);

        }

        /*
         *  Creates mesh based on model, fills in parameters based on parentShip's parameters,
         *  fills in parameters necessary for drawing and computations, and populates container.
         *  (called by loadLasers only)
         *      parentShip: sceneObject representing parent ship the lasers belong to
         *      laserContainer: Object3D to hold individual lasers
         */
        function loadJSONLasers(geometry, parentShip, laserContainer) {
            var laserMesh;
            var i;
            for(i = 0; i < parentShip.gameParameters.weapons.lasers.amount; i++) {
                laserMesh = new THREE.Mesh(geometry, tempMaterial);
                laserMesh.type = parentShip.gameParameters.weapons.lasers.type;
                laserMesh.damage = parentShip.gameParameters.weapons.lasers.damage;
                laserMesh.range = parentShip.gameParameters.weapons.lasers.range;
                laserMesh.speed = parentShip.gameParameters.weapons.lasers.speed;
                laserMesh.parentShip = parentShip.drawParameters.shipID;

                laserMesh.useQuaternion = true;
                laserMesh.fired = false;
                laserMesh.currentDistance = 0;
                laserMesh.direction = new THREE.Vector3();
                //laserMesh.visible = false;

                laserContainer.add(laserMesh);
            }
        }
    }

    /*
     *  Delete everything in the scene.
     *  TODO deallocate textures, remove from scenelements/hudelements arrays
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

        sceneElements.mainShip = null;
        for(i = sceneElements.AIShips.length; i > 0; i--) {
            delete sceneElements.AIShips[i];
            sceneElements.AIShips.length--;
        }
        for(i = sceneElements.env_objects.length; i > 0; i--) {
            delete sceneElements.env_objects[i];
            sceneElements.env_objects.length--;
        }
        for(i = sceneElements.explosions.length; i > 0; i--) {
            delete sceneElements.explosions[i];
            sceneElements.explosions.length--;
        }
        for(i = sceneElements.lasers.length; i > 0; i--) {
            delete sceneElements.lasers[i];
            sceneElements.lasers.length--;
        }
        for(i = sceneElements.missiles.length; i > 0; i--) {
            delete sceneElements.missiles[i];
            sceneElements.missiles.length--;
        }


        this.scene_loaded = false;
    }

//=================================================================
//================= Scene manipulation functions ==================
//adding/removing stuff after it's been created

    //TODO deallocate from memory
    GraphicsEngine.prototype.removeSceneObject = function(sceneObject) { //still have to consider removing from memory and SceneElements arrays
        this.gameplay_scene.remove(sceneObject);
    }


    //TODO change to take gameObject
    GraphicsEngine.prototype.addSceneObject = function(sceneObject) {
        this.gameplay_scene.add(sceneObject);
    }

    //TODO: NEED TO FIX THIS UP
    GraphicsEngine.prototype.addExplosion = function(x, y, z) { //plus other vars
        //will need multiple systems for the different textures
        var container = new THREE.Object3D();
        container.name = "ps";

        var geometry1 = new THREE.Geometry();
        var particleMaterial1, particleSystem1;
        var particlePosition;
        var i;
        for(i = 0; i < 100; i++) {
            particlePosition = new THREE.Vector3(0, 0, 0);
            geometry1.vertices.push(new THREE.Vertex(particlePosition));
            geometry1.vertices[i].direction = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            geometry1.vertices[i].speed = Math.random() * 10;
        }

        particleMaterial1 = new THREE.ParticleBasicMaterial({
            color: 0xff0000,
            size: 100,

        });

        particleSystem1 = new THREE.ParticleSystem(geometry1, particleMaterial1);
        particleSystem1.position.set(x, y, z);
        particleSystem1.name = "particle system1";

        container.add(particleSystem1);


        var geometry2 = new THREE.Geometry();
        var particleMaterial2, particleSystem2;
        for(i = 0; i < 50; i++) {
            particlePosition = new THREE.Vector3(0, 0, 0);
            geometry2.vertices.push(new THREE.Vertex(particlePosition));
        }
        particleMaterial2 = new THREE.ParticleBasicMaterial({
            color: 0x0000ff,
            size: 50
        });

        particleSystem2 = new THREE.ParticleSystem(geometry2, particleMaterial2);
        particleSystem2.position.set(x+60, y, z);
        particleSystem2.name = "particle system2";


        container.add(particleSystem2);

        sceneElements.explosions.push(container);
        this.gameplay_scene.add(container);
    }

//=================================================================


//=============================================================
//================== Rendering functions ======================


    GraphicsEngine.prototype.toggleCursor = function() {
        this.gameplay_controls.dragToLook = !this.gameplay_controls.dragToLook;
        console.log("blah");
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

    GraphicsEngine.prototype.stopEngine = function() {
        this.isRunning = false;
        console.log("stopping");
    }

    /*
     *  Start rendering
     *
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
           //try {
                render();
           //} catch(err) {
           //     console.warn("CAUGHT: " + err);
           //     return;
           //}
        }


        function render() { //can have a separate function to update scene
            self.gameplay_controls.update(self.gameplay_controls_factor);
            self.stats.update();

            if(self.getSceneStatus()) {
                updateMainShip();
                updateHUD(); //includes minimap

                //ai.updateScene(); //decides direction
                //gameEngine.updateScene(); //increment laser and ship position
                updateScene();
            }

            self.renderer.clear();
            self.renderer.render(self.gameplay_scene, self.gameplay_camera); //actual game scene
        }





        function initMathStructures() {
            tempVec = new THREE.Vector3();
            tempVecDir = new THREE.Vector3();
            tempVecForward = new THREE.Vector3(0, 0, -1); //don't overwrite
            tempVecUp = new THREE.Vector3(0, 1, 0); //don't overwrite
            tempQuat = new THREE.Quaternion();
            tempMat = new THREE.Matrix4();
        }


        var sceneObject, diff,
            maxRoll, negRoll,
            maxXOffset, maxYOffset, negX, negY;
        function updateMainShip() {
            sceneObject = sceneElements.mainShip;
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
            //tempVec.set(0, 0, -1);
            sceneObject.quaternion.multiplyVector3(tempVecForward, sceneObject.direction);

            //rotate ship based on roll
            tempQuat.setFromAxisAngle(tempVecForward, sceneObject.drawParameters.tiltRotationCurrent);
            sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

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
            sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

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

            sceneObject.translateZ(-70); //(distance from camera)
        }

        var HUDObject, i;
        function updateHUD() { //includes crosshair, ring around mainship to show other ships,
            //draw crosshair
            for(i = 0; i < HUDElements.length; i++) {
                HUDObject = HUDElements[i];
                switch(HUDElements[i].objectType) {
                    case CROSSHAIR: {
                        HUDObject.position.copy(self.gameplay_camera.position);
                        HUDObject.quaternion.copy(self.gameplay_camera.quaternion);
                        HUDObject.translateX(-self.gameplay_controls.rotationVector.y * 10);
//                         HUDObject.position.x = -gameControls.rotationVector.y * 0.1;
                        HUDObject.translateY(self.gameplay_controls.rotationVector.x * 10);
//                         HUDObject.position.y = gameControls.rotationVector.x * 0.1;
                        HUDObject.translateZ(-71);
                        break;
                    }
                    case RING: {
                        HUDObject.position.copy(sceneElements.mainShip.position);
                        break;
                    }
                    case MINIMAP: {
                        HUDObject.updateMinimap();
                        break;
                    }
                }
            }


        }



        //temporary
////////////////////////////////////////////////////////////////////////////////////////
        /*
         *  Function to update the objects in the scene (~= game engine for now)
         */
        function updateScene() {
            for(i = 0; i < self.gameplay_scene.objects.length; i++) {
                sceneObject = self.gameplay_scene.objects[i];
                switch(sceneObject.objectType) {
                    case AI_SHIP: {
                        // tempVecForward.set(0, 0, -1);
                        // tempVecUp.set(0, 1, 0);
                        switch(sceneObject.drawParameters.shipID) {
                            case 1: {

                                //TODO: NEED TO CONVERT THIS INTO aiTurn() function

                                //calculate object's current look direction
                                sceneObject.quaternion.multiplyVector3(tempVecForward, sceneObject.direction);
                                sceneObject.direction.normalize();

                                //multiply reference UP by quaternion to keep current UP
                                sceneObject.quaternion.multiplyVector3(tempVecUp, sceneObject.up);

                                //object's new look direction
                                tempVecDir.set(tempSphere1.position.x - sceneObject.position.x ,tempSphere1.position.y - sceneObject.position.y, tempSphere1.position.z - sceneObject.position.z);

                                //invert ship quaternion and apply to new look dir to get it in local coords
                                tempQuat.copy(sceneObject.quaternion).inverse();
                                tempQuat.multiplyVector3(tempVecDir, tempVec);
                                tempVec.normalize();

                                //set a rotation based on x offset of forward dir and new look dir (local coords)
                                tempQuat.setFromAxisAngle(tempVecForward, (Math.PI) * tempVec.x); //get max angle based on huy's direction vector

                                //look at new dir (world coords)
                                tempMat.lookAt(sceneObject.position, tempSphere1.position, sceneObject.up);
                                sceneObject.quaternion.setFromRotationMatrix(tempMat);

                                //apply turn rotation
                                sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

                                //go forward
                                sceneObject.translateZ(-4);
                                break;
                            }
                            case 2: {

                                //calculate object's current look direction
                                sceneObject.quaternion.multiplyVector3(tempVecForward, sceneObject.direction);
                                sceneObject.direction.normalize();

                                //multiply reference UP by quaternion to keep current UP
                                sceneObject.quaternion.multiplyVector3(tempVecUp, sceneObject.up);

                                //object's new look direction
                                tempVecDir.set(tempSphere2.position.x - sceneObject.position.x ,tempSphere2.position.y - sceneObject.position.y, tempSphere2.position.z - sceneObject.position.z);

                                //invert ship quaternion and apply to new look dir
                                tempQuat.copy(sceneObject.quaternion).inverse();
                                tempQuat.multiplyVector3(tempVecDir, tempVec);
                                tempVec.normalize();

                                //set a rotation based on x offset of forward dir and new look dir (local coords)
                                tempQuat.setFromAxisAngle(tempVecForward, (Math.PI) * tempVec.x);

                                //look at new dir (world coords)
                                tempMat.lookAt(sceneObject.position, tempSphere2.position, sceneObject.up);
                                sceneObject.quaternion.setFromRotationMatrix(tempMat);

                                //apply turn rotation
                                sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

                                //go forward
                                sceneObject.translateZ(-3);
                                break;
                            }
                        }

                        break;
                    }
                }

                var t = Date.now() * 0.0008;
                tempSphere1.position.x = 500*Math.cos(t)
                tempSphere1.position.y = -1000*Math.sin(t)
                tempSphere1.position.z = 800*Math.sin(t) - 400;

                tempSphere2.position.x = 400*Math.sin(t);
                tempSphere2.position.y = 500*Math.cos(t) + 150;
                tempSphere2.position.z = 600*Math.cos(t);

            }

            for(i = 0; i < sceneElements.explosions.length; i++) {
                sceneElements.explosions[i].position.x = 50*(i+1)*Math.cos(Date.now() * 0.005);
            }

        }
////////////////////////////////////////////////////////////////////////////////////////

    }
