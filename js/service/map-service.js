


const KEY = 'AIzaSyAgIcVfys_vQ4OwhTVIut8RsPboBf17FXA'

let gPlaces 

window.getCoords = getCoords

function getCoords(placeName){
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=${KEY}`)
    .then(({data})=> {data.results[0].geometry.location})
    .then(coords => ({
        lat: coords.lat,
        lng: coords.lng
    }))
} 