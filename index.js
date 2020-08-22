/**
 ||=========================================================||
 ||  * @author Teban18 <https://github.com/Teban18>         ||
 ||* @description This project pretend represent coordinates||
 ||*              grafically in a map. by OpenLayers api    ||
 ||=========================================================||
 */



import 'ol/ol.css';
import {Map, View} from 'ol';
import {Vector as VectorLayer, Tile as TileLayer} from 'ol/layer';
import {Vector as VectorSource, OSM} from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {defaults as defaultControls, ScaleLine} from 'ol/control';
import TileWMS from 'ol/source/TileWMS';
import {PointStyle, Fill, Stroke, Style, Circle} from 'ol/style';
import CircleStyle from 'ol/style/Circle';


const source = new VectorSource();

function ajaxRequest(){
  var request = new XMLHttpRequest();
  request.open("GET","https://www.datos.gov.co/resource/wsrw-hr5d.json",true);
  request.addEventListener("load", function() {
  for (const iterator of JSON.parse(request.responseText)){
    let data = {
      'coordinates': [iterator.longitud,iterator.latitud],
      'radius':20,
      'fillcolor': 'rgba(255,0,0,0.2)',
      'strokecolor': 'rgba(255,0,0,0.2)'
    }  
    createFeature(data); 
  }
  });
  request.send();
}

function createFeature(data){
  let features = [];
  let figure = new Feature({ 
    geometry: new Point(data.coordinates)
  });
  figure.setStyle(new Style({
    image: new CircleStyle({
      radius: data.radius,
      fill: new Fill({
        color: data.fillcolor}),
        stroke: new Stroke({
          color: data.strokecolor})
        })
    }));
  features.push(figure);
  source.addFeatures(features);
}

function createMap(){
  new Map({
  controls: defaultControls().extend([
    new ScaleLine({
      units: 'degrees'
    })
  ]),
  layers: [
    new TileLayer({
      source: new OSM({
        params: {
          'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
          'TILED': true
        }
      })
    }),
    new VectorLayer({
      source: source
    })
  ],
  target: 'map',
  view: new View({
    projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 2
  })
});
}

ajaxRequest();
createMap();
