import {mapService} from './service/map-service.js'

window.onInit = onInit
window.initMap = initMap
window.onAddPlace = onAddPlace
window.onDelete = onDelete
window.onPlaceName = onPlaceName
window.onCopyLocation = onCopyLocation

let gCoords = {lat: 31.028090, lng:35.361351}
let gSelectedLocation = ''

function onInit() {
    renderMapByQueryParams()
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
    infoWindow = new google.maps.InfoWindow();
    const locationButton = document.querySelector(".my-location");

  locationButton.classList.add("custom-map-control-button");
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Your Location");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
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

function onPlaceName() {
    const elPlaceName = document.querySelector('[name=place-name]')
    loadPlace(elPlaceName.value)
    updateSelectedLocation(elPlaceName.value)
}

function updatePlaceOnMap(place) {
    gCoords = {lat: place.lat, lng: place.lng}
    gCoords 
    setURL()
    initMap()
}

function loadPlace(place) {
    const prm = getCoords(place)
    prm.then(updatePlaceOnMap)
}

function updateSelectedLocation(place) {
    gSelectedLocation = place
    document.querySelector('.selected-location').innerText = place
}

function onCopyLocation() {
    const copyText = prepareLinkToCopy()
    navigator.clipboard.writeText(copyText)
    notifyUserCopied()
}

function notifyUserCopied() {
    const elCopied = document.querySelector('.copied')
    elCopied.innerText = 'Copied Succesfully ✅'
    setTimeout(() => {
        elCopied.innerText = ''
    }, 1500)
}

function setURL() {
    var strQueryParams = `?`
    strQueryParams += `lat=${gCoords.lat}&lng=${gCoords.lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + strQueryParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderMapByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const coords = {
        lat: queryParams.get('lat') || 30,
        lng: queryParams.get('lng') || 30
    }

    gCoords = coords
}

function prepareLinkToCopy() {
    return `https://yardenfarag.github.io/travel-tip/index.html?lat=${gCoords.lat}&lng=${gCoords.lng}`
}