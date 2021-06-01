import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { jabarGeoJson } from '../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  
  private initMap(): void {

    let map = L.Map;
    let geoJson = L.geoJson;
    
    map = L.map('map', {
      center: [ -6.92, 107.64 ],
      zoom: 8
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      id: 'rutilahu-jabar', 
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function getColor(d) {
	    return d > 1000 ? '#800026' :
	           d > 500  ? '#BD0026' :
	           d > 200  ? '#E31A1C' :
	           d > 100  ? '#FC4E2A' :
	           d > 50   ? '#FD8D3C' :
	           d > 20   ? '#FEB24C' :
	           d > 10   ? '#FED976' :
	                      '#FFEDA0';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
          weight: 1,
          color: 'gray',
          dashArray: '',
          fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
    }

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function resetHighlight(e) {
      geoJson.resetStyle(e.target);
    }

    function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
      });
    }

    geoJson = L.geoJson(jabarGeoJson, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);

  }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
