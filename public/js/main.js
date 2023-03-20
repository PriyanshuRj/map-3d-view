import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON.js";

const startingLong = 10.93376479;
const starttingLat = 50.98376802;
const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: "map",
  view: new View({
    center: fromLonLat([startingLong, starttingLat]),
    zoom: 20,
  }),
});


$(document).ready(function () {

  // FETCHING DATA FROM JSON FILE
  $.getJSON("/js/pinConfig.json", function (data) {
    {
      data.data.map((point) => {
        let pt = {};
        let features = [
          {
            type: "Feature",

            geometry: {
              type: "Point",
              coordinates: [point.longitude, point.Latitude],
            },
            properties: {
              fileName: point.fileName,
            },
          },
        ];
        pt.features = features;
        pt.type = point.type;
        const properties = { point };
        pt.properties = properties;

        var layer = new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures(pt, {
              featureProjection: get("EPSG:3857"),
            }),
          }),
        });
        map.addLayer(layer);
      });
    }
  });


});
var panorama, viewer, container;
$(document).ready(function () {
  container = document.querySelector('#container');
  viewer = new PANOLENS.Viewer({
    container: container,
    output: 'console'
  });
  panorama = new PANOLENS.ImagePanorama('/assets/HMTpano_000001_000000.jpg' ); 
    viewer.add(panorama);
    viewer.setPanorama(panorama);
});


const displayNewLocationPanoroma = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });

  if (feature) {
    panorama = new PANOLENS.ImagePanorama('/assets/' + feature.get("fileName").substring(1)); 
    viewer.add(panorama);
    viewer.setPanorama(panorama);
  } 
};

map.on('click', function (evt) {

  displayNewLocationPanoroma(evt.pixel);
})
