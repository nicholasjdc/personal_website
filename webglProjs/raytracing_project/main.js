import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/addons/libs/stats.module.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

let container, stats;
let fbxLoader, objLoader;
let camera, scene, renderer;
let controls;

const clock = new THREE.Clock();

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // camera

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 150000 );
    camera.position.z = 0;
    camera.position.y = 1500
    // scene

    scene = new THREE.Scene();
    scene.background = new THREE.CubeTextureLoader()
	.setPath( 'textures/' )
	.load( [ 'sq_nightsky.jpg', 'sq_nightsky.jpg', 'sq_nightsky.jpg', 'sq_nightsky.jpg', 'sq_nightsky.jpg', 'sq_nightsky.jpg' ] );

    //scene.background = new THREE.Color().setHSL( 0.51, 0.4, 0.01, THREE.SRGBColorSpace );
    scene.fog = new THREE.Fog(0x000000, 1000, 15000 );

    // world

    const s = 250;

    
    const radius = 1000;
    const emissiveMaterial = new THREE.MeshLambertMaterial( { emissive:0xFCF9D9} );

    fbxLoader = new FBXLoader();
    /*
    fbxLoader.load('textures/sun.fbx', function(sun){
        //const sunMesh = new THREE.Mesh( sun, emissiveMaterial );

        scene.add(sun)
    })
    */
   const offset = 4000;
    const moonNumber = 10
    const moonMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 50 } );

    for(let i = 0; i<moonNumber; i++){
        fbxLoader.load('textures/moon.fbx', function(moon){

            let xPos = Math.cos((2*Math.PI *i)/moonNumber ) * radius;
            let zPos = Math.sin((2*Math.PI *i) /moonNumber) * radius;

            moon.position.set(xPos,0, zPos);
            scene.add(moon)
        })
        
    }
    for(let i = 0; i<moonNumber; i++){
        fbxLoader.load('textures/moon.fbx', function(moon){

            let xPos = (Math.cos((2*Math.PI *i)/moonNumber ) * radius) + offset;
            let zPos = (Math.sin((2*Math.PI *i) /moonNumber) * radius);

            moon.position.set(xPos,0, zPos);
            scene.add(moon)
        })
        
    }
    for(let i = 0; i<moonNumber; i++){
        fbxLoader.load('textures/moon.fbx', function(moon){

            let xPos = (Math.cos((2*Math.PI *i)/moonNumber ) * radius) - offset;
            let zPos = (Math.sin((2*Math.PI *i) /moonNumber) * radius);

            moon.position.set(xPos,0, zPos);
            scene.add(moon)
        })
        
    }
   


    // lights

    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.15 );
    dirLight.position.set( 0, - 1, 0 ).normalize();
    dirLight.color.setHSL( 0.1, 0.7, 0.5 );
    scene.add( dirLight );

    // lensflares
    const textureLoader = new THREE.TextureLoader();

    const textureFlare0 = textureLoader.load( 'textures/lensflare0.png' );
    const textureFlare3 = textureLoader.load( 'textures/lensflare3.png' );

    addLight( 0.08, 0.4, 0.5, 0,0,0 );
    addLight( 0.95, 0.8, 0.5, offset,0,0 );
    addLight( 0.5, 1, 0.5, -offset,0,0 );

    function addLight( h, s, l, x, y, z ) {

        const light = new THREE.PointLight( 0xffffff, 1.5, 2000, 0 );
        light.color.setHSL( h, s, l );
        light.position.set( x, y, z );
        scene.add( light );

        const lensflare = new Lensflare();
        lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
        light.add( lensflare );

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