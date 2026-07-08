import React from 'react';
import './App.css';
import PositionPath from "./PositionPath.tsx";
import { CountryDetails, lat2y } from "./utility.ts";
import mapReducer, { MapSteps, SteplessMapState, stepsWithPathProps } from './mapReducer.ts';
import SvgTextBox from './SvgTextBox.tsx';
import CountryHighlight from './CountryHighlight.tsx';
import PulsingCircle from './PulsingCircle.tsx';
import MapControls from './MapControls.tsx';

interface MapAnimationProps {
  steps: MapSteps
  initialState: SteplessMapState
  toWithPathProps: (country: CountryDetails) => CountryDetails
}

const [northLat, southLat] = [85, -60]
const WORLDHEIGHT = lat2y(northLat) - lat2y(southLat)

export default function MapAnimation(props: MapAnimationProps) {
  const { steps, initialState: { countries: initialCountries, ...initialRest }, toWithPathProps } = props

  const [state, dispatch] = React.useReducer(
    mapReducer,
    { steps: stepsWithPathProps(steps, toWithPathProps), countries: initialCountries.map(toWithPathProps), ...initialRest, step: 0 }
  )
  const { countries, textCollection, highlightCollection, viewCenter, zoom, step } = state

  const viewBox = React.useMemo(() => {
    const height = WORLDHEIGHT / zoom
    const [long, lat] = viewCenter
    const [x, y] = [long + 180, 180 - lat2y(lat)]
    return `${x - 1} ${y - height / 2} 2 ${height}`
  }, [viewCenter, zoom])

  const animationRef = React.useRef<number>();

  const duration = 1000; // Duration in milliseconds (1 second)

  function doAnimation(startTime: number) {
    const now = performance.now();
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalized time, clamped to [0,1]

    dispatch({ type: "doTransitions", percentage: t })

    if (t < 1) {
      animationRef.current = requestAnimationFrame(() => doAnimation(startTime));
    }
  }

  function startAnimation() {
    if (animationRef.current !== undefined)
      cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => doAnimation(performance.now()));
  }

  function handleNext() {
    if (step >= steps.length) return
    startAnimation()

    // Increment step and also save initial values for transitions that need them.
    dispatch({ type: "startAnimation" })
  }

  function handleReInit() {
    dispatch({ type: "reInit" })
  }

  function handleDirectStep(newStep: number) {
    dispatch({ type: "directStep", step: newStep })
  }

  return (
    <div className='viewport'>
      <div className='container'>
        <MapControls {...{ handleReInit, handleDirectStep, handleNext, steps, step }} />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
          {countries.map(({ name, coordinates, pathProps }) => {
            return coordinates.map((countryCoordinates, index) => (
              <PositionPath key={`${name}${index}`}
                countryName={name}
                countryCoordinates={countryCoordinates}
                pathProps={pathProps}
              />
            ))
          })}
          <g>
            {highlightCollection.map(highlight => {
              const coordinates = highlight.coordinates ?? countries.find(({ name }) => name === highlight.id)?.coordinates
              if (!coordinates) return null
              return <CountryHighlight key={highlight.id} highlight={highlight} coordinates={coordinates} zoom={zoom} />
            })}
            {steps[step - 1]?.circles?.map((circle, i) => (
              <PulsingCircle key={i} {...circle} zoom={zoom} />
            ))}
          </g>
          <g fontSize={6 / zoom}>
            {textCollection.map(mapText => (
              <SvgTextBox key={mapText.id} {...mapText} zoom={zoom} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
