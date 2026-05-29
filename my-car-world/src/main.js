// Import Three.js from node_modules — notice no CDN link needed
import * as THREE from 'three'

// GLTFLoader is a Three.js add-on that loads .glb and .gltf files
// It lives in the 'three/addons/' folder inside node_modules
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// OrbitControls lets you orbit the camera with mouse — useful for debugging
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


// ─────────────────────────────────────────
// SCENE SETUP
// ─────────────────────────────────────────
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb) // sky blue
scene.fog = new THREE.Fog(0x87ceeb, 20, 80)  // fog: color, start distance, end distance
// Fog makes far objects fade into the sky — adds depth, Bruno's world has this


// ─────────────────────────────────────────
// CAMERA
// ─────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200
)
camera.position.set(0, 5, 10)


// ─────────────────────────────────────────
// RENDERER
// ─────────────────────────────────────────
const canvas = document.getElementById('webgl-canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// devicePixelRatio handles retina/high-DPI screens — cap at 2 for performance
renderer.shadowMap.enabled = true
// Enable shadows — objects cast and receive shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// PCFSoftShadowMap = soft shadow edges, looks more realistic


// ─────────────────────────────────────────
// LIGHTS
// ─────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xfff4e0, 1.5) // warm sunlight color
sunLight.position.set(10, 20, 10)
sunLight.castShadow = true              // this light creates shadows
sunLight.shadow.mapSize.width = 2048    // shadow resolution — higher = sharper
sunLight.shadow.mapSize.height = 2048
sunLight.shadow.camera.near = 0.5
sunLight.shadow.camera.far = 100
sunLight.shadow.camera.left = -30       // how wide the shadow area is
sunLight.shadow.camera.right = 30
sunLight.shadow.camera.top = 30
sunLight.shadow.camera.bottom = -30
scene.add(sunLight)


// ─────────────────────────────────────────
// GROUND
// ─────────────────────────────────────────
const groundGeometry = new THREE.PlaneGeometry(100, 100)
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a7c59,   // medium green
  roughness: 0.8,
  metalness: 0
})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true  // ground receives shadows cast by the car
scene.add(ground)


// ─────────────────────────────────────────
// SOME SIMPLE BUILDINGS (boxes for now)
// ─────────────────────────────────────────
function makeBuilding(x, z, width, height, depth, color) {
  // This is a FUNCTION — a reusable block of code
  // Instead of writing the same box code 10 times, we call this 10 times
  const geo = new THREE.BoxGeometry(width, height, depth)
  const mat = new THREE.MeshStandardMaterial({ color })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(x, height / 2, z)  // y = half height so it sits on the ground
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
}

// Place some buildings around the scene
makeBuilding(15,  10, 4, 6, 4, 0x8888aa)
makeBuilding(-12, 8,  3, 4, 3, 0xaa8866)
makeBuilding(20, -15, 5, 8, 4, 0x667788)
makeBuilding(-8, -12, 3, 5, 3, 0x889966)
makeBuilding(5,   18, 4, 3, 4, 0xaa9977)


// ─────────────────────────────────────────
// KEYBOARD INPUT
// ─────────────────────────────────────────
const keys = {}
window.addEventListener('keydown', (e) => { keys[e.code] = true })
window.addEventListener('keyup',   (e) => { keys[e.code] = false })


// ─────────────────────────────────────────
// CAR VARIABLES
// We'll fill these once the model loads
// ─────────────────────────────────────────
let carModel = null       // will hold the loaded 3D model
let carSpeed = 0          // current speed (can be negative = reversing)
const maxSpeed    = 0.15  // top forward speed
const maxReverse  = 0.06  // top reverse speed
const acceleration = 0.004 // how fast speed builds up
const friction     = 0.003 // how fast speed bleeds off when not pressing anything
const turnSpeed    = 0.03  // radians per frame


// ─────────────────────────────────────────
// LOAD THE CAR MODEL
// ─────────────────────────────────────────
const loader = new GLTFLoader()

// loader.load takes: path, onLoad callback, onProgress callback, onError callback
loader.load(
  '/models/car.glb',

  // onLoad — runs when the model is fully downloaded and ready
  function(gltf) {
    carModel = gltf.scene  // gltf.scene contains the full 3D object

    // Make every mesh inside the car cast and receive shadows
    carModel.traverse(function(child) {
      // traverse visits every object inside the model, no matter how nested
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Scale and position the car
    // Different models come in different sizes — adjust until it looks right
    carModel.scale.set(0.5, 0.5, 0.5)  // make it half size if too big
    carModel.position.set(0, 0, 0)

    scene.add(carModel)
    console.log('Car loaded!')
  },

  // onProgress — runs repeatedly while downloading, useful for loading bars
  function(progress) {
    const percent = (progress.loaded / progress.total * 100).toFixed(1)
    console.log('Loading: ' + percent + '%')
  },

  // onError — runs if something goes wrong
  function(error) {
    console.error('Failed to load car:', error)
  }
)


// ─────────────────────────────────────────
// ANIMATION LOOP
// ─────────────────────────────────────────
const clock = new THREE.Clock()
// Clock measures real time between frames
// This matters because on a slow computer frames take longer
// We want movement based on REAL TIME not frame count

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()
  // delta = seconds since last frame, typically ~0.016 (1/60th of a second)
  // We multiply movement by delta to make speed frame-rate independent

  // Only move the car once it's loaded
  if (carModel) {

    // TURNING — only turn if actually moving
    if (Math.abs(carSpeed) > 0.001) {
      if (keys['ArrowLeft'] || keys['KeyA']) {
        // Turn more sharply at lower speeds, less at high speeds — feels realistic
        carModel.rotation.y += turnSpeed * (carSpeed > 0 ? 1 : -1)
      }
      if (keys['ArrowRight'] || keys['KeyD']) {
        carModel.rotation.y -= turnSpeed * (carSpeed > 0 ? 1 : -1)
      }
    }

    // ACCELERATION
    if (keys['ArrowUp'] || keys['KeyW']) {
      carSpeed = Math.min(carSpeed + acceleration, maxSpeed)
      // Math.min prevents going above maxSpeed
    } else if (keys['ArrowDown'] || keys['KeyS']) {
      carSpeed = Math.max(carSpeed - acceleration, -maxReverse)
      // Math.max prevents going beyond maxReverse (backwards)
    } else {
      // No key held — apply friction to slow down naturally
      if (carSpeed > 0) carSpeed = Math.max(0, carSpeed - friction)
      if (carSpeed < 0) carSpeed = Math.min(0, carSpeed + friction)
    }

    // MOVE in the direction the car faces
    carModel.position.x -= Math.sin(carModel.rotation.y) * carSpeed
    carModel.position.z -= Math.cos(carModel.rotation.y) * carSpeed

    // CAMERA FOLLOW
    const camDistance = 8
    const camHeight   = 3
    const camTargetX  = carModel.position.x + Math.sin(carModel.rotation.y) * camDistance
    const camTargetZ  = carModel.position.z + Math.cos(carModel.rotation.y) * camDistance

    camera.position.x += (camTargetX - camera.position.x) * 0.05
    camera.position.z += (camTargetZ - camera.position.z) * 0.05
    camera.position.y += (camHeight  - camera.position.y) * 0.05

    // Look slightly ahead of the car — more cinematic than looking at center
    const lookTarget = new THREE.Vector3(
      carModel.position.x - Math.sin(carModel.rotation.y) * 2,
      carModel.position.y + 0.5,
      carModel.position.z - Math.cos(carModel.rotation.y) * 2
    )
    camera.lookAt(lookTarget)
  }

  renderer.render(scene, camera)
}

animate()


// ─────────────────────────────────────────
// RESIZE HANDLER
// ─────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})