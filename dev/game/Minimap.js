
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




    this.map_width = parseInt($('#minibox').css('width'));
    this.map_height = parseInt($('#minibox').css('height'));

    this.container = document.getElementById('minibox');



    this.minimap_scene = new THREE.Scene(); //scene for texture
    this.minimap_camera = new THREE.PerspectiveCamera(60, this.map_width/this.map_height, 0.1, 1e5);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.autoClear = false;
    this.renderer.setSize(this.map_width, this.map_height);

    this.container.appendChild(this.renderer.domElement);

    init();

    var self = this;
    function init() {
        var plane_geometry = new THREE.PlaneGeometry(self.map_width, self.map_height);
        var material = new THREE.MeshNormalMaterial();
        var minimap_background = new THREE.Mesh(plane_geometry, material);

        self.minimap_scene.add(minimap_background);
    }

}


    Minimap.prototype.addMinimapObject = function() {

    }

    Minimap.prototype.removeMinimapObject = function() {


    }

    //for each ship in sceneElements array, draw ship based on its position
    Minimap.prototype.drawMinimap = function() {
        //render to texture and let graphics engine handle rendering to screen
        this.renderer.render(this.minimap_scene, this.minimap_camera);
    }


