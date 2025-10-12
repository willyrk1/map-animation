import React from 'react';
import './App.css';
import LongLatPath from "./paths/PositionPath.tsx";
import { CountryDetails, position2ViewBox, viewBoxFromString } from "./utility.ts";
import mapReducer, { countryReplacement, MapState, MapTransition, MapTransitionList } from './mapReducer.ts';

interface MapAnimationProps {
  transitions: MapTransitionList
  initialState: Omit<MapState, 'step'>
  toWithPathProps: (country: CountryDetails) => CountryDetails
}

export default function MapAnimation(props: MapAnimationProps) {
  const { transitions, initialState: { countries: initialCountries, ...initialRest }, toWithPathProps } = props

  const [state, dispatch] = React.useReducer(mapReducer(transitions, toWithPathProps), { countries: initialCountries.map(toWithPathProps), ...initialRest, step: 0 })
  const { countries, viewBox, step } = state

  const animationRef = React.useRef<number>();

  const duration = 1000; // Duration in milliseconds (1 second)

  function setViewBox(newViewBox: string) {
    dispatch({ type: "setViewBox", newViewBox })
  }

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

  function animateCountryReplacement(fromCountryNames: Array<string>, toCountries: Array<CountryDetails>) {
    return function (t: number) {
      dispatch({ ...countryReplacement(fromCountryNames, toCountries.map(toHiddenWithPathProps)), opacity: t})
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

  function getAnimationFunction(transition: MapTransition) {
    switch (transition.type) {
      case "CountryReplacement":
        return animateCountryReplacement(transition.fromCountryNames, transition.toCountries)
      case "ViewBoxChange":
        return animateViewBoxChange(viewBox, position2ViewBox(transition.left, transition.top, transition.right, transition.bottom))
      default:
        const _exhaustiveCheck: never = transition;
        return _exhaustiveCheck;
    }
  }

  function handleNext() {
    const transition = transitions[step](state);
    if (transition) {
      startAnimation(getAnimationFunction(transition))
    }

    dispatch({ type: "incrementStep" })
  }

  function handleReInit() {
    dispatch({ type: "reInit", countries: initialCountries.map(toWithPathProps), ...initialRest})
  }

  function handleDirectStep(newStep: number) {
    dispatch({ type: "directStep", step: newStep, countries: initialCountries.map(toWithPathProps), ...initialRest})
  }

  return (
    <div className='container'>
      <div className='controls'>
        <button onClick={handleNext}>NEXT</button>
        <div>
          <button onClick={handleReInit}>Start</button>
          {transitions.map((_t, index) => (
            <button onClick={() => handleDirectStep(index)} key={`step${index}`}>
              {index}
            </button>
          ))}
        </div>
      </div>
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
