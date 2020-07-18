// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  dimensions: [1080, 1920],
  duration: 6,
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(2, 4, -6);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BufferGeometry();
  const numVertices = 100000;
  let cube = new Float32Array(numVertices*3);
  for (var i = 0; i <= numVertices*3; i=i+3) {
    cube[i] = Math.random()*2 - 1
    cube[i+1] = Math.random()* 2 -1;
    cube[i+2] = Math.random()*2 - 1;
  }

  let sphere = new Float32Array(numVertices*3);
  let teta,z;
  for (var i = 0; i < numVertices*3; i=i+3) {
    teta = Math.random()*2*Math.PI;
    z = 2*Math.random()*2 - 1;
    sphere[i] = 1.8*Math.sqrt(1 - z*z)*Math.cos(teta);
    sphere[i+1] = 1.8*Math.sqrt(1 - z*z)*Math.sin(teta) + 2 - 2 ;
    sphere[i+2] = 1.8*z;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(cube,3))
  geometry.setAttribute('sphere', new THREE.BufferAttribute(sphere,3))

  // Setup a material
  const material = new THREE.RawShaderMaterial({
    uniforms: {
      dot: { type: 't', value: new THREE.TextureLoader().load('./reddot.png') },
      blend: { type: 'f', value: 0 },
      size: { type: 'f', value: 20.1 },
      rotation: {type: 'f', value: 0},
      time: {type: 'f', value: 0},
      progress: {type: 'f', value: 0},
      center: {value: new THREE.Vector3(0,0,0)},
    },
    alphaTest: 0.5,
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader,
    fragmentShader,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);
  geometry.needsUpdate = true;


  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time, playhead }) {

      material.uniforms.progress.value = playhead < 0.35
        ? playhead * 1 / 0.35
        : playhead > 0.65
          ? (1 - playhead) / 0.35
          : 1;
      material.uniforms.time.value = playhead;
      material.uniforms.rotation.value = playhead * Math.PI*2;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
