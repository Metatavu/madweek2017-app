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
      $(this.element).madweekImage();
      $(this.element).madweekMap();
      
      this.element.on('click', '.nav-item', $.proxy(this._onMenuItemClick, this));
      
      this.changePage('index', null);
    },
    
    changePage: function (page) {
      this.activePage = page;
      $(".content").empty();
      $("#map").hide();
      $('.content').show();
      $(".content").append('<div class="loader"></div>');

      switch (page) {
        case 'index':
          this._loadMainPageEvents();
        break;
        case 'event-list':
          $(this.element).madweekEvents('createEventList');
        break;
        case 'image':
          $(this.element).madweekImage('startCamera');
        break;
        case 'map':
          $(this.element).madweekMap('renderMapPage');
        break;
        case 'info':
           this._loadInfoPage();
        break;
        default:
      }
    },
    
    resetView: function() {
      const viewToReset = this.activePage ? this.activePage : 'index';
      this.changePage(viewToReset);
    },
    
    _loadInfoPage: function() {
      $(this.element).madweekWordpress('getInfo')
        .then((info) => {
          $(".loader").remove();
          const wrappedInfo = $('<div>').addClass('info-container').append(info);
          $(".content").append(wrappedInfo);
        });
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

          const html = pugMainPageEvents({
            activeEvents: activeEvents.slice(0,5),
            comingEvents: comingEvents.slice(0,5)
          });
          
          $(".loader").remove();
          $(".content").append(html);
        });
    },
    
    _onMenuItemClick: function(e) {
      e.preventDefault();
      $('.nav-item').removeClass('active');
      const navItem = $(e.target).closest('.nav-item');
      navItem.addClass('active');
      const page = navItem.attr('data-page');   
      this.changePage(page);
      $('.navbar-collapse').collapse('hide');
    }
    
  });
  
  $(document).on("deviceready", () => {
    $(document.body).madweek();
  });

})();

