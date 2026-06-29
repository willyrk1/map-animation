import { Position } from "geojson";
import { CountryDetails } from "./utility";

export interface MapState {
  countries: Array<CountryDetails>
  textCollection: Array<MapText>
  highlightCollection: Array<MapHighlight>
  viewCenter: Position
  zoom: number
  step: number
}

export type SteplessMapState = Omit<MapState, 'step'>

interface CountryReplace {
  type: "CountryReplace"
  name: string
}

interface CountryFadeIn {
  type: "CountryFadeIn"
  country: CountryDetails
}

export type MapAction =
  | { type: 'setViewCenter', newViewCenter: Position }
  | { type: 'setZoom', newZoom: number }
  | (CountryReplace & { opacity: number })
  | (CountryFadeIn & { opacity: number })
  | { type: 'incrementStep' }
  | ({ type: 'reInit' } & SteplessMapState)
  | ({ type: 'directStep' } & MapState)
  | (TextFadeIn & { opacity: number })
  | (TextFadeOut & { opacity: number })
  | TextMove
  | TextFontSize
  | (HighlightFadeIn & { opacity: number })
  | (HighlightFadeOut & { opacity: number })


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

interface TextFontSize {
  type: "TextFontSize"
  mapTextId: string
  newFontSize: string
}

export interface MapText {
  id: string
  text?: string | Array<string> // If undefined, use id instead.
  coordinates: Position
  svgTextProps?: React.SVGTextElementAttributes<SVGTextElement>
  svgGProps?: React.SVGProps<SVGGElement>
  svgRectProps?: React.SVGProps<SVGRectElement>
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
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export type MapTransition = CountryReplace | CountryFadeIn | ViewCenterChange | ZoomChange | TextFadeIn | TextFadeOut | TextMove | TextFontSize | HighlightFadeIn | HighlightFadeOut

// displayMs is how long autostepping mode pauses on this step (so the user
// has time to read it) before moving on to the next one.
export interface MapStep {
  transitions: Array<MapTransition>
  displayMs?: number
}

export type MapSteps = Array<MapStep>

export const DEFAULT_STEP_DISPLAY_MS = 1200

export function mapStep(transitions: Array<MapTransition>, displayMs?: number): MapStep {
  return { transitions, displayMs }
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

export function textFadeIn(mapText: MapText): TextFadeIn {
  return { type: "TextFadeIn", mapText }
}

export function textFadeOut(mapTextId: string): TextFadeOut {
  return { type: "TextFadeOut", mapTextId }
}

export function textMove(mapTextId: string, long: number, lat: number): TextMove {
  return { type: "TextMove", mapTextId, newCoordinates: [long, lat] }
}

export function textFontSize(mapTextId: string, newFontSize: string): TextFontSize {
  return { type: "TextFontSize", mapTextId, newFontSize }
}

export function highlightFadeIn(highlight: MapHighlight): HighlightFadeIn {
  return { type: "HighlightFadeIn", highlight }
}

export function highlightFadeOut(id: string): HighlightFadeOut {
  return { type: "HighlightFadeOut", id }
}

export default function reducer(
  steps: MapSteps,
  toWithPathProps: (country: CountryDetails) => CountryDetails
): (state: MapState, action: MapAction | Array<MapAction>) => MapState {
  return function (state: MapState, actions: MapAction | Array<MapAction>): MapState {
    if (Array.isArray(actions)) {
      return actions.reduce(mapStateReducer, state)
    }
    else {
      return mapStateReducer(state, actions)
    }
  }

  function mapStateReducer(state: MapState, action: MapAction): MapState {
    switch (action.type) {
      case 'setViewCenter':
        return { ...state, viewCenter: action.newViewCenter }
      case 'setZoom':
        return { ...state, zoom: action.newZoom }
      case 'CountryFadeIn':
        const toCountryIndex = state.countries.findIndex(({ name }) => name === action.country.name)
        const curToCountry = state.countries[toCountryIndex] ?? action.country
        const newToCountry = {
          ...curToCountry,
          pathProps: {
            ...curToCountry.pathProps,
            opacity: action.opacity
          }
        }

        return {
          ...state,
          countries: state.countries.toSpliced(
            toCountryIndex >= 0 ? toCountryIndex : state.countries.length,
            1,
            newToCountry
          )
        }
      case 'CountryReplace':
        if (action.opacity >= 1) {
          const fromCountryIndex = state.countries.findIndex(({ name }) => name === action.name)
          return {
            ...state,
            countries: state.countries.toSpliced(fromCountryIndex, 1)
          }
        }

        return state
      case 'TextFadeIn':
        const toTextIndex = state.textCollection.findIndex(({ id }) => id === action.mapText.id)
        const curToText = state.textCollection[toTextIndex] ?? action.mapText
        const newToText = {
          ...curToText,
          svgGProps: {
            ...curToText.svgGProps,
            opacity: action.opacity
          }
        }

        return {
          ...state,
          textCollection: state.textCollection.toSpliced(
            toTextIndex >= 0 ? toTextIndex : state.textCollection.length,
            1,
            newToText
          )
        }
      case 'TextFadeOut':
        const fromTextIndex = state.textCollection.findIndex(({ id }) => id === action.mapTextId)
        if (fromTextIndex >= 0) {
          const newTextCollection = [...state.textCollection]
          if (action.opacity >= 1) {
            newTextCollection.splice(fromTextIndex, 1)
          }
          else {
            const fromText = newTextCollection[fromTextIndex]
            newTextCollection.splice(fromTextIndex, 1, {
              ...fromText,
              svgGProps: {
                ...fromText.svgGProps,
                opacity: 1 - action.opacity,
              }
            })
          }

          return { ...state, textCollection: newTextCollection }
        }

        return state
      case 'TextMove':
        const moveTextIndex = state.textCollection.findIndex(({ id }) => id === action.mapTextId)
        if (moveTextIndex >= 0) {
          const newTextCollection = [...state.textCollection]
          const moveText = newTextCollection[moveTextIndex]
          newTextCollection.splice(moveTextIndex, 1, {
            ...moveText,
            coordinates: action.newCoordinates
          })

          return { ...state, textCollection: newTextCollection }
        }

        return state
      case 'TextFontSize':
        const fontSizeTextIndex = state.textCollection.findIndex(({ id }) => id === action.mapTextId)
        if (fontSizeTextIndex >= 0) {
          const newTextCollection = [...state.textCollection]
          const fontSizeText = newTextCollection[fontSizeTextIndex]
          newTextCollection.splice(fontSizeTextIndex, 1, {
            ...fontSizeText,
            svgTextProps: {
              ...fontSizeText.svgTextProps,
              fontSize: action.newFontSize
            }
          })

          return { ...state, textCollection: newTextCollection }
        }

        return state
      case 'HighlightFadeIn':
        const toHighlightIndex = state.highlightCollection.findIndex(({ id }) => id === action.highlight.id)
        const curToHighlight = state.highlightCollection[toHighlightIndex] ?? action.highlight
        const newToHighlight = {
          ...curToHighlight,
          svgPathProps: {
            ...curToHighlight.svgPathProps,
            opacity: action.opacity
          }
        }

        return {
          ...state,
          highlightCollection: state.highlightCollection.toSpliced(
            toHighlightIndex >= 0 ? toHighlightIndex : state.highlightCollection.length,
            1,
            newToHighlight
          )
        }
      case 'HighlightFadeOut':
        const fromHighlightIndex = state.highlightCollection.findIndex(({ id }) => id === action.id)
        if (fromHighlightIndex >= 0) {
          const newHighlightCollection = [...state.highlightCollection]
          if (action.opacity >= 1) {
            newHighlightCollection.splice(fromHighlightIndex, 1)
          }
          else {
            const fromHighlight = newHighlightCollection[fromHighlightIndex]
            newHighlightCollection.splice(fromHighlightIndex, 1, {
              ...fromHighlight,
              svgPathProps: {
                ...fromHighlight.svgPathProps,
                opacity: 1 - action.opacity,
              }
            })
          }

          return { ...state, highlightCollection: newHighlightCollection }
        }

        return state
      case "incrementStep":
        return { ...state, step: state.step + 1 }
      case "reInit": {
        const { type, ...rest } = action
        return { ...state, ...rest, step: 0 }
      }
      case "directStep":
        const { type, step, ...newState } = action
        steps.slice(0, action.step + 1).forEach((mapStepItem) => {
          mapStepItem.transitions.forEach(transition => {
            switch (transition.type) {
              case "CountryFadeIn":
                newState.countries = newState.countries.concat(toWithPathProps(transition.country))
                break;
              case "CountryReplace":
                newState.countries = newState.countries.filter(({ name }) => name !== transition.name)
                break;
              case "ViewCenterChange":
                newState.viewCenter = [transition.long, transition.lat]
                break;
              case "ZoomChange":
                newState.zoom = transition.newZoom
                break;
              case "TextFadeIn":
                newState.textCollection = newState.textCollection.concat(transition.mapText)
                break;
              case "TextFadeOut":
                newState.textCollection = newState.textCollection.filter(({ id }) => id !== transition.mapTextId)
                break;
              case "TextMove":
                const moveTextIndex = newState.textCollection.findIndex(({ id }) => id === transition.mapTextId)
                if (moveTextIndex >= 0) {
                  const moveText = newState.textCollection[moveTextIndex]
                  newState.textCollection = newState.textCollection.toSpliced(moveTextIndex, 1, {
                    ...moveText,
                    coordinates: transition.newCoordinates
                  })
                }
                break;
              case "TextFontSize":
                const fontSizeTextIndex = newState.textCollection.findIndex(({ id }) => id === transition.mapTextId)
                if (fontSizeTextIndex >= 0) {
                  const fontSizeText = newState.textCollection[fontSizeTextIndex]
                  newState.textCollection = newState.textCollection.toSpliced(fontSizeTextIndex, 1, {
                    ...fontSizeText,
                    svgTextProps: {
                      ...fontSizeText.svgTextProps,
                      fontSize: transition.newFontSize
                    }
                  })
                }
                break;
              case "HighlightFadeIn":
                newState.highlightCollection = newState.highlightCollection.concat(transition.highlight)
                break;
              case "HighlightFadeOut":
                newState.highlightCollection = newState.highlightCollection.filter(({ id }) => id !== transition.id)
                break;
              default:
                const _exhaustiveCheck: never = transition;
                console.log(_exhaustiveCheck)
                break
            }
          })
        })

        return { ...state, ...newState, step: step + 1 }
      default:
        const _exhaustiveCheck: never = action
        console.log(_exhaustiveCheck)
        break;
    }
    return state
  }
}
