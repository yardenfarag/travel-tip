import {mapService} from './service/map-service.js'

window.onInit = onInit
window.initMap = initMap
window.onAddPlace = onAddPlace

function onInit() {
    initMap()
    renderPlaces()
}

let map, infoWindow;

function initMap() {
    const deadSea = { lat: 31.028090, lng: 35.361351 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: deadSea,
    });
    const marker = new google.maps.Marker({
        position: deadSea,
        map: map,
    });

    map.addListener("click", ev => {

        const lat = ev.latLng.lat()
        const lng = ev.latLng.lng()
        const zoom = map.getZoom()
        onRenderModal(lat , lng , zoom)
      })
}

function renderPlaces() {
    let places = mapService.getPlaces()
  
    let elTable = document.querySelector('.location-list')
  
    let strHTML = places.map(place => `
    <div class="place border">
    <button class="btn border" onclick="onDelete('${place.id}')">X</button>
      <h3 onclick="onUpdateMapInitParams('${place.lat}', '${place.lng}', '${place.zoom}')">${place.name}</h3>
      <p> '${place.lat}' , '${place.lng}' </p>
      </div><br>
      `)
  
    elTable.innerHTML = strHTML.join('')
  
}

function onRenderModal(lat, lng, zoom) {
    document.querySelector('.add-location').innerHTML = `
    <button class="btn" 
    onclick="onAddPlace('${lat}', '${lng}', '${zoom}')">Save</button>`
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
}

function onAddPlace(lat, lng, zoom) {
    let name = document.querySelector('[name=place-name]').value
    console.log(name, lat, lng, zoom);
    if (!name) return
    mapService.addPlace(name, +lat, +lng, +zoom)
    onInit()
}