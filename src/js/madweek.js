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
      
      this.changePage('0', null);
    },
    
    changePage: function (pageIndex, data) {
      if (pageIndex !== this.activePage) {
        this.activePage = pageIndex;
        $(".content-wrapper").empty();
        
        $(".content-wrapper").append('<div class="loader"></div>');
        
        switch (pageIndex) {
          case '0':
            this._loadMainPageEvents();
            break;
          case '1':
            $(this.element).madweekEvents('createEventList');
            break;
          case '2':
            $(this.element).madweekEvents('openEventsByDate', data);
            break;
          default:
        }
      }
    },
    
    _loadMainPageEvents: function () {
      $(this.element).madweekWordpress('listEvents')
        .then((events) => {
          const now = new Date().getTime();
  
          let activeEvents = events.filter((event) => {
            return event.start < now && event.end > now;
          });
          
          let comingEvents = events.filter((event) => {
            return event.start > now;
          }).sort();
          
          comingEvents = comingEvents.sort((a, b) =>  {
            return a.start - b.start;
          });
          
          console.log(activeEvents);
          console.log(comingEvents);
          const html = pugMainPageEvents({
            activeEvents: activeEvents.slice(0,5),
            comingEvents: comingEvents.slice(0,5)
          });
          
          $(".loader").remove();
          $(".content-wrapper").append(html);
        });
    }
    
  });
  
  $(document).on("deviceready", () => {
    $(document.body).madweek();
  });

})();

