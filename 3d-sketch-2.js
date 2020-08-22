// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const BezierEasing = require('bezier-easing');
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require("eases");
const glsl = require("glslify");

// Include any additional ThreeJS examples below
// require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [512, 512],
  fps: 24,
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 90%)', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  camera.position.set(4, 2, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  const fragmentShader = glsl(`
    varying vec2 vUv;
    uniform vec3 color;
    uniform float playhead;
    #pragma glslify: noise = require("glsl-noise/simplex/3d");

    void main () {
        float offset = 0.9 * noise(vec3(vUv.xy * 0.50, playhead));
        gl_FragColor = vec4(vec3(color * vUv.y + offset), 1.0);
    }
  
  `);

  const vertexShader = glsl(`
  varying vec2 vUv;
  uniform float time;
  uniform float playhead;

  #pragma glslify: noise = require("glsl-noise/simplex/4d");
  void main () {
    vUv = uv;
    vec3 pos = position.xyz;
    pos += 0.05 * normal * noise(vec4(pos.xyz * 10.0, playhead ));
    pos += 0.25 * normal * noise(vec4(pos.xyz * 100.0, 0.0));
    pos += 0.01 * normal * noise(vec4(pos.xyz * 100.0, 0.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }

`);

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const meshes = [];
  for(let i=0; i<1; i++) {
      // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(
          geometry, 
          new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
              time: {value: 0},
              playhead: {value: 0},
              color: {value: new THREE.Color(random.pick(random.pick(palettes)))}
            },
            // roughness: 0.75,
            // flatShading: true,
            // wireframe: true
          })
        );
    // mesh.position.set(
    //     random.range(-1, 1), 
    //     random.range(-1, 1),
    //     random.range(-1, 1));
    // mesh.scale.set(
    //   random.range(-1, 1), 
    //   random.range(-1, 1),
    //   random.range(-1, 1));
    mesh.scale.multiplyScalar(0.3)
    scene.add(mesh);

    // store individual mesh
    meshes.push(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(174, 9%, 23%)'))

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(2, 2, 4)
  scene.add(light);

  const ease = BezierEasing(0.74, -0.01, 0.21, 0.99);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 1.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead, time }) {
      const t = Math.sin(playhead * Math.PI * 2) ;
      scene.rotation.y = eases.expoInOut(t); 
      scene.rotation.x= eases.expoIn(t / 2)

      meshes.forEach(mesh => {
        mesh.material.uniforms.time.value = time;
        mesh.material.uniforms.playhead.value = playhead;
      })

      // scene.rotation.x = ease(playhead) * Math.PI * 2; 
      // scene.rotation.y = time * 0.05; 
      // controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
