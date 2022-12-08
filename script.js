mapboxgl.accessToken = 'pk.eyJ1IjoicGhhbW15MjIiLCJhIjoiY2xhZ2JoNmEwMHI2azN1bzFwczlkMTNqdiJ9.T2vpz0gVbuFh7jAZJo67QA';

    //initialize map and details
    const map = new mapboxgl.Map({
        container: 'map', //container id
        style:'mapbox://styles/mapbox/streets-v12', //map style
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
            }
        });
    });