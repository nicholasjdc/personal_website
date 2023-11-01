import * as THREE from 'three';

import { StereoEffect } from 'three/addons/effects/StereoEffect.js';

let container, camera, scene, renderer, effect;

const spheres = [];

let mouseX = 0, mouseY = 0;


document.addEventListener( 'mousemove', onDocumentMouseMove );

init();
animate();

function init() {

container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
camera.position.z = 4000;

scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
	.setPath( 'Park3Med/' )
	.load( [ 'sq_large_planet.jpg', 'sq_large_planet.jpg', 'sq_large_planet.jpg', 'sq_large_planet.jpg', 'sq_large_planet.jpg', 'sq_large_planet.jpg' ] );

const geometry = new THREE.SphereGeometry( 100, 32, 16 );
const cubeGeometry = new THREE.BoxGeometry(200,200,200);
const textureCube = new THREE.CubeTextureLoader()
	.setPath( 'Park3Med/' )
	.load( [ 'sq_large_planet.jpg', 'sq_large_planet.jpg', 'sq_large_planet.jpg', 'sq_large_planet.jpg', 'sq_large_planet.jpg', 'sq_large_planet.jpg' ] );
textureCube.mapping = THREE.CubeRefractionMapping;

const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.7 } );

for ( let i = 0; i < 500; i ++ ) {

	const mesh = new THREE.Mesh( cubeGeometry, material );
	mesh.position.x = Math.random() * 10000 - 5000;
	mesh.position.y = Math.random() * 10000 - 5000;
	mesh.position.z = Math.random() * 10000 - 5000;
	mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
	scene.add( mesh );

	spheres.push( mesh );

}

//

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

//effect = new StereoEffect( renderer );
//effect.setSize( window.innerWidth, window.innerHeight );

//

window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {


camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove( event ) {

mouseX = ( event.clientX - window.innerWidth) * 10;
mouseY = ( event.clientY - window.innerHeight) * 10;

}

//

function animate() {

requestAnimationFrame( animate );

renderer.render(scene, camera);
render()

}

function render() {

const timer = 0.0001 * Date.now();

camera.position.x += ( mouseX - camera.position.x ) * .05;
camera.position.y += ( - mouseY - camera.position.y ) * .05;
camera.lookAt( scene.position );

for ( let i = 0, il = spheres.length; i < il; i ++ ) {

	const sphere = spheres[ i ];

	sphere.position.x = 5000 * Math.cos( timer + i );
	sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

}

renderer.render( scene, camera );

}

