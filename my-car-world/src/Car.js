import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { input } from './Input.js'

export class Car {
  constructor(scene, physics, loadingManager) {
    this.scene = scene
    this.physics = physics
    this.carMesh = null
    this.wheelMeshes = []

    this._initPhysics()
    this._loadModel(loadingManager)
  }

  _initPhysics() {
    // Chassis body
    const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2.2))
    this.chassisBody = new CANNON.Body({ mass: 800 })
    this.chassisBody.addShape(chassisShape, new CANNON.Vec3(0, 0.5, 0))
    this.chassisBody.position.set(0, 2, 0)
    
    // Low friction for drifting, high angular damping to prevent spinning out
    this.chassisBody.angularDamping = 0.5
    this.chassisBody.linearDamping = 0.1

    this.vehicle = new CANNON.RaycastVehicle({
      chassisBody: this.chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    })

    const wheelOptions = {
      radius: 0.35,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 40,
      suspensionRestLength: 0.3,
      frictionSlip: 2.5,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.05,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(1, 0, 1),
      maxSuspensionTravel: 0.3,
      customSlidingRotationalSpeed: -30,
      useCustomSlidingRotationalSpeed: true
    }

    // Front left
    wheelOptions.chassisConnectionPointLocal.set(0.9, 0.2, 1.4)
    this.vehicle.addWheel(wheelOptions)

    // Front right
    wheelOptions.chassisConnectionPointLocal.set(-0.9, 0.2, 1.4)
    this.vehicle.addWheel(wheelOptions)

    // Rear left
    wheelOptions.chassisConnectionPointLocal.set(0.9, 0.2, -1.5)
    this.vehicle.addWheel(wheelOptions)

    // Rear right
    wheelOptions.chassisConnectionPointLocal.set(-0.9, 0.2, -1.5)
    this.vehicle.addWheel(wheelOptions)

    this.vehicle.addToWorld(this.physics.world)

    // Wheel bodies for CANNON (needed for friction/contact)
    const wheelBodies = []
    this.vehicle.wheelInfos.forEach((wheel) => {
      const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20)
      const wheelBody = new CANNON.Body({
        mass: 1,
        type: CANNON.Body.KINEMATIC,
        collisionFilterGroup: 0, 
      })
      const q = new CANNON.Quaternion()
      q.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2)
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q)
      wheelBodies.push(wheelBody)
      this.physics.world.addBody(wheelBody)
    })

    // Update wheel bodies
    this.physics.world.addEventListener('postStep', () => {
      for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
        this.vehicle.updateWheelTransform(i)
        const t = this.vehicle.wheelInfos[i].worldTransform
        wheelBodies[i].position.copy(t.position)
        wheelBodies[i].quaternion.copy(t.quaternion)
      }
    })
  }

  _loadModel(loadingManager) {
    const loader = new GLTFLoader(loadingManager)
    loader.load('/models/ferrari.glb', (gltf) => {
      this.carMesh = gltf.scene
      this.carMesh.scale.set(0.5, 0.5, 0.5)

      this.carMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Extract wheels to animate them
      // Assuming typical GLTF naming or we just use 4 empty meshes if no wheels found
      const wheelNames = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']
      this.wheelMeshes = wheelNames.map(name => {
        let w = this.carMesh.getObjectByName(name)
        if (!w) {
          // Placeholder wheel if not found in model
          w = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16),
            new THREE.MeshStandardMaterial({color: 0x111111})
          )
          w.rotation.z = Math.PI / 2
          this.scene.add(w)
        }
        return w
      })

      this.scene.add(this.carMesh)
    })
  }

  update() {
    const maxSteerVal  = 0.45   // ~25 deg
    const maxForce     = 1200
    const brakeForce   = 20

    // STEERING
    if (input.isAnyPressed('ArrowLeft', 'KeyA')) {
      this.vehicle.setSteeringValue( maxSteerVal, 0) 
      this.vehicle.setSteeringValue( maxSteerVal, 1) 
    } else if (input.isAnyPressed('ArrowRight', 'KeyD')) {
      this.vehicle.setSteeringValue(-maxSteerVal, 0)
      this.vehicle.setSteeringValue(-maxSteerVal, 1)
    } else {
      this.vehicle.setSteeringValue(0, 0)
      this.vehicle.setSteeringValue(0, 1)
    }

    // ACCELERATION / BRAKING
    if (input.isAnyPressed('ArrowUp', 'KeyW')) {
      this.vehicle.applyEngineForce(-maxForce, 2)
      this.vehicle.applyEngineForce(-maxForce, 3)
      this.vehicle.setBrake(0, 0)
      this.vehicle.setBrake(0, 1)
      this.vehicle.setBrake(0, 2)
      this.vehicle.setBrake(0, 3)
    } else if (input.isAnyPressed('ArrowDown', 'KeyS')) {
      this.vehicle.applyEngineForce(maxForce, 2)
      this.vehicle.applyEngineForce(maxForce, 3)
      this.vehicle.setBrake(0, 0)
      this.vehicle.setBrake(0, 1)
      this.vehicle.setBrake(0, 2)
      this.vehicle.setBrake(0, 3)
    } else if (input.isAnyPressed('Space')) {
      // Handbrake
      this.vehicle.applyEngineForce(0, 2)
      this.vehicle.applyEngineForce(0, 3)
      this.vehicle.setBrake(brakeForce * 2, 2)
      this.vehicle.setBrake(brakeForce * 2, 3)
    } else {
      // Coasting
      this.vehicle.applyEngineForce(0, 2)
      this.vehicle.applyEngineForce(0, 3)
      this.vehicle.setBrake(brakeForce * 0.1, 0)
      this.vehicle.setBrake(brakeForce * 0.1, 1)
      this.vehicle.setBrake(brakeForce * 0.1, 2)
      this.vehicle.setBrake(brakeForce * 0.1, 3)
    }

    // Visual Sync
    if (this.carMesh) {
      this.carMesh.position.copy(this.chassisBody.position)
      this.carMesh.quaternion.copy(this.chassisBody.quaternion)
      
      // The model might need a Y offset depending on pivot
      this.carMesh.position.y -= 0.5 

      for (let i = 0; i < this.wheelMeshes.length; i++) {
        const wheelObj = this.wheelMeshes[i]
        // If it's part of the carMesh group originally, its position is local.
        // But if it's detached or top-level, it needs world transforms.
        // It's safer to detach them from the car mesh if we want to sync them with CANNON directly.
        if (wheelObj.parent && wheelObj.parent !== this.scene) {
          this.scene.attach(wheelObj)
        }
        const t = this.vehicle.wheelInfos[i].worldTransform
        wheelObj.position.copy(t.position)
        wheelObj.quaternion.copy(t.quaternion)
        
        // Rotate the wheel mesh properly so it faces outward
        if(i % 2 === 0) { // left wheels
           wheelObj.rotateY(Math.PI)
        }
      }
    }
  }

  getSpeedKmh() {
    return Math.abs(this.vehicle.currentVehicleSpeedKmHour || 0)
  }
}