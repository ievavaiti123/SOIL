import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
let light;
let spheres = [];
let INTERSECTED;



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


// create raycaster and coordinates for mouse movement
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const onMouseMove = (event) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);

   
    // change colour if mouse is on object
    if (intersects.length > 0) {
        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            
            //print out the info about the particle
            console.log(intersects[0].object.userData.name);
            console.log(intersects[0].object.userData.info);

            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
            

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }
    
  };

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 0, 0);
scene.add(sphere);

sphere.userData.nutrient = true;
sphere.userData.name = 'invertibrates';
sphere.userData.info = 'this is some info on this particle'

const geometry2 = new THREE.SphereGeometry(1, 64, 64);
const material2 = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
const sphere2 = new THREE.Mesh(geometry2, material2);
sphere2.position.set(5, 0, 0);
scene.add(sphere2);

sphere2.userData.nutrient = true;
sphere2.userData.name = 'alpha';
sphere2.userData.info = 'this is some info on this particle'

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

window.addEventListener('resize', onWindowResize);



function animate() {
	requestAnimationFrame( animate );

    
	renderer.render( scene, camera );
};
window.addEventListener( 'pointermove', onMouseMove );
// window.requestAnimationFrame(animate);
animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}
