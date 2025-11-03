import { countryReplacement, MapTransitionList, viewBoxChange } from "./mapReducer";
import { CountryDetails, position2ViewBox } from "./utility";
import MapAnimation from "./MapAnimation";
import { getCountriesHighRes } from "./countries";
import { modernColorMap } from "./colors";
import {
  getAHBalkansUnion,
  getAHCzechUnion,
  getAHFinalUnion,
  getAHItalyUnion,
  getAHRomaniaUnion,
  getAHSerbiaUnion,
  getAustriaHungaryUnion,
  getBulgariaUnion,
  getGermanyFinalUnion,
  getGermanyFranceDenmarkUnion,
  getGermanyPolandUnion,
  getRomaniaBulgariaUnion,
  getRomaniaUnion,
  getRussiaBalticsUnion,
  getRussiaBelarusUnion,
  getRussiaFinlandUnion,
  getRussiaPolandUnion,
  getRussiaUkraineUnion,
  getTurkeyEuropeUnion
} from "./positionCalc";

const initialState = {
  viewBox: position2ViewBox(-10, 72, 67, 34),
  countries: getCountriesHighRes()
}

const russiaFinlandUnion = getRussiaFinlandUnion(initialState)
const russiaBalticsUnion = getRussiaBalticsUnion(initialState)
const russiaBelarusUnion = getRussiaBelarusUnion(initialState)
const russiaUkraineUnion = getRussiaUkraineUnion(initialState)
const russiaPolandUnion = getRussiaPolandUnion(initialState)
const germanyFranceDenmarkUnion = getGermanyFranceDenmarkUnion(initialState)
const germanyPolandUnion = getGermanyPolandUnion(initialState)
const germanyFinalUnion = getGermanyFinalUnion(initialState)
const austriaHungaryUnion = getAustriaHungaryUnion(initialState)
const ahCzechUnion = getAHCzechUnion(initialState)
const ahBalkansUnion = getAHBalkansUnion(initialState)
const ahItalyUnion = getAHItalyUnion(initialState)
const ahSerbiaUnion = getAHSerbiaUnion(initialState)
const romaniaUnion = getRomaniaUnion(initialState)
const ahRomaniaUnion = getAHRomaniaUnion(initialState)
const ahFinalUnion = getAHFinalUnion(initialState)
const bulgariaUnion = getBulgariaUnion(initialState)
const turkeyEuropeUnion = getTurkeyEuropeUnion(initialState)
const romaniaBulgariaUnion = getRomaniaBulgariaUnion(initialState)

const transitions: MapTransitionList = [
  () => {
    if (russiaFinlandUnion) {
      const russiaFinland = {
        "name": "RussiaFinland",
        "coordinates": russiaFinlandUnion
      }
      return countryReplacement(['Russia', 'Finland'], [russiaFinland])
    }
  },
  () => {
    if (russiaBalticsUnion) {
      const russiaBaltics = {
        "name": "RussiaBaltics",
        "coordinates": russiaBalticsUnion
      }
      return countryReplacement(['RussiaFinland', 'Estonia', 'Latvia'], [russiaBaltics])
    }
  },
  () => {
    if (russiaBelarusUnion) {
      const russiaBelarus = {
        "name": "RussiaBelarus",
        "coordinates": russiaBelarusUnion
      }
      return countryReplacement(['RussiaBaltics', 'Belarus'], [russiaBelarus])
    }
  },
  () => {
    if (russiaUkraineUnion) {
      const russiaUkraine = {
        "name": "RussiaUkraine",
        "coordinates": russiaUkraineUnion
      }
      return countryReplacement(['RussiaBelarus', 'Moldova'], [russiaUkraine])
    }
  },
  () => {
    if (russiaPolandUnion) {
      const russiaPoland = {
        "name": "RussiaPoland",
        "coordinates": russiaPolandUnion
      }
      return countryReplacement(['RussiaUkraine'], [russiaPoland])
    }
  },
  () => viewBoxChange(3, 58, 26, 46),
  () => {
    if (germanyFranceDenmarkUnion) {
      const germanyFranceDenmark = {
        "name": "GermanyFranceDenmark",
        "coordinates": germanyFranceDenmarkUnion
      }
      return countryReplacement(['Germany'], [germanyFranceDenmark])
    }
  },
  () => {
    if (germanyPolandUnion) {
      const germanyPoland = {
        "name": "GermanyPoland",
        "coordinates": germanyPolandUnion
      }
      return countryReplacement(['GermanyFranceDenmark'], [germanyPoland])
    }
  },
  () => {
    if (germanyFinalUnion) {
      const germanyFinal = {
        "name": "GermanyFinal",
        "coordinates": germanyFinalUnion
      }
      return countryReplacement(['GermanyPoland', 'Lithuania'], [germanyFinal])
    }
  },
  () => viewBoxChange(7, 52, 19, 40),
  () => {
    if (austriaHungaryUnion) {
      const austriaHungary = {
        "name": "AustriaHungary",
        "coordinates": austriaHungaryUnion
      }
      return countryReplacement(['Austria', 'Hungary'], [austriaHungary])
    }
  },
  () => {
    if (ahCzechUnion) {
      const austriaHungaryCZ = {
        "name": "AustriaHungaryCZ",
        "coordinates": ahCzechUnion
      }
      return countryReplacement(['AustriaHungary'], [austriaHungaryCZ])
    }
  },
  () => {
    if (ahBalkansUnion) {
      const austriaHungaryBalkans = {
        "name": "AustriaHungaryBalkans",
        "coordinates": ahBalkansUnion
      }
      return countryReplacement(['AustriaHungaryCZ', 'Slovenia', 'Croatia', 'Bosnia and Herz.'], [austriaHungaryBalkans])
    }
  },
  () => {
    if (ahItalyUnion) {
      const austriaHungaryItaly = {
        "name": "AustriaHungaryItaly",
        "coordinates": ahItalyUnion
      }
      return countryReplacement(['AustriaHungaryBalkans'], [austriaHungaryItaly])
    }
  },
  () => {
    if (ahSerbiaUnion) {
      const austriaHungarySerbia = {
        "name": "AustriaHungarySerbia",
        "coordinates": ahSerbiaUnion
      }
      return countryReplacement(['AustriaHungaryItaly'], [austriaHungarySerbia])
    }
  },
  () => {
    if (romaniaUnion && ahRomaniaUnion) {
      const origRomania = {
        "name": "NewRomania",
        "coordinates": romaniaUnion
      }
      const austriaHungaryRomania = {
        "name": "AustriaHungaryRomania",
        "coordinates": ahRomaniaUnion
      }
      return countryReplacement(['AustriaHungarySerbia', 'Romania'], [origRomania, austriaHungaryRomania])
    }
  },
  () => {
    if (ahFinalUnion) {
      const austriaHungaryFinal = {
        "name": "AustriaHungaryFinal",
        "coordinates": ahFinalUnion
      }
      return countryReplacement(['AustriaHungaryRomania', 'Ukraine', 'Poland'], [austriaHungaryFinal])
    }
  },
  () => {
    if (romaniaBulgariaUnion && bulgariaUnion && turkeyEuropeUnion) {
      const romaniaFinal = {
        "name": "RomaniaFinal",
        "coordinates": romaniaBulgariaUnion
      }
      const bulgariaFinal = {
        "name": "BulgariaFinal",
        "coordinates": bulgariaUnion
      }
      const turkeyEurope = {
        "name": "TurkeyEurope",
        "coordinates": turkeyEuropeUnion
      }
      return countryReplacement(['Bulgaria', 'NewRomania', 'Turkey'], [bulgariaFinal, turkeyEurope, romaniaFinal])
    }
  },
  () => viewBoxChange(-10, 72, 67, 34),
]

function toWithPathProps(country: CountryDetails): CountryDetails {
  return {
    ...country,
    pathProps: {
      stroke: "black",
      strokeWidth: 0.03,
      fill: modernColorMap[country.name ?? ''] ?? 'none',
      ...country.pathProps
    }
  }
}

export default function WW1() {
  return <MapAnimation transitions={transitions} initialState={initialState} toWithPathProps={toWithPathProps} />
}
