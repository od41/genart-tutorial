// dot pattern
const canvasSketch = require('canvas-sketch');
const {lerp} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {

  const createGrid = () => {
    const points = [];
    const count = 74;

    // determine x, y points for the grid. 
    // It'll be a count by count square grid
    for(let x = 0; x<count; x++) {
      for(let y = 0; y < count; y++) {
        const u = count <=1 ? 0.5 : x / (count - 1);
        const v = count <=1 ? 0.5 : y / (count - 1);
        points.push([u, v]);
      }
    }

    return points;
  }

  // random seed
  random.setSeed(193)
  // draw grid points randomly
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 300;

  return ({ context, width, height }) => {
    context.fillStyle = '#2a231d';
    context.fillRect(0, 0, width, height);

    points.forEach(([u,v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2, false )
      context.fillStyle = '#fff093';
    //   context.lineWidth = 15;
      context.fill();

    });
  };
};

canvasSketch(sketch, settings);
