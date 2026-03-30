import { countryFadeIn, countryReplace, MapTransitionList, textFadeIn, textFadeOut, textMove, viewCenterChange, zoomChange } from './mapReducer';
import { CountryDetails, position2Spaced } from './utility';
import MapAnimation from './MapAnimation';
import { getCountriesHighRes, getInitialMapText, baseText, modernColorMap, summaryText } from './countries';
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
} from './positionCalc';

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
  // ------------------------------------------------------------------- 0
  () => [
    textFadeOut('StartSummary'),
    textFadeOut('Russia'),
    textFadeIn(summaryText('RussianEmpireSummary', 53, 62, ['Russia had been an empire for', 'nearly two centuries and', 'encompassed modern-day Finland...'])),
    textFadeIn(baseText('Russian Empire', 44, 57.24804212417763, { svgTextProps: { fontSize: '200%' } })),
    textFadeIn(baseText('Finland', 26, 62.5902121295499)),
  ],
  // ------------------------------------------------------------------- 1
  () => [
    textFadeOut('Finland'),
    countryReplace('Russia'),
    countryReplace('Finland'),
    countryFadeIn('RussiaFinland', russiaFinlandUnion)
  ],
  // ------------------------------------------------------------------- 2
  () => [
    viewCenterChange(15, 52),
    zoomChange(8),
    textFadeOut('RussianEmpireSummary'),
    textFadeIn(summaryText('RussiaBalticSummary', 34, 58, 'The Baltic states...')),
    textMove('Russian Empire', 42, 54),
    textFadeIn(baseText('Estonia', 25.8, 58.6)),
    textFadeIn(baseText('Latvia', 25.84680136704439, 56.83295731831097)),
    textFadeIn(baseText('Lithuania', 24, 55.4, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Ukraine', 31.00791766243967, 49.4, { svgTextProps: { fontSize: '150%' } })),
    textFadeIn(baseText('Belarus', 27.8206206153948, 53.2, { svgTextProps: { fontSize: '130%' } })),
    textFadeIn(baseText('Moldova', 28.5, 47.3, { svgTextProps: { fontSize: '85%', transform: `rotate(45 ${position2Spaced([28.5, 47.3])})` } })),
    textFadeIn(baseText('Poland', 19.4, 52, { svgTextProps: { fontSize: '130%', style: { fill: 'black' } } })),
  ],
  // ------------------------------------------------------------------- 3
  () => [
    textFadeOut('Estonia'),
    textFadeOut('Latvia'),
    textFadeOut('Lithuania'),
    countryReplace('RussiaFinland'),
    countryReplace('Estonia'),
    countryReplace('Latvia'),
    countryFadeIn('RussiaBaltics', russiaBalticsUnion)
  ],
  // ------------------------------------------------------------------- 4
  () => [
    textFadeOut('RussiaBalticSummary'),
    textFadeOut('Russian Empire'),
    textFadeIn(baseText('Russian Empire2', 36, 57, { text: 'Russian Empire', svgTextProps: { fontSize: '200%' } })),
    textFadeIn(summaryText('RussiaBelarusSummary', 37, 54, 'Belarus...')),
  ],
  // ------------------------------------------------------------------- 5
  () => [
    textFadeOut('Belarus'),
    countryReplace('RussiaBaltics'),
    countryReplace('Belarus'),
    countryFadeIn('RussiaBelarus', russiaBelarusUnion)
  ],
  // ------------------------------------------------------------------- 6
  () => [
    textFadeOut('RussiaBelarusSummary'),
    textFadeIn(summaryText('RussiaUkraineSummary', 35, 54, 'Moldova and most of Ukraine...')),
  ],
  // ------------------------------------------------------------------- 7
  () => [
    textFadeOut('Ukraine'),
    textFadeOut('Moldova'),
    textFadeIn(baseText('Ukraine2', 24.4, 49, { text: 'Ukraine', svgTextProps: { fontSize: '90%' } })),
    countryReplace('RussiaBelarus'),
    countryReplace('Moldova'),
    countryFadeIn('RussiaUkraine', russiaUkraineUnion)
  ],
  // ------------------------------------------------------------------- 8
  () => [
    textFadeOut('RussiaUkraineSummary'),
    textFadeIn(summaryText('RussiaPolandSummary', 31, 53, ['Eastern Poland', '(Congress Poland)...'])),
  ],
  // ------------------------------------------------------------------- 9
  () => [
    textFadeOut('Poland'),
    textFadeIn(baseText('Poland2', 16.5, 53.2, { text: 'Poland', svgTextProps: { fontSize: '120%', style: { fill: 'black' } } })),
    countryReplace('RussiaUkraine'),
    countryFadeIn('RussiaPoland', russiaPolandUnion),
  ],
  // ------------------------------------------------------------------- 10
  () => [
    viewCenterChange(44.5, 43.8),
    zoomChange(10),
    textMove('Russian Empire2', 40, 49),
    textFadeOut('RussiaPolandSummary'),
    textFadeIn(summaryText('RussiaCaucusus', 52.8, 44, '...and the Caucasus region.')),
    textFadeIn(baseText('Georgia', 43.4, 42.1, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Azerbaijan', 47.6, 40.5)),
    textFadeIn(baseText('Armenia', 44.7, 40.4, { svgTextProps: { fontSize: '90%', transform: `rotate(45 ${position2Spaced([44.7, 40.4])})` } })),
    textFadeIn(baseText('Turkey', 35.3, 39, { svgTextProps: { fontSize: '150%' } }))
  ],
  // ------------------------------------------------------------------- 11
  () => [
    textFadeOut('Georgia'),
    textFadeOut('Azerbaijan'),
    textFadeOut('Armenia'),
    countryReplace('RussiaPoland'),
    countryReplace('Armenia'),
    countryReplace('Azerbaijan'),
    countryReplace('Georgia'),
    countryFadeIn('RussiaMiddleEast', russiaMiddleEastUnion),
  ],
  // ------------------------------------------------------------------- 12
  () => [
    viewCenterChange(15, 52),
    zoomChange(13),
    textMove('Russian Empire2', 25, 52),
    textFadeOut('RussiaCaucusus'),
    textFadeIn(baseText('German Empire', 10.5, 51.8, { svgTextProps: { fontSize: '150%' } })),
    textFadeIn(baseText('Denmark', 9.2, 56.2, { svgTextProps: { fontSize: '80%' } })),
    textFadeIn(baseText('France', 2.6, 48.1, { svgTextProps: { fontSize: '150%' } })),
    textFadeIn(summaryText('GermanyInitial', 0.5, 54, [
      'Germany was also an empire after', 'unifying 43 years earlier. It', 'included South Jutland (Denmark),', 'Alsace-Lorraine (France)...'
    ])),
  ],
  // ------------------------------------------------------------------- 13
  () => [
    countryReplace('Germany'),
    countryFadeIn('GermanyFranceDenmark', germanyFranceDenmarkUnion),
  ],
  // ------------------------------------------------------------------- 14
  () => [
    textFadeOut('GermanyInitial'),
    textFadeIn(summaryText('GermanyPoland', 15.4, 55.5, ['Western and', 'northern Poland...'])),
  ],
  // ------------------------------------------------------------------- 15
  () => [
    textFadeOut('Poland2'),
    textFadeIn(baseText('Poland', 21.4, 49.75, { svgTextProps: { fontSize: '120%', style: { fill: 'black' } } })),
    textMove('German Empire', 13, 52.3),
    countryReplace('GermanyFranceDenmark'),
    countryFadeIn('GermanyPoland', germanyPolandUnion),
  ],
  // ------------------------------------------------------------------- 16
  () => [
    textFadeOut('GermanyPoland'),
    textFadeIn(summaryText('EastGermany', 16, 56, ['...Kaliningrad (Russia),', 'and Memel (Lithuania).'])),
  ],
  // ------------------------------------------------------------------- 17
  () => [
    countryReplace('GermanyPoland'),
    countryReplace('Lithuania'),
    countryFadeIn('GermanyFinal', germanyFinalUnion),
  ],
  // ------------------------------------------------------------------- 18
  () => [
    viewCenterChange(20.7, 46.8),
    zoomChange(14.7),
    textMove('France', 4, 46.9),
    textMove('German Empire', 9.3, 50.4),
    textMove('Russian Empire2', 29, 51),
    textFadeIn(baseText('Austria', 14.7, 47.6, { svgTextProps: { fontSize: '140%' } })),
    textFadeIn(baseText('Hungary', 19.1, 47.1, { svgTextProps: { fontSize: '140%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Czechia', 15.5, 49.6, { svgTextProps: { fontSize: '140%' } })),
    textFadeIn(baseText('Slovakia', 19.5, 48.75, { svgTextProps: { fontSize: '140%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Slovenia', 14.6, 46)),
    textFadeIn(baseText('Croatia', 16.6, 45.6)),
    textFadeIn(baseText('Bosnia', 17.8, 44.3, { text: ['Bosnia and', 'Herzegovina'], svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Italy', 10.1, 45, { svgTextProps: { fontSize: '140%' } })),
    textFadeIn(baseText('Switzerland', 8.2, 46.8, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Romania', 24.9, 45.8, { svgTextProps: { fontSize: '140%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Serbia', 21, 44, { svgTextProps: { fontSize: '140%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Bulgaria', 25.1, 42.6, { svgTextProps: { fontSize: '140%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Montenegro', 19.2, 42.9, { text: ['Monte-', 'negro'], svgTextProps: { fontSize: '75%' } })),
    textFadeIn(baseText('Kosovo', 20.9, 42.5, { svgTextProps: { fontSize: '80%' } })),
    textFadeIn(baseText('North Macedonia', 21.7, 41.6, { text: ['North', 'Macedonia'], svgTextProps: { fontSize: '90%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Greece', 21.6, 39.9, { svgTextProps: { fontSize: '120%' } })),
    textFadeIn(baseText('Albania', 20.15, 40.7, { svgTextProps: { fontSize: '90%' } })),
    textFadeOut('EastGermany'),
    textFadeIn(summaryText('AustriaEmpire', 16, 44.5, ['In central Europe, Austria and Hungary are joined in', 'an empire led by the centuries-old Habsburg dynasty.'])),
  ],
  // ------------------------------------------------------------------- 19
  () => [
    countryReplace('Austria'),
    countryReplace('Hungary'),
    countryFadeIn('AustriaHungary', austriaHungaryUnion),
    textFadeOut('Austria'),
    textFadeOut('Hungary'),
    textFadeIn(baseText('Austria-Hungary', 17, 47.3, { svgTextProps: { fontSize: '140%' } })),
  ],
  // ------------------------------------------------------------------- 20
  () => [
    textFadeOut('AustriaEmpire'),
    textFadeIn(summaryText('AHCzechoslovakia', 16, 44.8, 'It included its neighbors to the north...')),
  ],
  // ------------------------------------------------------------------- 21
  () => [
    countryReplace('AustriaHungary'),
    countryReplace('Czechia'),
    countryReplace('Slovakia'),
    countryFadeIn('AustriaHungaryCZ', ahCzechUnion),
    textFadeOut('Czechia'),
    textFadeOut('Slovakia'),
    textMove('Austria-Hungary', 17.3, 48.1),
  ],
  // ------------------------------------------------------------------- 22
  () => [
    textFadeOut('AHCzechoslovakia'),
    textFadeIn(summaryText('AHBalkans', 24, 44.8, 'The western Balkan states...')),
  ],
  // ------------------------------------------------------------------- 23
  () => [
    countryReplace('AustriaHungaryCZ'),
    countryReplace('Slovenia'),
    countryReplace('Croatia'),
    countryReplace('Bosnia and Herz.'),
    countryFadeIn('AustriaHungaryBalkans', ahBalkansUnion),
    textFadeOut('Slovenia'),
    textFadeOut('Croatia'),
    textFadeOut('Bosnia'),
    textMove('Austria-Hungary', 17.2, 47.2),
  ],
  // ------------------------------------------------------------------- 24
  () => [
    textFadeOut('AHBalkans'),
    textFadeIn(summaryText('Trentino', 10.9, 48.4, 'Trentino and South Tyrol (Italy)...')),
  ],
  // ------------------------------------------------------------------- 25
  () => [
    countryReplace('AustriaHungaryBalkans'),
    countryFadeIn('AustriaHungaryItaly', ahItalyUnion),
  ],
  // ------------------------------------------------------------------- 26
  () => [
    textFadeOut('Trentino'),
    textFadeIn(summaryText('Vojvodina', 24.7, 45.7, 'Vojvodina (Serbia)...')),
  ],
  // ------------------------------------------------------------------- 27
  () => [
    countryReplace('AustriaHungaryItaly'),
    countryFadeIn('AustriaHungarySerbia', ahSerbiaUnion),
    textMove('Serbia', 21, 43.8),
  ],
  // ------------------------------------------------------------------- 28
  () => [
    textFadeOut('Vojvodina'),
    textFadeIn(summaryText('AHRomania', 26, 49, 'Much of Romania...')),
  ],
  // ------------------------------------------------------------------- 29
  () => [
    countryReplace('AustriaHungarySerbia'),
    countryReplace('Romania'),
    countryFadeIn('NewRomania', romaniaUnion),
    countryFadeIn('AustriaHungaryRomania', ahRomaniaUnion),
    textMove('Romania', 25.8, 44.7),
    textMove('Austria-Hungary', 19, 47),
  ],
  // ------------------------------------------------------------------- 30
  () => [
    textFadeOut('AHRomania'),
    textFadeIn(summaryText('GaliciaBukovina', 23.5, 51.3, 'Galicia, and Bukovina.')),
  ],
  // ------------------------------------------------------------------- 31
  () => [
    countryReplace('AustriaHungaryRomania'),
    countryReplace('Ukraine'),
    countryReplace('Poland'),
    countryFadeIn('AustriaHungaryFinal', ahFinalUnion),
    textFadeOut('Poland'),
    textFadeOut('Ukraine2'),
    textMove('Austria-Hungary', 19.5, 47.3),
  ],
  // ------------------------------------------------------------------- 32
  () => [
    viewCenterChange(24.2, 43.2),
    zoomChange(16),
    textFadeOut('GaliciaBukovina'),
    textFadeIn(summaryText('Bulgaria changes', 32.5, 43.5, ['The Balkan Wars of prior', 'years shaped the borders', 'of Bulgaria...'])),
  ],
  // ------------------------------------------------------------------- 33
  () => [
    countryReplace('Bulgaria'),
    countryReplace('NewRomania'),
    countryReplace('Turkey'),
    countryFadeIn('RomaniaFinal', romaniaBulgariaUnion),
    countryFadeIn('OttomanEurope', ottomanEuropeUnion),
    countryFadeIn('BulgariaFinal', bulgariaUnion),
    textMove('North Macedonia', 21.55, 41.6),
  ],
  // ------------------------------------------------------------------- 34
  () => [
    textFadeOut('Bulgaria changes'),
    textFadeIn(summaryText('Serbia union', 25.7, 43.5, ['...as well as Serbia'])),
  ],
  // ------------------------------------------------------------------- 35
  () => [
    countryReplace('Serbia'),
    countryReplace('North Macdeonia'),
    countryReplace('Kosovo'),
    countryFadeIn('SerbiaFinal', serbiaFinalUnion),
    textFadeOut('Kosovo'),
    textFadeOut('North Macedonia'),
    textMove('Serbia', 21.3, 43),
  ],
  // ------------------------------------------------------------------- 36
  () => [
    viewCenterChange(40, 29),
    zoomChange(6.2),
    textFadeOut('Serbia union'),
    textFadeOut('Greece'),
    textFadeOut('Albania'),
    textFadeOut('Montenegro'),
    textFadeOut('Romania'),
    textFadeOut('Bulgaria'),
    textFadeOut('Serbia'),
    textFadeIn(summaryText('Middle East', 61, 35, ['In the Middle East, the Turkish', 'Ottoman Empire controlled many sea', 'coasts and the Holy Land.'])),
    textFadeIn(baseText('Syria', 38.4, 35.2, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Iraq', 43.3, 33.1, { svgTextProps: { fontSize: '120%' } })),
    textFadeIn(baseText('Jordan', 36.5, 30.7, { svgTextProps: { fontSize: '70%' } })),
    textFadeIn(baseText('Saudi Arabia', 43.6, 24.3, { svgTextProps: { fontSize: '120%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Yemen', 47.1, 15.9)),
  ],
  // ------------------------------------------------------------------- 37
  () => [
    countryReplace('OttomanEurope'),
    countryReplace('Lebanon'),
    countryReplace('Israel'),
    countryReplace('Palestine'),
    countryFadeIn('OttomanMiddleEast', ottomanMiddleEastUnion),
    textFadeOut('Iraq'),
    textFadeOut('Jordan'),
    textFadeOut('Syria'),
    textFadeOut('Turkey'),
    textFadeIn(baseText('Ottoman Empire', 39.5, 38, { text: ['Ottoman', 'Empire'], svgTextProps: { fontSize: '150%' } })),
    textMove('Saudi Arabia', 46, 23.5),
    textMove('Yemen', 49.3, 16.3),
  ]
]

function toWithPathProps(country: CountryDetails): CountryDetails {
  return {
    ...country,
    pathProps: {
      stroke: 'black',
      strokeWidth: 0.03,
      fill: modernColorMap[country.name ?? ''] ?? 'grey',
      ...country.pathProps
    }
  }
}

export default function WW1() {
  return <MapAnimation transitions={transitions} initialState={initialState} toWithPathProps={toWithPathProps} />
}
