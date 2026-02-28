import { Position } from "geojson";
import { CountryDetails } from "./utility";

export interface MapState {
  countries: Array<CountryDetails>
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

export type MapActions =
  | { type: 'setViewCenter', newViewCenter: Position }
  | { type: 'setZoom', newZoom: number }
  | (CountryReplacement & { opacity: number })
  | { type: 'incrementStep' }
  | ({ type: 'reInit' } & SteplessMapState)
  | ({ type: 'directStep' } & MapState)


interface ViewCenterChange {
  type: 'ViewCenterChange'
  long: number
  lat: number
}

interface ZoomChange {
  type: 'ZoomChange'
  newZoom: number
}

export type MapTransition = CountryReplacement | ViewCenterChange | ZoomChange

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

export default function reducer(transitions: MapTransitionList, toWithPathProps: (country: CountryDetails) => CountryDetails) {
  return function (state: MapState, action: MapActions) {
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
