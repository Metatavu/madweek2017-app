/* jshint esversion: 6 */
/* global getConfig */

(function(){
  'use strict';
  
  $.widget("custom.madweek", { 
    
    options: {
    },
    
    _create : function() {
      $(this.element).madweekWordpress();
      $(this.element).madweekEvents();
      $(this.element).madweekHamburgerMenu();
      $(this.element).madweekWordpress('listEvents')
        .then((events) => {
          for (let i = 0; i < events.length; i++) {
            const event = events[i];
    
            const html = pugEvent({
              event: event
            });

            $('.content').append(html);
          }
        })
        .catch((err) => {
          console.log("ERR:" + err);
        });
    },
    
    changePage: function (pageIndex, data) {
      if (pageIndex !== this.activePage) {
        this.activePage = pageIndex;
        $(".content").empty();
        
        switch (pageIndex) {
          case '0':
            $(this.element).madweekEvents('createEventList');
            break;
          case '1':
            $(this.element).madweekEvents('openEventsByDate', data);
            break;
          default:
        }
      }
    }
    
  });
  
  $(document).on("deviceready", () => {
    $(document.body).madweek();
  });

})();

