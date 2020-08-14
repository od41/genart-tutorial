const canvasSketch = require('canvas-sketch');
const {lerp} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');


const settings = {
  dimensions: [2048, 2048],
  duration: 10,
  scaleToView: true,
  playbackRate: 'throttle',
  animate: true,
  fps: 24
};

const sketch = ({update}) => {
  const palette = random.pick(palettes);

  const createGrid = () => {
    const points = [];
    const count = 200;

    // determine x, y points for the grid. 
    // It'll be a count by count square grid
    for(let x = 0; x<count; x++) {
      for(let y = 0; y < count; y++) {
        const u = count <=1 ? 0.5 : x / (count - 1);
        const v = count <=1 ? 0.5 : y / (count - 1);
        points.push({
          color: random.pick(palette),
          radius: Math.abs(random.gaussian() * 0.015),
          position: [u, v]});
      }
    }

    return points;
  }

 

  

  return ({ context, frame, width, height, playhead }) => {
    context.fillStyle = '#ffffff';
    // context.fillStyle = random.pick(palette);
    context.fillRect(0, 0, width, height);
    const margin = width * 0.175;
    let seed = 10;
    setInterval((seed = random.noise1D(seed)), 300);
    random.setSeed(seed);
    // random seed
    // random.setSeed(1)
    // draw grid points randomly
    // let points = createGrid().filter(() => random.value() > 0.75);
    let points = createGrid();
    points = random.shuffle(points);

    points.forEach(data => {
      const {radius, position, color } = data;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      
      const vector = random.noise2D(u, v)
      const n = vector* 0.5 + 0.5;

      const L = Math.floor(n*100);
      const hsl = `hsl(0,0%, ${L}%)`;
      // const hsl = '#000000';


      context.beginPath();
      context.arc(x, y, 20, 0, Math.PI * 2, false )
      context.fillStyle = hsl;
      // context.lineWidth = 15;
      context.fill();

    });
  };
};

canvasSketch(sketch, settings);
