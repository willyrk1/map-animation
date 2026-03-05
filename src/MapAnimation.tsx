import React from 'react';
import './App.css';
import PositionPath from "./PositionPath.tsx";
import { CountryDetails, lat2y } from "./utility.ts";
import mapReducer, { countryReplacement, MapAction, MapState, MapText, MapTransition, MapTransitionList, textReplacement } from './mapReducer.ts';
import { Position } from 'geojson';
import SvgTextBox from './SvgTextBox.tsx';

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
  const { countries, textCollection, viewCenter, zoom, step } = state

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

  function animateCountryReplacement(fromCountryNames: Array<string>, toCountries: Array<CountryDetails>) {
    return function (t: number): MapAction {
      return { ...countryReplacement(fromCountryNames, toCountries.map(toHiddenWithPathProps)), opacity: t }
    }
  }

  function animateTextReplacement(fromTextIds: Array<string>, toTextCollection: Array<MapText>) {
    return function (t: number): MapAction {
      return { ...textReplacement(fromTextIds, toTextCollection), opacity: t }
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
      case "CountryReplacement":
        return animateCountryReplacement(transition.fromCountryNames, transition.toCountries)
      case "ViewCenterChange":
        return animateViewCenterChange(viewCenter, [transition.long, transition.lat])
      case "ZoomChange":
        return animateZoomChange(zoom, transition.newZoom)
      case "TextReplacement":
        return animateTextReplacement(transition.fromTextIds, transition.toTextCollection)
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
        <g fontSize={6 / zoom}>
          {textCollection.map(mapText => (
            <SvgTextBox key={mapText.id} {...mapText} />
          ))}
        </g>
      </svg>
    </div>
  )
}
