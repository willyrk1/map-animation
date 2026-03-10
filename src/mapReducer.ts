import { Position } from "geojson";
import { CountryDetails } from "./utility";

export interface MapState {
  countries: Array<CountryDetails>
  textCollection: Array<MapText>
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

export interface MapText {
  id: string
  text: string | Array<string>
  coordinates: Position
  svgTextProps?: React.SVGTextElementAttributes<SVGTextElement>
  svgGProps?: React.SVGProps<SVGGElement>
  svgRectProps?: React.SVGProps<SVGRectElement>
  includeBackground?: boolean
}

export type MapTransition = CountryReplace | CountryFadeIn | ViewCenterChange | ZoomChange | TextFadeIn | TextFadeOut | TextMove

export type MapTransitionList = Array<(state: SteplessMapState) => MapTransition | Array<MapTransition>>

export function countryReplace(name: string): CountryReplace {
  return { type: "CountryReplace", name }
}

export function countryFadeIn(country: CountryDetails): CountryFadeIn {
  return { type: "CountryFadeIn", country }
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

export default function reducer(
  transitions: MapTransitionList,
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
      case "incrementStep":
        return { ...state, step: state.step + 1 }
      case "reInit": {
        const { type, ...rest } = action
        return { ...state, ...rest, step: 0 }
      }
      case "directStep":
        const { type, step, ...newState } = action
        transitions.slice(0, action.step + 1).forEach((transitionFn) => {
          const transitionDefinition = transitionFn(newState)
          const transitionDefinitions = Array.isArray(transitionDefinition) ? transitionDefinition : [transitionDefinition]
          transitionDefinitions.forEach(transition => {
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
