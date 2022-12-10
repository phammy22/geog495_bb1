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