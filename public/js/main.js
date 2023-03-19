import Map from "/node_modules/ol/Map.js";
import OSM from "/node_modules/ol/source/OSM.js";
import TileLayer from "/node_modules/ol/layer/Tile.js";
import View from "/node_modules/ol/View.js";
import { fromLonLat } from "/node_modules/ol/proj.js";
import Feature from "/node_modules/ol/Feature.js";
import VectorLayer from "/node_modules/ol/layer/Vector.js";
import { Point } from "/node_modules/ol/geom.js";
import VectorSource from "/node_modules/ol/source/Vector.js";
import { Overlay } from "/node_modules/ol";
import { get } from "/node_modules/ol/proj";
import GeoJSON from "/node_modules/ol/format/GeoJSON.js";

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: "map",
  view: new View({
    center: fromLonLat([10.93376479, 50.98376802]),
    zoom: 18,
  }),
});

$(document).ready(function () {
  // FETCHING DATA FROM JSON FILE
  $.getJSON("/public/js/pinConfig.json", function (data) {
    {
      data.data.map((point, index) => {
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

const displayFeatureInfo = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });

  if (feature) {
    console.log("here is the event", feature.get("fileName"));
    
  } else {
  }


};
map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
})
