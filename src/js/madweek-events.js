/* jshint esversion: 6 */
/* global getConfig, StatusBar, WPAPI, Promise, moment, _ */

(function(){
  'use strict';
  
  $.widget("custom.madweekEvents", {
    
    options: {
    },
    
    _create : function() {
      this.element.on('click', '.event-list-item', $.proxy(this._onEventListItemClick, this));
      this.element.on('click', '.index-event-btn', $.proxy(this._onIndexEventBtnClick, this));
      this.element.on('click', '.close-events-btn', $.proxy(this._onCloseEventBtnClick, this));
    },
    
    createEventList: function () {
      $(this.element).madweekWordpress('listEvents')
        .then((events) => {
          const result = {};
          const resultArray = [];
          for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let dateSlug =  this._capitalizeFirstLetter(moment.utc(event.start).format('dddd-D'));
            if (!result[dateSlug]) {
              result[dateSlug] = {
                weekDay: moment.utc(event.start).format('dddd D.M.'),
                events: _.filter(events, (event) => { return event['event_type'].indexOf(dateSlug) > -1; }),
                slug: dateSlug,
                dayStart: moment.utc(event.start).startOf('day').unix()
              }
            }
          }
          
          _.forEach(result, (eventData, key) => {
            eventData.events.sort((a, b) => {
              return moment(a.start).hours() - moment(b.start).hours();
            });
            resultArray.push(eventData);
          });

          resultArray.sort((a, b) => {
            return a.dayStart - b.dayStart;
          });
          
          $(".loader").remove();
          $(".content").append(pugEventList({
            eventDatas: resultArray
          }));
        });
    },

    openAllEventsView: function (id) {
      $(this.element).madweekWordpress('listEvents')
        .then((events) => {
          events.sort((a, b) => {
            return moment(a.start).hours() - moment(b.start).hours();
          });

        this._renderEventElements(events, id);
      });
    },
    
    openEventsByDate: function (selectedSlug, id) {
      $(this.element).madweekWordpress('listEventsByEventType', selectedSlug)
        .then((events) => {
          events.sort((a, b) => {
            return moment(a.start).hours() - moment(b.start).hours();
          });

        this._renderEventElements(events, id);
      });
    },
    
    openEventsByLocationName: function (locationName, id) {
      $(this.element).madweekWordpress('listEventsByLocationName', locationName)
        .then((events) => {
          events.sort((a, b) => {
            return moment(a.start).hours() - moment(b.start).hours();
          });

        this._renderEventElements(events, id);
      });
    },
    
    _capitalizeFirstLetter: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    _onSlideChangeEnd: function (swiper) {
      this._resizeSlides();
    },
    
    _resizeSlides: function () {
      $('.swiper-slide-active').css({
        'height': 'auto',
        'min-height': 'calc(100vh - 50px)'
      });
      
      $('.swiper-slide:not(.swiper-slide-active)').css({
        'height': '0',
        'min-height': '0'
      });
    },
    
    _renderEventElements: function (events, id) {
      $(".content").append(pugEventSwiper());
      
      this.horizontalSwiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationType: 'fraction',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
      });

      this.horizontalSwiper.on('onSlideChangeEnd', (swiper) => {this._onSlideChangeEnd(swiper); });
          
      $(".loader").remove();
      const idSlideIndexMap = {};

      events.forEach((event, index) => {
        idSlideIndexMap[event.id] = index;
        const html = pugEvent({
          event: event
        });

        $(".swiper-wrapper").append(html);
      });
      this.horizontalSwiper.update();
      this._resizeSlides();
      if (id) {
        this.horizontalSwiper.slideTo(idSlideIndexMap[id]);
      }
    },
    
    _checkDateDifference: function (firstTime, secondTime) {
      const fisrtStamp = parseInt(firstTime);
      const secondStamp = parseInt(secondTime);
      
      const date1 = moment(new Date(fisrtStamp));
      const date2 = moment(new Date(secondStamp));
      
      return date1.diff(date2, 'days');
    },
    
    _onEventListItemClick: function (e) {
      const selectedSlug = $(e.target).closest('.event-list-item').attr('data-slug');
      const selectedId = $(e.target).closest('.event-list-item').attr('data-event-id');
      
      $(".content").empty();
      this.openEventsByDate(selectedSlug, selectedId);
    },
    
    _onIndexEventBtnClick: function (e) {
      const selectedId = $(e.target).closest('.index-event-btn').attr('data-event-id');
      
      $(".content").empty();
      this.openAllEventsView(selectedId);
    },
    
    _onCloseEventBtnClick: function() {
      $(this.element).madweek('resetView');
    }
    
  });

})();
