import { Position } from "geojson";
import { CountryDetails, Zoom } from "./utility";

export interface SteplessMapState extends Zoom {
  countries: Array<CountryDetails>
  textCollection: Array<MapText>
  highlightCollection: Array<MapHighlight>
  viewCenter: Position
}

export interface MapState extends SteplessMapState {
  steps: MapSteps
  step: number
  animationStart?: AnimationStart
  // Pristine step-0 baseline, captured on the first dispatch (before anything
  // has changed); reInit and directStep rebuild from this instead of the
  // caller re-passing the initial values.
  initial?: SteplessMapState
}

// Snapshot taken by startAnimation of the values the step's transitions
// interpolate from, so each doTransitions frame lerps from a fixed starting
// point instead of compounding on the previous frame's result.
interface AnimationStart extends Zoom {
  viewCenter: Position
  textCollection: Array<MapText>
}

export type MapAction =
  | { type: 'startAnimation' }
  | { type: 'doTransitions', percentage: number }
  | { type: 'reInit' }
  | { type: 'directStep', step: number }

interface CountryReplace {
  type: "CountryReplace"
  name: string
}

interface CountryFadeIn {
  type: "CountryFadeIn"
  country: CountryDetails
}

interface ViewCenterChange {
  type: 'ViewCenterChange'
  long: number
  lat: number
}

interface ZoomChange {
  type: 'ZoomChange'
  newZoom: number
}

interface TextFadeIn {
  type: "TextFadeIn"
  mapText: MapText
}

interface TextFadeOut {
  type: "TextFadeOut"
  mapTextId: string
}

interface TextMove {
  type: "TextMove"
  mapTextId: string
  newCoordinates: Position
}

interface TextFontPct {
  type: "TextFontPct"
  mapTextId: string
  newFontPct: number
}

interface TextRotate {
  type: "TextRotate"
  mapTextId: string
  newRotation: number
}

export interface MapText {
  id: string
  text?: string | Array<string> // If undefined, use id instead.
  coordinates: Position
  rotation?: number
  svgTextProps?: React.SVGTextElementAttributes<SVGTextElement>
  svgGProps?: React.SVGProps<SVGGElement>
  svgRectProps?: React.SVGProps<SVGRectElement>
  opacity?: number
  // Font size as a percentage of the label layer's base size (100 = base).
  // SvgTextBox turns this into the `${fontPct}%` the SVG attribute wants.
  fontPct?: number
  // Text fill; SvgTextBox applies it as an inline style so the black-fill CSS
  // rule (.svgText text[style*="fill: black"]) still matches.
  color?: string
  includeBackground?: boolean
}

interface HighlightFadeIn {
  type: "HighlightFadeIn"
  highlight: MapHighlight
}

interface HighlightFadeOut {
  type: "HighlightFadeOut"
  id: string
}

// An outline traced around either:
//   - an existing country's current shape, looked up by name (`id`) from
//     state.countries at render time, so it automatically tracks whatever
//     that country's geometry currently is — or
//   - an arbitrary custom shape, when `coordinates` is provided directly
//     (e.g. a precomputed union of several countries' borders, to preview an
//     upcoming merge that doesn't match any single country's current shape).
// Used to draw the reader's eye to whatever is about to change next.
export interface MapHighlight {
  id: string
  coordinates?: Position[][]
  opacity?: number
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export interface PulsingCircle {
  center: Position
  radius: number
}

export type MapTransition = CountryReplace | CountryFadeIn | ViewCenterChange | ZoomChange | TextFadeIn | TextFadeOut | TextMove | TextFontPct | TextRotate | HighlightFadeIn | HighlightFadeOut

// displayMs is how long autostepping mode pauses on this step (so the user
// has time to read it) before moving on to the next one.
export interface MapStep {
  transitions: Array<MapTransition>
  displayMs?: number
  circles?: Array<PulsingCircle>
}

export type MapSteps = Array<MapStep>

export const DEFAULT_STEP_DISPLAY_MS = 1200

export function mapStep(transitions: Array<MapTransition>, displayMs?: number, circles?: Array<PulsingCircle>): MapStep {
  return { transitions, displayMs, circles }
}

// Pre-applies path props to every country a CountryFadeIn transition will
// introduce, so once the steps are in state the reducer never needs the
// mapping function again.
export function stepsWithPathProps(steps: MapSteps, toWithPathProps: (country: CountryDetails) => CountryDetails): MapSteps {
  return steps.map(step => ({
    ...step,
    transitions: step.transitions.map(transition =>
      transition.type === 'CountryFadeIn'
        ? { ...transition, country: toWithPathProps(transition.country) }
        : transition
    ),
  }))
}

export function getStepDisplayMs(step: MapStep): number {
  return step.displayMs ?? DEFAULT_STEP_DISPLAY_MS
}

export function countryReplace(name: string): CountryReplace {
  return { type: "CountryReplace", name }
}

export function countryFadeIn(name: string, coordinates: Position[][], country?: Omit<CountryDetails, 'name' | 'coordinates'>): CountryFadeIn {
  return { type: "CountryFadeIn", country: { name, coordinates, ...country } }
}

export function viewCenterChange(long: number, lat: number): ViewCenterChange {
  return { type: "ViewCenterChange", long, lat }
}

export function zoomChange(newZoom: number): ZoomChange {
  return { type: "ZoomChange", newZoom }
}

export function mapTextFadeIn(mapText: MapText): TextFadeIn {
  return { type: "TextFadeIn", mapText }
}

export function textFadeOut(mapTextId: string): TextFadeOut {
  return { type: "TextFadeOut", mapTextId }
}

export function textMove(mapTextId: string, long: number, lat: number): TextMove {
  return { type: "TextMove", mapTextId, newCoordinates: [long, lat] }
}

export function textFontPct(mapTextId: string, newFontPct: number): TextFontPct {
  return { type: "TextFontPct", mapTextId, newFontPct }
}

export function textRotate(mapTextId: string, newRotation: number): TextRotate {
  return { type: "TextRotate", mapTextId, newRotation }
}

export function highlightFadeIn(highlight: MapHighlight): HighlightFadeIn {
  return { type: "HighlightFadeIn", highlight }
}

export function highlightFadeOut(id: string): HighlightFadeOut {
  return { type: "HighlightFadeOut", id }
}

export default function mapReducer(prevState: MapState, action: MapAction): MapState {
  const { steps } = prevState

  // The first dispatch is the only one guaranteed to see the pristine step-0
  // state, so capture the baseline then.
  const initial: SteplessMapState = prevState.initial ?? {
    countries: prevState.countries,
    textCollection: prevState.textCollection,
    highlightCollection: prevState.highlightCollection,
    viewCenter: prevState.viewCenter,
    zoom: prevState.zoom,
  }
  const state = prevState.initial ? prevState : { ...prevState, initial }

  switch (action.type) {
    case "startAnimation":
      // Increment step and snapshot the values the new step's transitions
      // interpolate from.
      return {
        ...state,
        step: state.step + 1,
        animationStart: {
          viewCenter: state.viewCenter,
          zoom: state.zoom,
          textCollection: state.textCollection,
        }
      }
    case "doTransitions": {
      const transitions = steps[state.step - 1]?.transitions ?? []
      return transitions.reduce(
        (curState, transition) => applyTransition(curState, transition, action.percentage),
        state
      )
    }
    case "reInit":
      return { ...state, ...initial, step: 0 }
    case "directStep": {
      // Replay from the pristine baseline. animationStart must be cleared so
      // the text transitions read their start values from the state being
      // replayed, not a stale snapshot of an earlier animation.
      const baseline: MapState = { ...state, ...initial, animationStart: undefined }
      const replayed = steps
        .slice(0, action.step + 1)
        .flatMap(({ transitions }) => transitions)
        .reduce((curState, transition) => applyTransition(curState, transition, 1), baseline)
      return { ...replayed, step: action.step + 1 }
    }
    default: {
      const _exhaustiveCheck: never = action
      console.log(_exhaustiveCheck)
      return state
    }
  }
}

// Applies a single transition at percentage t (0 to 1) of its animation,
// interpolating from the values captured by startAnimation in
// state.animationStart. No-ops when the transition's target no longer exists.
function applyTransition(state: MapState, transition: MapTransition, t: number): MapState {
  const start = state.animationStart
  const findStartText = (mapTextId: string) =>
    (start?.textCollection ?? state.textCollection).find(({ id }) => id === mapTextId)

  switch (transition.type) {
    case "CountryFadeIn": {
      const index = state.countries.findIndex(({ name }) => name === transition.country.name)
      const current = state.countries[index] ?? transition.country
      const faded = {
        ...current,
        opacity: t,
      }

      return {
        ...state,
        countries: state.countries.toSpliced(index >= 0 ? index : state.countries.length, 1, faded)
      }
    }
    case "CountryReplace": {
      const index = state.countries.findIndex(({ name }) => name === transition.name)
      if (t >= 1 && index >= 0) {
        return { ...state, countries: state.countries.toSpliced(index, 1) }
      }

      return state
    }
    case "ViewCenterChange": {
      const [startLong, startLat] = start?.viewCenter ?? state.viewCenter
      const newLong = startLong + (transition.long - startLong) * t
      const newLat = startLat + (transition.lat - startLat) * t
      return { ...state, viewCenter: [newLong, newLat] }
    }
    case "ZoomChange": {
      const startZoom = start?.zoom ?? state.zoom
      return { ...state, zoom: startZoom + (transition.newZoom - startZoom) * t }
    }
    case "TextFadeIn": {
      const index = state.textCollection.findIndex(({ id }) => id === transition.mapText.id)
      const current = state.textCollection[index] ?? transition.mapText
      const faded = {
        ...current,
        opacity: t
      }

      return {
        ...state,
        textCollection: state.textCollection.toSpliced(index >= 0 ? index : state.textCollection.length, 1, faded)
      }
    }
    case "TextFadeOut": {
      const index = state.textCollection.findIndex(({ id }) => id === transition.mapTextId)
      if (index < 0) return state
      if (t >= 1) {
        return { ...state, textCollection: state.textCollection.toSpliced(index, 1) }
      }

      const current = state.textCollection[index]
      const faded = {
        ...current,
        opacity: 1 - t
      }
      return { ...state, textCollection: state.textCollection.toSpliced(index, 1, faded) }
    }
    case "TextMove": {
      const index = state.textCollection.findIndex(({ id }) => id === transition.mapTextId)
      const startText = findStartText(transition.mapTextId)
      if (index < 0 || !startText) return state

      const [startLong, startLat] = startText.coordinates
      const newCoordinates = [
        startLong + (transition.newCoordinates[0] - startLong) * t,
        startLat + (transition.newCoordinates[1] - startLat) * t,
      ]
      return {
        ...state,
        textCollection: state.textCollection.toSpliced(index, 1, {
          ...state.textCollection[index],
          coordinates: newCoordinates
        })
      }
    }
    case "TextFontPct": {
      const index = state.textCollection.findIndex(({ id }) => id === transition.mapTextId)
      const startText = findStartText(transition.mapTextId)
      if (index < 0 || !startText) return state

      const startFontPct = startText.fontPct ?? 100
      const newPct = startFontPct + (transition.newFontPct - startFontPct) * t
      const current = state.textCollection[index]
      return {
        ...state,
        textCollection: state.textCollection.toSpliced(index, 1, {
          ...current,
          fontPct: newPct
        })
      }
    }
    case "TextRotate": {
      const index = state.textCollection.findIndex(({ id }) => id === transition.mapTextId)
      const startText = findStartText(transition.mapTextId)
      if (index < 0 || !startText) return state

      const startRotation = startText.rotation ?? 0
      const newRotation = startRotation + (transition.newRotation - startRotation) * t
      return {
        ...state,
        textCollection: state.textCollection.toSpliced(index, 1, {
          ...state.textCollection[index],
          rotation: newRotation
        })
      }
    }
    case "HighlightFadeIn": {
      const index = state.highlightCollection.findIndex(({ id }) => id === transition.highlight.id)
      const current = state.highlightCollection[index] ?? transition.highlight
      const faded = {
        ...current,
        opacity: t
      }

      return {
        ...state,
        highlightCollection: state.highlightCollection.toSpliced(index >= 0 ? index : state.highlightCollection.length, 1, faded)
      }
    }
    case "HighlightFadeOut": {
      const index = state.highlightCollection.findIndex(({ id }) => id === transition.id)
      if (index < 0) return state
      if (t >= 1) {
        return { ...state, highlightCollection: state.highlightCollection.toSpliced(index, 1) }
      }

      const current = state.highlightCollection[index]
      const faded = {
        ...current,
        opacity: 1 - t
      }
      return { ...state, highlightCollection: state.highlightCollection.toSpliced(index, 1, faded) }
    }
    default: {
      const _exhaustiveCheck: never = transition
      console.log(_exhaustiveCheck)
      return state
    }
  }
}
