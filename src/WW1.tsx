import { countryFadeIn, countryReplace, mapStep, MapSteps, textFadeIn, textFadeOut, textMove, textFontSize, textRotate, viewCenterChange, zoomChange, highlightFadeIn, highlightFadeOut } from './mapReducer';
import { CountryDetails, position2Spaced } from './utility';
import MapAnimation from './MapAnimation';
import { getCountriesHighRes, getInitialMapText, baseText, modernColorMap, summaryText, countryHighlight, areaHighlight } from './countries';
import {
  getAHBalkansUnion,
  getBalkanTrioUnion,
  getAHCzechUnion,
  getCzechSlovakiaUnion,
  getAHFinalUnion,
  getGaliciaBukovinaUnion,
  getAHItalyUnion,
  getAHRomaniaUnion,
  getAHSerbiaUnion,
  getAustriaHungaryUnion,
  getBulgariaUnion,
  getGermanyFinalUnion,
  getKaliningradMemelUnion,
  getGermanyFranceDenmarkUnion,
  getAlsaceLorraineSouthJutlandUnion,
  getGermanyPolandUnion,
  getPolandWestNorthUnion,
  getRomaniaBulgariaUnion,
  getRomaniaUnion,
  getRussiaBalticsUnion,
  getBalticsUnion,
  getRussiaBelarusUnion,
  getRussiaFinlandUnion,
  getRussiaMiddleEastUnion,
  getCaucasusUnion,
  getRussiaPolandUnion,
  getRussiaUkraineUnion,
  getSerbiaFinalUnion,
  getOttomanEuropeUnion,
  getOttomanMiddleEastUnion,
  getLevantUnion
} from './positionCalc';
import trentinoSouthTyrolJson from './data/TrentinoSouthTyrol.json';
import vojvodinaJson from './data/Vojvodina.json';
import exRomaniaJson from './data/exRomania.json';

export const initialState = {
  countries: getCountriesHighRes(),
  textCollection: getInitialMapText(),
  highlightCollection: [],
  viewCenter: [28, 57],
  zoom: 3.65,
}

const russiaFinlandUnion = getRussiaFinlandUnion(initialState)
const russiaBalticsUnion = getRussiaBalticsUnion(initialState)
const balticsUnion = getBalticsUnion(initialState)
const russiaBelarusUnion = getRussiaBelarusUnion(initialState)
const russiaUkraineUnion = getRussiaUkraineUnion(initialState)
const russiaPolandUnion = getRussiaPolandUnion(initialState)
const russiaMiddleEastUnion = getRussiaMiddleEastUnion(initialState)
const caucasusUnion = getCaucasusUnion(initialState)
const germanyFranceDenmarkUnion = getGermanyFranceDenmarkUnion(initialState)
const alsaceLorraineSouthJutlandUnion = getAlsaceLorraineSouthJutlandUnion()
const germanyPolandUnion = getGermanyPolandUnion(initialState)
const polandWestNorthUnion = getPolandWestNorthUnion(initialState)
const germanyFinalUnion = getGermanyFinalUnion(initialState)
const kaliningradMemelUnion = getKaliningradMemelUnion(initialState)
const austriaHungaryUnion = getAustriaHungaryUnion(initialState)
const ahCzechUnion = getAHCzechUnion(initialState)
const czechSlovakiaUnion = getCzechSlovakiaUnion(initialState)
const ahBalkansUnion = getAHBalkansUnion(initialState)
const balkanTrioUnion = getBalkanTrioUnion(initialState)
const ahItalyUnion = getAHItalyUnion(initialState)
const ahSerbiaUnion = getAHSerbiaUnion(initialState)
const romaniaUnion = getRomaniaUnion(initialState)
const ahRomaniaUnion = getAHRomaniaUnion(initialState)
const ahFinalUnion = getAHFinalUnion(initialState)
const galiciaBukovinaUnion = getGaliciaBukovinaUnion()
const bulgariaUnion = getBulgariaUnion(initialState)
const ottomanEuropeUnion = getOttomanEuropeUnion(initialState)
const romaniaBulgariaUnion = getRomaniaBulgariaUnion(initialState)
const serbiaFinalUnion = getSerbiaFinalUnion(initialState)
const ottomanMiddleEastUnion = getOttomanMiddleEastUnion(initialState)
const levantUnion = getLevantUnion(initialState)
const bosniaCoordinates = initialState.countries.find(c => c.name === 'Bosnia and Herz.')?.coordinates ?? []

export const steps: MapSteps = [
  // ------------------------------------------------------------------- 0
  mapStep([
    textFadeOut('StartSummary'),
    textFadeOut('Russia'),
    textFadeIn(summaryText('RussianEmpireSummary', 53, 63, ['Russia had been an empire for', 'nearly two centuries and', 'encompassed modern-day Finland...'])),
    textFadeIn(baseText('Russian Empire', 44, 57.24804212417763, { text: ['Russian', 'Empire'], svgTextProps: { fontSize: '200%' } })),
    textFadeIn(baseText('Finland', 26, 62.5902121295499)),
    highlightFadeIn(countryHighlight('Finland')),
  ], 4000),
  // ------------------------------------------------------------------- 1
  mapStep([
    textFadeOut('Finland'),
    highlightFadeOut('Finland'),
    countryReplace('Russia'),
    countryReplace('Finland'),
    countryFadeIn('RussiaFinland', russiaFinlandUnion)
  ]),
  // ------------------------------------------------------------------- 2
  mapStep([
    viewCenterChange(15, 52),
    zoomChange(8),
    textFadeOut('RussianEmpireSummary'),
    textFadeIn(summaryText('RussiaBalticSummary', 34, 58, 'The Baltic states...')),
    textMove('Russian Empire', 38, 54),
    textFadeIn(baseText('Estonia', 25.8, 58.6)),
    textFadeIn(baseText('Latvia', 25.84680136704439, 56.83295731831097)),
    textFadeIn(baseText('Lithuania', 24, 55.4, { svgTextProps: { style: { fill: 'black' } } })),
    highlightFadeIn(areaHighlight('Baltics', balticsUnion)),
    textFadeIn(baseText('Ukraine', 31.00791766243967, 49.4, { svgTextProps: { fontSize: '150%' } })),
    textFadeIn(baseText('Belarus', 27.8206206153948, 53.2, { svgTextProps: { fontSize: '130%' } })),
    textFadeIn(baseText('Moldova', 28.5, 47.3, { svgTextProps: { fontSize: '85%', transform: `rotate(45 ${position2Spaced([28.5, 47.3])})` } })),
    textFadeIn(baseText('Poland', 19.4, 52, { svgTextProps: { fontSize: '130%', style: { fill: 'black' } } })),
    textFadeIn(baseText('France', 2.6, 48.1, { svgTextProps: { fontSize: '150%' } })),
    textFadeIn(baseText('Germany', 10.5, 51.8, { svgTextProps: { fontSize: '150%', style: { fill: 'white' } } })),
    textFadeIn(baseText('United Kingdom', -1.8, 52.6, { text: ['United', 'Kingdom'], svgTextProps: { fontSize: '90%' } })),
    textFadeIn(baseText('Spain', -2.8, 42)),
    textFadeIn(baseText('Italy', 10.1, 45)),
    textFadeIn(baseText('Sweden', 14.2, 57.9, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Romania', 24.9, 45.8, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Bulgaria', 25.1, 42.6)),
    textFadeIn(baseText('Norway', 8.4, 59.6)),
    textFadeIn(baseText('Ireland', -7.8, 53, { svgTextProps: { fontSize: '85%' } })),
    textFadeIn(baseText('Czechia', 15.5, 49.6)),
    textFadeIn(baseText('Austria', 14.7, 47.6)),
    textFadeIn(baseText('Hungary', 19.1, 47.1)),
    textFadeIn(baseText('Serbia', 21, 44)),
  ], 1900),
  // ------------------------------------------------------------------- 3
  mapStep([
    textFadeOut('Estonia'),
    textFadeOut('Latvia'),
    textFadeOut('Lithuania'),
    highlightFadeOut('Baltics'),
    countryReplace('RussiaFinland'),
    countryReplace('Estonia'),
    countryReplace('Latvia'),
    countryFadeIn('RussiaBaltics', russiaBalticsUnion)
  ]),
  // ------------------------------------------------------------------- 4
  mapStep([
    textFadeOut('RussiaBalticSummary'),
    textMove('Russian Empire', 36, 57),
    textFadeIn(summaryText('RussiaBelarusSummary', 37, 54, 'Belarus...')),
    highlightFadeIn(countryHighlight('Belarus')),
  ], 1500),
  // ------------------------------------------------------------------- 5
  mapStep([
    textFadeOut('Belarus'),
    highlightFadeOut('Belarus'),
    countryReplace('RussiaBaltics'),
    countryReplace('Belarus'),
    countryFadeIn('RussiaBelarus', russiaBelarusUnion)
  ]),
  // ------------------------------------------------------------------- 6
  mapStep([
    textFadeOut('RussiaBelarusSummary'),
    textFadeIn(summaryText('RussiaUkraineSummary', 33.5, 54, 'Moldova and most of Ukraine...')),
    highlightFadeIn(countryHighlight('Ukraine')),
    highlightFadeIn(countryHighlight('Moldova')),
  ], 2500),
  // ------------------------------------------------------------------- 7
  mapStep([
    textFadeOut('Ukraine'),
    textFadeOut('Moldova'),
    highlightFadeOut('Ukraine'),
    highlightFadeOut('Moldova'),
    textFadeIn(baseText('Ukraine2', 24.4, 49, { text: 'Ukraine', svgTextProps: { fontSize: '90%' } })),
    countryReplace('RussiaBelarus'),
    countryReplace('Moldova'),
    countryFadeIn('RussiaUkraine', russiaUkraineUnion)
  ]),
  // ------------------------------------------------------------------- 8
  mapStep([
    textFadeOut('RussiaUkraineSummary'),
    textFadeIn(summaryText('RussiaPolandSummary', 31, 53, ['Eastern Poland', '(Congress Poland)...'])),
    highlightFadeIn(countryHighlight('Poland')),
  ], 2100),
  // ------------------------------------------------------------------- 9
  mapStep([
    highlightFadeOut('Poland'),
    textMove('Poland', 16.5, 53.2),
    textFontSize('Poland', '120%'),
    countryReplace('RussiaUkraine'),
    countryFadeIn('RussiaPoland', russiaPolandUnion),
  ]),
  // ------------------------------------------------------------------- 10
  mapStep([
    viewCenterChange(44.5, 43.8),
    zoomChange(10),
    textMove('Russian Empire', 40, 49),
    textFadeOut('RussiaPolandSummary'),
    textFadeIn(summaryText('RussiaCaucusus', 52.8, 44, '...and the Caucasus region.')),
    textFadeIn(baseText('Georgia', 43.4, 42.1, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Azerbaijan', 47.6, 40.5)),
    textFadeIn(baseText('Armenia', 44.7, 40.4, { svgTextProps: { fontSize: '90%', transform: `rotate(45 ${position2Spaced([44.7, 40.4])})` } })),
    textFadeIn(baseText('Turkey', 35.3, 39, { svgTextProps: { fontSize: '150%' } })),
    highlightFadeIn(areaHighlight('Caucasus', caucasusUnion)),
  ], 2300),
  // ------------------------------------------------------------------- 11
  mapStep([
    textFadeOut('Georgia'),
    textFadeOut('Azerbaijan'),
    textFadeOut('Armenia'),
    highlightFadeOut('Caucasus'),
    countryReplace('RussiaPoland'),
    countryReplace('Armenia'),
    countryReplace('Azerbaijan'),
    countryReplace('Georgia'),
    countryFadeIn('RussiaMiddleEast', russiaMiddleEastUnion),
  ]),
  // ------------------------------------------------------------------- 12
  mapStep([
    viewCenterChange(15, 52),
    zoomChange(13),
    textMove('Russian Empire', 25, 52),
    textFadeOut('RussiaCaucusus'),
    textFadeOut('Germany'),
    textFadeIn(baseText('German Empire', 10.5, 51.8, { svgTextProps: { fontSize: '150%' } })),
    textFadeIn(baseText('Denmark', 9.2, 56.2, { svgTextProps: { fontSize: '80%' } })),
    textFadeIn(summaryText('GermanyInitial', 3, 54, [
      'Germany was also an empire', 'after unifying 43 years', 'earlier. It included South', 'Jutland (Denmark),', 'Alsace-Lorraine (France)...'
    ])),
    highlightFadeIn(areaHighlight('AlsaceLorraineSouthJutland', alsaceLorraineSouthJutlandUnion)),
    textFadeIn(baseText('Slovakia', 19.5, 48.75, { svgTextProps: { fontSize: '140%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Switzerland', 8.2, 46.8, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Belgium', 4.7, 50.6, { svgTextProps: { style: { fill: 'black' } } })),
    textFontSize('Austria', '140%'),
    textFontSize('Hungary', '140%'),
    textFontSize('Czechia', '140%'),
    textFontSize('Romania', '140%'),
  ], 7000),
  // ------------------------------------------------------------------- 13
  mapStep([
    highlightFadeOut('AlsaceLorraineSouthJutland'),
    countryReplace('Germany'),
    countryFadeIn('GermanyFranceDenmark', germanyFranceDenmarkUnion),
  ]),
  // ------------------------------------------------------------------- 14
  mapStep([
    textFadeOut('GermanyInitial'),
    textFadeIn(summaryText('GermanyPoland', 15.4, 55.5, ['Western and', 'northern Poland...'])),
    highlightFadeIn(areaHighlight('PolandWestNorth', polandWestNorthUnion)),
  ], 2100),
  // ------------------------------------------------------------------- 15
  mapStep([
    highlightFadeOut('PolandWestNorth'),
    textMove('Poland', 21.4, 49.75),
    textMove('German Empire', 13, 52.3),
    countryReplace('GermanyFranceDenmark'),
    countryFadeIn('GermanyPoland', germanyPolandUnion),
  ]),
  // ------------------------------------------------------------------- 16
  mapStep([
    textFadeOut('GermanyPoland'),
    textFadeIn(summaryText('EastGermany', 16, 56, ['...Kaliningrad (Russia),', 'and Memel (Lithuania).'])),
    highlightFadeIn(areaHighlight('KaliningradMemel', kaliningradMemelUnion)),
  ], 2300),
  // ------------------------------------------------------------------- 17
  mapStep([
    highlightFadeOut('KaliningradMemel'),
    countryReplace('GermanyPoland'),
    countryReplace('Lithuania'),
    countryFadeIn('GermanyFinal', germanyFinalUnion),
  ]),
  // ------------------------------------------------------------------- 18
  mapStep([
    viewCenterChange(20.7, 46.8),
    zoomChange(14.7),
    textMove('France', 4, 46.9),
    textMove('German Empire', 9.3, 50.4),
    textMove('Russian Empire', 29, 51),
    textFontSize('Serbia', '140%'),
    textFontSize('Bulgaria', '140%'),
    textFontSize('Italy', '140%'),
    textFadeIn(baseText('Slovenia', 14.6, 46)),
    textFadeIn(baseText('Croatia', 16.6, 45.6)),
    textFadeIn(baseText('Bosnia', 17.8, 44.3, { text: ['Bosnia and', 'Herzegovina'], svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Montenegro', 19.2, 42.9, { text: ['Monte-', 'negro'], svgTextProps: { fontSize: '75%' } })),
    textFadeIn(baseText('Kosovo', 20.9, 42.5, { svgTextProps: { fontSize: '80%' } })),
    textFadeIn(baseText('North Macedonia', 21.7, 41.6, { text: ['North', 'Macedonia'], svgTextProps: { fontSize: '90%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Greece', 21.6, 39.9, { svgTextProps: { fontSize: '120%' } })),
    textFadeIn(baseText('Albania', 20.15, 40.7, { svgTextProps: { fontSize: '90%' } })),
    textFadeOut('EastGermany'),
    textFadeIn(summaryText('AustriaEmpire', 16, 44.5, ['In central Europe, Austria and Hungary were joined in', 'an empire led by the centuries-old Habsburg dynasty.'])),
    highlightFadeIn(areaHighlight('AustriaHungary', austriaHungaryUnion)),
  ], 5400),
  // ------------------------------------------------------------------- 19
  mapStep([
    highlightFadeOut('AustriaHungary'),
    countryReplace('Austria'),
    countryReplace('Hungary'),
    countryFadeIn('AustriaHungary', austriaHungaryUnion),
    textFadeOut('Austria'),
    textFadeOut('Hungary'),
    textFadeIn(baseText('Austria-Hungary', 17, 47.3, { svgTextProps: { fontSize: '140%' } })),
  ]),
  // ------------------------------------------------------------------- 20
  mapStep([
    textFadeOut('AustriaEmpire'),
    textFadeIn(summaryText('AHCzechoslovakia', 16, 44.8, 'It included its neighbors to the north...')),
    highlightFadeIn(areaHighlight('CzechSlovakia', czechSlovakiaUnion)),
  ], 2700),
  // ------------------------------------------------------------------- 21
  mapStep([
    highlightFadeOut('CzechSlovakia'),
    countryReplace('AustriaHungary'),
    countryReplace('Czechia'),
    countryReplace('Slovakia'),
    countryFadeIn('AustriaHungaryCZ', ahCzechUnion),
    textFadeOut('Czechia'),
    textFadeOut('Slovakia'),
    textMove('Austria-Hungary', 17.3, 48.1),
  ]),
  // ------------------------------------------------------------------- 22
  mapStep([
    textFadeOut('AHCzechoslovakia'),
    textFadeIn(summaryText('AHBalkans', 24, 44.8, 'The western Balkan states...')),
    highlightFadeIn(areaHighlight('BalkanTrio', balkanTrioUnion)),
  ], 2100),
  // ------------------------------------------------------------------- 23
  mapStep([
    highlightFadeOut('BalkanTrio'),
    countryReplace('AustriaHungaryCZ'),
    countryReplace('Slovenia'),
    countryReplace('Croatia'),
    countryReplace('Bosnia and Herz.'),
    countryFadeIn('AustriaHungaryBalkans', ahBalkansUnion),
    textFadeOut('Slovenia'),
    textFadeOut('Croatia'),
    textFadeOut('Bosnia'),
    textMove('Austria-Hungary', 17.2, 47.2),
  ]),
  // ------------------------------------------------------------------- 24
  mapStep([
    textFadeOut('AHBalkans'),
    textFadeIn(summaryText('Trentino', 10.9, 48.4, 'Trentino and South Tyrol (Italy)...')),
    highlightFadeIn(areaHighlight('Trentino', trentinoSouthTyrolJson)),
  ], 2500),
  // ------------------------------------------------------------------- 25
  mapStep([
    highlightFadeOut('Trentino'),
    countryReplace('AustriaHungaryBalkans'),
    countryFadeIn('AustriaHungaryItaly', ahItalyUnion),
  ]),
  // ------------------------------------------------------------------- 26
  mapStep([
    textFadeOut('Trentino'),
    textFadeIn(summaryText('Vojvodina', 24.7, 45.7, 'Vojvodina (Serbia)...')),
    highlightFadeIn(areaHighlight('Vojvodina', vojvodinaJson)),
  ], 1700),
  // ------------------------------------------------------------------- 27
  mapStep([
    highlightFadeOut('Vojvodina'),
    countryReplace('AustriaHungaryItaly'),
    countryFadeIn('AustriaHungarySerbia', ahSerbiaUnion),
    textMove('Serbia', 21, 43.8),
  ]),
  // ------------------------------------------------------------------- 28
  mapStep([
    textFadeOut('Vojvodina'),
    textFadeIn(summaryText('AHRomania', 26, 49, 'Much of Romania...')),
    highlightFadeIn(areaHighlight('ExRomania', exRomaniaJson)),
  ], 1900),
  // ------------------------------------------------------------------- 29
  mapStep([
    highlightFadeOut('ExRomania'),
    countryReplace('AustriaHungarySerbia'),
    countryReplace('Romania'),
    countryFadeIn('NewRomania', romaniaUnion),
    countryFadeIn('AustriaHungaryRomania', ahRomaniaUnion),
    textMove('Romania', 25.8, 44.7),
    textMove('Austria-Hungary', 19, 47),
  ]),
  // ------------------------------------------------------------------- 30
  mapStep([
    textFadeOut('AHRomania'),
    textFadeIn(summaryText('GaliciaBukovina', 23.5, 51.3, 'Galicia, and Bukovina.')),
    highlightFadeIn(areaHighlight('GaliciaBukovina', galiciaBukovinaUnion)),
  ], 1900),
  // ------------------------------------------------------------------- 31
  mapStep([
    highlightFadeOut('GaliciaBukovina'),
    countryReplace('AustriaHungaryRomania'),
    countryReplace('Ukraine'),
    countryReplace('Poland'),
    countryFadeIn('AustriaHungaryFinal', ahFinalUnion),
    textFadeOut('Poland'),
    textFadeOut('Ukraine2'),
    textMove('Austria-Hungary', 19.5, 47.3),
  ]),
  // ------------------------------------------------------------------- 32
  mapStep([
    viewCenterChange(24.2, 43.2),
    zoomChange(16),
    textFadeOut('GaliciaBukovina'),
    textFadeIn(summaryText('Bulgaria changes', 32.5, 43.5, ['The Balkan Wars of prior', 'years shaped the borders', 'of Bulgaria...'])),
    textMove('Italy', 12.16, 43),
    textMove('Turkey', 33, 39),
    highlightFadeIn(countryHighlight('Bulgaria')),
  ], 3800),
  // ------------------------------------------------------------------- 33
  mapStep([
    highlightFadeOut('Bulgaria'),
    countryReplace('Bulgaria'),
    countryReplace('NewRomania'),
    countryReplace('Turkey'),
    countryFadeIn('RomaniaFinal', romaniaBulgariaUnion),
    countryFadeIn('OttomanEurope', ottomanEuropeUnion),
    countryFadeIn('BulgariaFinal', bulgariaUnion),
    textMove('North Macedonia', 21.55, 41.6),
  ]),
  // ------------------------------------------------------------------- 34
  mapStep([
    textFadeOut('Bulgaria changes'),
    textFadeIn(summaryText('Serbia union', 25.7, 43.5, ['...as well as Serbia'])),
    highlightFadeIn(areaHighlight('SerbiaFinal', serbiaFinalUnion)),
  ], 2100),
  // ------------------------------------------------------------------- 35
  mapStep([
    highlightFadeOut('SerbiaFinal'),
    countryReplace('Serbia'),
    countryReplace('North Macdeonia'),
    countryReplace('Kosovo'),
    countryFadeIn('SerbiaFinal', serbiaFinalUnion),
    textFadeOut('Kosovo'),
    textFadeOut('North Macedonia'),
    textMove('Serbia', 21.3, 43),
  ]),
  // ------------------------------------------------------------------- 36
  mapStep([
    viewCenterChange(40, 29),
    zoomChange(6.2),
    textMove('Turkey', 36, 39),
    textFadeOut('Serbia union'),
    textFadeOut('Greece'),
    textFadeOut('Albania'),
    textFadeOut('Montenegro'),
    textFadeOut('Romania'),
    textFadeOut('Bulgaria'),
    textFadeOut('Italy'),
    textFadeOut('Serbia'),
    textFadeIn(summaryText('Middle East', 61, 35, ['In the Middle East, the Turkish', 'Ottoman Empire controlled many sea', 'coasts and the Holy Land.'])),
    textFadeIn(baseText('Syria', 38.4, 35.2, { svgTextProps: { style: { fill: 'black' } } })),
    textFadeIn(baseText('Iraq', 43.3, 33.1, { svgTextProps: { fontSize: '120%' } })),
    textFadeIn(baseText('Jordan', 36.5, 30.7, { svgTextProps: { fontSize: '70%' } })),
    textFadeIn(baseText('Saudi Arabia', 43.6, 24.3, { svgTextProps: { fontSize: '120%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Yemen', 47.1, 15.9)),
    highlightFadeIn(areaHighlight('Levant', levantUnion)),
  ], 5200),
  // ------------------------------------------------------------------- 37
  mapStep([
    highlightFadeOut('Levant'),
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
    textFadeOut('Saudi Arabia'),
    textFadeIn(baseText('Arabia', 46, 23.5, { svgTextProps: { fontSize: '120%', style: { fill: 'black' } } })),
    textMove('Yemen', 49.3, 16.3),
  ]),
  // ------------------------------------------------------------------- 38
  mapStep([
    viewCenterChange(18, 42),
    zoomChange(4.6),
    textFadeOut('Middle East'),
    textFadeOut('Spain'),
    textFadeOut('Denmark'),
    textFadeOut('Ireland'),
    textFadeOut('Switzerland'),
    textFadeOut('Belgium'),
    textFontSize('Ottoman Empire', '100%'),
    textFontSize('Russian Empire', '100%'),
    textFontSize('German Empire', '100%'),
    textFontSize('Austria-Hungary', '100%'),
    textFontSize('France', '100%'),
    textFontSize('United Kingdom', '70%'),
    textMove('France', 2.5, 46.9),
    textMove('German Empire', 13, 52.5),
    textMove('Russian Empire', 28, 52),
    textFadeIn(summaryText('WWIClimate', -5, 35, [
      'By 1914, Europe was divided into rival', 'alliances, and old empires strained under', 'rising nationalism. The Balkan Wars of', '1912-13 had just redrawn borders in the', 'region, leaving the area especially volatile.'
    ])),
  ], 5500),
  // ------------------------------------------------------------------- 39
  mapStep([
    viewCenterChange(18.39, 43.86),
    zoomChange(40),
    textFadeOut('WWIClimate'),
    textMove('Austria-Hungary', 17.9, 45.2),
    textFadeIn(baseText('Bosnia', 17.6, 44.2, { svgTextProps: { fontSize: '140%' } })),
    textFontSize('Austria-Hungary', '300%'),
    textRotate('Austria-Hungary', -20),
    textFadeIn(baseText('Serbia', 21.06, 43.3, { svgTextProps: { fontSize: '140%' } })),
    textFadeIn(baseText('Montenegro', 19.2, 42.9)),
    textFadeIn(baseText('Bulgaria', 23.22, 42.6, { svgTextProps: { fontSize: '140%' } })),
    textFadeIn(baseText('Romania', 23.37, 44.55, { svgTextProps: { fontSize: '140%', style: { fill: 'black' } } })),
    textFadeIn(baseText('Albania', 19.93, 42.08, { svgTextProps: { fontSize: '90%' } })),
    highlightFadeIn(areaHighlight('Bosnia', bosniaCoordinates, { strokeDasharray: `${4 / 40} ${2.5 / 40}`, strokeWidth: 0.8 / 40, opacity: 0.55 })),
    textFadeIn(baseText('SarajevoMarker', 18.413, 43.856, { text: '★', svgTextProps: { fontSize: '200%', style: { fill: '#e8c84a' } } })),
    textFadeIn(baseText('Sarajevo', 18, 43.856, { svgTextProps: { fontSize: '90%', style: { fill: '#e8c84a' } } })),
    textFadeIn(summaryText('Assassination', 14.8, 42.85, [
      'Tensions boiled over on June 28, 1914',
      'when a Bosnian Serb nationalist',
      'assassinated the heir to the throne',
      'of Austria-Hungary, Archduke Franz',
      'Ferdinand, and his wife, while they',
      'visited the Bosnian provincial',
      'capital of Sarajevo.',
    ])),
  ]),
]

function toWithPathProps(country: CountryDetails): CountryDetails {
  return {
    ...country,
    pathProps: {
      stroke: '#3d2a1a',
      strokeWidth: 0.03,
      fill: modernColorMap[country.name ?? ''] ?? 'grey',
      ...country.pathProps
    }
  }
}

export default function WW1() {
  return <MapAnimation steps={steps} initialState={initialState} toWithPathProps={toWithPathProps} />
}
