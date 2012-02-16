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
    // this.canvas_width = parseInt($('#middle').css('width'));
    // this.canvas_height = parseInt($('#middle').css('height'));

    //container
    this.container = document.createElement('game_div');
    document.body.appendChild(this.container);
    // this.container = document.getElementById('maindiv');

    //threejs scene elements for gameplay
    this.gameplay_scene = new THREE.Scene();
    this.gameplay_camera = new THREE.PerspectiveCamera(40, this.canvas_width/this.canvas_height, 0.1, 1e7);
    this.gameplay_scene.add(this.gameplay_camera);
    this.gameplay_controls = new THREE.FlyControls(this.gameplay_camera);
    this.gameplay_controls_factor = 1; //used to represent camera sensitivity, ends up being replaced by player ship's turnFactor param
    //this.gameplay_controls.dragToLook = true;

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

    var removed = false;

    document.addEventListener('mousedown', onMouseDown, false);

    function onMouseDown(event) {
        if(!removed) {
            engine.removeSceneObject(sceneElements.AIShips[0]);
            engine.addExplosion(-10, 0, 0);
        } else {
            engine.addSceneObject(sceneElements.AIShips[0]);
        }
        removed = !removed;
    }
///////////////////////////////////////
}


////////////////////////////////
                //for testing purposes, remove for final
                var tempMaterial = new THREE.MeshNormalMaterial({
                });

                var sphereGeometry = new THREE.SphereGeometry(1,10,10);
                var tempSphere1 = new THREE.Mesh(sphereGeometry, tempMaterial);
                    tempSphere2 = new THREE.Mesh(sphereGeometry, tempMaterial);
                tempSphere1.name = "sphere1";
                tempSphere2.name = "sphere2"

                var infinityreverse = false;
                var axishelper = new THREE.AxisHelper();

//////////////////////////////


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
                    loadRing(gameObject, this.gameplay_scene);
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
                    sceneElements.mainShip = modelMesh;
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
            //modelMesh.scale.set(10, 10, 10);
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
                //laserMesh.visible = false;

                laserContainer.add(laserMesh);
            }
        }
    }

//=================================================================
//================= Scene manipulation functions ==================

    GraphicsEngine.prototype.removeSceneObject = function(sceneObject) { //still have to consider removing from memory and SceneElements arrays
        this.gameplay_scene.remove(sceneObject);
    }

    GraphicsEngine.prototype.addSceneObject = function(sceneObject) {
        this.gameplay_scene.add(sceneObject);
    }

    //NEED TO FIX THIS UP
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

        var geometry2 = new THREE.Geometry();
        var particleMaterial2, particleSystem2;

        particleSystem1 = new THREE.ParticleSystem(geometry1, particleMaterial1);
        particleSystem1.position.set(x, y, z);
        particleSystem1.name = "particle system1";

        container.add(particleSystem1);

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

        this.gameplay_scene.add(container);
    }

//=================================================================


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
            stats = this.stats,

            tempVec,
            tempQuat,
            tempMat,
            tempVecForward,
            tempVecDir;


        init();
        animate();
        function render() { //can have a separate function to update scene
            gameControls.update(gameControls_factor);
            stats.update();

            drawMainShip();
            drawHUD();
            //updateScene();

            renderer.clear();
            renderer.render(gameScene, gameCamera); //actual game scene
            //renderer.render(overlayScene, overlayCamera); //draw hud, crosshair, ring, etc...
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        function init() {
            tempVec = new THREE.Vector3();
            tempVecDir = new THREE.Vector3();
            tempVecForward = new THREE.Vector3();
            tempQuat = new THREE.Quaternion();
            tempMat = new THREE.Matrix4();

        }


        var sceneObject,
            diff;
        function drawMainShip() {
            sceneObject = sceneElements.mainShip;
            sceneObject.position.copy(gameCamera.position);
            //tilt left or right depending on roll
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
                    sceneObject.drawParameters.tiltRotationCurrent -= 0.0035 * diff;
                    if( sceneObject.drawParameters.tiltRotationCurrent < 0) {
                        sceneObject.drawParameters.tiltRotationCurrent = 0;
                    }
                }
            }
            if(gameControls.moveState.rollLeft == 0) {
                if(sceneObject.drawParameters.tiltRotationCurrent < 0) {
                    diff = sceneObject.drawParameters.tiltRotationMax + sceneObject.drawParameters.tiltRotationCurrent + 1;
                    sceneObject.drawParameters.tiltRotationCurrent += 0.0035 * diff;
                    if(sceneObject.drawParameters.tiltRotationCurrent > 0) {
                        sceneObject.drawParameters.tiltRotationCurrent = 0;
                    }
                }
            }

            //tilt left or right depending on turn
            sceneObject.quaternion.copy(gameCamera.quaternion);

            tempVec.set(0, 0, -1);
            sceneObject.quaternion.multiplyVector3(tempVec, sceneObject.direction);

            tempQuat.setFromAxisAngle(tempVec, sceneObject.drawParameters.tiltRotationCurrent);
            sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

            tempQuat.setFromAxisAngle(tempVec, -gameControls.rotationVector.y * 0.35);
            sceneObject.quaternion.multiply(sceneObject.quaternion, tempQuat);

            sceneObject.translateX(gameControls.rotationVector.y); //might not need to hardcode 2
            sceneObject.translateY(-gameControls.rotationVector.x - 20); //ditto
            sceneObject.translateZ(-100); //ditto (distance from camera)
        }

        var HUDObject,
            i;
        function drawHUD() { //includes crosshair, ring around mainship to show other ships,
            //draw crosshair
            for(i = 0; i < HUDElements.length; i++) {
                HUDObject = HUDElements[i];
                switch(HUDElements[i].objectType) {
                    case CROSSHAIR: {
                        HUDObject.position.copy(gameCamera.position);
                        HUDObject.quaternion.copy(gameCamera.quaternion);
                        HUDObject.translateX(-gameControls.rotationVector.y*0.05);
                        HUDObject.translateY(gameControls.rotationVector.x*0.05);
                        HUDObject.translateZ(-1);
                        break;
                    }
                    case RING: {
                        HUDObject.position.copy(sceneElements.mainShip.position);
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
            for(i = 0; i < gameScene.objects.length; i++) {
                sceneObject = gameScene.objects[i];
                switch(sceneObject.objectType) {
                    case AI_SHIP: {
                        tempVecForward.set(0, 0, -1);
                        switch(sceneObject.drawParameters.shipID) {
                            case 0: {

                                //calculate object's current look direction
                                // sceneObject.quaternion.multiplyVector3(tempVecForward, sceneObject.direction);
                                // sceneObject.direction.normalize();

                                //object's new look direction
                                tempVecDir.set(tempSphere1.position.x - sceneObject.position.x ,tempSphere1.position.y - sceneObject.position.y, tempSphere1.position.z - sceneObject.position.z);

                                //invert ship quaternion and apply to new look dir
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
                                sceneObject.translateZ(-5);
                                break;
                            }
                            case 1: {

                                //calculate object's current look direction
                                // sceneObject.quaternion.multiplyVector3(tempVecForward, sceneObject.direction);
                                // sceneObject.direction.normalize();

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
                tempSphere1.position.x = 500*Math.cos(t);
                tempSphere1.position.y = 300*Math.cos(t);
                tempSphere1.position.z = 800*Math.sin(t) - 400;

                tempSphere2.position.x = 400*Math.sin(t);
                tempSphere2.position.y = 500*Math.cos(t) + 150;
                tempSphere2.position.z = 600*Math.cos(t);

            }

        }
////////////////////////////////////////////////////////////////////////////////////////


    }
