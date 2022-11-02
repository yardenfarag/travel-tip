import {mapService} from './service/map-service.js'

window.onInit = onInit
window.initMap = initMap
window.onAddPlace = onAddPlace
window.onDelete = onDelete

function onInit() {
    initMap()
    renderPlaces()
}

// let map, infoWindow; ??

function initMap(lat , lng) {
    if (!lat) {({lat ,lng} = mapService.getPlaces()[0])}
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat , lng},
    });
    const marker = new google.maps.Marker({
        position: { lat , lng},
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
    <div class="place border radius" onclick="initMap(${place.lat} , ${place.lng})">
    <button class="btn btn-close border" onclick="onDelete('${place.id}')">X</button>
      <h3 onclick="onUpdateMapInitParams('${place.lat}', '${place.lng}', '${place.zoom}')">${place.name}</h3>
      <p class="coord"> '${place.lat}' , '${place.lng}' </p>
      </div>
      `)
  
    elTable.innerHTML = strHTML.join('')
}

function onRenderModal(lat, lng, zoom) {
    document.querySelector('.add-location').innerHTML = `
    <button class="btn" 
    onclick="onAddPlace('${lat}', '${lng}', '${zoom}')">Save</button>`
    const elModal = document.querySelector('.modal')
    elModal.classList.add('open-modal')
}

function onAddPlace(lat, lng, zoom) {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('open-modal')

    var name = document.querySelector('[name=place-name]').value
    if (!name) return
    mapService.addPlace(name, +lat, +lng, +zoom)
    renderPlaces()
    // onInit()??
    document.querySelector('[name=place-name]').value = ''
}

function onDelete(id){
    console.log(id);
    mapService.deletePlace(id)
    renderPlaces()
    // onInit()??
}