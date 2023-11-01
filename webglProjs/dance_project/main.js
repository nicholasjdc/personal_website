import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

let controls;
var dancers = [];
var spotLights = [];
var spotLightHelpers = [];
var spotLightPosData = [[]];
const camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 );

const clock = new THREE.Clock();

const scene = new THREE.Scene();

const matFloor = new THREE.MeshPhongMaterial( { color: 0x808080 } );

const geoFloor = new THREE.PlaneGeometry( 100, 100, 200 );

const mshFloor = new THREE.Mesh( geoFloor, matFloor );
mshFloor.rotation.x = - Math.PI * 0.5;


const spotLightNum = 3;
const dancerNum = 3;
for(let i=0; i<dancerNum; i++){
   createDancer();
}



const ambient = new THREE.AmbientLight( 0x444444 );

function createDancer(){
    const dancerGeo = new THREE.SphereGeometry( 0.3, 2, 2 );
    const dancerMat = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
    const dancerMsh = new THREE.Mesh( dancerGeo, dancerMat );
    dancerMsh.castShadow = true;
    dancerMsh.receiveShadow = true;
    var xPos = Math.random() * 10 +0.5;
    var yPos = 0.25;
    var zPos = Math.random() *10 +0.5;
    dancerMsh.position.set( xPos, yPos, zPos);
    dancers.push(dancerMsh);
    scene.add(dancerMsh);
    for(let i = 0; i<spotLightNum; i++){
        const spotLight = createSpotlight(getRandomColor(),xPos,yPos,zPos);
        spotLight.target.position.set(xPos,yPos, zPos)
        const lightHelper = new THREE.SpotLightHelper(spotLight);
        spotLightPosData.push([xPos,yPos,zPos])
        spotLights.push(spotLight);
        spotLightHelpers.push(lightHelper);
        scene.add(spotLight);
        scene.add(lightHelper);
    }
}
function init() {

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera.position.set( 0, 4, 5 );
    camera.lookAt(5.5,0,5.5);
    mshFloor.receiveShadow = true;
    mshFloor.position.set( 0, - 0.05, 0 );


    
   
    scene.add( mshFloor );
    scene.add( ambient );
 
    
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize );

    controls = new FlyControls( camera, renderer.domElement );

    controls.movementSpeed = 1;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = true;

}

function createSpotlight( color, x, y, z ) {

    const newObj = new THREE.SpotLight( color, 10 );
    newObj.position.set(x,y,z);
    newObj.castShadow = true;
    newObj.angle = 0.3;
    newObj.penumbra = 0.2;
    newObj.decay = 2;
    newObj.distance = 50;

    return newObj;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function tween( light, xOff, yOff, zOff ) {
    
    new TWEEN.Tween( light ).to( {
        angle: ( Math.random() * 0.3 ) + 0.1 ,
        penumbra: Math.random() + 0.2
    }, Math.random() * 3000 + 2000 ).start()
        .easing( TWEEN.Easing.Quadratic.Out ).start();

    new TWEEN.Tween( light.position ).to( {
        x: ( Math.random() * 3 ) - 1.5 +xOff,
        y: ( Math.random() * 1 ) + 1.5 +yOff,
        z: ( Math.random() * 3 ) - 1.5 +zOff
    }, Math.random() * 3000 + 2000 ).start()
        .easing( TWEEN.Easing.Quadratic.Out ).start();

}

function animate() {
    for(let i =0; i<spotLights.length; i++){
        let xPos = spotLightPosData[i][0];
        let yPos = spotLightPosData[i][1];
        let zPos = spotLightPosData[i][2];
        tween(spotLights[i],xPos, yPos, zPos)
    }
  
    setTimeout( animate, 5000 );

}

function render() {

    TWEEN.update();
    for(let i =0; i<spotLightHelpers.length; i++){
        let lightHelperCurrent = spotLightHelpers[i];
        if(lightHelperCurrent) lightHelperCurrent.update();
    }
    
    const delta = clock.getDelta();
    controls.update( delta );
    
    renderer.render( scene, camera );

    requestAnimationFrame( render );

}
document.getElementById("AddDancer").
    addEventListener("click", function(){
        createDancer();
    });
init();
render();
animate();