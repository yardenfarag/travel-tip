import {utils} from './utils.js'

export const mapService = {
    getPlaces,
    addPlace,
    deletePlace,
}

let gPlaces = [
    {
        id : utils.getId(),
        lat: 32.06750927884894,
        lng: 34.82356140098553 ,
        zoom: 8,
        name: 'home',
    }
]

function getPlaces(){
    return gPlaces
}

function addPlace(name, lat, lng, zoom){
    gPlaces.push({
        id : utils.getId(),
        lat,
        lng,
        zoom,
        name
    })
}

function deletePlace(id){
    let idx = gPlaces.findIndex(place => place.id === id)
    gPlaces.splice(idx ,1)
}