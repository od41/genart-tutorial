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
  varying vec2 vUv;
  uniform float aspect;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {

    vec2 center = vUv - 0.5;
    center.y /= aspect;

    float dist = length(center);

    float alpha = smoothstep(0.2, 0.1, dist);

    // float n = noise(vec3(vUv.xy * 2.0, time));
    float n = noise(vec3(center * 3.25, time/2.0));

    vec3 color = hsl2rgb(
      0.7 + n / 0.11,
      0.5,
      0.4
    );

    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'black',
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
