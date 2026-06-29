import React from 'react';
import './App.css';
import PositionPath from "./PositionPath.tsx";
import { CountryDetails, lat2y } from "./utility.ts";
import mapReducer, {
  countryFadeIn,
  countryReplace,
  getStepDisplayMs,
  MapAction, MapHighlight, MapState, MapSteps, MapText, MapTransition, textFadeIn, textFadeOut, highlightFadeIn, highlightFadeOut
} from './mapReducer.ts';
import { Position } from 'geojson';
import SvgTextBox from './SvgTextBox.tsx';
import CountryHighlight from './CountryHighlight.tsx';

interface MapAnimationProps {
  steps: MapSteps
  initialState: Omit<MapState, 'step'>
  toWithPathProps: (country: CountryDetails) => CountryDetails
}

type MapActionAnimation = (t: number) => MapAction

const [northLat, southLat] = [85, -60]
const WORLDHEIGHT = lat2y(northLat) - lat2y(southLat)

export default function MapAnimation(props: MapAnimationProps) {
  const { steps, initialState: { countries: initialCountries, ...initialRest }, toWithPathProps } = props

  const [state, dispatch] = React.useReducer(
    mapReducer(steps, toWithPathProps),
    { countries: initialCountries.map(toWithPathProps), ...initialRest, step: 0 }
  )
  const { countries, textCollection, highlightCollection, viewCenter, zoom, step } = state

  // handleNext is captured by autostepping's setTimeout right after the
  // previous step's incrementStep dispatch — before that step's fade-in
  // animation has actually written its new text into state via
  // requestAnimationFrame. animateTextMove/animateTextFontSize need the
  // latest textCollection (not that stale render's), so they read through
  // this ref instead of the destructured `textCollection` above.
  const stateRef = React.useRef(state)
  stateRef.current = state

  const viewBox = React.useMemo(() => {
    const height = WORLDHEIGHT / zoom
    const [long, lat] = viewCenter
    const [x, y] = [long + 180, 180 - lat2y(lat)]
    return `${x - 1} ${y - height / 2} 2 ${height}`
  }, [viewCenter, zoom])

  const animationRef = React.useRef<number>();
  const playTimerRef = React.useRef<number>();

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [showSteps, setShowSteps] = React.useState(import.meta.env.DEV)

  const duration = 1000; // Duration in milliseconds (1 second)
  const DEFAULT_PLAY_DELAY = 500; // Fallback pause when there's no prior step to read

  function animateViewCenterChange(startViewCenter: Position, targetViewCenter: Position) {
    return function (t: number): MapAction {
      const newLong = startViewCenter[0] + (targetViewCenter[0] - startViewCenter[0]) * t;
      const newLat = startViewCenter[1] + (targetViewCenter[1] - startViewCenter[1]) * t;

      return { type: "setViewCenter", newViewCenter: [newLong, newLat] }
    }
  }

  function animateZoomChange(startZoom: number, targetZoom: number) {
    return function (t: number): MapAction {
      const newZoom = startZoom + (targetZoom - startZoom) * t;

      return { type: "setZoom", newZoom }
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

  function animateCountryFadeIn(country: CountryDetails) {
    return function (t: number): MapAction {
      return { ...countryFadeIn('', [], toHiddenWithPathProps(country)), opacity: t }
    }
  }

  function animateCountryReplace(name: string) {
    return function (t: number): MapAction {
      return { ...countryReplace(name), opacity: t }
    }
  }

  function animateTextFadeIn(mapText: MapText) {
    return function (t: number): MapAction {
      return { ...textFadeIn(mapText), opacity: t }
    }
  }

  function animateTextFadeOut(mapTextId: string) {
    return function (t: number): MapAction {
      return { ...textFadeOut(mapTextId), opacity: t }
    }
  }

  function animateHighlightFadeIn(highlight: MapHighlight) {
    return function (t: number): MapAction {
      return { ...highlightFadeIn(highlight), opacity: t }
    }
  }

  function animateHighlightFadeOut(id: string) {
    return function (t: number): MapAction {
      return { ...highlightFadeOut(id), opacity: t }
    }
  }

  function animateTextMove(mapTextId: string, targetCoordinates: Position) {
    const startCoordinates = stateRef.current.textCollection.find(({ id }: MapText) => id === mapTextId)!.coordinates
    return function (t: number): MapAction {
      const newLong = startCoordinates[0] + (targetCoordinates[0] - startCoordinates[0]) * t;
      const newLat = startCoordinates[1] + (targetCoordinates[1] - startCoordinates[1]) * t;

      return { type: "TextMove", mapTextId, newCoordinates: [newLong, newLat] }
    }
  }

  function animateTextFontSize(mapTextId: string, targetFontSize: string) {
    const startFontSize = parseFloat(stateRef.current.textCollection.find(({ id }: MapText) => id === mapTextId)!.svgTextProps?.fontSize as string ?? '100%')
    const targetSize = parseFloat(targetFontSize)
    return function (t: number): MapAction {
      const newSize = startFontSize + (targetSize - startFontSize) * t;

      return { type: "TextFontSize", mapTextId, newFontSize: `${newSize}%` }
    }
  }

  function doAnimation(startTime: number, animateFns: MapActionAnimation | Array<MapActionAnimation>) {
    const now = performance.now();
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalized time, clamped to [0,1]

    const action = Array.isArray(animateFns) ? animateFns.map(animateFn => animateFn(t)) : animateFns(t)
    dispatch(action)

    if (t < 1) {
      animationRef.current = requestAnimationFrame(() => doAnimation(startTime, animateFns));
    }
  }

  function startAnimation(animateFns: MapActionAnimation | Array<MapActionAnimation>) {
    if (animationRef.current !== undefined)
      cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => doAnimation(performance.now(), animateFns));
  }

  function getAnimationFunction(transition: MapTransition): MapActionAnimation {
    switch (transition.type) {
      case "CountryFadeIn":
        return animateCountryFadeIn(transition.country)
      case "CountryReplace":
        return animateCountryReplace(transition.name)
      case "ViewCenterChange":
        return animateViewCenterChange(stateRef.current.viewCenter, [transition.long, transition.lat])
      case "ZoomChange":
        return animateZoomChange(stateRef.current.zoom, transition.newZoom)
      case 'TextFadeIn':
        return animateTextFadeIn(transition.mapText)
      case "TextFadeOut":
        return animateTextFadeOut(transition.mapTextId)
      case "TextMove":
        return animateTextMove(transition.mapTextId, transition.newCoordinates)
      case "TextFontSize":
        return animateTextFontSize(transition.mapTextId, transition.newFontSize)
      case "HighlightFadeIn":
        return animateHighlightFadeIn(transition.highlight)
      case "HighlightFadeOut":
        return animateHighlightFadeOut(transition.id)
      default:
        const _exhaustiveCheck: never = transition;
        return _exhaustiveCheck;
    }
  }

  function getAnimationFunctions(transitions: MapTransition | Array<MapTransition>) {
    return Array.isArray(transitions) ? transitions.map(getAnimationFunction) : getAnimationFunction(transitions)
  }

  function handleNext() {
    if (step >= steps.length) return
    startAnimation(getAnimationFunctions(steps[step].transitions))

    dispatch({ type: "incrementStep" })
  }

  function handleReInit() {
    setIsPlaying(false)
    dispatch({ type: "reInit", countries: initialCountries.map(toWithPathProps), ...initialRest })
  }

  function handleDirectStep(newStep: number) {
    setIsPlaying(false)
    dispatch({ type: "directStep", step: newStep, countries: initialCountries.map(toWithPathProps), ...initialRest })
  }

  function handlePlayToggle() {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    if (step >= steps.length) return
    handleNext()
    setIsPlaying(true)
  }

  React.useEffect(() => {
    if (!isPlaying) return

    if (step >= steps.length) {
      setIsPlaying(false)
      return
    }

    const justRanStep = steps[step - 1]
    const displayMs = justRanStep ? getStepDisplayMs(justRanStep) : DEFAULT_PLAY_DELAY
    playTimerRef.current = window.setTimeout(handleNext, duration + displayMs)
    return () => window.clearTimeout(playTimerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, step])

  return (
    <div className='viewport'>
      <div className='container'>
        <div className='controls'>
          <div className='controlsBar'>
            <button className='iconButton' onClick={handleReInit} title="Restart" aria-label="Restart">⟲</button>
            <button
              className='iconButton playButton'
              onClick={handlePlayToggle}
              disabled={!isPlaying && step >= steps.length}
              title={isPlaying ? 'Stop' : 'Play'}
              aria-label={isPlaying ? 'Stop' : 'Play'}
            >
              {isPlaying ? '⏹' : '▶'}
            </button>
            <button
              className='iconButton'
              onClick={handleNext}
              disabled={step >= steps.length}
              title="Next step"
              aria-label="Next step"
            >
              {'⏭'}
            </button>
            <button
              className={`iconButton stepsToggle ${showSteps ? 'active' : ''}`}
              onClick={() => setShowSteps(show => !show)}
              title="Toggle step picker"
              aria-label="Toggle step picker"
            >
              {'•••'}
            </button>
          </div>
          {showSteps && (
            <div className='stepPicker'>
              {steps.map((_t, index) => (
                <button
                  onClick={() => handleDirectStep(index)}
                  className={index === step - 1 ? 'current' : ''}
                  key={`step${index}`}
                >
                  {index}
                </button>
              ))}
            </div>
          )}
        </div>
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
