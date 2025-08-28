import React from 'react';
import './App.css';
import {modernColorMap} from './paths/modernConstants';
import LongLatPath from "./paths/LongLatPath.tsx";
import {CountryDetails, getCountriesHighRes, latLong2ViewBox} from "./utility.ts";
import austriaHungary from "./AustriaHungary.json"

const defaultViewBox = latLong2ViewBox(7, 51, 19, 44)

export default function App() {
  // const [viewBox, setViewBox] = React.useState("504 305 13 13");
  // const [viewBox, setViewBox] = React.useState('0 0 360 360');
  const [viewBox, setViewBox] = React.useState(defaultViewBox);
  // const [viewBox, setViewBox] = React.useState(latLong2ViewBox(-12, 60, 51, 33));
  const [animationOpacity, setAnimationOpacity] = React.useState(0.0)

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

  function startViewboxAnimation() {
    if (animationRef.current !== undefined)
      cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => animateViewBox(performance.now()));
  }

  function animateOpacity(startTime: number) {
    const now = performance.now();
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalized time, clamped to [0,1]

    // Interpolate each value
    setAnimationOpacity(t);
    console.log('QQQ1', t)

    if (t < 1) {
      animationRef.current = requestAnimationFrame(() => animateOpacity(startTime));
    }
  }

  function startOpacityAnimation() {
    if (animationRef.current !== undefined)
      cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => animateOpacity(performance.now()));
  }

  React.useEffect(() => {
    // startViewboxAnimation()
    startOpacityAnimation()
  }, [])

  function transformFn(input: React.SVGProps<SVGPathElement>): React.SVGProps<SVGPathElement> {
    return {
      ...input,
      stroke: "black",
      strokeWidth: 0.03,
      fill: modernColorMap[input.name ?? ''] ?? 'none',
      opacity: (input.name === 'AustriaHungary') ? animationOpacity : /*(input.name === 'Austria') ? 1.0 - animationOpacity :*/ 1.0,
    }
  }

  const modernCountries = getCountriesHighRes()

  const displayCountries = {
    ...modernCountries,
    ...(austriaHungary as unknown as Record<string, CountryDetails>)
  }

  return (
    <div className='container'>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
      >
        {Object.values(displayCountries).map(({name, coordinates}) => {
          return coordinates.map(countryCoordinates => (
              <LongLatPath countryName={name}
                           countryCoordinates={countryCoordinates}
                           transformFn={transformFn}
              />
          ))
        })}
      </svg>
    </div>
  )
}
