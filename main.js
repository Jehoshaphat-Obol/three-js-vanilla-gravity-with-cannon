import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//create a rendere
const canvas = document.getElementById('viewport')
const renderer = new THREE.WebGL1Renderer({canvas})
const dimensions = {
  width: innerWidth,
  height: innerHeight,
}


//create a scene
const scene = new THREE.Scene()


//add a camera
const camera = new THREE.PerspectiveCamera(
  45,
  dimensions.width / dimensions.height,
  0.1,
  1000
)
camera.position.set(10,10,10)
scene.add(camera)


//add a gridhelper
const gridHelper = new THREE.GridHelper(30,30)
scene.add(gridHelper)

// add some controls
const controls = new THREE.OrbitControls(camera,)


//render the scene
renderer.setSize(dimensions.width,dimensions.height)
renderer.render(scene, camera)

//update dimensions of screen resize
const refresh = ()=>{
  dimensions.width = innerWidth
  dimensions.height = innerHeight

  camera.aspect = dimensions.width/ dimensions.height
  camera.updateProjectionMatrix()
  renderer.setSize(dimensions.width, dimensions.height)
  renderer.render(scene, camera)

  requestAnimationFrame(refresh)
}

refresh()
