import * as THREE from 'three'
import { Loader } from './src/Loader.js'
import { UI } from './src/UI.js'
import { Environment } from './src/Environment.js'
import { Physics } from './src/Physics.js'
import { ZoneTrigger } from './src/ZoneTrigger.js'
import { World } from './src/World.js'
import { Car } from './src/Car.js'
import { Camera } from './src/Camera.js'
import { DustParticles } from './src/DustParticles.js'

let scene, cameraManager, renderer
let physics, car, world, zoneTrigger
let dustParticles, ui
let lastTime = performance.now()

function init() {
  ui = new UI()
  const loader = new Loader()
  loader.onProgress = (p) => ui.setLoadingProgress(p)
  loader.onComplete = () => {
    ui.hideLoadingScreen()
    ui.showZone({id: 'home'}) // Show home initially
  }

  scene = new THREE.Scene()
  
  new Environment(scene)

  physics = new Physics()
  zoneTrigger = new ZoneTrigger()
  
  zoneTrigger.onEnter = (zone) => ui.showZone(zone)
  zoneTrigger.onLeave = () => ui.hidePanel()

  world = new World(scene, physics, zoneTrigger)
  car = new Car(scene, physics, loader.manager)
  dustParticles = new DustParticles(scene)

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  document.body.appendChild(renderer.domElement)

  cameraManager = new Camera(renderer)

  window.addEventListener('resize', onWindowResize)

  renderer.setAnimationLoop(animate)
}

function onWindowResize() {
  cameraManager.camera.aspect = window.innerWidth / window.innerHeight
  cameraManager.camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  const time = performance.now()
  const delta = Math.min((time - lastTime) / 1000, 0.1) // Cap delta at 100ms
  lastTime = time

  physics.update(delta)
  car.update()
  
  const pos = car.chassisBody.position
  zoneTrigger.update(pos)
  
  const speed = car.getSpeedKmh()
  ui.updateHUD(speed, zoneTrigger.currentZoneId || 'freeroam')
  
  // Extract wheel positions for dust emission
  const wheelPositions = car.wheelMeshes.map(m => m.position)
  dustParticles.update(delta, speed, wheelPositions)

  cameraManager.update(pos, car.chassisBody.quaternion)

  renderer.render(scene, cameraManager.camera)
}

init()