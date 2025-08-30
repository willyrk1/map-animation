import React from 'react';
import './App.css';
import { modernColorMap } from './paths/modernConstants';
import LongLatPath from "./paths/LongLatPath.tsx";
import { CountryDetails, getCountriesHighRes, latLong2ViewBox } from "./utility.ts";
import austriaHungary from "./AustriaHungary.json"
import austriaHungaryCZ from "./AustriaHungaryCZ.json"
import ahBalkans from "./AHBalkans.json"

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
  // const hiddenCountries = [...austriaHungary, ...austriaHungaryCZ].map(toHiddenWithPathProps)
  const initialCountries = [
    ...getCountriesHighRes(),
  ].map(toWithPathProps)

  return initialCountries
}

const defaultViewBox = latLong2ViewBox(-26, 72, 67, 24)

interface ViewBox {x: number, y: number, width: number, height: number}

function viewBoxFromString(viewBoxString: string) {
  const [x, y, width, height] = viewBoxString.split(' ').map(v => +v)
  return {x, y, width, height}
}

export default function App() {
  const [viewBox, setViewBox] = React.useState(defaultViewBox);
  const [countries, setCountries] = React.useState(initCountries())
  const [step, setStep] = React.useState(0)

  const animationRef = React.useRef<number>();

  const duration = 1000; // Duration in milliseconds (1 second)

  function animateViewBoxChange(startBoxString: string, targetBoxString: string) {
    return function (t: number) {
      const startBox = viewBoxFromString(startBoxString)
      const targetBox = viewBoxFromString(targetBoxString)
      const x = startBox.x + (targetBox.x - startBox.x) * t;
      const y = startBox.y + (targetBox.y - startBox.y) * t;
      const width = startBox.width + (targetBox.width - startBox.width) * t;
      const height = startBox.height + (targetBox.height - startBox.height) * t;

      setViewBox(`${x} ${y} ${width} ${height}`);
    }
  }

  function animateCountryReplacement(fromCountryNames: Array<string>, toCountryName: string, toCountry: CountryDetails) {
    return function (t: number) {
      setCountries(curCountries => {
        const toCountryIndex = curCountries.findIndex(({ name }) => name === toCountryName)
        const curToCountry = curCountries[toCountryIndex] ?? toHiddenWithPathProps(toCountry)
        const newToCountry = {
          ...curToCountry,
          pathProps: {
            ...curToCountry.pathProps,
            opacity: t
          }
        }

        const newCountries = curCountries.toSpliced(
          toCountryIndex >= 0 ? toCountryIndex : curCountries.length,
          1,
          newToCountry
        )

        if (t >= 1) {
          for (const fromCountryName of fromCountryNames) {
            const fromCountryIndex = newCountries.findIndex(({ name }) => name === fromCountryName)
            if (fromCountryIndex >= 0) {
              newCountries.splice(fromCountryIndex, 1)
            }
          }
        }

        return newCountries
      })
    }
  }

  function doAnimation(startTime: number, animateFn: (t: number) => void) {
    const now = performance.now();
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalized time, clamped to [0,1]

    animateFn(t)

    if (t < 1) {
      animationRef.current = requestAnimationFrame(() => doAnimation(startTime, animateFn));
    }
  }

  function startAnimation(animateFn: (t: number) => void) {
    if (animationRef.current !== undefined)
      cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => doAnimation(performance.now(), animateFn));
  }

  React.useEffect(() => {
    // startViewboxAnimation()
    // startOpacityAnimation()
  }, [])

  function handleNext() {
    [
      () => startAnimation(animateViewBoxChange(
        viewBox,
        // latLong2ViewBox(13, 48, 18, 42),
        latLong2ViewBox(7, 52, 19, 40),
      )),
      () => startAnimation(animateCountryReplacement(
        ['Austria', 'Hungary'], 'AustriaHungary', austriaHungary[0]
      )),
      () => startAnimation(animateCountryReplacement(
        ['AustriaHungary'], 'AustriaHungaryCZ', austriaHungaryCZ[0]
      )),
      () => startAnimation(animateCountryReplacement(
        ['AustriaHungaryCZ', 'Slovenia', 'Croatia', 'Bosnia and Herz.'], 'AustriaHungaryBalkans', ahBalkans[0]
      )),
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
