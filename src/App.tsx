import React from 'react';
import './App.css';
import BosniaHerzegovina from './paths/BosniaHerzegovina';
import Croatia from './paths/Croatia';
import Serbia from './paths/Serbia';
import Kosovo from './paths/Kosovo';
import Montenegro from './paths/Montenegro';
import Albania from './paths/Albania';
import NorthMacedonia from './paths/NorthMacedonia';
import Greece from './paths/Greece';
import Bulgaria from './paths/Bulgaria';
import Romania from './paths/Romania';
import Turkey from './paths/Turkey';
import Armenia from './paths/Armenia';
import Moldova from './paths/Moldova';
import Ukraine from './paths/Ukraine';
import Hungary from './paths/Hungary';
import Slovenia from './paths/Slovenia';
import Italy from './paths/Italy';
import Slovakia from './paths/Slovakia';
import Czechia from './paths/Czechia';
import Poland from './paths/Poland';
import Austria from './paths/Austria';
import Russia from './paths/Russia';
import Georgia from './paths/Georgia';
import Azerbaijan from './paths/Azerbaijan';
import Belarus from './paths/Belarus';
import Lithuania from './paths/Lithuania';
import Latvia from './paths/Latvia';
import Estonia from './paths/Estonia';
import Germany from './paths/Germany';
import Switzerland from './paths/Switzerland';
import France from './paths/France';
import Luxembourg from './paths/Luxembourg';
import Belgium from './paths/Belgium';
import Netherlands from './paths/Netherlands';
import Spain from './paths/Spain';
import Portugal from './paths/Portugal';

export default function App() {
  const [viewBox, setViewBox] = React.useState("0 0 100 100");
  const animationRef = React.useRef<number>();

  const startBox = { x: 500, y: 50, width: 400, height: 400 };
  const targetBox = { x: 500, y: 225, width: 150, height: 150 };
  const duration = 1000; // Duration in milliseconds (1 second)

  function animateViewBox(startTime: number) {
    const now = performance.now();
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalized time, clamped to [0,1]

    // Interpolate each value
    const x = startBox.x + (targetBox.x - startBox.x) * t;
    const y = startBox.y + (targetBox.y - startBox.y) * t;
    const width = startBox.width + (targetBox.width - startBox.width) * t;
    const height = startBox.height + (targetBox.height - startBox.height) * t;

    setViewBox(`${x} ${y} ${width} ${height}`);

    if (t < 1) {
      animationRef.current = requestAnimationFrame(() => animateViewBox(startTime));
    }
  }

  function startAnimation() {
    if (animationRef.current !== undefined)
      cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => animateViewBox(performance.now()));
  }

  React.useEffect(() => {
    startAnimation()
  }, [])

  return (
    <div className='container'>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
      >
        <BosniaHerzegovina fill='#e6e000' />
        <Croatia fill='green' />
        <Serbia fill='#00e6d2' />
        <Kosovo fill='green' />
        <Montenegro fill='#cc0012' />
        <Albania fill='#4d54ff' />
        <NorthMacedonia fill='#e6e000' />
        <Greece fill='#cc0012' />
        <Bulgaria fill='#80ff8c' />
        <Romania fill='#ffe600' />
        <Turkey fill='#4d54ff' />
        <Armenia fill='#cc0012' />
        <Azerbaijan fill='#a600b3' />
        <Moldova fill='#991300' />
        <Ukraine fill='#00b4ff' />
        <Hungary fill='#ff808b' />
        <Slovenia fill='#4d54ff' />
        <Austria fill='#e200ff' />
        <Italy fill='#ff3377' />
        <Slovakia fill='#8bff66' />
        <Czechia fill='#cc0012' />
        <Poland fill='#e6e000' />
        <Russia fill='green' />
        <Georgia fill='#e6e000' />
        <Belarus fill='#cc0012' />
        <Lithuania fill='#001fcc' />
        <Latvia fill='#8400b3' />
        <Estonia fill='#aa4200' />
        <Germany fill='#002780' />
        <Switzerland fill='#fff54d' />
        <France fill='#bcff4d' />
        <Luxembourg fill='#b30016' />
        <Belgium fill='#1afffd' />
        <Netherlands fill='#ffc833' />
        <Spain fill='#000eb3' />
        <Portugal fill='#ff0024' />
      </svg>
    </div>
  );
}
