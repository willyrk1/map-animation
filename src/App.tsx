import React from 'react';
import './App.css';
import ModernWorld from './paths/ModernWorld';
import { modernColorMap } from './paths/modernConstants';
import AustriaHungary from './paths/AustriaHungary';
import PathBuilder from "./paths/PathBuilder.tsx";
import modernCountries from "./modernCountriesEvery5mi.json"
import {CountryDetails} from "./utility.ts";

export default function App() {
  // const [viewBox, setViewBox] = React.useState("504 305 13 13");
  const [viewBox, setViewBox] = React.useState("0 0 360 260");
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
    // startAnimation()
  }, [])

  function transformFn(input: React.SVGProps<SVGPathElement>): React.SVGProps<SVGPathElement> {
    return {
      ...input,
      stroke: "black",
      strokeWidth: 0.1,
      fill: modernColorMap[input.title],
    }
  }

  function transformFn2(input: React.SVGProps<SVGPathElement>): React.SVGProps<SVGPathElement> {
    const modernColorMap2 = {...modernColorMap, 'Austria': '#66cdff'}
    return {
      ...input,
      stroke: "black",
      strokeWidth: 0.1,
      fill: modernColorMap2[input.title],
    }
  }

  return (
    <div className='container'>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
      >
        {Object.values<CountryDetails>(modernCountries).map(({ coordinates }) => {
          return coordinates.map(countryCoordinates => <PathBuilder countryCoordinates={countryCoordinates} />)
        })}

        {/*<ModernWorld transformFn={transformFn} />*/}
        {/*<AustriaHungary transformFn={transformFn2}/>*/}
      </svg>
    </div>
  );
}
