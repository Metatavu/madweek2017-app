/* jshint esversion: 6 */
/* global getConfig, StatusBar, WPAPI, Promise, _, moment */

(function(){
  'use strict';
  
  $.widget("custom.madweekWordpress", {
    
    options: {
      host: 'www.madmikkeli.com',
      port: 80,
      secure: false,
      cacheValidFor: 1000 * 60 * 5,
      infoPageId: 2
    },
    
    _create : function() {
      this.url = `${this.options.secure ? 'https' : 'http'}://${this.options.host}:${this.options.port}/wp-json`;
      this.cachedEvents = null;
      this.cachedInfo = null;
      this.cacheValid = false;
      this.api = new WPAPI({ 
        endpoint: this.url
      });
      
      moment.locale("fi");
      this.api.events = this.api.registerRoute( 'eventon', '/events/(?P<id>)');
      this.api.info = this.api.registerRoute( 'wp/v2/pages', `/${this.options.infoPageId}`);
      
      setInterval(() => {
        this.cacheValid = false;
      }, this.options.cacheValidFor)
    },
    
    getInfo: function () {
      if (this.cacheValid && this.cachedInfo) {
        return Promise.resolve(this.cachedInfo);
      } else {
        return this.api.info()
          .then((result) => {
            this.cachedInfo = result.content.rendered.replace(/\[.*\]/g, '');
            this.cacheValid = true;
            return this.cachedInfo;
          });
      }
    },
    
    listEvents: function () {
      if (this.cacheValid && this.cachedEvents) {
        return Promise.resolve(this.cachedEvents);
      } else {
        return this.api.events()
          .then((result) => {
            const events = [];

            _.forEach(result.events, (event, id) => {
              event.start = parseInt(event.start) * 1000;
              event.end = parseInt(event.end) * 1000;
              event.id = id;
              event.dateString = moment.utc(event.start).format('DD.M.');
              event.timeString = `${moment.utc(event.start).format('H:mm')} - ${moment.utc(event.end).format('H:mm')}`;
              if (event['location_lat'] && event['location_lon']) {
                 event['location_lat'] = Number(event['location_lat']);
                 event['location_lon'] = Number(event['location_lon']);
              }
              const eventTypes = [];
              _.forEach(event['event_type'], (eventType) => {
                eventTypes.push(eventType);
              });
              event['event_type'] = eventTypes;
              events.push(event);
            });

            this.cachedEvents = events;
            this.cacheValid = true;
            return events;
          });      
      }
    },
    
    listEventsByEventType: function(eventType) {
      return this.listEvents()
        .then((events) => {
          return _.filter(events, (event) => { return event['event_type'].indexOf(eventType) > -1; });
        });
    },
    
    listEventsByLocationName: function(locationName) {
      return this.listEvents()
        .then((events) => {
          return _.filter(events, (event) => { return locationName == event['location_name']});
        });
    }
    
  });

})();