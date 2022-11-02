import {mapService} from './service/map-service.js'

window.onInit = onInit
window.initMap = initMap
window.onAddPlace = onAddPlace
window.onPlaceName - onPlaceName

let gCoords = {lat: 31.028090, lng:35.361351}

function onInit() {
    initMap()
    renderPlaces()
}

let map, infoWindow;

function initMap() {

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: gCoords,
    });
    const marker = new google.maps.Marker({
        position: gCoords,
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
    addPlace(name, +lat, +lng, +zoom)
    init()
}

function onPlaceName() {
    const elPlaceName = document.querySelector('[name=place-name]')
    loadPlace(elPlaceName.value)
}

function loadPlace(place) {
    gCoords = {
        lat: mapService.getCoords(place).lat,
        lng: mapService.getCoords(place).lng
    }
    console.log(gCoords)
    initMap()
}