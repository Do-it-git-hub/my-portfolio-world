// src/DustParticles.js
// Pooled particle system for wheel-dust VFX.
// Uses a fixed pool of small meshes — no allocation in the hot path.

import * as THREE from 'three'

const POOL_SIZE    = 60
const MIN_SPEED    = 8     // km/h threshold before dust emits
const EMIT_CHANCE  = 0.25  // probability per wheel per frame

export class DustParticles {
  constructor(scene) {
    this.pool = []

    const geo = new THREE.SphereGeometry(0.07, 4, 4)
    const mat = new THREE.MeshBasicMaterial({
      color:       0xc8b89a,
      transparent: true,
      opacity:     0.55,
      depthWrite:  false,
    })

    for (let i = 0; i < POOL_SIZE; i++) {
      const mesh    = new THREE.Mesh(geo, mat.clone())
      mesh.visible  = false
      scene.add(mesh)
      this.pool.push({
        mesh,
        life:    0,
        maxLife: 0,
        vx: 0, vy: 0, vz: 0,
      })
    }
  }

  /** Emit one dust particle at `pos` (THREE.Vector3). */
  _spawn(pos) {
    const p = this.pool.find((x) => !x.mesh.visible)
    if (!p) return

    p.mesh.position.set(
      pos.x + (Math.random() - 0.5) * 0.4,
      pos.y,
      pos.z + (Math.random() - 0.5) * 0.4,
    )
    p.vx      = (Math.random() - 0.5) * 1.5
    p.vy      = Math.random() * 2.5 + 0.5
    p.vz      = (Math.random() - 0.5) * 1.5
    p.maxLife = 0.45 + Math.random() * 0.3
    p.life    = p.maxLife
    p.mesh.visible = true
    p.mesh.scale.setScalar(1)
  }

  /**
   * Call every frame.
   * @param {number}         delta        Seconds since last frame
   * @param {number}         carSpeedKmh  Car speed (km/h)
   * @param {THREE.Vector3[]} wheelPositions  Array of wheel mesh positions
   */
  update(delta, carSpeedKmh, wheelPositions) {
    // Emit
    if (carSpeedKmh > MIN_SPEED) {
      for (const pos of wheelPositions) {
        if (Math.random() < EMIT_CHANCE) this._spawn(pos)
      }
    }

    // Simulate
    for (const p of this.pool) {
      if (!p.mesh.visible) continue

      p.life -= delta
      if (p.life <= 0) { p.mesh.visible = false; continue }

      const t = p.life / p.maxLife           // 1→0
      p.mesh.material.opacity = t * 0.55
      p.mesh.scale.setScalar(1 + (1 - t) * 2.5)

      p.mesh.position.x += p.vx * delta
      p.mesh.position.y += p.vy * delta
      p.mesh.position.z += p.vz * delta
      p.vy -= 4 * delta   // gravity
    }
  }
}
