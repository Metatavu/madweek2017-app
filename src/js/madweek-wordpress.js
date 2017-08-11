/* jshint esversion: 6 */
/* global getConfig, StatusBar, WPAPI, Promise */

(function(){
  'use strict';
  
  $.widget("custom.madweekWordpress", {
    
    options: {
      host: 'www.madmikkeli.com',
      port: 80,
      secure: false
    },
    
    _create : function() {
      this.url = `${this.options.secure ? 'https' : 'http'}://${this.options.host}:${this.options.port}/wp-json`;
      this.api = new WPAPI({ 
        endpoint: this.url
      });
      
      this.api.events = this.api.registerRoute( 'eventon', '/events/(?P<id>)');
    },
    
    listEvents: function () {
      return this.api.events()
        .then((result) => {
          const events = [];
          
          _.forEach(result.events, (event, id) => {
            event.start = parseInt(event.start) * 1000;
            events.push(Object.assign(event, {
              id: id
            }));
          });
          
          return events;
        });
    }
    
  });

})();