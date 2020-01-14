import { Component, ViewChild, ElementRef } from '@angular/core';

import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { TileLayer } from '@deck.gl/geo-layers';
import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';

import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  map: google.maps.Map;
  @ViewChild('mapWrapper', { static: false }) mapElement: ElementRef;

  zoom = 12
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    const lngLat = new google.maps.LatLng(49.83902, 24.02765);
    const mapOptions: google.maps.MapOptions = {
      center: lngLat,
      zoom: 15,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions,);

    let layer = new TileLayer({
      stroked: false,

      getLineColor: f => {
        var color;
        let pit = f.properties.pit
        if (pit <= 0.13) {
          color = [0, 255, 0]
        } else if (pit <= 0.28) {
          color = [255, 255, 0]
        } else if (pit > 0.28) {
          color = [255, 0, 0]
        } else {
          color = [0, 0, 0]
        }
        return color
      },

      getLineWidth: f => {
        return 3;
      },
      lineWidthMinPixels: 1,

      getTileData: ({ x, y, z }) => {
        const mapSource = `${environment.tileserverUrl}/${z}/${x}/${y}.pbf`;
        return fetch(mapSource)
          .then(response => response.arrayBuffer())
          .then(buffer => {
            const tile = new VectorTile(new Protobuf(buffer));
            const features = [];
            for (const layerName in tile.layers) {
              const vectorTileLayer = tile.layers[layerName];
              for (let i = 0; i < vectorTileLayer.length; i++) {
                const vectorTileFeature = vectorTileLayer.feature(i);
                const feature = vectorTileFeature.toGeoJSON(x, y, z);
                features.push(feature);
              }
            }
            return features;
          });
      }
    });

    let overlay = new GoogleMapsOverlay({
      layers: [layer]
    });

    overlay.setMap(this.map);
  }


}

