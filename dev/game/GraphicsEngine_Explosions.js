
<script id="vertexshader" type="x-shader/x-vertex">

            attribute float angle;
            attribute float size;
            attribute vec3 customColor;
            attribute vec3 direction;
            attribute float time;

            varying vec3 vColor;
            varying float vAngle;
            varying float vTime;

            void main() {
                float newsize;
                vec3 nDirection = direction;
                vAngle = angle;
                vColor = customColor;
                vTime = time;
                nDirection = normalize(direction);
                mat3 trmat = mat3(  0.0, 0.0, 10.0*nDirection.x*time,
                                    0.0, 0.0, 10.0*nDirection.y*time,
                                    0.0, 0.0, 10.0*nDirection.z*time);
                vec3 newposition = position * trmat;
                vec4 mvPosition = modelViewMatrix * vec4(newposition, 1.0);
                newsize = size;
                //newsize = 1000.0 / newsize;
                gl_PointSize = newsize * (50.0 / length(mvPosition.xyz));
                gl_Position = projectionMatrix * mvPosition;
            }

        </script>


        <script id="fragmentshader" type="x-shader/x-fragment">

            uniform sampler2D texture;
            uniform  vec3 color;

            varying vec3 vColor;
            varying float vAngle;
            varying float vTime;

            void main() {
                float cosx, sinx;
                sinx = sin(vAngle);
                cosx = cos(vAngle);
                mat2 rotmat = mat2( cosx, -sinx,
                                    sinx, cosx);
                vec2 pc = (gl_PointCoord - vec2(0.5, 0.5)) * rotmat;
                pc += vec2(0.5, 0.5);
                vec4 c = vec4(color * vColor, 1.0 - vTime);
                gl_FragColor = c * texture2D(texture, pc);
            }

        </script>


GraphicsEngine.prototype.addExplosion = function(x, y, z) { //plus other vars
        //will need multiple systems for the different textures of explosion
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

        particleSystem1 = new THREE.ParticleSystem(geometry1, particleMaterial1);
        particleSystem1.position.set(x, y, z);
        particleSystem1.name = "particle system1";

        container.add(particleSystem1);


        var geometry2 = new THREE.Geometry();
        var particleMaterial2, particleSystem2;
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

        sceneElements.explosions.push(container);
        this.gameplay_scene.add(container);
    }