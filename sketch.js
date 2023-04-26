import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js'
import {CSS2DRenderer, CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';

let light;
let INTERSECTED;
let soil;
let sphere;
let sphereBB;
let spheresBB = [];
let collision;
let spheres = [];
let x1 = getRnd(-3, 3);
let x2 = getRnd(-3, 3);
// arrays of xyz coordinates
let x = [];
let y = [];
let z = [];
let x1_ = [];

// setup the camera
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(-40, 10, -40);

//create new scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

//render and add to the canvas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("sketch-container").appendChild( renderer.domElement );

//load the css renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; // to allow oribt controls to pass
document.body.appendChild(labelRenderer.domElement);

// create the html structure for the labels
const h2 = document.createElement('h2'); //for title
const p = document.createElement('p'); //for info
h2.className ='tooltip';
p.className ='tooltip';
const pContainer = document.createElement('div');
pContainer.appendChild(h2)
pContainer.appendChild(p)
const cPointLabel = new CSS2DObject(pContainer);
scene.add(cPointLabel);


//camera controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.update();




//const cPointLabel = new CSS2DObject(pContainer);
//scene.add(cPointLabel);

  //load data file
  fetch("/json/soilinfo.json").then(function(response) {
    return response.json();
  }).then(function(data) {
    
    soil = data.contents;
   
    // draw the particles
   drawSoil();
  
  }).catch(function(err) {
    console.log(`Something went wrong: ${err}`);
  });

  //generate random int https://www.w3schools.com/JS/js_random.asp
  function getRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

// fix exposure and lighting of the HDR texture image
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.6;

// load HDR texture image, sourced from https://www.hdri-hub.com/hdrishop/freesamples/freehdri/item/117-hdr-041-path-free
const loader = new RGBELoader();
loader.load('imgs/HDR_041_Path.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
})


// add light to see
light = new THREE.PointLight( 0xfffafe, 1, 100 ); 
light.position.set(0, 10, 10);
scene.add( light );


// create raycaster and coordinates for mouse movement
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// track mouse movement and intersection with objects
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
            let objName = intersects[0].object.userData.name;
            let objInfo = intersects[0].object.userData.info;
            
            
            h2.className = 'tooltip show';
            h2.textContent = objName;

            p.className = 'tooltip show';
            p.textContent = objInfo;

            


            console.log(intersects[0].object.userData.name);
            console.log(intersects[0].object.userData.info);

            // change colour when mouse collides with object
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
            
        }

    } else {

        // colour change back if not intersects
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;
        p.className = 'tooltip hide';
        h2.className = 'tooltip hide';
        }
    
  };


    
 

  
// const cube1 = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshPhongMaterial({color: 0xff0000})
// );
// cube1.position.set(x1, 0, 0);

// let cube1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
// cube1BB.setFromObject(cube1);
// console.log(cube1BB);

// const ball1 = new THREE.Mesh(
//     new THREE.SphereGeometry(1),
//     new THREE.MeshPhongMaterial({color: 0xff14933})
// );
// ball1.position.set(x2,0,0);

//   //ball bounding sphere:
// let ball1BB = new THREE.Sphere(ball1.position, 1);
// console.log(ball1BB)

// scene.add(ball1, cube1);

// collision = false;
// //   scene.add(ball1);

// // check for collisions of particles
// function checkCollisions() {
//     if(cube1BB.intersectsSphere(ball1BB)) {
//         console.log("intersected");
//         // animation1();
//         collision = true
//         if (collision == true){
//             // x1 += x1
//             if(x1 <= 0) {
//             x1 -= 0.1;
//             } else if (x1 >= 0.1) {
//                 x1 += 0.1;
//             }
//             cube1.position.x = x1;
//          }
//     } else {
//         collision = false
//     }
// }




function drawSoil() {
collision = false;
let value;
const geometry = new THREE.SphereGeometry(2, 64, 64);
const material1 = new THREE.MeshPhysicalMaterial( { 
    roughness: 0.1,
    metalness: 0.3,
    transmission: 1,
    transparent: 1,
    opacity: 0.7,
    color: 0xffff00 } );
    //ior: 2.33;
const material2 = new THREE.MeshPhysicalMaterial( { 
    roughness: 0.1,
    metalness: 0.2,
    transmission: 1, 
    transparent: 1,
    opacity: 0.7,
    color: 0xf7a9a9 } );
const material3 = new THREE.MeshPhysicalMaterial( { 
    roughness: 0.1,
    metalness: 0.2,
    transmission: 1,
    transparent: 1,
    opacity: 0.7,
    color: 0xc4f157 } );


    for (let i=0; i<soil.length; i++) {
        value = soil[i].amount;
        let type = soil[i].type;
        let species = soil[i].species;
        let year = soil[i].year;
        
        

        for (let j = 0; j < value; j ++) {
            
           x[j] = getRnd(-10, 10)
           y[j] = getRnd(-10, 10)
           z[j] = getRnd(-10, 10)
            

            if (type == "invertebrate" && species == "Broad Taxa" && year == "2007") {
                
                sphere = new THREE.Mesh(geometry, material1);
                sphere.position.set(x[j], y[j], z[j]);
                scene.add(sphere);

                sphere.userData.nutrient = true;
                sphere.userData.name = 'Broad Taxa';
                sphere.userData.info = 'this is some info on this particle'

        
                
            }

           
                

           

            if (type == "invertebrate" && species == "Shannon Diversity" && year == "2007") {
                
                const sphere = new THREE.Mesh(geometry, material2);
                sphere.position.set(x[j], y[j], z[j]);
                scene.add(sphere);

                sphere.userData.nutrient = true;
                sphere.userData.name = 'Shannon';
                sphere.userData.info = 'this is some info on this particle'

                
            }

            if (type == "invertebrate" && species == "Mite: Springtail" && year == "2007") {
               
                const sphere = new THREE.Mesh(geometry, material3);
                sphere.position.set(x[j], y[j], z[j]);
                scene.add(sphere);

                sphere.userData.nutrient = true;
                sphere.userData.name = 'Mite: Springtail';
                sphere.userData.info = 'this is some info on this particle'
            }
        }
    }


}




window.addEventListener('resize', onWindowResize);



//animate or update
function animate() {

    requestAnimationFrame( animate );    

    // update labels
    labelRenderer.render(scene, camera);
    
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

    // update size of label
    labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);

}
