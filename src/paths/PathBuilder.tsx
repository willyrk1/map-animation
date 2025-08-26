import modernCountries from "../modernCountries.json"

export default function PathBuilder() {
    const path = modernCountries.Austria.coordinates[1].map(([long, lat]) => {
        return `${long},${90-lat}`
    })
    return <path d={`M ${path.join(' ')} z`} />
}
