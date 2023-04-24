import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
let light;
// setup the camera
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(-5, 0, 5);

//render and add to the canvas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("sketch-container").appendChild( renderer.domElement );

//controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//create new scene
const scene = new THREE.Scene();

// add light to see
light = new THREE.PointLight( 0xfffafe, 1, 100 ); 
light.position.set(0, 10, 10);
scene.add( light );


const geometry = new THREE.SphereGeometry( 1, 64, 64 );
const material = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

window.addEventListener('resize', onWindowResize );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}