import modernCountries from "../modernCountries.json"

export default function PathBuilder() {
    // const country = modernCountries.Austria.coordinates[1]
    const country = modernCountries.Afghanistan.coordinates[0]
    const path = country.map(([long, lat]) => {
        return `${long},${90-lat}`
    })
    return <path d={`M ${path.join(' ')} z`} />
}
