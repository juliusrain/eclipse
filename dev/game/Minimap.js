

function Minimap() {

    this.minimapObjects = [];

    this.map_width;
    this.map_height;
    

    
    this.minimap_scene = new THREE.Scene();
    this.minimap_camera = new THREE.PerspectiveCamera(60, this.map_width/this.map_height, 0.1, 1000);
    
    
    
}

    Minimap.prototype.loadObjects = function() {
        
    }
    
