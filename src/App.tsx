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

  const [countries, setCountries] = React.useState(initCountries)

  function initCountries(): Record<string, CountryDetails> {
    // const baseCountries = getCountriesHighRes()
    const initialCountries = {
      // "Austria": baseCountries["Austria"],
      // "Hungary": baseCountries["Hungary"],
      // "Czechia": baseCountries["Czechia"],
      // "Slovakia": baseCountries["Slovakia"],
      ...getCountriesHighRes(),
      ...(austriaHungary as unknown as Record<string, CountryDetails>)
    }
    for (const name in initialCountries) {
      initialCountries[name].pathProps = {
        stroke: "black",
        strokeWidth: 0.03,
        fill: modernColorMap[name ?? ''] ?? 'none',
        opacity: (name === 'AustriaHungary') ? 0.0 : 1.0,
      }
    }
    return initialCountries
  }

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
    setCountries(curCountries => {
      const curAustriaHungary = curCountries['AustriaHungary']
      const newAustriaHungary: CountryDetails = {
        ...curAustriaHungary,
        pathProps: {
          ...curAustriaHungary.pathProps,
          opacity: t
        }
      }
      return { ...curCountries, 'AustriaHungary': newAustriaHungary }
    })
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
    // startOpacityAnimation()
  }, [])

  function handleNext() {
    startOpacityAnimation()
  }

  return (
    <div className='container'>
      <button className='next' onClick={handleNext}>NEXT</button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
      >
        {Object.values(countries).map(({name, coordinates, pathProps}) => {
          return coordinates.map((countryCoordinates, index) => (
              <LongLatPath key={`${name}${index}`}
                           countryName={name}
                           countryCoordinates={countryCoordinates}
                           pathProps={pathProps}
              />
          ))
        })}
      </svg>
    </div>
  )
}
