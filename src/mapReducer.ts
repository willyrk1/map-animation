import { CountryDetails, position2ViewBox } from "./utility";

export interface MapState {
  countries: Array<CountryDetails>
  viewBox: string
  step: number
}

export type SteplessMapState = Omit<MapState, 'step'>

export type MapActions =
  | { type: 'setViewBox', newViewBox: string }
  | (CountryReplacement & { opacity: number })
  | { type: 'incrementStep' }
  | ({ type: 'reInit' } & SteplessMapState)
  | ({ type: 'directStep' } & MapState)

interface CountryReplacement {
  type: "CountryReplacement"
  fromCountryNames: Array<string>
  toCountries: Array<CountryDetails>
}

interface ViewBoxChange {
  type: "ViewBoxChange"
  left: number
  top: number
  right: number
  bottom: number
}

export type MapTransition = CountryReplacement | ViewBoxChange

export type MapTransitionList = Array<(state: SteplessMapState) => MapTransition | undefined>

export function countryReplacement(fromCountryNames: Array<string>, toCountries: Array<CountryDetails>): CountryReplacement {
  return { type: "CountryReplacement", fromCountryNames, toCountries }
}

export function viewBoxChange(left: number, top: number, right: number, bottom: number): ViewBoxChange {
  return { type: "ViewBoxChange", left, top, right, bottom }
}

export default function reducer(transitions: MapTransitionList, toWithPathProps: (country: CountryDetails) => CountryDetails) {
  return function (state: MapState, action: MapActions) {
    switch (action.type) {
      case 'setViewBox':
        return { ...state, viewBox: action.newViewBox }
      case 'CountryReplacement':
        const newCountries = [...state.countries]

        for (let toCountry of action.toCountries) {
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
          const transition = transitionFn(newState)
          if (transition) {
            switch (transition.type) {
              case "CountryReplacement":
                newState.countries = [...newState.countries, ...transition.toCountries.map(toWithPathProps)].filter(({ name }) => !transition.fromCountryNames.includes(name))
                break;
              case "ViewBoxChange":
                newState.viewBox = position2ViewBox(transition.left, transition.top, transition.right, transition.bottom)
                break;
              default:
                const _exhaustiveCheck: never = transition;
                console.log(_exhaustiveCheck)
                break
            }
          }
        })

        return { ...state, ...newState, step: step + 1 }
      }
    }
    return state
  }
}
