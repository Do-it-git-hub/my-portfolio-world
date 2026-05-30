// src/Camera.js
// Smooth third-person follow camera.
// Pre-allocates all Vector3 / Quaternion objects to avoid per-frame GC pressure.

import * as THREE from 'three'

const CAMERA_DISTANCE = 9   // units behind car
const CAMERA_HEIGHT   = 4.5 // units above car
const POS_LERP        = 0.06
const LOOK_LERP       = 0.10

export class Camera {
  constructor(renderer) {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      300,
    )
    this.camera.position.set(0, CAMERA_HEIGHT, CAMERA_DISTANCE)

    // Pre-allocated working objects — never recreated in update()
    this._threeQuat    = new THREE.Quaternion()
    this._offset       = new THREE.Vector3()
    this._lookOffset   = new THREE.Vector3()
    this._targetPos    = new THREE.Vector3()
    this._targetLook   = new THREE.Vector3()
    this._currentLook  = new THREE.Vector3()
  }

  /**
   * Called every frame.
   * @param {CANNON.Vec3}       carPosition  Physics body position
   * @param {CANNON.Quaternion} carQuat      Physics body rotation
   */
  update(carPosition, carQuat) {
    // Convert CANNON quaternion → THREE quaternion (same layout, just copy)
    this._threeQuat.set(carQuat.x, carQuat.y, carQuat.z, carQuat.w)

    // Camera offset in car-local space → world space
    this._offset.set(0, CAMERA_HEIGHT, CAMERA_DISTANCE)
    this._offset.applyQuaternion(this._threeQuat)

    this._targetPos.set(
      carPosition.x + this._offset.x,
      carPosition.y + this._offset.y,
      carPosition.z + this._offset.z,
    )

    // Smooth camera position
    this.camera.position.lerp(this._targetPos, POS_LERP)

    // Look-at point — slightly ahead of the car
    this._lookOffset.set(0, 0.5, -3)
    this._lookOffset.applyQuaternion(this._threeQuat)

    this._targetLook.set(
      carPosition.x + this._lookOffset.x,
      carPosition.y + this._lookOffset.y,
      carPosition.z + this._lookOffset.z,
    )

    this._currentLook.lerp(this._targetLook, LOOK_LERP)
    this.camera.lookAt(this._currentLook)
  }
}