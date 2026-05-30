// src/Signs.js
// Creates 3D billboard signs using canvas textures — no font file needed.
// Each sign is a pole + board, positioned slightly in front of each zone.

import * as THREE from 'three'

// Zone accent colours — keep in sync with World.js and style.css
const ZONE_COLOURS = {
  HOME:     '#e94560',
  SKILLS:   '#4a90d9',
  PROJECTS: '#27ae60',
  ABOUT:    '#8e44ad',
  CONTACT:  '#e67e22',
}

export class Signs {
  constructor(scene) {
    this.scene = scene
  }

  /**
   * Creates a sign with canvas-rendered text on a textured plane.
   * @param {string}          text      Text drawn on the sign
   * @param {THREE.Vector3}   position  World position of the sign base
   * @param {string}          colour    Hex string, e.g. '#e94560'
   */
  createSign(text, position, colour = '#e94560') {
    // ── Canvas texture ──────────────────────────────────────────────────────
    const W = 512, H = 160
    const canvas  = document.createElement('canvas')
    canvas.width  = W
    canvas.height = H
    const ctx     = canvas.getContext('2d')

    // Background panel
    ctx.fillStyle = colour
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, 18)
    ctx.fill()

    // Inner border
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth   = 5
    ctx.beginPath()
    ctx.roundRect(6, 6, W - 12, H - 12, 12)
    ctx.stroke()

    // Text
    ctx.fillStyle    = '#ffffff'
    ctx.font         = 'bold 68px "Arial Black", Arial, sans-serif'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, W / 2, H / 2)

    const texture   = new THREE.CanvasTexture(canvas)

    // ── Board mesh ──────────────────────────────────────────────────────────
    const boardGeo  = new THREE.BoxGeometry(8, 2.5, 0.15)
    const boardMat  = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6 })
    const board     = new THREE.Mesh(boardGeo, boardMat)
    board.castShadow = true
    board.position.y = 6.25   // top of pole (5m) + half board height

    // ── Pole mesh ───────────────────────────────────────────────────────────
    const poleGeo   = new THREE.CylinderGeometry(0.12, 0.12, 5, 8)
    const poleMat   = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 })
    const pole      = new THREE.Mesh(poleGeo, poleMat)
    pole.castShadow  = true
    pole.position.y  = 2.5

    // ── Group ───────────────────────────────────────────────────────────────
    const group = new THREE.Group()
    group.add(board, pole)
    group.position.copy(position)
    this.scene.add(group)

    return group
  }

  /** Convenience method — looks up zone colour automatically. */
  createZoneSign(zoneKey, position) {
    const colour = ZONE_COLOURS[zoneKey.toUpperCase()] || '#e94560'
    return this.createSign(zoneKey.toUpperCase(), position, colour)
  }
}
