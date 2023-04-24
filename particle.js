// import * as THREE from 'three';
// import {OrbitControls} from 'three/addons/controls/OrbitControls';

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