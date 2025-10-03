import React from 'react';
import './App.css';
import { modernColorMap } from './paths/modernConstants';
import LongLatPath from "./paths/PositionPath.tsx";
import { CountryDetails, position2ViewBox, union, viewBoxFromString } from "./utility.ts";
import { getCountriesHighRes, getGaliciaBukovina, getNERomania } from './countries.ts';
import vojvodinaJson from "./data/Vojvodina.json"
import exRomaniaJson from "./data/exRomania.json"
import trentinoSouthTyrolJson from "./data/TrentinoSouthTyrol.json"

function toWithPathProps(country: CountryDetails): CountryDetails {
  return {
    ...country,
    pathProps: {
      stroke: "black",
      strokeWidth: 0.03,
      fill: modernColorMap[country.name ?? ''] ?? 'none',
      ...country.pathProps
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
  const [countries, setCountries] = React.useState(() => initCountries())
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

  function animateCountryReplacement(fromCountryNames: Array<string>, toCountries: Array<CountryDetails>) {
    return function (t: number) {
      setCountries(curCountries => {
        const newCountries = [...curCountries]

        for (let toCountry of toCountries) {
          const toCountryIndex = newCountries.findIndex(({ name }) => name === toCountry.name)
          const curToCountry = newCountries[toCountryIndex] ?? toHiddenWithPathProps(toCountry)
          const newToCountry = {
            ...curToCountry,
            pathProps: {
              ...curToCountry.pathProps,
              opacity: t
            }
          }

          newCountries.splice(
            toCountryIndex >= 0 ? toCountryIndex : newCountries.length,
            1,
            newToCountry
          )
        }

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
        position2ViewBox(7, 52, 19, 40),
      )),
      () => {
        const austriaCoordinates = countries.find(({ name }) => name === 'Austria')?.coordinates
        const hungaryCoordinates = countries.find(({ name }) => name === 'Hungary')?.coordinates
        if (austriaCoordinates && hungaryCoordinates) {
          const austriaHungaryCoordinates = union(austriaCoordinates, hungaryCoordinates)
          const austriaHungary = {
            "name": "AustriaHungary",
            "coordinates": austriaHungaryCoordinates
          }
          startAnimation(animateCountryReplacement(['Austria', 'Hungary'], [austriaHungary]))
        }
      },
      () => {
        const ahCoordinates = countries.find(({ name }) => name === 'AustriaHungary')?.coordinates
        const czechiaCoordinates = countries.find(({ name }) => name === 'Czechia')?.coordinates
        const slovakiaCoordinates = countries.find(({ name }) => name === 'Slovakia')?.coordinates
        if (ahCoordinates && czechiaCoordinates && slovakiaCoordinates) {
          const ahczCoordinates = union(ahCoordinates, czechiaCoordinates, slovakiaCoordinates)
          const austriaHungaryCZ = {
            "name": "AustriaHungaryCZ",
            "coordinates": ahczCoordinates
          }
          startAnimation(animateCountryReplacement(['AustriaHungary'], [austriaHungaryCZ]))
        }
      },
      () => {
        const ahczCoordinates = countries.find(({ name }) => name === 'AustriaHungaryCZ')?.coordinates
        const sloveniaCoordinates = countries.find(({ name }) => name === 'Slovenia')?.coordinates
        const croatiaCoordinates = countries.find(({ name }) => name === 'Croatia')?.coordinates
        const bosniaCoordinates = countries.find(({ name }) => name === 'Bosnia and Herz.')?.coordinates
        if (ahczCoordinates && sloveniaCoordinates && croatiaCoordinates && bosniaCoordinates) {
          const [croatiaMain, croatiaExclave, ...croatiaRest] = croatiaCoordinates
          const ahBalkansCoordinates = union(ahczCoordinates, sloveniaCoordinates, [croatiaMain], [croatiaExclave], bosniaCoordinates)
          const austriaHungaryBalkans = {
            "name": "AustriaHungaryBalkans",
            "coordinates": [...ahBalkansCoordinates, ...croatiaRest]
          }
          startAnimation(animateCountryReplacement(['AustriaHungaryCZ', 'Slovenia', 'Croatia', 'Bosnia and Herz.'], [austriaHungaryBalkans]))
        }
      },
      () => {
        const ahBalkansCoordinates = countries.find(({ name }) => name === 'AustriaHungaryBalkans')?.coordinates
        if (ahBalkansCoordinates) {
          const [_ahBalkansMain, ...ahBalkansRest] = ahBalkansCoordinates
          const ahItalyCoordinates = union(ahBalkansCoordinates, [trentinoSouthTyrolJson])
          const austriaHungaryItaly = {
            "name": "AustriaHungaryItaly",
            "coordinates": [...ahItalyCoordinates, ...ahBalkansRest]
          }
          startAnimation(animateCountryReplacement(['AustriaHungaryBalkans'], [austriaHungaryItaly]))
        }
      },
      () => {
        const ahItalyCoordinates = countries.find(({ name }) => name === 'AustriaHungaryItaly')?.coordinates
        if (ahItalyCoordinates) {
          const [_ahItalyMain, ...ahItalyRest] = ahItalyCoordinates
          const ahSerbiaCoordinates = union(ahItalyCoordinates, [vojvodinaJson])
          const austriaHungarySerbia = {
            "name": "AustriaHungarySerbia",
            "coordinates": [...ahSerbiaCoordinates, ...ahItalyRest]
          }
          startAnimation(animateCountryReplacement(['AustriaHungaryItaly'], [austriaHungarySerbia]))
        }
      },
      () => {
        const ahSerbiaCoordinates = countries.find(({ name }) => name === 'AustriaHungarySerbia')?.coordinates
        const romaniaCoordinates = countries.find(({ name }) => name === 'Romania')?.coordinates
        if (ahSerbiaCoordinates && romaniaCoordinates) {
          const [_romaniaMain, ...romaniaRest] = romaniaCoordinates
          const origRomaniaCoordinates = union(romaniaCoordinates, getNERomania(romaniaCoordinates))
          const origRomania = {
            "name": "NewRomania",
            "coordinates": [...origRomaniaCoordinates, ...romaniaRest]
          }
          const [_ahSerbiaMain, ...ahSerbiaRest] = ahSerbiaCoordinates
          const ahRomaniaCoordinates = union(ahSerbiaCoordinates, [exRomaniaJson])
          const austriaHungaryRomania = {
            "name": "AustriaHungaryRomania",
            "coordinates": [...ahRomaniaCoordinates, ...ahSerbiaRest]
          }
          startAnimation(animateCountryReplacement(['AustriaHungarySerbia', 'Romania'], [origRomania, austriaHungaryRomania]))
        }
      },
      () => {
        const ahRomaniaCoordinates = countries.find(({ name }) => name === 'AustriaHungaryRomania')?.coordinates
        if (ahRomaniaCoordinates) {
          const [_ahRomaniaMain, ...ahRomaniaRest] = ahRomaniaCoordinates
          const ahFinalCoordinates = union(ahRomaniaCoordinates, getGaliciaBukovina())
          const austriaHungaryFinal = {
            "name": "AustriaHungaryFinal",
            "coordinates": [...ahFinalCoordinates, ...ahRomaniaRest]
          }
          startAnimation(animateCountryReplacement(['AustriaHungaryRomania'], [austriaHungaryFinal]))
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
