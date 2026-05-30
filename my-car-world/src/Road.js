// src/Road.js
// Cross-shaped asphalt road connecting all five portfolio zones.

import * as THREE from 'three'

const ROAD_COLOUR  = 0x444455   // dark grey asphalt
const MARK_COLOUR  = 0xffffff   // white centre-line dashes

export class Road {
  constructor(scene) {
    this.scene = scene
    this._buildRoads()
  }

  _buildRoads() {
    const mat = new THREE.MeshStandardMaterial({ color: ROAD_COLOUR, roughness: 0.95 })

    // Horizontal arm  (Skills ←→ Home ←→ Projects), width 8, length 100
    this._slab(0, 0, 100, 8, mat)

    // Vertical arm  (About ←→ Home ←→ Contact), width 8, length 100
    // Swap width/length so it runs along Z
    this._slab(0, 0, 8, 100, mat)

    // Centre-line dashes — horizontal
    const dashMat = new THREE.MeshStandardMaterial({ color: MARK_COLOUR, roughness: 1 })
    for (let x = -48; x <= 48; x += 6) this._dash(x, 0, 3.0, 0.25, dashMat)

    // Centre-line dashes — vertical
    for (let z = -48; z <= 48; z += 6) this._dash(0, z, 0.25, 3.0, dashMat)
  }

  /** Flat road slab at y ≈ 0 */
  _slab(x, z, w, d, mat) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat)
    mesh.rotation.x   = -Math.PI / 2
    mesh.position.set(x, 0.01, z)
    mesh.receiveShadow = true
    this.scene.add(mesh)
  }

  /** Road marking dash */
  _dash(x, z, w, d, mat) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(x, 0.02, z)
    this.scene.add(mesh)
  }
}
