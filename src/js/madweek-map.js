/* jshint esversion: 6 */
/* global getConfig, StatusBar, WPAPI, Promise, _, moment, L */

(function(){
  'use strict';
  
  $.widget("custom.madweekMap", {
    
    options: {
    },
    
    _create : function() {
      const HighlightIcon = L.Icon.Default.extend({
        options: {
          iconUrl: '/../../../../../gfx/red-icon.png'
        }
      });
      const DefaultIcon = L.Icon.Default.extend({
        options: {
          iconUrl: '/../../../../../gfx/default-icon.png'
        }
      });

      this.defaultIcon = new DefaultIcon();
      this.highlightIcon = new HighlightIcon();
      this.mapMarkers = [];
      this.markerGroups = [];
      this.mapInitialized = false;
    },
    
    renderMapPage: function (highlightId) {
      $(".content").hide();
      $('#map').show();
      if (!this.mapInitialized) {
        this.mapInitialized = true;
        this.mapMarkers = [];
        this.markerGroups = [];
        const layer = new L.StamenTileLayer('watercolor');
        const map = new L.Map('map', {
          maxZoom: 16
        });
        map.addLayer(layer);
        const markerClusters = {};
        $(this.element).madweekWordpress('listEvents')
          .then((events) => {
            _.forEach(events, (event) => {
              if (event['location_lat'] && event['location_lon']) {
                if (typeof (markerClusters[event['location_name']]) === 'undefined') {
                  markerClusters[event['location_name']] = L.markerClusterGroup({});
                }

                var marker = L.marker({
                  lat: event['location_lat'],
                  lng: event['location_lon']
                }, {
                    icon: this.defaultIcon
                });

                marker.eventId = event.id;
                marker.locationName = event['location_name'];
                marker.on('click', () => {
                  $("#map").hide();
                  $('.content').show();
                  $(this.element).madweekEvents('openEventsByLocationName', marker.locationName, marker.eventId);
                });

                markerClusters[event['location_name']].addLayer(marker);
                this.mapMarkers.push(marker);
              }
            });

            for (let clusterName in markerClusters) {
              if (markerClusters.hasOwnProperty(clusterName)) {
                var cluster = markerClusters[clusterName];
                map.addLayer(cluster);
                this.markerGroups.push(cluster);
              }
            }
            map.setView({
              lat: 61.688727,
              lng: 27.272146
            }, 14);

            if (typeof (highlightId) !== 'undefined') {
              layer.once('load', function () {
                this._highlightMarker(highlightId);
              });
            }
          });
      } else {
        this._resetMarkers();
        this._highlightMarker(highlightId);
      }
    },
    
    _highlightMarker: function(highlightId) {
      if (typeof (highlightId) !== 'undefined') {
        const highlightMarker = this._getMarkerById(highlightId);
        if (highlightMarker) {
          showMarker(highlightMarker);
        }
      }
    },
    
    _getGroupByMarker: function(marker) {
      for (let i = 0; i < this.markerGroups.length; i++) {
        if (this.markerGroups[i].hasLayer(marker)) {
          return this.markerGroups[i];
        }
      }
      return null;  
    },

    _getMarkerById: function(id) {
      for (let i = 0; i < this.mapMarkers.length; i++) {
        if (this.mapMarkers[i].eventId == id) {
          return this.mapMarkers[i];
        }
      }
      return null;
    },

    _showMarker: function(marker) {
      marker.setIcon(this.highlightIcon);
      const group = getGroupByMarker(marker);
      if(group) {
        group.zoomToShowLayer(marker, () => {
          marker.__parent.spiderfy();  
        });
      }
    },
    
    _resetMarkers: function() {
      for (let i = 0; i < this.mapMarkers.length; i++) {
        this.mapMarkers[i].setIcon(this.defaultIcon);
        this.mapMarkers[i].__parent.unspiderfy();
      }
    }
    
  });

})();