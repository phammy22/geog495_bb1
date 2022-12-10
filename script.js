mapboxgl.accessToken = 'pk.eyJ1IjoicGhhbW15MjIiLCJhIjoiY2xhZ2JoNmEwMHI2azN1bzFwczlkMTNqdiJ9.T2vpz0gVbuFh7jAZJo67QA';

//initialize map and details
const map = new mapboxgl.Map({
    container: 'map', //container id
    style: 'mapbox://styles/mapbox/streets-v12', //map style
    center: [-122.3321, 47.6062], //starting coordinates
    zoom: 10.5 //starting zoom level
});

//load data onto map
map.on('load', () => {
    map.addLayer({
        'id': 'schools',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'assets/schools.geojson'
        },
        'paint': {
            'circle-color': [
                'match',
                ['get', 'PUB_PRIV'],
                'Public',
                '#003f5c',
                'Private',
                '#ff6361',
                '#000'
            ]
        }
    });
});

const geocoder = new MapboxGeocoder({
    // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    placeholder: 'Search for schools in Seattle', // Placeholder text for the search bar
    bbox: [-122.451358,47.785686,-122.194608,47.474749], // Boundary for Seattle
    proximity: {
        longitude: -122.3321,
        latitude: 47.6062
    } // Coordinates of Seattle
});

map.addControl(geocoder);

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
map.on('mouseenter', 'schools', (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
    
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const school_name = e.features[0].properties.SCHOOL;
    const school_address = e.features[0].properties.ADDRESS;
    const city = e.features[0].properties.CITY;
    const PUB_PRIV = e.features[0].properties.PUB_PRIV;
    
    
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML("School name:  " + school_name + "<br>Address: " + school_address + ", " + city +  "<br>Status: " + PUB_PRIV ).addTo(map);
    });
    
    map.on('mouseleave', 'schools', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
    });
const toggles = {
    'either': document.getElementById('toggle-either'),
    'public': document.getElementById('toggle-public'),
    'private': document.getElementById('toggle-private'),
    'elementary': document.getElementById('toggle-elementary'),
    'middle': document.getElementById('toggle-middle'),
    'high': document.getElementById('toggle-high')
};

Object.entries(toggles).forEach(([k, v]) => {
    v.addEventListener('click', updateVis);
});

function updateVis() {
    let either_toggled = toggles.either.checked;
    let public_toggled = toggles.public.checked;
    let private_toggled = toggles.private.checked;
    let elementary_toggled = toggles.elementary.checked;
    let middle_toggled = toggles.middle.checked;
    let high_toggled = toggles.high.checked;

    let expression = [
        'case',
        ['all',
            ['any', 
                ['all', ['==', ['get', 'TYPE_ELE'], 1], elementary_toggled],
                ['all', ['==', ['get', 'TYPE_MID'], 1], middle_toggled],
                ['all', ['==', ['get', 'TYPE_HIG'], 1], high_toggled]],
            ['any',
                either_toggled,
                ['all', ['==', ['get', 'PUB_PRIV'], 'Public'], public_toggled],
                ['all', ['==', ['get', 'PUB_PRIV'], 'Private'], private_toggled]]],
        1,
        0
    ];

    map.setPaintProperty('schools', 'circle-opacity', expression);
}

