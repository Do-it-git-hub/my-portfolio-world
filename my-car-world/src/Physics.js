// src/Physics.js
import * as CANNON from 'cannon-es'

export class Physics {
  constructor() {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)
    this.world.broadphase  = new CANNON.SAPBroadphase(this.world)
    this.world.allowSleep  = true
    this.world.defaultContactMaterial.friction    = 0.3
    this.world.defaultContactMaterial.restitution = 0.1

    // Pairs that need position sync every frame (added via addBox)
    this.objectsToUpdate = []
  }

  /**
   * Add any raw CANNON.Body directly to the world.
   * Used by World.js for the ground plane, buildings, trees, etc.
   */
  addBody(body) {
    this.world.addBody(body)
  }

  /**
   * Add a box-shaped physics body that mirrors a THREE.Mesh each frame.
   * @param {THREE.Mesh}   mesh  Visual mesh to keep in sync
   * @param {number}       mass  kg (0 = static)
   * @param {THREE.Vector3} size Full extents (NOT half-extents)
   */
  addBox(mesh, mass, size) {
    const shape = new CANNON.Box(
      new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2),
    )
    const body = new CANNON.Body({
      mass,
      shape,
      position: new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z),
    })
    this.world.addBody(body)
    this.objectsToUpdate.push({ mesh, body })
    return body
  }

  /** Step physics forward and sync all tracked mesh/body pairs. */
  update(delta) {
    this.world.step(1 / 60, delta, 3)
    for (const obj of this.objectsToUpdate) {
      obj.mesh.position.copy(obj.body.position)
      obj.mesh.quaternion.copy(obj.body.quaternion)
    }
  }
}