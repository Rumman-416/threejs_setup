import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

const gui = new dat.GUI();

/**
 * BAse
 */

//Canvas
const canvas = document.querySelector(".webgl");

//Scene
const scene = new THREE.Scene();

const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  radiusBias: 2.5,
  branches: 3,
  spin: 1,
  randomness: 0.9,
  randomnessPower: 3,
  insideColor: "#ffa500",
  outsideColor: "#0000ff",
};

let geometry;
let material;
let points;

const generateGalaxy = () => {
  //destroy galaxy
  if (points !== null) {
    geometry?.dispose();
    material?.dispose();
    scene.remove(points);
  }

  //geometry
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // const radius = Math.random() * parameters.radius;
    const radius =
      Math.pow(Math.random(), parameters.radiusBias) * parameters.radius;

    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomAngle1 = Math.random() * Math.PI * 2;
    const randomAngle2 = Math.acos(Math.random() * 2 - 1);
    const randomRadius =
      Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness;

    const randomX =
      Math.sin(randomAngle2) * Math.cos(randomAngle1) * randomRadius;
    const randomY =
      Math.sin(randomAngle2) * Math.sin(randomAngle1) * randomRadius;
    const randomZ = Math.cos(randomAngle2) * randomRadius;

    // const randomX =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1);
    // const randomY =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1);
    // const randomZ =
    //   Math.pow(Math.random(), parameters.randomnessPower) *
    //   (Math.random() < 0.5 ? 1 : -1);

    (positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX),
      parameters.randomnessPower;

    positions[i3 + 1] = 0 + randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    if (i < 50) {
      // console.log(branchAngle);
      // Math.cos(branchAngle + spinAngle) * radius + randomX
    }

    //colors
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  //material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  // points
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(0.001)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radiusBias")
  .min(0.1)
  .max(10)
  .step(0.1)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(0.01)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

generateGalaxy();

/**
 * Sizes
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Sizes
 */

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 2;

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 * Renderer
 */

/**
 * Animate Clock
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  points.rotation.y = elapsedTime * 0.5;

  //update controls
  controls.update();

  //Renderer
  renderer.render(scene, camera);

  //Call tick again on next frame
  window.requestAnimationFrame(tick);
};

tick();
/**
 * Animate Clock
 */
