
window.onInit = onInit
window.initMap = initMap

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
        onRenderModal()
      })
}

function renderPlaces() {
    let places = getPlaces()
  
    let elTable = document.querySelector('.table')
  
    let strHTML = places.map(place => `
      <div class="place border">
      <h3 onclick="onUpdateMapInitParams('${place.lat}', '${place.lng}', '${place.zoom}')">${place.name}</h3>
      <button class="btn border" onclick="onDelete('${place.id}')">X</button>
      </div><br>
      `).join('')
  
    elTable.innerHTML = strHTML
  
}

function onRenderModal(lat, lng, zoom) {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    document.querySelector('.add-loaction').innerHTML = `
    <button class="btn" 
    onclick="onAddPlace($('[name=place-name]').val(),
     '${lat}', '${lng}', '${zoom}')">Save</button>
    `
}

function onAddPlace(name, lat, lng, zoom) {
    if (!name) return
    addPlace(name, +lat, +lng, +zoom)
    init()
}