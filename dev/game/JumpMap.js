

function JumpMap() {

    this.container = document.getElementById('jumpmapbox');

    this.map_width = parseInt($('#jumpmapbox').css('width'));
    this.map_height = parseInt($('#jumpmapbox').css('height'));

    this.jumpmap_scene = new THREE.Scene();
    this.jumpmap_camera = new THREE.PerspectiveCamera(60, this.map_width/this.map_height, 0.1, 1e5);

    this.jumpmap_scene.add(this.jumpmap_camera);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.autoClear = false;
    this.renderer.setSize(this.map_width, this.map_height);

    this.container.appendChild(this.renderer.domElement);


}

    JumpMap.prototype.loadJumpMap = function() {

        var sphereGeometry = new THREE.SphereGeometry(20, 20, 20);
        var sphere = new THREE.Mesh(sphereGeometry, new THREE.MeshNormalMaterial());
        this.jumpmap_scene.add(sphere);
        sphere.position.z = -100;

        var solar_system;
        for(var i = 0; i < sectorMap.length; i++) {
            solar_system = sectorMap[i];

        }
    }

    JumpMap.prototype.animate = function() {
        var self = this;
        animate();
        function animate() {
            requestAnimationFrame(animate);
            self.renderer.clear();
            self.renderer.render(self.jumpmap_scene, self.jumpmap_camera);
        }


    }