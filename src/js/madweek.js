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
    },
    
    changePage: function (pageIndex, data) {
      if (pageIndex !== this.activePage) {
        this.activePage = pageIndex;
        $(".content-wrapper").empty();
        
        $(".content-wrapper").append('<div class="loader"></div>');
        
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

