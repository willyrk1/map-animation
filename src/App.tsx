import React from 'react';
import './App.css';
import {modernColorMap} from './paths/modernConstants';
import LongLatPath from "./paths/PositionPath.tsx";
import { CountryDetails, position2ViewBox, joinShapes, viewBoxFromString } from "./utility.ts";
import {getCountriesHighRes, getVojvodina} from './countries.ts';

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
  const initialCountries = [
    ...getCountriesHighRes(),
  ].map(toWithPathProps)

  return initialCountries
}

const defaultViewBox = position2ViewBox(-26, 72, 67, 24)

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
        // latLong2ViewBox(17.3, 43.2, 18.7, 42.1),
        // latLong2ViewBox(13, 47, 20, 42.1),
        position2ViewBox(7, 52, 19, 40),
      )),
      () => {
        const austriaCoordinates = countries.find(({ name }) => name === 'Austria')?.coordinates[0]
        const hungaryCoordinates = countries.find(({ name }) => name === 'Hungary')?.coordinates[0]
        if (austriaCoordinates && hungaryCoordinates) {
          const austriaHungaryCoordinates = joinShapes(austriaCoordinates, hungaryCoordinates)
          const austriaHungary = {
            "name": "AustriaHungary",
            "coordinates": [austriaHungaryCoordinates]
          }
          startAnimation(animateCountryReplacement(
            ['Austria', 'Hungary'], 'AustriaHungary', austriaHungary
          ))
        }
      },
      () => {
        const ahCoordinates = countries.find(({ name }) => name === 'AustriaHungary')?.coordinates[0]
        const czechiaCoordinates = countries.find(({ name }) => name === 'Czechia')?.coordinates[0]
        const slovakiaCoordinates = countries.find(({ name }) => name === 'Slovakia')?.coordinates[0]
        if (ahCoordinates && czechiaCoordinates && slovakiaCoordinates) {
          const ahczCoordinates = joinShapes(ahCoordinates, czechiaCoordinates, slovakiaCoordinates)
          const austriaHungaryCZ = {
            "name": "AustriaHungaryCZ",
            "coordinates": [ahczCoordinates]
          }
          startAnimation(animateCountryReplacement(
            ['AustriaHungary'], 'AustriaHungaryCZ', austriaHungaryCZ
          ))
        }
      },
      () => {
        const ahczCoordinates = countries.find(({ name }) => name === 'AustriaHungaryCZ')?.coordinates[0]
        const sloveniaCoordinates = countries.find(({ name }) => name === 'Slovenia')?.coordinates[0]
        const croatiaCoordinates = countries.find(({ name }) => name === 'Croatia')?.coordinates
        const bosniaCoordinates = countries.find(({ name }) => name === 'Bosnia and Herz.')?.coordinates[0]
        if (ahczCoordinates && sloveniaCoordinates && croatiaCoordinates && bosniaCoordinates) {
          const [croatiaMain, croatiaExclave, ...croatiaRest] = croatiaCoordinates
          const ahBalkansCoordinates = joinShapes(ahczCoordinates, sloveniaCoordinates, croatiaMain, bosniaCoordinates, croatiaExclave)
          const austriaHungaryBalkans = {
            "name": "AustriaHungaryBalkans",
            "coordinates": [ahBalkansCoordinates, ...croatiaRest]
          }
          startAnimation(animateCountryReplacement(
            ['AustriaHungaryCZ', 'Slovenia', 'Croatia', 'Bosnia and Herz.'], 'AustriaHungaryBalkans', austriaHungaryBalkans
          ))
        }
      },
      () => {
        const ahBalkansCoordinates = countries.find(({ name }) => name === 'AustriaHungaryBalkans')?.coordinates
        const romaniaCoordinates = countries.find(({ name }) => name === 'Romania')?.coordinates
        const serbiaCoordinates = countries.find(({name}) => name === 'Serbia')?.coordinates
        if (ahBalkansCoordinates && romaniaCoordinates && serbiaCoordinates) {
          const [ahBalkansMain, ...ahBalkansRest] = ahBalkansCoordinates
          const vojvodinaCoordinates = getVojvodina(ahBalkansMain, romaniaCoordinates[0], serbiaCoordinates[0]).coordinates[0]
          const ahSerbiaCoordinates = joinShapes(ahBalkansMain, vojvodinaCoordinates)
          const austriaHungarySerbia = {
            "name": "AustriaHungarySerbia",
            "coordinates": [ahSerbiaCoordinates, ...ahBalkansRest]
          }
          startAnimation(animateCountryReplacement(
              ['AustriaHungaryBalkans'], 'AustriaHungarySerbia', austriaHungarySerbia
          ))
        }
      },
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
