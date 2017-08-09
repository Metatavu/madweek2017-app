/* jshint esversion: 6 */
/* global getConfig */

(function(){
  'use strict';
  
  $.widget("custom.madweek", { 
    
    options: {
    },
    
    _create : function() {
      $(this.element).madweekWordpress();
      $(this.element).madweekWordpress('listEvents')
        .then((events) => {
          for (let i = 0; i < events.length; i++) {
            const event = events[i];
    
            const html = pugEvent({
              event: event
            });

            $('.events-container').append(html);
          }
        })
        .catch((err) => {
          console.log("ERR:" + err);
        });
    }
    
  });
  
  $(document).on("deviceready", () => {
    $(document.body).madweek();
  });

})();

