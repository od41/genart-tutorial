const canvasSketch = require('canvas-sketch');
const {lerp} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');


// random.setSeed(random.getRandomSeed())
// console.log(random.getSeed());

const settings = {
  suffix: random.getSeed(),
  dimensions: [1080, 1080]
};



const sketch = () => {
  const palette = random.pick(palettes);

  const createGrid = () => {
    const points = [];
    const count = 6;

    // determine x, y points for the grid. 
    // It'll be a count by count square grid
    for(let x = 0; x<count; x++) {
      for(let y = 0; y < count; y++) {
        const u = count <=1 ? 0.5 : x / (count - 1);
        const v = count <=1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.12;
        points.push({
          // radius: Math.abs(0.01 + random.gaussian() * 0.015),
          radius: radius,
          rotation: random.noise2D(u, v) + 95,
          position: [u, v]});
      }
    }

    return points;
  }


  const drawTrapezoid = (pointA, pointB) => {
    //   assume a 6x6 grid
    // always from from pointA to pointB and then close shape at the base of the grid
    const gridBase = 930;
    
    // four corners of the trapezoid
    let c1, c2, c3, c4;

    c1 = pointA;
    c2 = pointB;

    c3 = {
        x: pointB.x,
        y: gridBase // the base of the grid, assuming 6x6 grid
    };

    c4 = {
        x: pointA.x,
        y: gridBase // the base of the grid, assuming 6x6 grid
    }

    // return [c1, c2, c3, c4]
    return {c1: c1, c2: c2, c3: c3, c4: c4, color: random.pick(random.pick(palettes))}

  }
  // deterministic random seed
  // random.setSeed(256)
  
  let points = createGrid()

  return ({ context, width, height }) => {
    //   console.log(palettes)
    const bgColour = '#eaeaea';
    context.fillStyle = bgColour;
    context.fillRect(0, 0, width, height);
    const margin = 150;

    // points.forEach(data => {
    //   const { radius, position, rotation } = data;
    //   const [u, v] = position;
    //   const x = lerp(margin, width - margin, u);
    //   const y = lerp(margin, height - margin, v);

    // // console.log(x,y)
      
    //   context.beginPath();
    //   context.arc(x, y, 5, 0, Math.PI * 2, false )
    //   context.fillStyle = 'black';
    //   // context.lineWidth = 15;
    //   context.fill();

    // });



   let k = 0;
  //  let somePoints = []

   let somePoints = points.filter(point => point.position[1] < 1)
  //  for(i=0; i<30; i++) {
  //    somePoints.push(points[i])
  //  }

  //  console.log('points', points)
  //  console.log('some points', somePoints)

    while(k<15) {
        console.log('some points', somePoints)

        const p1 = random.pick(somePoints)
        const p2 = random.pick(somePoints)
        
        const [u1, v1] = p1.position;
        const x1 = lerp(margin, width - margin, u1);
        const y1 = lerp(margin, height - margin, v1);

        const [u2, v2] = p2.position;
        const x2 = lerp(margin, width - margin, u2);
        const y2 = lerp(margin, height - margin, v2);
        
        console.log(u1,v1)
        console.log(u2,v2)
        const trap = drawTrapezoid({x:x1,y:y1}, {x:x2,y:y2});

        const {c1, c2, c3, c4, color} = trap;
        // console.log(trap)
        context.save()
        context.beginPath();
        context.moveTo(c1.x, c1.y);
        context.lineTo(c2.x, c2.y);
        context.lineTo(c3.x, c3.y);
        context.lineTo(c4.x, c4.y);
        context.closePath();
        context.fillStyle = color;
        context.fill();
        context.strokeStyle = bgColour;
        context.lineWidth = 15;
        context.stroke()
        context.restore()

        console.log(k);
        k++;

        // remove p1 and p2 from somePoints
        somePoints.splice(somePoints.indexOf(p1), 1)
        somePoints.splice(somePoints.indexOf(p2), 1)
    }

    let a = {x:2,y:3}
    let b = {x:1,y:2}
    // let b = [3,5]
    // const trap = drawTrapezoid(a,b);

    // const {c1, c2, c3, c4} = trap;
    // console.log(trap)
    // context.beginPath();
    // context.moveTo(c1.x * 100, c1.y * 100);
    // context.lineTo(c2.x * 100, c2.y * 100);
    // context.lineTo(c3.x * 100, c3.y * 100);
    // context.lineTo(c4.x * 100, c4.y * 100);
    // context.fillStyle = 'red';
    // context.fill()
    
  };
};

canvasSketch(sketch, settings);
