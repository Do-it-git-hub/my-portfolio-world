// src/Environment.js
// Sky colour, hemisphere light, sun (directional + shadows), fill light.

import * as THREE from 'three'

export class Environment {
  constructor(scene) {
    // Sky blue background + exponential distance fog
    scene.background = new THREE.Color(0x87ceeb)
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.010)

    // Hemisphere light  — sky colour from above, warm earth from below
    const hemi = new THREE.HemisphereLight(0xb0d8f0, 0x6a9b5e, 0.7)
    scene.add(hemi)

    // Sun  — directional light with high-quality soft shadows
    const sun = new THREE.DirectionalLight(0xfff4e0, 1.8)
    sun.position.set(40, 60, 30)
    sun.castShadow = true
    sun.shadow.mapSize.set(4096, 4096)
    sun.shadow.camera.near   = 0.5
    sun.shadow.camera.far    = 200
    sun.shadow.camera.left   = -80
    sun.shadow.camera.right  =  80
    sun.shadow.camera.top    =  80
    sun.shadow.camera.bottom = -80
    sun.shadow.bias          = -0.0005
    scene.add(sun)

    // Soft fill — opposite direction, no shadows, low intensity
    const fill = new THREE.DirectionalLight(0x7ec8e3, 0.4)
    fill.position.set(-40, 20, -30)
    scene.add(fill)
  }
}
