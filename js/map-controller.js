import {mapService} from './service/map-service.js'

window.onInit = onInit
window.initMap = initMap
window.onAddPlace = onAddPlace
window.onDelete = onDelete
window.onPlaceName = onPlaceName
window.onCopyLocation = onCopyLocation
window.updatePlaceOnMap = updatePlaceOnMap

let gCoords = {}
let gSelectedLocation = ''

function onInit() {
    renderMapByQueryParams()
    initMap()
    renderPlaces()
    loadWeather()
}

let infoWindow

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: gCoords || {lat: 30, lng: 30},
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
    <div class="place border radius" onclick="updatePlaceOnMap({lat : ${place.lat} ,lng: ${place.lng}})">
    <button class="btn btn-close border" onclick="onDelete('${place.id}')">X</button>
      <h3 onclick="onUpdateMapInitParams('${place.lat}', '${place.lng}', '${place.zoom}')">${place.name}</h3>
      <p class="coord"> '${place.lat}' , '${place.lng}' </p>
      </div>
      `)
  
    elTable.innerHTML = strHTML.join('')
}

function renderWeather({temp , weather , humidity, name}){
  let strHTML = `<h2>Today's weather in ${name} </h2>
                <h3>${temp} C</h3>
                <h4>${weather}</h4>
                <p>humidity ${humidity}</p>

  `
  document.querySelector('.weather').innerHTML = strHTML
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
    const elPlaceName = document.querySelector('[name=search-place]')
    loadWeather(elPlaceName.value)
    loadPlace(elPlaceName.value)
    updateSelectedLocation(elPlaceName.value)
}

function updatePlaceOnMap(place) {
    gCoords = {lat: place.lat, lng: place.lng} 
    loadWeather()
    setURL()
    initMap()
}

function loadWeather() {
    const prm = mapService.getCoordsWeather(gCoords)
    prm.then(renderWeather)
}

function loadPlace(place) {
    const prm = mapService.getCoords(place)
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
        lat: +queryParams.get('lat') || 30,
        lng: +queryParams.get('lng') || 30,
    }
    
    gCoords = {lat: coords.lat, lng: coords.lng}
}

function prepareLinkToCopy() {
    return `https://yardenfarag.github.io/travel-tip/index.html?lat=${gCoords.lat}&lng=${gCoords.lng}`
}