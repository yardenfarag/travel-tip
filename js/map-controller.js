
window.onInit = onInit
window.initMap = initMap

function onInit() {
    initMap()
}

let map, infoWindow;

function initMap() {
    const uluru = { lat: -25.344, lng: 131.031 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: uluru,
    });
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });

    map.addListener("click", ev => {

        const lat = ev.latLng.lat()
        const lng = ev.latLng.lng()
        const zoom = map.getZoom()
        onRenderModal()
        $(".add-location").html(`<button type="button" 
        class="btn btn-primary add-location" data-bs-dismiss="modal"
        onclick="onAddPlace($('[name=place-name]').val(), '${lat}', '${lng}', '${zoom}')">Save</button>`)
    
    
      })
}

function onRenderModal(lat, lng, zoom) {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
}