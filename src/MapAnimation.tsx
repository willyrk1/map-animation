import React from 'react';
import './App.css';
import PositionPath from "./PositionPath.tsx";
import { CountryDetails, lat2y } from "./utility.ts";
import mapReducer, {
  countryFadeIn,
  countryReplace,
  MapAction, MapHighlight, MapState, MapText, MapTransition, MapTransitionList, textFadeIn, textFadeOut, highlightFadeIn, highlightFadeOut
} from './mapReducer.ts';
import { Position } from 'geojson';
import SvgTextBox from './SvgTextBox.tsx';
import CountryHighlight from './CountryHighlight.tsx';

interface MapAnimationProps {
  transitions: MapTransitionList
  initialState: Omit<MapState, 'step'>
  toWithPathProps: (country: CountryDetails) => CountryDetails
}

type MapActionAnimation = (t: number) => MapAction

const [northLat, southLat] = [85, -60]
const WORLDHEIGHT = lat2y(northLat) - lat2y(southLat)

export default function MapAnimation(props: MapAnimationProps) {
  const { transitions, initialState: { countries: initialCountries, ...initialRest }, toWithPathProps } = props

  const [state, dispatch] = React.useReducer(
    mapReducer(transitions, toWithPathProps),
    { countries: initialCountries.map(toWithPathProps), ...initialRest, step: 0 }
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
    const startCoordinates = textCollection.find(({ id }: MapText) => id === mapTextId)!.coordinates
    return function (t: number): MapAction {
      const newLong = startCoordinates[0] + (targetCoordinates[0] - startCoordinates[0]) * t;
      const newLat = startCoordinates[1] + (targetCoordinates[1] - startCoordinates[1]) * t;

      return { type: "TextMove", mapTextId, newCoordinates: [newLong, newLat] }
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
        return animateViewCenterChange(viewCenter, [transition.long, transition.lat])
      case "ZoomChange":
        return animateZoomChange(zoom, transition.newZoom)
      case 'TextFadeIn':
        return animateTextFadeIn(transition.mapText)
      case "TextFadeOut":
        return animateTextFadeOut(transition.mapTextId)
      case "TextMove":
        return animateTextMove(transition.mapTextId, transition.newCoordinates)
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
    const transition = transitions[step](state);
    startAnimation(getAnimationFunctions(transition))

    dispatch({ type: "incrementStep" })
  }

  function handleReInit() {
    dispatch({ type: "reInit", countries: initialCountries.map(toWithPathProps), ...initialRest })
  }

  function handleDirectStep(newStep: number) {
    dispatch({ type: "directStep", step: newStep, countries: initialCountries.map(toWithPathProps), ...initialRest })
  }

  return (
    <div className='viewport'>
      <div className='container'>
        <div className='controls'>
          <button onClick={handleNext}>NEXT</button>
          <div>
            <button onClick={handleReInit}>Start</button>
            {transitions.map((_t, index) => (
              <button
                onClick={() => handleDirectStep(index)}
                className={index === step - 1 ? 'current' : ''}
                key={`step${index}`}
              >
                {index}
              </button>
            ))}
          </div>
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
