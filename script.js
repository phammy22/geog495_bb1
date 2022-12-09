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

    map.setPaintProperty('schools',
        'circle-opacity', [
            'match',
            ['get', 'PUB_PRIV'],
            'Public',
            1,
            0
        ]);
});

toggles = {
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
    console.log('test');
}

document.getElementById('toggle-either').addEventListener('click', () => {
    map.setPaintProperty('schools', 'circle-opacity', 1);
});

document.getElementById('toggle-public').addEventListener('click', () => {
    map.setPaintProperty('schools',
    'circle-opacity', [
        'match',
        ['get', 'PUB_PRIV'],
        'Public',
        1,
        0
    ]);
});

document.getElementById('toggle-private').addEventListener('click', () => {
    map.setPaintProperty('schools',
    'circle-opacity', [
        'match',
        ['get', 'PUB_PRIV'],
        'Private',
        1,
        0
    ]);
});

document.getElementById('toggle-elementary').addEventListener('click', () => {
    map.setPaintProperty('schools',
    'circle-opacity', [
        'match',
        ['get', 'TYPE_ELE'],
        1,
        1,
        0
    ]);
});

