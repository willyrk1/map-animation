import React from 'react';
import './App.css';
import Country from "./Country.tsx";
import { CountryDetails } from "./utility.ts";
import mapReducer, { MapSteps, SteplessMapState, stepsWithPathProps } from './mapReducer.ts';
import SvgTextBox from './SvgTextBox.tsx';
import CountryHighlight from './CountryHighlight.tsx';
import CurvedArrow from './CurvedArrow.tsx';
import PulsingCircle from './PulsingCircle.tsx';
import MapControls from './MapControls.tsx';
import SvgContainer from './SvgContainer.tsx';

interface MapAnimationProps {
  steps: MapSteps
  initialState: SteplessMapState
  toWithPathProps: (country: CountryDetails) => CountryDetails
}

// The URL's ?step= param mirrors the step picker's 0-based numbering (i.e.
// the argument to directStep), not the reducer's internal `step` field
// (which is that number + 1, since 0 means "no step taken yet").
const STEP_QUERY_PARAM = 'step'

function getStepFromQuery(): number | undefined {
  const raw = new URLSearchParams(window.location.search).get(STEP_QUERY_PARAM)
  if (raw === null) return undefined
  const parsed = Number.parseInt(raw, 10)
  return Number.isInteger(parsed) ? parsed : undefined
}

export default function MapAnimation(props: MapAnimationProps) {
  const { steps, initialState: { countries: initialCountries, ...initialRest }, toWithPathProps } = props

  const [state, dispatch] = React.useReducer(
    mapReducer,
    { steps: stepsWithPathProps(steps, toWithPathProps), countries: initialCountries.map(toWithPathProps), ...initialRest, step: 0 }
  )
  const { countries, textCollection, highlightCollection, arrowCollection, viewCenter, zoom, step } = state

  // On startup/reload, jump straight to the step named in the URL, if valid.
  React.useEffect(() => {
    const queryStep = getStepFromQuery()
    if (queryStep !== undefined && queryStep >= 0 && queryStep < steps.length) {
      dispatch({ type: 'directStep', step: queryStep })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the URL's ?step= mirroring the current step as the user navigates.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (step > 0) {
      params.set(STEP_QUERY_PARAM, String(step - 1))
    } else {
      params.delete(STEP_QUERY_PARAM)
    }
    const search = params.toString()
    const newUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    window.history.replaceState(null, '', newUrl)
  }, [step])

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
        <SvgContainer centerLong={viewCenter[0]} centerLat={viewCenter[1]} zoom={zoom}>
          {countries.map(country => (
            <Country key={country.name} {...country} />
          ))}
          {highlightCollection.map(highlight => {
            const coordinates = highlight.coordinates ?? countries.find(({ name }) => name === highlight.id)?.coordinates
            if (!coordinates) return null
            return <CountryHighlight key={highlight.id} highlight={highlight} coordinates={coordinates} zoom={zoom} />
          })}
          {arrowCollection.map(arrow => (
            <CurvedArrow key={arrow.id} {...arrow} zoom={zoom} />
          ))}
          {/* Key by step (not just index) so every circle remounts on each
              step change and replays its one-shot pulse animation. With a bare
              index key, a circle slot reused from the previous step keeps its
              already-finished animation and never pulses again. */}
          {steps[step - 1]?.circles?.map((circle, i) => (
            <PulsingCircle key={`${step}-${i}`} {...circle} zoom={zoom} />
          ))}
          {textCollection.map(mapText => (
            <SvgTextBox key={mapText.id} {...mapText} zoom={zoom} />
          ))}
        </SvgContainer>
      </div>
    </div>
  )
}
