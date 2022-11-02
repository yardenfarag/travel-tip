export const mapService = {
    getPlaces,
    addPlace,
    getCoords
}

let gPlaces = [
    {
        lat: 32.06750927884894,
        lng: 34.82356140098553 ,
        zoom: 8,
        name: 'home,'
    }
]


const KEY = 'AIzaSyAgIcVfys_vQ4OwhTVIut8RsPboBf17FXA'

window.getCoords = getCoords

function getCoords(placeName){
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=${KEY}`)
    .then(({data})=> 
    {return data.results[0].geometry.location})
    .then(res =>({
        lat: res.lat,
        lng: res.lng
    }))
} 
function getPlaces(){
    return gPlaces
}

function addPlace(name, lat, lng, zoom){
    gPlaces.push({
        lat,
        lng,
        zoom,
        name
    })
    console.log(gPlaces);
}
