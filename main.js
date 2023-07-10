import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const btnCreateBoard = document.querySelector("#btn-board-creator");

//add scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff1f1ff);
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//add camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
scene.add(camera);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const cleanScene = () => {
  while (scene.children.length > 0) {
    const child = scene.children[0];
    scene.remove(child);
  }
};
const createNewGeometry = (width, length) => {
  const vertices = [
    -length / 4,
    width / 2,
    0,
    length / 4,
    width / 2,
    0,
    -length / 2,
    -width / 2,
    0,
    length / 2,
    -width / 2,
    0,
  ];

  const geometry = new THREE.BufferGeometry();
  const verticesArray = new Float32Array(vertices);
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(verticesArray, 3)
  );

  const indices = [2, 0, 3, 2, 1, 3, 0, 1];

  const indicesArray = new Uint16Array(indices);
  geometry.setIndex(new THREE.BufferAttribute(indicesArray, 1));
  const board = new THREE.LineSegments(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  board.material = lineMaterial;
  return board;
};

const getboardSizesFromInput = () => {
  const width = +document.querySelector("#width").value;
  const length = +document.querySelector("#length").value / 2.54;
  return { width, length };
};

const createBoard = () => {
  cleanScene();
  const { width, length } = getboardSizesFromInput();
  const board = createNewGeometry(width, length);
  scene.add(board);

  const rotationAngle = Math.PI / 4;
  const rotationMatrix = new THREE.Matrix4().makeRotationZ(rotationAngle);
  board.applyMatrix4(rotationMatrix);
};

createBoard();

btnCreateBoard.addEventListener("click", () => {
  createBoard();
});

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}
animate();
