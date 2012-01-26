var container, camera, controls, scene, renderer;
var width = parseInt($('#middle').css('width')),//window.innerWidth,
	height = parseInt($('#middle').css('height'));//window.innerHeight;
var sphereGeometry, moonMesh, moonMaterial, moonRotation = 0.0, moonRev = 0.0, moonDist = 250;
var earthMesh, earthMaterial, earthRotation = 0.0;
var laserMesh, laserDir, laserDuration = 100; laserDist = 0;
var cubeGeometry, cubeMesh, cubeMaterial, cubeRot = 0, cubeRotMax = 25, diff;
var crosshairMesh;
var tiltLeft, tiltRight;
var skyboxTex, skybox, skyboxMateiral;
var dirLight1, dirLight2, ambLight;

var turnFactor = 2;

var INTERSECT;

var q1, q2, q3, d1, d2, d3, r1, r2;
var stats;

var vec, ray, intersects;
var cameraWorldCoords; 
var sphereWorldCoords;
var crosshairWorldCoords;
//var shipWorldCoords;

var pCount = 10000, pGeometry, pMaterial, particleSystem, tempPos, duration = 0; 


init();
animate();

function init() {
	if(!Detector.webgl) Detector.addGetWebGLMessage();		
	
	//window stuff
	//container = document.createElement('div');
	//document.body.appendChild(container);
	container = document.getElementById('maindiv');
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	renderer.setFaceCulling(0);
	renderer.sortObjects = false;
	renderer.autoClear = false;
	
	container.appendChild(renderer.domElement);					
	
	//scene
	scene = new THREE.Scene();

	
	//camera
	camera = new THREE.PerspectiveCamera(45.0, width/height, 0.1, 1e7);
	camera.position.set = (0, 0, 500);		
	
	//controls
	controls = new THREE.FlyControls(camera);
	//controls.dragToLook = true;
	controls.movementSpeed = 1.5;
	
	//geometries
	sphereGeometry = new THREE.SphereGeometry(100, 40, 40);
	cubeGeometry = new THREE.CubeGeometry(10, 10, 10);

	//earth
	earthMaterial = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("textures/planets/earth_atmos_2048.jpg")
	});
	earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
	earthMesh.position.z = -1000;
	earthMesh.rotation.z = 0.41;
	earthMesh.name = "earth";
	scene.add(earthMesh);	
	
	//moon
	moonMaterial = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("textures/planets/moon_1024.jpg")
	});
	moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
	moonMesh.scale.set(0.25, 0.25, 0.25);
	moonMesh.position.copy(earthMesh.position);
	moonMesh.name = "moon";
	scene.add(moonMesh);
	

	
	//ship
	cubeMaterial = new THREE.MeshLambertMaterial({
		color: 0x00ff00
	});
	cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cubeMesh.scale.set(0.2, 0.02, 0.2);
	cubeMesh.useQuaternion = true;
	cubeMesh.name = "ship";
	scene.add(cubeMesh);
	
	
	//crosshair
	crosshairMesh = new THREE.Mesh(sphereGeometry, cubeMaterial);
	crosshairMesh.scale.set(0.0005, 0.0005, 0.0005);
	crosshairMesh.useQuaternion = true;
	crosshairMesh.name = "crosshair";
	scene.add(crosshairMesh);
	
	//laser
	laserMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
	laserMesh.scale.set(0.05, 0.05, 1);
	laserMesh.useQuaternion = true;
	laserMesh.name = "laser";
	scene.add(laserMesh);
	
	//skybox
	skyboxTex = ["textures/cube/skybox/px.jpg", "textures/cube/skybox/nx.jpg", 
				 "textures/cube/skybox/py.jpg", "textures/cube/skybox/ny.jpg",
				 "textures/cube/skybox/pz.jpg", "textures/cube/skybox/nz.jpg"];
	cubeTex = THREE.ImageUtils.loadTextureCube(skyboxTex);

	var shader = THREE.ShaderUtils.lib["cube"];
	shader.uniforms["tCube"].texture = cubeTex;
	var skyboxMaterial = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false
	});
	skybox = new THREE.Mesh(new THREE.CubeGeometry(1000000, 1000000, 1000000), skyboxMaterial);
	skybox.flipSided = true;
	skybox.name = "skybox";
	scene.add(skybox);
	
	
	//lights
	dirLight1 = new THREE.DirectionalLight(0xffffff);
	dirLight1.position.set(1.0, 1.0, 1.0).normalize();
	scene.add(dirLight1);
	
	dirLight2 = new THREE.DirectionalLight(0xffffff);
	dirLight2.position.set(-1.0, 1.0, -1.0).normalize();
	scene.add(dirLight2);

	ambLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambLight);				

	//particle system
	pGeometry = new THREE.Geometry();
	for(var i = 0; i < pCount; i++) {
		//tempPos = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
		tempPos = new THREE.Vector3(0, 0, 0);
		pGeometry.vertices.push(new THREE.Vertex(tempPos));
		pGeometry.vertices[i].direction = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
		pGeometry.vertices[i].direction.normalize();
	}
	
	pMaterial = new THREE.ParticleBasicMaterial({
		color: 0x0000000,
		size: 5
	});
	
	particleSystem = new THREE.ParticleSystem(pGeometry, pMaterial);
	particleSystem.position.z = -1000;
	particleSystem.position.x = -1000;
	
	scene.add(particleSystem);
	


	//stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild(stats.domElement);

	//initize random stuff
	q1 = new THREE.Quaternion();
	q2 = new THREE.Quaternion();
	q3 = new THREE.Quaternion();
	r1 = new THREE.Vector3();
	r2 = new THREE.Vector3();
	vec = new THREE.Vector3();
	ray = new THREE.Ray();
	
	document.addEventListener('mousedown', onMouseLeftClick, false);
	document.addEventListener('keydown', onKeyPress, false);
	//window.addEventListener('resize', onWindowResize, false);
}

function onMouseLeftClick(event) {




}

function onKeyPress(event) {

	switch(event.keyCode) {
		case 32: {
			if(laserDist == 0) {
				
				laserMesh.quaternion = cubeMesh.quaternion;					
				laserMesh.position.x = cubeMesh.position.x;
				laserMesh.position.y = cubeMesh.position.y;
				laserMesh.position.z = cubeMesh.position.z;
				laserMesh.translateX(controls.rotationVector.y * 2);
				laserMesh.translateY(-controls.rotationVector.x * 1.75 - 2);
				laserMesh.translateZ(-20);
				laserDist += 1;

			}			
			break;				
		}
	
		case 67: {
		
			//console.log("laserMesh: " + laserMesh.position.x + " " + laserMesh.position.y + " " + laserMesh.position.z);
			//console.log("cubeMesh: " + cubeMesh.position.x + " " + cubeMesh.position.y + " " + cubeMesh.position.z);
			console.log("---------------------");
			sphereCoords = moonMesh.matrixWorld.getPosition();					
			console.log("moonMesh: " + moonMesh.position.x + " " + moonMesh.position.y + " " + moonMesh.position.z);
			console.log("moon world coords: " + sphereCoords.x + " " + sphereCoords.y + " " + sphereCoords.z);
			console.log("");
			
			cameraWorldCoords = camera.matrixWorld.getPosition();						
			console.log("camera: " + camera.position.x + " " + camera.position.y + " " + camera.position.z);
			console.log("camera world coords: " + cameraWorldCoords.x + " " + cameraWorldCoords.y + " " + cameraWorldCoords.z);						
			console.log("");
			
			crosshairWorldCoords = crosshairMesh.matrixWorld.getPosition();
			console.log("crosshair: " + crosshairMesh.position.x + " " + crosshairMesh.position.y + " " + crosshairMesh.position.z);						
			console.log("crosshair world coords: " + crosshairWorldCoords.x + " " + crosshairWorldCoords.y + " " + crosshairWorldCoords.z);
			console.log("---------------------");
			break;
		}

			
		case 86: {
			var i;
			
			crosshairWorldCoords = crosshairMesh.matrixWorld.getPosition();
			vec = new THREE.Vector3(crosshairWorldCoords.x, crosshairWorldCoords.y, crosshairWorldCoords.z);
			//vec = new THREE.Vector3(crosshairWorldCoords.x, crosshairWorldCoords.y, 1000000);
			
			var shipWorldCoords = cubeMesh.matrixWorld.getPosition();
			//console.log("ship: " + cubeMesh.position.x + " " + cubeMesh.position.y + " " + cubeMesh.position.z);						
			//console.log("ship world coords: " + shipWorldCoords.x + " " + shipWorldCoords.y + " " + shipWorldCoords.z);
			cameraWorldCoords = camera.matrixWorld.getPosition();						
			//console.log("camera: " + camera.position.x + " " + camera.position.y + " " + camera.position.z);
			//console.log("camera world coords: " + cameraWorldCoords.x + " " + cameraWorldCoords.y + " " + cameraWorldCoords.z);						

			ray = new THREE.Ray(camera.position, vec.subSelf(camera.position).normalize());
			//ray = new THREE.Ray(cubeMesh.position, vec.subSelf(cubeMesh.position).normalize());
			
			intersects = ray.intersectScene(scene);

			console.log(vec.x, vec.y, vec.z);
			console.log("---------------------------");
			if(intersects.length > 0) {
				for(i = 0; i < intersects.length; i++) {
					console.log("intersect " + i + ": " + intersects[i].object.name);
					console.log("distance to object: " + intersects[i].distance);
				}
			} else {
				console.log("no intersects");
			}
			console.log("---------------------------");
			break;
		}
		
		case 90: {
			for(var i = 0; i < scene.objects.length; i++) {
				if(scene.objects[i] != skybox) {
					scene.objects[i].material.wireframe = !scene.objects[i].material.wireframe;
				}
			}

		}

	}
	
}

function resizePlayWindow() {
	width = parseInt($('#middle').css('width'));
	height = parseInt($('#middle').css('height'));
	renderer.setSize(width, height);
	camera.aspect = (width/height);
	camera.updateProjectionMatrix();
}

function onWindowResize(event) {
	console.log("onWindowResize shouldn't happen, but it did!");
	width = window.innerWidth;
	height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = (width/height);
	camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame(animate);			
	render();
	stats.update(); 
}	

function render() {
	controls.update(turnFactor);
/*				
	for(var i = 0; i < pCount; i++) {
		pGeometry.vertices[i].position.x = Math.random() * 500 - 250;
		pGeometry.vertices[i].position.y = Math.random() * 500 - 250;
		pGeometry.vertices[i].position.z = Math.random() * 500 - 250;	
	}
*/		
	if(duration < 1000) {
		for(var i = 0; i < pCount; i++) {
			pGeometry.vertices[i].position.x += pGeometry.vertices[i].direction.x;
			pGeometry.vertices[i].position.y += pGeometry.vertices[i].direction.y; 
			pGeometry.vertices[i].position.z += pGeometry.vertices[i].direction.z;
		}
		duration++;
	} else {
		duration = 0;
		for(var i = 0; i < pCount; i++) {
			pGeometry.vertices[i].position.x = 0;
			pGeometry.vertices[i].position.y = 0;
			pGeometry.vertices[i].position.z = 0;
		}
	}

	particleSystem.geometry.__dirtyVertices = true;

	//earth rotation/positioning
	earthMesh.rotation.y = earthRotation%360;
	earthRotation += 0.0025;
	
	//moon rotation/revolution/positioning
	moonMesh.position.copy(earthMesh.position);
	moonMesh.position.x += moonDist*Math.cos(moonRev);			
	moonMesh.position.z += moonDist*Math.sin(moonRev);
	//moonMesh.rotation.y = moonRot%360;
	//moonRot += 0.005;
	moonRev += 0.005;
	
	//position crosshair
	crosshairMesh.quaternion = camera.quaternion;
	crosshairMesh.position.x = camera.position.x;
	crosshairMesh.position.y = camera.position.y;
	crosshairMesh.position.z = camera.position.z;
	//crosshairMesh.translateX(-controls.rotationVector.y * 2 * 80);
	//crosshairMesh.translateY(controls.rotationVector.x * 60);
	crosshairMesh.translateZ(-11);	
	
	
	//position ship
	cubeMesh.position.x = camera.position.x;
	cubeMesh.position.y = camera.position.y;
	cubeMesh.position.z = camera.position.z;

	//roll tilt
	if(controls.moveState.rollRight == 1) {
		if(cubeRot < cubeRotMax) {
			diff = cubeRotMax - cubeRot;
			cubeRot += 0.05 * diff;
			if(cubeRot > cubeRotMax) {
				cubeRot = cubeRotMax;
			}
		}
	}
	if(controls.moveState.rollLeft == 1) {
		if(cubeRot > -cubeRotMax) {
			diff = cubeRotMax + cubeRot;
			cubeRot -= 0.05 * diff;
			if(cubeRot < -cubeRotMax) {
				cubeRot = -cubeRotMax;
			}
		}
	}
	if(controls.moveState.rollRight == 0) {
		if(cubeRot > 0) {
			diff = cubeRotMax - cubeRot + 1;
			cubeRot -= 2/diff;
			if(cubeRot < 0) {
				cubeRot = 0;
			}
		}
	}
	if(controls.moveState.rollLeft == 0) {
		if(cubeRot < 0) {
			diff = cubeRotMax + cubeRot + 1;
			cubeRot += 2/diff;
			if(cubeRot > 0) {
				cubeRot = 0;
			}
		}
	}
	
	
	cubeMesh.quaternion.copy(camera.quaternion);				
	r1.set(0, 0, cubeRot);
	q1.setFromEuler(r1);
	cubeMesh.quaternion.multiply(cubeMesh.quaternion, q1);
	
	r1.set(0, 0, -controls.rotationVector.x*controls.rotationVector.y * 25);
	q1.setFromEuler(r1);
	cubeMesh.quaternion.multiply(cubeMesh.quaternion, q1);

	cubeMesh.translateX(controls.rotationVector.y * 2);
	cubeMesh.translateY(-controls.rotationVector.x * 1.75 - 2);
	cubeMesh.translateZ(-10);		

	
	if(laserDist == laserDuration) {
		laserDist = 0;
	}
	
	if(laserDist == 0) {
		
		laserMesh.quaternion = cubeMesh.quaternion;
		
		laserMesh.position.x = cubeMesh.position.x;
		laserMesh.position.y = cubeMesh.position.y;
		laserMesh.position.z = cubeMesh.position.z;
		laserMesh.translateX(controls.rotationVector.y * 2);
		laserMesh.translateY(-controls.rotationVector.x * 1.75 - 2);
		
		//console.log("laserMesh: " + laserMesh.position.x + " " + laserMesh.position.y + " " + laserMesh.position.z);
		//console.log("cubeMesh: " + cubeMesh.position.x + " " + cubeMesh.position.y + " " + cubeMesh.position.z);
		//console.log("moonMesh: " + moonMesh.position.x + " " + moonMesh.position.y + " " + moonMesh.position.z);
		//console.log("camera: " + camera.position.x + " " + camera.position.y + " " + camera.position.z);
		//console.log("crosshair: " + crosshairMesh.position.x + " " + crosshairMesh.position.y + " " + crosshairMesh.position.z);
		
		laserMesh.translateZ(-20);
	} else {
		//laserMesh.translateX(d2 * 2 * 80);
		//laserMesh.translateY((-d1 - 1) * 60);
		laserMesh.translateZ(-laserDist*5);
		laserDist+=1;
	}
	/*
	if(laserDist != 0) {
		laserMesh.translateZ(-laserDist*0.5);
		laserDist += 1;		
	}
	*/

	crosshairWorldCoords = crosshairMesh.matrixWorld.getPosition();
	vec = new THREE.Vector3(crosshairWorldCoords.x, crosshairWorldCoords.y, crosshairWorldCoords.z);
	
	ray = new THREE.Ray(camera.position, vec.subSelf(camera.position).normalize());
	intersects = ray.intersectScene(scene);

	if(intersects.length > 0) {
		for(var i = 0; i < intersects.length; i++) { //checks for intersected objects in order, so can break out after first "real" object
			if(intersects[i].object == cubeMesh || intersects[i].object == crosshairMesh || intersects[i].object == laserMesh || intersects[i].object == skybox) {
				cubeMesh.material.color.setHex(0x00ff00);
				continue;
			}
			if(intersects[i].distance < 12) {
				cubeMesh.material.color.setHex(0xff0000);
				
			}
			break;
		}

	} else {
		//console.log("no intersect");
		cubeMesh.material.color.setHex(0x00ff00);
	}



	renderer.clear();
	renderer.render(scene, camera);
	
}

