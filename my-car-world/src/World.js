import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { Road } from './Road.js'
import { Signs } from './Signs.js'

export class World {
  constructor(scene, physics, zoneTrigger) {
    this.scene = scene
    this.physics = physics
    this.zoneTrigger = zoneTrigger

    this._buildGround()
    this._buildDecorations()
    this._buildZones()
  }

  _buildGround() {
    // Ground Mesh
    const planeGeo = new THREE.PlaneGeometry(300, 300)
    // Create a subtle green grid/grass feel
    const planeMat = new THREE.MeshStandardMaterial({ 
      color: 0x5a8b4e, 
      roughness: 1, 
      metalness: 0.0
    })
    const planeMesh = new THREE.Mesh(planeGeo, planeMat)
    planeMesh.rotation.x = -Math.PI / 2
    planeMesh.receiveShadow = true
    this.scene.add(planeMesh)

    // Ground Physics
    const planeShape = new CANNON.Plane()
    const planeBody = new CANNON.Body({ mass: 0 })
    planeBody.addShape(planeShape)
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    this.physics.addBody(planeBody)

    // Add Roads
    new Road(this.scene)
  }

  _buildDecorations() {
    // Add some random cubes as buildings / obstacles
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.4 })
    
    for(let i=0; i<30; i++) {
       const w = 2 + Math.random() * 6
       const h = 4 + Math.random() * 10
       const d = 2 + Math.random() * 6

       const x = (Math.random() - 0.5) * 150
       const z = (Math.random() - 0.5) * 150

       // Keep clear of roads
       if (Math.abs(x) < 15 || Math.abs(z) < 15) continue; 

       const mesh = new THREE.Mesh(cubeGeo, cubeMat)
       mesh.scale.set(w, h, d)
       mesh.position.set(x, h/2, z)
       mesh.castShadow = true
       mesh.receiveShadow = true
       this.scene.add(mesh)

       this.physics.addBox(mesh, 0, new THREE.Vector3(w, h, d))
    }
  }

  _buildZones() {
    const signs = new Signs(this.scene)

    const ZONES = [
      { id: 'home',     cx: 0,   cz: 0,   radius: 12 },
      { id: 'skills',   cx: -35, cz: 0,   radius: 15 },
      { id: 'projects', cx: 0,   cz: -35, radius: 15 },
      { id: 'about',    cx: 35,  cz: 0,   radius: 15 },
      { id: 'contact',  cx: 0,   cz: 35,  radius: 15 }
    ]

    ZONES.forEach(z => {
      this.zoneTrigger.addZone(z.id, [z.cx, 0, z.cz], z.radius, z.id)
      if (z.id !== 'home') {
        // Place sign slightly offset from the zone center so we can read it before entering
        // For skills (left), offset X. For projects (top), offset Z.
        const sx = z.cx !== 0 ? z.cx - Math.sign(z.cx)*6 : z.cx
        const sz = z.cz !== 0 ? z.cz - Math.sign(z.cz)*6 : z.cz
        const sign = signs.createZoneSign(z.id, new THREE.Vector3(sx, 0, sz))
        
        // Rotate sign so it faces the origin (home)
        sign.lookAt(0, sign.position.y, 0)
      }
    })
  }
}