import React from 'react';
import './App.css';
import { modernColorMap } from './paths/modernConstants';
import LongLatPath from "./paths/LongLatPath.tsx";
import { CountryDetails, getCountriesHighRes, latLong2ViewBox } from "./utility.ts";
import austriaHungary from "./AustriaHungary.json"
import austriaHungaryCZ from "./AustriaHungaryCZ.json"

function toWithPathProps(country: CountryDetails): CountryDetails {
  return {
    ...country,
    pathProps: {
      stroke: "black",
      strokeWidth: 0.03,
      fill: modernColorMap[country.name ?? ''] ?? 'none',
    }
  }
}

function toHiddenWithPathProps(country: CountryDetails): CountryDetails {
  const withPathProps = toWithPathProps(country)
  return {
    ...withPathProps,
    pathProps: {
      ...withPathProps.pathProps,
      opacity: 0.0
    }
  }
}

function initCountries() {
  const hiddenCountries = [...austriaHungary, ...austriaHungaryCZ].map(toHiddenWithPathProps)
  const initialCountries = [
    ...getCountriesHighRes().map(toWithPathProps),
    ...hiddenCountries
  ]

  return initialCountries
}

const defaultViewBox = latLong2ViewBox(7, 54, 19, 42)

export default function App() {
  const [viewBox, setViewBox] = React.useState(defaultViewBox);
  const [countries, setCountries] = React.useState(initCountries())
  const [step, setStep] = React.useState(0)

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

  function combineAustriaAndHungary(t: number) {
    setCountries(curCountries => {
      const austriaHungaryIndex = curCountries.findIndex(({ name }) => name === 'AustriaHungary')
      const curAustriaHungary = curCountries[austriaHungaryIndex]
      const newCountries = curCountries.toSpliced(austriaHungaryIndex, 1, {
        ...curAustriaHungary,
        pathProps: {
          ...curAustriaHungary.pathProps,
          opacity: t
        }
      })
      if (t >= 1) {
        const austriaIndex = curCountries.findIndex(({ name }) => name === 'Austria')
        if (austriaIndex >= 0)
          curCountries.splice(austriaIndex, 1)
        const hungaryIndex = curCountries.findIndex(({ name }) => name === 'Hungary')
        if (hungaryIndex >= 0)
          curCountries.splice(hungaryIndex, 1)
      }
      return newCountries
    })
  }

  function combineAHandCZ(t: number) {
    setCountries(curCountries => {
      const austriaHungaryCZIndex = curCountries.findIndex(({ name }) => name === 'AustriaHungaryCZ')
      const curAustriaHungaryCZ = curCountries[austriaHungaryCZIndex]
      const newCountries = curCountries.toSpliced(austriaHungaryCZIndex, 1, {
        ...curAustriaHungaryCZ,
        pathProps: {
          ...curAustriaHungaryCZ.pathProps,
          opacity: t
        }
      })
      if (t >= 1) {
        const austriaHungaryIndex = curCountries.findIndex(({ name }) => name === 'AustriaHungary')
        if (austriaHungaryIndex >= 0)
          curCountries.splice(austriaHungaryIndex, 1)
      }
      return newCountries
    })
  }

  function animateOpacity(startTime: number, animateFn: (t: number) => void) {
    const now = performance.now();
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalized time, clamped to [0,1]

    animateFn(t)

    if (t < 1) {
      animationRef.current = requestAnimationFrame(() => animateOpacity(startTime, animateFn));
    }
  }

  function startOpacityAnimation(animateFn: (t: number) => void) {
    if (animationRef.current !== undefined)
      cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => animateOpacity(performance.now(), animateFn));
  }

  React.useEffect(() => {
    // startViewboxAnimation()
    // startOpacityAnimation()
  }, [])

  function handleNext() {
    [
      () => startOpacityAnimation(combineAustriaAndHungary),
      () => startOpacityAnimation(combineAHandCZ),
    ][step]()

    setStep(curStep => curStep + 1)
  }

  return (
    <div className='container'>
      <button className='next' onClick={handleNext}>NEXT</button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
      >
        {countries.map(({ name, coordinates, pathProps }) => {
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
