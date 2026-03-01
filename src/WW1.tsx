import { countryReplacement, MapTransitionList, viewCenterChange, zoomChange } from "./mapReducer";
import { CountryDetails } from "./utility";
import MapAnimation from "./MapAnimation";
import { getCountriesHighRes, getInitialMapText, modernColorMap } from "./countries";
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
  getRussiaMiddleEastUnion,
  getRussiaPolandUnion,
  getRussiaUkraineUnion,
  getSerbiaFinalUnion,
  getOttomanEuropeUnion,
  getOttomanMiddleEastUnion
} from "./positionCalc";

const initialState = {
  countries: getCountriesHighRes(),
  textCollection: getInitialMapText(),
  viewCenter: [28, 57],
  zoom: 3.65,
}

const russiaFinlandUnion = getRussiaFinlandUnion(initialState)
const russiaBalticsUnion = getRussiaBalticsUnion(initialState)
const russiaBelarusUnion = getRussiaBelarusUnion(initialState)
const russiaUkraineUnion = getRussiaUkraineUnion(initialState)
const russiaPolandUnion = getRussiaPolandUnion(initialState)
const russiaMiddleEastUnion = getRussiaMiddleEastUnion(initialState)
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
const ottomanEuropeUnion = getOttomanEuropeUnion(initialState)
const romaniaBulgariaUnion = getRomaniaBulgariaUnion(initialState)
const serbiaFinalUnion = getSerbiaFinalUnion(initialState)
const ottomanMiddleEastUnion = getOttomanMiddleEastUnion(initialState)

const transitions: MapTransitionList = [
  () => {
    const russiaFinland = {
      "name": "RussiaFinland",
      "coordinates": russiaFinlandUnion
    }
    return countryReplacement(['Russia', 'Finland'], [russiaFinland])
  },
  () => {
    const russiaBaltics = {
      "name": "RussiaBaltics",
      "coordinates": russiaBalticsUnion
    }
    return countryReplacement(['RussiaFinland', 'Estonia', 'Latvia'], [russiaBaltics])
  },
  () => {
    const russiaBelarus = {
      "name": "RussiaBelarus",
      "coordinates": russiaBelarusUnion
    }
    return countryReplacement(['RussiaBaltics', 'Belarus'], [russiaBelarus])
  },
  () => {
    const russiaUkraine = {
      "name": "RussiaUkraine",
      "coordinates": russiaUkraineUnion
    }
    return countryReplacement(['RussiaBelarus', 'Moldova'], [russiaUkraine])
  },
  () => {
    const russiaPoland = {
      "name": "RussiaPoland",
      "coordinates": russiaPolandUnion
    }
    return countryReplacement(['RussiaUkraine'], [russiaPoland])
  },
  () => {
    const russiaMiddleEast = {
      "name": "RussiaMiddleEast",
      "coordinates": russiaMiddleEastUnion
    }
    return countryReplacement(['RussiaPoland', 'Armenia', 'Azerbaijan', 'Georgia'], [russiaMiddleEast])
  },
  () => [viewCenterChange(15, 52), zoomChange(13)],
  () => {
    const germanyFranceDenmark = {
      "name": "GermanyFranceDenmark",
      "coordinates": germanyFranceDenmarkUnion
    }
    return countryReplacement(['Germany'], [germanyFranceDenmark])
  },
  () => {
    const germanyPoland = {
      "name": "GermanyPoland",
      "coordinates": germanyPolandUnion
    }
    return countryReplacement(['GermanyFranceDenmark'], [germanyPoland])
  },
  () => {
    const germanyFinal = {
      "name": "GermanyFinal",
      "coordinates": germanyFinalUnion
    }
    return countryReplacement(['GermanyPoland', 'Lithuania'], [germanyFinal])
  },
  () => [viewCenterChange(13, 46), zoomChange(14.7)],
  () => {
    const austriaHungary = {
      "name": "AustriaHungary",
      "coordinates": austriaHungaryUnion
    }
    return countryReplacement(['Austria', 'Hungary'], [austriaHungary])
  },
  () => {
    const austriaHungaryCZ = {
      "name": "AustriaHungaryCZ",
      "coordinates": ahCzechUnion
    }
    return countryReplacement(['AustriaHungary'], [austriaHungaryCZ])
  },
  () => {
    const austriaHungaryBalkans = {
      "name": "AustriaHungaryBalkans",
      "coordinates": ahBalkansUnion
    }
    return countryReplacement(['AustriaHungaryCZ', 'Slovenia', 'Croatia', 'Bosnia and Herz.'], [austriaHungaryBalkans])
  },
  () => {
    const austriaHungaryItaly = {
      "name": "AustriaHungaryItaly",
      "coordinates": ahItalyUnion
    }
    return countryReplacement(['AustriaHungaryBalkans'], [austriaHungaryItaly])
  },
  () => {
    const austriaHungarySerbia = {
      "name": "AustriaHungarySerbia",
      "coordinates": ahSerbiaUnion
    }
    return countryReplacement(['AustriaHungaryItaly'], [austriaHungarySerbia])
  },
  () => {
    const origRomania = {
      "name": "NewRomania",
      "coordinates": romaniaUnion
    }
    const austriaHungaryRomania = {
      "name": "AustriaHungaryRomania",
      "coordinates": ahRomaniaUnion
    }
    return countryReplacement(['AustriaHungarySerbia', 'Romania'], [origRomania, austriaHungaryRomania])
  },
  () => {
    const austriaHungaryFinal = {
      "name": "AustriaHungaryFinal",
      "coordinates": ahFinalUnion
    }
    return countryReplacement(['AustriaHungaryRomania', 'Ukraine', 'Poland'], [austriaHungaryFinal])
  },
  () => {
    const romaniaFinal = {
      "name": "RomaniaFinal",
      "coordinates": romaniaBulgariaUnion
    }
    const bulgariaFinal = {
      "name": "BulgariaFinal",
      "coordinates": bulgariaUnion
    }
    const ottomanEurope = {
      "name": "OttomanEurope",
      "coordinates": ottomanEuropeUnion
    }
    return countryReplacement(['Bulgaria', 'NewRomania', 'Turkey'], [bulgariaFinal, ottomanEurope, romaniaFinal])
  },
  () => {
    const serbiaFinal = {
      "name": "SerbiaFinal",
      "coordinates": serbiaFinalUnion
    }
    return countryReplacement(['Serbia', 'North Macdeonia', 'Kosovo'], [serbiaFinal])
  },
  () => [viewCenterChange(40, 29), zoomChange(6.2)],
  () => {
    const ottomanMiddleEast = {
      "name": "OttomanMiddleEast",
      "coordinates": ottomanMiddleEastUnion
    }
    return countryReplacement(['OttomanEurope', 'Lebanon', 'Israel', 'Palestine'], [ottomanMiddleEast])
  },
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
