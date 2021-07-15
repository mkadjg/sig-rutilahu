import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { jabarGeoJson } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // form
  anggaran: string = 'APBD I';
  tahun: string = '2013';

  // temp

  // table
  displayedColumns: string[] = ['nama_kabupaten_kota', 'jumlah_realisasi', 'anggaran', 'tahun'];
  dataSource = new MatTableDataSource<any>([]);
  
  // leafleat
  map:any = L.Map;
  tempInfo:any = L.control(); 

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient) { }

  initRenderMap() {
    this.http.get<any>("https://data.jabarprov.go.id/api-coredata/disperkim/od_jumlah_realisasi_perbaikan_rumah_tidak_layak_huni?" +
    "where={'tahun': '" + this.tahun + "', 'anggaran': '"+ this.anggaran + "'}")
      .subscribe(response => {
        this.dataSource = new MatTableDataSource<any>(response.data);
        this.dataSource.paginator = this.paginator;

        let geoJson = L.geoJson;
        var info = L.control();

        this.map = L.map('map', {
          center: [ -6.92, 107.64 ],
          zoom: 8
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          id: 'rutilahu-jabar', 
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

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
          let jumlah = 0;
          response.data.map(item => {
            if (item.kode_kabupaten_kota == feature.properties.ID_KAB) {
              jumlah = item.jumlah_realisasi; 
            }
          });
          return {
            fillColor: getColor(jumlah),
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
          info.update(layer.feature.properties);
        }

        function zoomToFeature(e) {
          this.map.fitBounds(e.target.getBounds());
        }

        function resetHighlight(e) {
          geoJson.resetStyle(e.target);
          info.update();
        }

        function onEachFeature(feature, layer) {
          layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
          });
        }

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        info.update = function (props) {
          let jumlah = 0;
          if (props) 
            response.data.map(item => {
              if (item.kode_kabupaten_kota == props.ID_KAB) {
                jumlah = item.jumlah_realisasi; 
              }
            });

          this._div.innerHTML = '<h4>Perbaikan Rutilahu Jabar</h4>' +  (props ?
              '<b>' + props.KABKOT + '</b><br />' + jumlah + ' rumah / mi<sup>2</sup>'
              : 'Arahkan mouse ke peta');
        };

        info.addTo(this.map);
        this.tempInfo = info;

        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 50, 100, 200, 500, 1000],
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(this.map);

        geoJson = L.geoJson(jabarGeoJson, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(this.map);
      }
    )
  }

  renderMap() {
    this.http.get<any>("https://data.jabarprov.go.id/api-coredata/disperkim/od_jumlah_realisasi_perbaikan_rumah_tidak_layak_huni?" +
    "where={'tahun': '" + this.tahun + "', 'anggaran': '"+ this.anggaran + "'}")
      .subscribe(response => {
        this.dataSource = new MatTableDataSource<any>(response.data);
        this.dataSource.paginator = this.paginator;

        let geoJson = L.geoJson;
        var info = L.control();
        this.map.removeControl(this.tempInfo);

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
          let jumlah = 0;
          response.data.map(item => {
            if (item.kode_kabupaten_kota == feature.properties.ID_KAB) {
              jumlah = item.jumlah_realisasi; 
            }
          });
          return {
            fillColor: getColor(jumlah),
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
          info.update(layer.feature.properties);
        }

        function zoomToFeature(e) {
          this.map.fitBounds(e.target.getBounds());
        }

        function resetHighlight(e) {
          geoJson.resetStyle(e.target);
          info.update();
        }

        function onEachFeature(feature, layer) {
          layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
          });
        }

        info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        info.update = function (props) {
          let jumlah = 0;
          if (props) 
            response.data.map(item => {
              if (item.kode_kabupaten_kota == props.ID_KAB) {
                jumlah = item.jumlah_realisasi; 
              }
            });

          this._div.innerHTML = '<h4>Perbaikan Rutilahu Jabar</h4>' +  (props ?
              '<b>' + props.KABKOT + '</b><br />' + jumlah + ' rumah / mi<sup>2</sup>'
              : 'Arahkan mouse ke peta');
        };

        info.addTo(this.map);
        this.tempInfo = info;

        geoJson = L.geoJson(jabarGeoJson, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(this.map);
      }
    )
  }

  ngOnInit() {          
    this.initRenderMap();
  }

  onChangeTahun(event) {
    this.renderMap();
  }

  onChangeAnggaran(event) {
    this.renderMap();
  }

}