import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
let light;
let spheres = [];
let nutrient;

//classes

//nutrient 1
class Particle{
    constructor(x, y, z) {
        //position
        this.x = x;
        this.y = y;
        this.z = z;

        //colour
        this.c;
    }

    show() {
        this.geometry = new THREE.SphereGeometry(1, 64, 64);
        this.material = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
        this.sphere = new THREE.Mesh(this.geometry, this.material);

        this.sphere.position.x = this.x;
        this.sphere.position.y = this.y;
        this.sphere.position.z = this.z;

        scene.add(this.sphere);
    }
}

// setup the camera
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(-35, 15, 25);

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

nutrient = new Particle(0, 0, 0);
console.log(nutrient)

nutrient.show();

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const onMouseMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientX / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        console.log(intersects);
    }

 
}

// for (let x = -10; x <= 10; x += 5) {
//     for (let z = -10; z <= 10; z += 5) {
//         for (let y = -10; y <= 10; y += 5) {
//         const geometry = new THREE.SphereGeometry(1, 64, 64);
//         const material = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
//         const sphere = new THREE.Mesh(geometry, material);

//         sphere.position.x = x;
//         sphere.position.y = y;
//         sphere.position.z = z;

//         scene.add(sphere);

//         spheres.push(sphere);
//         }

//     }
// }

window.addEventListener('resize', onWindowResize, 'mousemove', onMouseMove );



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
