
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

    this.container = document.getElementById('minimap');

    this.map_width = parseInt($('#minimap').css('width'));
    this.map_height = parseInt($('#minimap').css('height'));

    var halfWidth = this.map_width / 2,
        halfHeight = this.map_height / 2;


    this.minimap_texture_scene = new THREE.Scene(); //scene for texture
    this.minimap_texture_camera = new THREE.PerspectiveCamera(60, this.map_width/this.map_height, 0.1, 1e5);
    this.minimap_texture_scene.add(this.minimap_texture_camera);

    this.minimap_scene = new THREE.Scene();
    this.minimap_camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, -1000, 1000);
    this.minimap_camera = new THREE.PerspectiveCamera(60, this.map_width/this.map_height, 0.1, 1e5);
    this.minimap_scene.add(this.minimap_camera);

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
        this.minimap_camera.aspect = this.map_width/this.map_height;
        this.minimap_camera.updateProjectionMatrix();
    }

    Minimap.prototype.loadMinimap = function() {
        var plane_geometry = new THREE.PlaneGeometry(this.map_width, this.map_height);
        var sphere_geometry = new THREE.SphereGeometry(20, 20, 20);
        var material = new THREE.MeshNormalMaterial();
        var minimap_background = new THREE.Mesh(plane_geometry, material);
        var sphere = new THREE.Mesh(sphere_geometry, material);
        sphere.position.z = -100;

        this.minimap_scene.add(sphere);
    }

    Minimap.prototype.addMinimapObject = function() {

    }

    Minimap.prototype.removeMinimapObject = function() {


    }



    //for each ship in sceneElements array, draw ship based on its position
    Minimap.prototype.updateMinimap = function() {

//         this.stats.update();




        this.renderer.clear();
        this.renderer.render(this.minimap_scene, this.minimap_camera);
    }


