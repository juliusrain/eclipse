
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

function Minimap(game_camera) {

    this.minimap_objects = [];

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

        drawCircles(this.minimap_texture_scene);
        drawShipIndicators(this.minimap_texture_scene);
        //draw on to quad


        //draw onto texture
        var plane_geometry = new THREE.PlaneGeometry(this.map_width, this.map_height);
        var sceneMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: this.minimap_texture});
        var quad = new THREE.Mesh(plane_geometry, sceneMaterial);
        quad.position.z = -500;

        this.minimap_scene.add(quad);



        function addLights(tex_scene) {
            var dirLight = new THREE.DirectionalLight(0xffffff);
            dirLight.position.z = -1;
            tex_scene.add(dirLight);
        }

        function drawCircles(scene) {
            var mergedCircles = new THREE.Object3D(),
                line_geometryH = new THREE.Geometry(),
                line_geometryVyz = new THREE.Geometry(),
                line_geometryVxy = new THREE.Geometry(),
                line_material = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    opacity: 0.5,
                }),
                pos;

            for(var i = 0; i <= 360; i++) {
                pos = new THREE.Vector3(Math.cos(2*Math.PI*i/360), 0, Math.sin(2*Math.PI*i/360));
                line_geometryH.vertices.push(new THREE.Vertex(pos));

                pos = new THREE.Vector3(0, Math.cos(2*Math.PI*i/360), Math.sin(2*Math.PI*i/360));
                line_geometryVyz.vertices.push(new THREE.Vertex(pos));

                pos = new THREE.Vector3(Math.cos(2*Math.PI*i/360), Math.sin(2*Math.PI*i/360), 0);
                line_geometryVxy.vertices.push(new THREE.Vertex(pos));

            }

            var circleH = new THREE.Line(line_geometryH, line_material);
            var circleHtop = new THREE.Line(line_geometryH, line_material);
            circleHtop.scale.set(Math.cos(Math.PI/4), Math.cos(Math.PI/4), Math.cos(Math.PI/4));
            circleHtop.position.y -= Math.sin(Math.PI/4);

            var circleHbottom = new THREE.Line(line_geometryH, line_material);
            circleHbottom.scale.set(Math.cos(Math.PI/4), Math.cos(Math.PI/4), Math.cos(Math.PI/4));
            circleHbottom.position.y += Math.sin(Math.PI/4);

            var circleVyz = new THREE.Line(line_geometryVyz, line_material);
            var circleVxy = new THREE.Line(line_geometryVxy, line_material);

            mergedCircles.add(circleH);
            mergedCircles.add(circleHtop);
            mergedCircles.add(circleHbottom);
            mergedCircles.add(circleVyz);
            mergedCircles.add(circleVxy);
            mergedCircles.useQuaternion = true;

            self.minimap_objects.push(mergedCircles);

            scene.add(mergedCircles);

        }

        function drawShipIndicators(scene) {

            console.log(sceneElements.AIShips.length);
            var vec,
                sprite;
            for(var i = 0; i < sceneElements.AIShips.length; i++) {
                console.log("vvdsv");
                sprite = new THREE.Srptie({
                    map: THREE.ImageUtils.loadTexture("textures/sprite0.png"),
                    useScreenCoordinates: false
                });
                scene.add(sprite);
            }
        }
    }

    Minimap.prototype.addMinimapObject = function() {

    }

    Minimap.prototype.removeMinimapObject = function() {


    }



    //for each ship in sceneElements array, draw ship based on its position
    Minimap.prototype.updateMinimap = function() {

//         this.stats.update();

        this.minimap_objects[0].quaternion.copy(this.game_camera.quaternion).inverse();


        this.renderer.clear();
        //render to texture
        this.renderer.render(this.minimap_texture_scene, this.minimap_texture_camera, this.minimap_texture, true);

        //render quad scene with texture applied
        this.renderer.render(this.minimap_scene, this.minimap_camera);

        var self = this;
        function update() {


        }
    }


