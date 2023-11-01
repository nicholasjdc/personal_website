import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
const sphereGeometry = new THREE.SphereGeometry(.5)
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00});

const cube = new THREE.Mesh(geometry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);

cube.position.set(1,-1,3)
scene.add(sphere);
scene.add(cube);
camera.position.z = 5;

function animate() {
	requestAnimationFrame(animate);
	sphere.position.x += 0.01;
    sphere.rotation.x += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	renderer.render(scene, camera);

}
if ( WebGL.isWebGLAvailable() ) {
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}
