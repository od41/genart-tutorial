const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(/* glsl */`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  void main () {
    vec3 colorA = (cos(time) / 2.0) + vec3(0.6, 0.3, 0.0);
    vec3 colorB = vec3(0.2, 0.5, 0.0);

    vec2 center = vUv - 0.5;
    center.y /= aspect;

    float dist = length(center);

    float alpha = smoothstep(0.255, 0.05, dist);

    vec3 color = mix(colorB, colorA, vUv.y + vUv.x * sin(time));
    gl_FragColor = vec4(color, alpha);
  }
`);
 /* vec3 color = vec3(sin(time) + 1.0); 
    vec3 color = mix(sin(colorA) + 1.0, sin(colorB) *0.5, vUv.x);
 */

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width/height,
    }
  });
};

canvasSketch(sketch, settings);
