import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as CANNON from 'cannon-es'


//create a rendere
const canvas = document.getElementById('viewport')
const renderer = new THREE.WebGL1Renderer({ canvas })
const dimensions = {
  width: innerWidth,
  height: innerHeight,
}

// ==================== SET UP A SCENE =====================
//create a scene
const scene = new THREE.Scene()


//add a camera
const camera = new THREE.PerspectiveCamera(
  45,
  dimensions.width / dimensions.height,
  0.1,
  1000
)
camera.position.set(30, 15, 30)
scene.add(camera)


//add a gridhelper
const gridHelper = new THREE.GridHelper(30, 30)
scene.add(gridHelper)

//add the objects
//box
const boxGeo = new THREE.BoxGeometry(2, 2, 2)
const boxMat = new THREE.MeshStandardMaterial({
  wireframe: true,
  color: 0x382068
})
const boxMesh = new THREE.Mesh(boxGeo, boxMat)
scene.add(boxMesh)


//sphere
const sphereGeo = new THREE.SphereGeometry(2)
const sphereMat = new THREE.MeshStandardMaterial({
  wireframe: true,
  color: 0x381056
})
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
scene.add(sphereMesh)

//ground
const groundGeo = new THREE.PlaneGeometry(30, 30)
const groundMat = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  color: 0xFFFFFF
})
const groundMesh = new THREE.Mesh(groundGeo, groundMat)
// ground.rotateX(-Math.PI / 2)
scene.add(groundMesh)

//add som light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1)
scene.add(ambientLight)

// add some controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// add some physics to it
//create a world and add is physics properties
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
})

// create a physical bodies
const groundPhyMat = new CANNON.Material()
const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.01)),
  // mass: 10
  type: CANNON.Body.STATIC,
  material: groundPhyMat
})

world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

const boxPhyMat = new CANNON.Material();
const boxBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  mass: 10,
  position: new CANNON.Vec3(5, 20, 0),
  material:boxPhyMat,
})
world.addBody(boxBody);

// set some angular velocity
boxBody.angularVelocity.set(0,10,0)
boxBody.angularDamping = 0.5

const spherePhyMat = new CANNON.Material()
const sphereBody =  new CANNON.Body({
  shape: new CANNON.Sphere(2),
  mass: 10,
  position: new CANNON.Vec3(0, 15, 0),
  material: spherePhyMat
})

world.addBody(sphereBody)
// add some air resitancew
sphereBody.linearDamping = 0.31  


// define the behaviors when two different materials come in contact
const groundBoxContactMat = new CANNON.ContactMaterial(
  groundPhyMat,
  boxPhyMat,
  {
    friction: 0.02
  }
)

const grounSphereContactMat = new CANNON.ContactMaterial(
  groundPhyMat,
  spherePhyMat,
  {
    restitution: 0.9,
    friction: 0.04
  }
)

world.addContactMaterial(groundBoxContactMat)
world.addContactMaterial(grounSphereContactMat)

// introduce time
const timeStep = 1 / 60

//render the scene
renderer.setSize(dimensions.width, dimensions.height)
renderer.setClearColor(0xafafaf)
renderer.render(scene, camera)

//update dimensions of screen resize
const animate = () => {
  world.step(timeStep)

  //merge bodies and meshes, position and orientations
  groundMesh.position.copy(groundBody.position)
  groundMesh.quaternion.copy(groundBody.quaternion)

  boxMesh.position.copy(boxBody.position)
  boxMesh.quaternion.copy(boxBody.quaternion);

  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)

  controls.update()



  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
  dimensions.width = innerWidth
  dimensions.height = innerHeight
  camera.aspect = dimensions.width / dimensions.height
  camera.updateProjectionMatrix()
  renderer.setSize(dimensions.width, dimensions.height)
})



