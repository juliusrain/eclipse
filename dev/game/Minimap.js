
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

function Minimap() {

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
    this.minimap_texture_camera = new THREE.PerspectiveCamera(60, this.map_width/this.map_height, 0.1, 1e5);
    this.minimap_texture_scene.add(this.minimap_texture_camera);

    this.minimap_texture = new THREE.WebGLRenderTarget(
        this.map_width, this.map_height,
        {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat}
    );


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
//         this.minimap_camera.aspect = this.map_width/this.map_height;
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

        //draw on to texture
//         var sphere_geometry = new THREE.SphereGeometry(20, 20, 20),
//             sphere_material = new THREE.MeshNormalMaterial(),
//             sphere = new THREE.Mesh(sphere_geometry, sphere_material);
//
//         sphere.position.z = -100;
//
//         this.minimap_texture_scene.add(sphere);

        var self = this;

        drawCircles(this.minimap_texture_scene);

        //draw on to quad


//        draw onto texture
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
            var line_geometry = new THREE.Geometry(),
                line_material = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    opacity: 0.75,
                    transparent: true
                }),
                pos;
            for(var i = 0; i <= 360; i++) {
                pos = new THREE.Vector3(Math.cos(2*Math.PI*i/360), 0, Math.sin(2*Math.PI*i/360));
                line_geometry.vertices.push(new THREE.Vertex(pos));
            }
            var circleH = new THREE.Line(line_geometry, line_material),
                circleV = new THREE.Line(line_geometry, line_material);

            //circleH.useQuaternion = true;
            //circleV.useQuaternion = true;
            self.minimap_objects.push(circleH);
            self.minimap_objects.push(circleV);

            circleV.rotation.z = Math.PI/2;

            scene.add(circleH);
            scene.add(circleV);

        }
    }

    Minimap.prototype.addMinimapObject = function() {

    }

    Minimap.prototype.removeMinimapObject = function() {


    }



    //for each ship in sceneElements array, draw ship based on its position
    Minimap.prototype.updateMinimap = function() {

//         this.stats.update();

        for(var i = 0; i < this.minimap_objects.length; i++) {

            this.minimap_objects[i].rotation.z += 0.05;
        }

        this.renderer.clear();
        //render to texture
        this.renderer.render(this.minimap_texture_scene, this.minimap_texture_camera, this.minimap_texture, true);

        //render quad scene with texture applied
        this.renderer.render(this.minimap_scene, this.minimap_camera);

        function update() {

        }
    }


