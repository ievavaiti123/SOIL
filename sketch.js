import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js'
import {CSS2DRenderer, CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';

let light;
let material1, material2, material3, material4;
let species, type, info, types, c;
let INTERSECTED, INTERSECTED2;
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
let materials = [];
let materials2 = [];


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

let newValue;

let slider = document.getElementById("sliderYear");
let output = slider.value
let yearseven = convertRange(output, [0, 100], [0, 0.7]);
let year98 = convertRange(output, [0, 100], [0.7, 0]);
//let output = slider.value;

          

// create the html structure for the labels
// const h2 = document.createElement('h2'); //for title

// html variables
const h = document.getElementById('name');
const p2 = document.getElementById('type');
const p = document.getElementById('info');

const s1 = document.getElementById('species1');
const s2 = document.getElementById('species2');
const s3 = document.getElementById('species3');

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
loader.load('imgs/HDR_041_Path_Ref.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
})


// add light to see
light = new THREE.PointLight( 0xfffafe, 1, 100 ); 
light.position.set(0, 10, 10);
scene.add( light );

let a;
let objects = [];
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

        
        for (a = 0; a < intersects.length; a++) {
 
        //check if mousew intersects with object
        objects.push(intersects[a].object)
        intersects[a].object.currentHex = intersects[a].object.material.emissive.getHex();
        intersects[a].object.material.emissive.setHex( 0xff0000 );

        //get particle name
        let objName = intersects[a].object.userData.name;
        let objInfo = intersects[a].object.userData.info;
        let objType = intersects[a].object.userData.type;
       

        // only show names of objects that can be seen
        if (intersects[a].object.material.opacity > 0) {
            h.className = 'tooltip show importantH';
        h.textContent = objName;
        p.className = 'tooltip show importantP';
        p.textContent = objInfo;
        p2.className = 'tooltip show importantP';
        p2.textContent = objType;
        }
        //print out the info about the particle    
        



        }
        
    }
    else {
      
        for (let b = 0; b < objects.length; b++) {
            //reset object colour and array
            if ( objects[b] ) objects[b].material.emissive.setHex( 0x00000);
            objects[b] = null

            //hide text when mouse not on object
            p.className = 'tooltip hide';
            p2.className = 'tooltip hide';
            h.className = 'tooltip hide';

        }

    }

  };


function drawSoil() {
    
collision = false;
let value98;
let value07;
const geometry = new THREE.SphereGeometry(0.5, 64, 64);




    for (let i=0; i<soil.length; i++) {
        value07 = soil[i].amount07;
        value98 = soil[i].amount98;
        
        type = soil[i].type;
        info = soil[i].info;
        c = soil[i].color;

        material1 = new THREE.MeshPhysicalMaterial( { 
            roughness: 0.1,
            metalness: 0.3,
            transmission: 1,
            transparent: 1,
            opacity: yearseven,
            color: c } );
        material2 = new THREE.MeshPhysicalMaterial( { 
            roughness: 0.1,
            metalness: 0.3,
            transmission: 1,
            transparent: 1,
            opacity: year98,
            color: c } );

            materials.push(material1)
            materials2.push(material2)
           
        //types = soil[i].types;
      
        
        // use same sphere positions in different years to see the difference easier
            for (let sPos = 0; sPos <500; sPos ++) {
                x[sPos] = getRnd(-10, 10)
                y[sPos] = getRnd(-10, 10)
                z[sPos] = getRnd(-10, 10)
            }
       ;
        //nutrients for year 2007
        for (let j = 0; j < value07; j ++) {
            
            if (type == "invertebrate" || "Carbon Concentration" || "Olsen-P" || "Nitrogen" || "Moisture") {
              
                sphere = new THREE.Mesh(geometry, material1);
                sphere.position.set(x[j], y[j], z[j]);
                scene.add(sphere);

                //use data from json to give the particles names
                sphere.userData.nutrient = true;
                sphere.userData.name = type; 
                sphere.userData.info = info; 
               
            }

        }

        //nutrients for year 1998
        for (let k = 0; k < value98; k ++) {
            
            if (type == "invertebrate" || "Carbon Concentration" || "Olsen-P" || "Nitrogen" || "Moisture") {
                
                sphere = new THREE.Mesh(geometry, material2);
                sphere.position.set(x[k], y[k], z[k]);
                scene.add(sphere);

             
                //use data from json to give the particles names
                sphere.userData.nutrient = true;
                sphere.userData.name = type; 
                sphere.userData.info = info; 
                
            }
        }
    }

}


// scale values: https://stackoverflow.com/questions/14224535/scaling-between-two-number-ranges
function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}



window.addEventListener('resize', onWindowResize);



//animate or update
function animate() {
   
    requestAnimationFrame( animate ); 
    //change opacity on input of slider
    slider.oninput = function() {
        output = this.value;
        yearseven = convertRange(output, [0, 100], [0, 0.7]);
        year98 = convertRange(output, [0, 100], [0.7, 0]);
        
       for (let i = 0; i< soil.length; i++) {
        materials[i].opacity = yearseven;
        materials2[i].opacity = year98;
       }
   
    
        }
   
    
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
