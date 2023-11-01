import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { FlyControls } from 'three/addons/controls/FlyControls.js';

let container, stats;
let fbxLoader;
let camera, scene, renderer;
let controls;

const clock = new THREE.Clock();

init();
animate();

function init() {
    spheres = []
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // camera

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL( .9, .4, .5, THREE.SRGBColorSpace );
    scene.fog = new THREE.Fog( scene.background, 2500, 15000 );


    // lights

    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.15 );
    dirLight.position.set( 0, 1, 0 ).normalize();
    dirLight.color.setHSL( 0.1, 0.7, 0.5 );
    scene.add( dirLight );
   
    // world

    const s = 250;

    const fbxLoader = new FBXLoader();
    
    const translucentMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    })
    const geometry = new THREE.BoxGeometry( s, s, s );
    const sphereGeometry = new THREE.SphereGeometry(125, 250, 250)
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 50 } );
    
    for ( let i = 0; i < 3000; i ++ ) {

        const mesh = new THREE.Mesh( sphereGeometry, translucentMaterial );

        mesh.position.x = 8000 * ( 2.0 * Math.random() - 1.0 );
        mesh.position.y = 8000 * ( 2.0 * Math.random() - 1.0 );
        mesh.position.z = 8000 * ( 2.0 * Math.random() - 1.0 );

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        scene.add( mesh );
      

    }


    

    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //

    controls = new FlyControls( camera, renderer.domElement );

    controls.movementSpeed = 2500;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = true;
    

    // stats

    stats = new Stats();
    container.appendChild( stats.dom );

    // events

    window.addEventListener( 'resize', onWindowResize );

}

//

function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {
    
    const delta = clock.getDelta();

    controls.update( delta );
    renderer.render( scene, camera );

}