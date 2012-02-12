//game engine
var entities = {ships: []};
/*
 * Create and initialize Threejs elements.
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
    this.gameplay_camera = new THREE.PerspectiveCamera(45, this.canvas_width/this.canvas_height, 0.1, 1e7);
    this.gameplay_scene.add(this.gameplay_camera);
    this.gameplay_controls = new THREE.FlyControls(this.gameplay_camera);
    this.gameplay_controls_factor = 1; //used to represent camera sensitivity, ends up being replaced by player ship's turnFactor param

    this.overlay_scene = new THREE.Scene();
    this.overlay_camera = new THREE.PerspectiveCamera(45, this.canvas_width/this.canvas_height, 0.1, 1e7);
    this.overlay_scene.add(this.overlay_camera);


    //threejs scene elements for map overlay
    this.map_scene = new THREE.Scene();
    this.map_camera = new THREE.PerspectiveCamera(45, this.canvas_width/this.canvas_height, 0.1, 1e7);
/////////////////////////////////
    //stats (TEMPORARY) or can leave in as option
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild(this.stats.domElement);
///////////////////////////////////

    //main renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canvas_width, this.canvas_height);
    this.renderer.autoClear = false;
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    var width, height,
        renderer = this.renderer,
        gameCamera = this.gameplay_camera;
        overlayCamera = this.overlay_camera;

    function onWindowResize(event) {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        gameCamera.aspect = (width/height);
        gameCamera.updateProjectionMatrix();
        overlayCamera.aspect = (width/height);
        overlayCamera.updateProjectionMatrix();

    }

}


    //for private use
    var destroyObjects = function() {

    }


                //for testing purposes, remove for final
                var tempMaterial = new THREE.MeshNormalMaterial({
                });

                //--------------------------------------

//=======================================================================
//==================== Loading Functions ===============================

    /*
     *   Input: Array of gameObjects following specified format.
     */
    GraphicsEngine.prototype.loadGameplayObjects = function(objects) {

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

                case PLAYER_SHIP: { //if ship object
                    loadShip(gameObject, this.gameplay_scene, loader);
                    drawCrosshair(gameObject, this.overlay_scene);
                    this.gameplay_controls_factor = gameObject.gameParameters.engine.turnFactor;
                    break;
                }

                case AI_SHIP: { //if ship object
                    loadShip(gameObject, this.gameplay_scene, loader);
                    break;
                }
            }
        }

        function drawCrosshair(gameObject, scene) {
            var quad = new THREE.PlaneGeometry(0.025,0.025),
                material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("textures/crosshair/crosshair.png"),
                    blending: THREE.AdditiveBlending,
                    transparent: true
                });
            var quadMesh = new THREE.Mesh(quad, material);
            quadMesh.position.z = -1;
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
            skyboxMesh.objectType = gameObject.type;  //assign object type so updateScene function knows what it is
            scene.add(skyboxMesh);
        }

        /*
         *  Load ship.
         *
         */
        function loadShip(gameObject, scene, loader) {
            var callback = function(geometry) {loadJSON(geometry, gameObject, scene)};
            loader.load(gameObject.drawParameters.geometry, callback);
        }

        /*
         *  Load model from JSON
         *      objectType = 0 -> ship
         *      objectType = 1 -> env_object
         */
        function loadJSON(geometry, gameObject, scene) {

            var modelMesh = new THREE.Mesh(geometry, tempMaterial);//(geometry, new THREE.MeshFaceMaterial());
            modelMesh.useQuaternion = true;
            modelMesh.direction = new THREE.Vector3();
            modelMesh.name = gameObject.gameParameters.name;
            modelMesh.objectType = gameObject.type;
            if(gameObject.type == PLAYER_SHIP || gameObject.type == AI_SHIP) { //if ship, load ship-specific parameters
                //load game related parameters
                modelMesh.gameParameters = gameObject.gameParameters; //is this safe...?
//                 modelMesh.gameParameters.engine = { level: gameObject.gameParameters.engine.level,
//                                                     turnFactor: gameObject.gameParameters.engine.turnFactor
//                                                   };
//                 modelMesh.gameParameters.armor = {};
//                 modelMesh.health = gameObject.gameParameters.health;

                //load graphics/drawing related parameters
                modelMesh.drawParameters = gameObject.drawParameters; //safe...........?
//                 modelMesh.tiltRotationCurrent = gameObject.parameters.tiltRotationCurrent;
//                 modelMesh.tiltRotationMax = gameObject.parameters.tiltRotationMax;
            }
            scene.add(modelMesh);
	entities.ships.push(scene.objects[scene.objects.length-1]);
        }
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
//                         //position ship according to camera position
//                         sceneObject.position.copy(gameCamera.position);
//                         //tilt left or right depending on roll
//                         var diff;
//                         if(gameControls.moveState.rollRight == 1) {
//                             if(sceneObject.tiltRotationCurrent < sceneObject.tiltRotationMax) {
//                                 diff = sceneObject.tiltRotationMax - sceneObject.tiltRotationCurrent;
//                                 sceneObject.tiltRotationCurrent += 0.05 * diff;
//                                 if(sceneObject.tiltRotationCurrent > sceneObject.tiltRotationMax) {
//                                     sceneObject.tiltRotationCurrent = sceneObject.tiltRotationMax;
//                                 }
//                             }
//                         }
//                         if(gameControls.moveState.rollLeft == 1) {
//                             if(sceneObject.tiltRotationCurrent > -sceneObject.tiltRotationMax) {
//                                 diff = sceneObject.tiltRotationMax + sceneObject.tiltRotationCurrent;
//                                 sceneObject.tiltRotationCurrent -= 0.05 * diff;
//                                 if(sceneObject.tiltRotationCurrent < -sceneObject.tiltRotationMax) {
//                                     sceneObject.tiltRotationCurrent = -sceneObject.tiltRotationMax;
//                                 }
//                             }
//                         }
//                         if(gameControls.moveState.rollRight == 0) {
//                             if(sceneObject.tiltRotationCurrent > 0) {
//                                 diff =  sceneObject.tiltRotationMax - sceneObject.tiltRotationCurrent + 1;
//                                 sceneObject.tiltRotationCurrent -= 5/diff;
//                                 if( sceneObject.tiltRotationCurrent < 0) {
//                                     sceneObject.tiltRotationCurrent = 0;
//                                 }
//                             }
//                         }
//                         if(gameControls.moveState.rollLeft == 0) {
//                             if(sceneObject.tiltRotationCurrent < 0) {
//                                 diff = sceneObject.tiltRotationMax + sceneObject.tiltRotationCurrent + 1;
//                                 sceneObject.tiltRotationCurrent += 5/diff;
//                                 if(sceneObject.tiltRotationCurrent > 0) {
//                                     sceneObject.tiltRotationCurrent = 0;
//                                 }
//                             }
//                         }
//
//                         tilt left or right depending on turn
//                         var tempVec = new THREE.Vector3(),
//                             tempQuat = new THREE.Quaternion();
//                         sceneObject.quaternion.copy(gameCamera.quaternion);
//                         tempVec.set(0, 0,  sceneObject.tiltRotationCurrent);
//                         tempQuat.setFromEuler(tempVec);
//                         sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);
//
//                         tempVec.set(0, 0, -gameControls.rotationVector.x*gameControls.rotationVector.y * 25); //might not need to hard code 25
//                         tempQuat.setFromEuler(tempVec);
//                         sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);
//
//                         sceneObject.translateX(gameControls.rotationVector.y * 2); //might not need to hardcode 2
//                         sceneObject.translateY(-gameControls.rotationVector.x * 1.75 - 3); //ditto
//                         sceneObject.translateZ(-15); //ditto

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
                                sceneObject.drawParameters.tiltRotationCurrent -= 5/diff;
                                if( sceneObject.drawParameters.tiltRotationCurrent < 0) {
                                    sceneObject.drawParameters.tiltRotationCurrent = 0;
                                }
                            }
                        }
                        if(gameControls.moveState.rollLeft == 0) {
                            if(sceneObject.drawParameters.tiltRotationCurrent < 0) {
                                diff = sceneObject.drawParameters.tiltRotationMax + sceneObject.drawParameters.tiltRotationCurrent + 1;
                                sceneObject.drawParameters.tiltRotationCurrent += 5/diff;
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

                        tempVec.set(0, 0, -gameControls.rotationVector.x*gameControls.rotationVector.y * 25); //might not need to hard code 25
                        tempQuat.setFromEuler(tempVec);
                        sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

                        sceneObject.translateX(gameControls.rotationVector.y * 2); //might not need to hardcode 2
                        sceneObject.translateY(-gameControls.rotationVector.x * 1.75 - 3); //ditto
                        sceneObject.translateZ(-15); //ditto
                    }
                }
            }
        }


    }
