//game engine

/* Create and initialize Threejs elements.
 * Rendering will take place through this object (singleton?)
 */
function GraphicsEngine() {

    if(!Detector.webgl) Detector.addGetWebGLMessage();

    this.gameplayObjects = []; //array of gameplay objects
    this.mapObjects = []; //array of objects for map overlay (jumping)

    //canvas dimensions
    this.canvas_width = window.innerWidth;
    this.canvas_height = window.innerHeight;

    //container
    this.container = document.createElement('game_div');
    document.body.appendChild(this.container);

    //threejs scene elements for gameplay
    this.gameplay_scene = new THREE.Scene();
    this.gameplay_camera = new THREE.PerspectiveCamera(40, this.canvas_width/this.canvas_height, 0.1, 1e7);
    this.gameplay_scene.add(this.gameplay_camera);
    this.gameplay_controls = new THREE.FlyControls(this.gameplay_camera);
    this.gameplay_controls_factor = 1; //used to represent camera sensitivity, ends up being replaced by player ship's turnFactor param
    this.gameplay_controls.dragToLook = true;////////////////////////////////

    //HUD elements (might not need this)
    this.overlay_scene = new THREE.Scene();
    this.overlay_camera = new THREE.PerspectiveCamera(40, this.canvas_width/this.canvas_height, 0.1, 1e7);
    this.overlay_scene.add(this.overlay_camera);

    //threejs scene elements for map overlay (jump map)
    this.map_scene = new THREE.Scene();
    this.map_camera = new THREE.PerspectiveCamera(45, this.canvas_width/this.canvas_height, 0.1, 1e7);

    //main renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canvas_width, this.canvas_height);
    this.renderer.autoClear = false;
    this.container.appendChild(this.renderer.domElement);


/////////////////////////////////
    //stats (TEMPORARY) or can leave in as option
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild(this.stats.domElement);
///////////////////////////////////

///////////////////////////////////

    window.addEventListener('resize', onWindowResize, false);

    var renderer = this.renderer,
        gameScene = this.gameplay_scene,
        gameCamera = this.gameplay_camera;


    function onWindowResize(event) {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        gameCamera.aspect = (width/height);
        gameCamera.updateProjectionMatrix();
    }
///////////////////////////////////////
}


////////////////////////////////
                //for testing purposes, remove for final
                var tempMaterial = new THREE.MeshNormalMaterial({
                });

                
                var sphereGeometry = new THREE.SphereGeometry(1,10,10);
                var tempSphere = new THREE.Mesh(sphereGeometry, tempMaterial);
                tempSphere.position.set(0,0,-100);

                var axishelper = new THREE.AxisHelper();
                

                
//////////////////////////////


//=======================================================================
//==================== Loading Functions ===============================

    /*
     *   Input: Array of gameObjects following specified format.
     */
    GraphicsEngine.prototype.loadGameplayObjects = function(objects) {

/////////////////////////////
       
        
        this.gameplay_scene.add(axishelper);
        this.gameplay_scene.add(tempSphere);

////////////////////////////


        this.gameplayObjects = objects;

        //for loading models
        var loader = new THREE.JSONLoader();

        var gameObject;
        var i;
        for(i = 0; i < this.gameplayObjects.length; i++) {
            gameObject = this.gameplayObjects[i];
            switch(gameObject.type) {
                case SKYBOX: { //if skybox
                    loadSkybox(gameObject, this.gameplay_scene);
                    break;
                }

                case PLAYER_SHIP: {
                    loadShip(gameObject, this.gameplay_scene);
                    loadCrosshair(gameObject, this.gameplay_scene);
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

        function loadCrosshair(gameObject, scene) {
            var quad = new THREE.PlaneGeometry(0.02,0.02),
                material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(gameObject.drawParameters.crosshair),
                    blending: THREE.AdditiveBlending,
                    transparent: true
                });
            var quadMesh = new THREE.Mesh(quad, material);
            quadMesh.useQuaternion = true;
            quadMesh.objectType = CROSSHAIR;
            quadMesh.name = "crosshair";
            quadMesh.position.set(0, 0, -1);
            HUDElements.push(quadMesh);
            scene.add(quadMesh);
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
            skyboxMesh.objectType = gameObject.type;  //assign object type so updateScene function knows what it is
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
                    loadLasers(modelMesh, scene);
                    sceneElements.mainShip.push(modelMesh);
                    break;
                }
                case AI_SHIP: {
                    modelMesh.gameParameters = gameObject.gameParameters;
                    modelMesh.drawParameters = gameObject.drawParameters;
                    loadLasers(modelMesh, scene);
                    sceneElements.AIShips.push(modelMesh);
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
            var laserContainer = new THREE.Object3D();
                callback = function(geometry) {loadJSONLasers(geometry, parentShip, laserContainer)};

            loader.load(parentShip.drawParameters.laserModel, callback);

            //laserContainer.parentShip = parentShip; //assign pointer from lasers to its parent ship
            parentShip.lasers = laserContainer; //assign pointer from parent ship to its lasers'
            laserContainer.name = parentShip.gameParameters.name + " " + "lasers";
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

                laserMesh.useQuaternion = true;
                laserMesh.fired = false;
                laserMesh.currentDistance = 0;
                laserMesh.direction = new THREE.Vector3();

                laserContainer.add(laserMesh);
            }

        }
    }

//=================================================================
//================= Scene manipulation functions ==================

    GraphicsEngine.prototype.removeSceneObject = function(sceneObject) {
        this.gameplay_scene.remove(sceneObject);
    }

    GraphicsEngine.prototype.addSceneObject = function(sceneObject) {
        this.gameplay_scene.add(sceneObject);
    }



//=============================================================
//================== Rendering functions ======================
    /*
     *  Start rendering
     *
     */
    GraphicsEngine.prototype.startEngine = function() {
        var renderer = this.renderer,
            gameScene = this.gameplay_scene,
            gameCamera = this.gameplay_camera,
            gameControls = this.gameplay_controls,
            gameControls_factor = this.gameplay_controls_factor,
            overlayScene = this.overlay_scene,
            overlayCamera = this.overlay_camera,
            skyboxScene = this.skybox_scene,
            skyboxCamera = this.skybox_camera,
            stats = this.stats;

        animate();
        function render() { //can have a separate function to update scene
            gameControls.update(gameControls_factor); //change to ship's turnFactor later
            stats.update();

            updateScene();
            drawHUD();

            renderer.clear();
            renderer.render(gameScene, gameCamera); //actual game scene
            renderer.render(overlayScene, overlayCamera); //draw hud, crosshair, ring, etc...
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        /*
         *  Function to update the objects in the scene (~= game engine for now)
         */
        function updateScene() {
            var i;
            var sceneObject;
            for(i = 0; i < gameScene.objects.length; i++) {
                sceneObject = gameScene.objects[i];
                switch(sceneObject.objectType) {
                    case PLAYER_SHIP: {
                        //position ship according to camera position
                        sceneObject.position.copy(gameCamera.position);
                        //tilt left or right depending on roll
                        var diff;
                        if(gameControls.moveState.rollRight == 1) {
                            if(sceneObject.drawParameters.tiltRotationCurrent < sceneObject.drawParameters.tiltRotationMax) {
                                diff = sceneObject.drawParameters.tiltRotationMax - sceneObject.drawParameters.tiltRotationCurrent;
                                sceneObject.drawParameters.tiltRotationCurrent += 0.05 * diff;
                                if(sceneObject.drawParameters.tiltRotationCurrent > sceneObject.drawParameters.tiltRotationMax) {
                                    sceneObject.drawParameters.tiltRotationCurrent = sceneObject.drawParameters.tiltRotationMax;
                                }
                            }
                        }
                        if(gameControls.moveState.rollLeft == 1) {
                            if(sceneObject.drawParameters.tiltRotationCurrent > -sceneObject.drawParameters.tiltRotationMax) {
                                diff = sceneObject.drawParameters.tiltRotationMax + sceneObject.drawParameters.tiltRotationCurrent;
                                sceneObject.drawParameters.tiltRotationCurrent -= 0.05 * diff;
                                if(sceneObject.drawParameters.tiltRotationCurrent < -sceneObject.drawParameters.tiltRotationMax) {
                                    sceneObject.drawParameters.tiltRotationCurrent = -sceneObject.drawParameters.tiltRotationMax;
                                }
                            }
                        }
                        if(gameControls.moveState.rollRight == 0) {
                            if(sceneObject.drawParameters.tiltRotationCurrent > 0) {
                                diff =  sceneObject.drawParameters.tiltRotationMax - sceneObject.drawParameters.tiltRotationCurrent + 1;
                                sceneObject.drawParameters.tiltRotationCurrent -= 3/diff;
                                if( sceneObject.drawParameters.tiltRotationCurrent < 0) {
                                    sceneObject.drawParameters.tiltRotationCurrent = 0;
                                }
                            }
                        }
                        if(gameControls.moveState.rollLeft == 0) {
                            if(sceneObject.drawParameters.tiltRotationCurrent < 0) {
                                diff = sceneObject.drawParameters.tiltRotationMax + sceneObject.drawParameters.tiltRotationCurrent + 1;
                                sceneObject.drawParameters.tiltRotationCurrent += 3/diff;
                                if(sceneObject.drawParameters.tiltRotationCurrent > 0) {
                                    sceneObject.drawParameters.tiltRotationCurrent = 0;
                                }
                            }
                        }

                        //tilt left or right depending on turn
                        var tempVec = new THREE.Vector3(),
                            tempQuat = new THREE.Quaternion();
                        sceneObject.quaternion.copy(gameCamera.quaternion);
                        tempVec.set(0, 0,  sceneObject.drawParameters.tiltRotationCurrent);
                        tempQuat.setFromEuler(tempVec);
                        sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

                        tempVec.set(0, 0, -gameControls.rotationVector.x); //might not need to hard code 25
                        tempQuat.setFromEuler(tempVec);
                        sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

                        tempVec.set(0, 0, -gameControls.rotationVector.y * 25); //might not need to hard code 25
                        tempQuat.setFromEuler(tempVec);
                        sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

                        sceneObject.translateX(gameControls.rotationVector.y); //might not need to hardcode 2
                        sceneObject.translateY(-gameControls.rotationVector.x - 3); //ditto
                        sceneObject.translateZ(-15); //ditto
                        break;
                    }
                    case AI_SHIP: {
                    
                        var t = Date.now() * 0.0005;
                        tempSphere.position.x = 30*Math.cos(t);
                        tempSphere.position.y = 30*Math.sin(t);
                        
                        var tempVec = new THREE.Vector3().set(tempSphere.position.x - sceneObject.position.x, tempSphere.position.y - sceneObject.position.y, tempSphere.position.z - sceneObject.position.z);
                        
                        
                        var tempMat = new THREE.Matrix4();
                        tempMat.lookAt(sceneObject.position, tempSphere.position, sceneObject.up);
                        
                        var tempQuat = new THREE.Quaternion().setFromRotationMatrix(tempMat);
                        sceneObject.quaternion.copy(tempQuat);
                        
                        //sceneObject.quaternion.multiplyVector3(tempVec, sceneObject.direction);
                        //console.log(sceneObject.quaternion.w, sceneObject.quaternion.x, sceneObject.quaternion.y, sceneObject.quaternion.z);
                        //console.log(sceneObject.direction.x, sceneObject.direction.y, sceneObject.direction.z);
                        //console.log(tempVec.x, tempVec.y, tempVec.z);
                        //console.log(tempSphere.position.x, tempSphere.position.y, tempSphere.position.z);

                        break;
                    }
                }

            }

        }
        

        function drawHUD() { //includes crosshair, ring around mainship to show other ships,
            //draw crosshair
            var i;
            var HUDObject;
            for(i = 0; i < HUDElements.length; i++) {
                HUDObject = HUDElements[i];
                switch(HUDElements[i].objectType) {
                    case CROSSHAIR: {
                        var tempVec = new THREE.Vector3(),
                            tempQuat = new THREE.Quaternion();
                        HUDObject.position.copy(gameCamera.position);
                        HUDObject.quaternion.copy(gameCamera.quaternion);
                        HUDObject.translateX(-gameControls.rotationVector.y*0.05);
                        HUDObject.translateY(gameControls.rotationVector.x*0.05);
                        HUDObject.translateZ(-1);
                        break;
                    }
                }
            }
        }
    }
