export const mapService = {
    getPlaces,
    addPlace
}

let gPlaces = [
    {
        lat: 32.06750927884894,
        lng: 34.82356140098553 ,
        zoom: 8,
        name: 'home,'
    }
]

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