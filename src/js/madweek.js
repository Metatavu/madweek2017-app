/* jshint esversion: 6 */
/* global getConfig, moment */

(function(){
  'use strict';
  
  $.widget("custom.madweek", { 
    
    options: {
    },
    
    _create : function() {
       moment.locale('fi');
      
      $(this.element).madweekWordpress();
      $(this.element).madweekEvents();
      $(this.element).madweekImage();
      $(this.element).madweekMap();
      
      if (window.FirebasePlugin) {
        window.FirebasePlugin.subscribe('eventstart', function() {
          console.log("Subscribed to eventstart");
        });
        window.FirebasePlugin.subscribe('announcements', function() {
          console.log("Subscribed to announcements");
        });
        window.FirebasePlugin.onNotificationOpen(function(notification) {
            console.log("Received push notification");
        }, function(error) {
            console.error(error);
        });
      }
      
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
    
    _isEventEndedToday: function(event) {
      const now = moment();
      const eventEnd = moment.utc(event.end);
      if (now.hours() > eventEnd.hours()) {
        return true;
      } else if (eventEnd.hours() > now.hours()) {
        return false;
      } else {
        if (eventEnd.minutes() > now.minutes()) {
          return false;
        } else {
          return true;
        }
      }
    },
    
    _isEventStartedToday: function(event) {
      const now = moment();
      const eventStart = moment.utc(event.start);
      if (now.hours() > eventStart.hours()) {
        return true;
      } else if (eventStart.hours() > now.hours()) {
        return false;
      } else {
        if (eventStart.minutes() > now.minutes()) {
          return false;
        } else {
          return true;
        }
      }
    },
    
    _capitalizeFirstLetter: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    _loadMainPageEvents: function () {
      const dateSlug = this._capitalizeFirstLetter(moment().format('dddd-D'));
      $(this.element).madweekWordpress('listEventsByEventType', dateSlug)
        .then((events) => {
          events.sort((a, b) => {
            return moment(a.start).hours() - moment(b.start).hours();
          });
          const activeEvents = [];
          const comingEvents = [];
          for (let i = 0; i < events.length; i++) {
            let event = events[i];
            if (this._isEventEndedToday(event)) {
              continue;
            }
            if (this._isEventStartedToday(event)) {
              activeEvents.push(event);
            } else {
              comingEvents.push(event);
            }
          }

          const html = pugMainPageEvents({
            activeEvents: activeEvents,
            comingEvents: comingEvents
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

