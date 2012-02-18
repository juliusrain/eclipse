
/*
 *  Created by Graphics Engine upon loading a scene.
 *
 *      renderer: graphics engine's main renderer.
 */

/*
 *  render to buffer, use as texture for quad, place quad in corner and add to graphics engine scene
 *  also add to HUDElements array
 *
 */


function Minimap(renderer) {

    this.minimapObjects = [];

    this.map_width;
    this.map_height;
    var halfWidth = this.map_width / 2,
        halfHeight = this.map_height / 2;

    this.minimap_scene = new THREE.Scene();
    //this.minimap_camera = new THREE.PerspectiveCamera(60, this.map_width/this.map_height, 0.1, 1000);
    this.minimap_camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, -1000, 1000);

    this.renderer = renderer;

    }

    Minimap.prototype.loadObjects = function() {

    }

    Minimap.prototype.drawMinimap() {

    }
