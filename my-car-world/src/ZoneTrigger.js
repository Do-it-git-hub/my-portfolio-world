// src/ZoneTrigger.js
// Lightweight proximity-based zone detection.
// No additional physics bodies needed — just distance checks each frame.

export class ZoneTrigger {
  constructor() {
    this.zones          = []   // [{ id, cx, cz, radius, label }]
    this.currentZoneId  = null
    this.onEnter        = null // fn(zone)
    this.onLeave        = null // fn(zoneId)
  }

  /**
   * Register a zone.
   * @param {string} id        Unique identifier, e.g. 'skills'
   * @param {number[]} center  [x, y, z]
   * @param {number} radius    Trigger radius in world units
   * @param {string} label     Display name, e.g. 'SKILLS'
   */
  addZone(id, center, radius, label) {
    this.zones.push({ id, cx: center[0], cz: center[2], radius, label })
  }

  /**
   * Call every frame with the car's physics position (CANNON.Vec3 or any {x,z}).
   */
  update(carPosition) {
    for (const zone of this.zones) {
      const dx   = carPosition.x - zone.cx
      const dz   = carPosition.z - zone.cz
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < zone.radius) {
        if (this.currentZoneId !== zone.id) {
          const prevId = this.currentZoneId
          this.currentZoneId = zone.id
          if (prevId !== null && this.onLeave) this.onLeave(prevId)
          if (this.onEnter) this.onEnter(zone)
        }
        return   // found our zone — early exit
      }
    }

    // No zone matched — car is in open world
    if (this.currentZoneId !== null) {
      if (this.onLeave) this.onLeave(this.currentZoneId)
      this.currentZoneId = null
    }
  }
}
