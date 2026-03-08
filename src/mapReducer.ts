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

interface CountryReplacement {
  type: "CountryReplacement"
  fromCountryNames: Array<string>
  toCountries: Array<CountryDetails>
}

export type MapAction =
  | { type: 'setViewCenter', newViewCenter: Position }
  | { type: 'setZoom', newZoom: number }
  | (CountryReplacement & { opacity: number })
  | { type: 'incrementStep' }
  | ({ type: 'reInit' } & SteplessMapState)
  | ({ type: 'directStep' } & MapState)
  | (TextFadeIn & { opacity: number })
  | (TextFadeOut & { opacity: number })


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

export interface MapText {
  id: string
  text: string | Array<string>
  coordinates: Position
  svgTextProps?: React.SVGTextElementAttributes<SVGTextElement>
  svgGProps?: React.SVGProps<SVGGElement>
  svgRectProps?: React.SVGProps<SVGRectElement>
  includeBackground?: boolean
}

export type MapTransition = CountryReplacement | ViewCenterChange | ZoomChange | TextFadeIn | TextFadeOut

export type MapTransitionList = Array<(state: SteplessMapState) => MapTransition | Array<MapTransition>>

export function countryReplacement(fromCountryNames: Array<string>, toCountries: Array<CountryDetails>): CountryReplacement {
  return { type: "CountryReplacement", fromCountryNames, toCountries }
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
      case 'CountryReplacement':
        const newCountries = [...state.countries]

        for (const toCountry of action.toCountries) {
          const toCountryIndex = newCountries.findIndex(({ name }) => name === toCountry.name)
          const curToCountry = newCountries[toCountryIndex] ?? toCountry
          const newToCountry = {
            ...curToCountry,
            pathProps: {
              ...curToCountry.pathProps,
              opacity: action.opacity
            }
          }

          newCountries.splice(
            toCountryIndex >= 0 ? toCountryIndex : newCountries.length,
            1,
            newToCountry
          )
        }

        if (action.opacity >= 1) {
          for (const fromCountryName of action.fromCountryNames) {
            const fromCountryIndex = newCountries.findIndex(({ name }) => name === fromCountryName)
            if (fromCountryIndex >= 0) {
              newCountries.splice(fromCountryIndex, 1)
            }
          }
        }

        return { ...state, countries: newCountries }
      case 'TextFadeIn': {
        const newTextCollection = [...state.textCollection]

        const toTextIndex = newTextCollection.findIndex(({ id }) => id === action.mapText.id)
        const curToText = newTextCollection[toTextIndex] ?? action.mapText
        const newToText = {
          ...curToText,
          svgGProps: {
            ...curToText.svgGProps,
            opacity: action.opacity
          }
        }

        newTextCollection.splice(
          toTextIndex >= 0 ? toTextIndex : newTextCollection.length,
          1,
          newToText
        )

        return { ...state, textCollection: newTextCollection }
      }
      case 'TextFadeOut': {
        const newTextCollection = [...state.textCollection]

        if (action.opacity >= 1) {
          const fromTextIndex = newTextCollection.findIndex(({ id }) => id === action.mapTextId)
          if (fromTextIndex >= 0) {
            newTextCollection.splice(fromTextIndex, 1)
          }
        }
        else {
          const fromTextIndex = newTextCollection.findIndex(({ id }) => id === action.mapTextId)
          if (fromTextIndex >= 0) {
            const fromText = newTextCollection[fromTextIndex]
            newTextCollection.splice(fromTextIndex, 1, {
              ...fromText,
              svgGProps: {
                ...fromText.svgGProps,
                opacity: 1 - action.opacity,
              }
            })
          }
        }

        return { ...state, textCollection: newTextCollection }
      }
      case "incrementStep":
        return { ...state, step: state.step + 1 }
      case "reInit": {
        const { type, ...rest } = action
        return { ...state, ...rest, step: 0 }
      }
      case "directStep": {
        const { type, step, ...newState } = action
        transitions.slice(0, action.step + 1).forEach((transitionFn) => {
          const transitionDefinition = transitionFn(newState)
          const transitionDefinitions = Array.isArray(transitionDefinition) ? transitionDefinition : [transitionDefinition]
          transitionDefinitions.forEach(transition => {
            switch (transition.type) {
              case "CountryReplacement":
                newState.countries = [
                  ...newState.countries,
                  ...transition.toCountries.map(toWithPathProps)
                ].filter(({ name }) => !transition.fromCountryNames.includes(name))
                break;
              case "ViewCenterChange":
                newState.viewCenter = [transition.long, transition.lat]
                break;
              case "ZoomChange":
                newState.zoom = transition.newZoom
                break;
              case "TextFadeIn":
                newState.textCollection = [
                  ...newState.textCollection,
                  transition.mapText
                ]
                break;
              case "TextFadeOut":
                newState.textCollection = newState.textCollection.filter(({ id }) => id !== transition.mapTextId)
                break;
              default:
                const _exhaustiveCheck: never = transition;
                console.log(_exhaustiveCheck)
                break
            }
          })
        })

        return { ...state, ...newState, step: step + 1 }
      }
      default:
        const _exhaustiveCheck: never = action
        console.log(_exhaustiveCheck)
        break;
    }
    return state
  }
}
