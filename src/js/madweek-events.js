/* jshint esversion: 6 */
/* global getConfig, StatusBar, WPAPI, Promise */

(function(){
  'use strict';
  
  $.widget("custom.madweekEvents", {
    
    options: {
    },
    
    _create : function() {
      this.element.on('click', '.event-list-item', $.proxy(this._onEventListItemClick, this));
    },
    
    createEventList: function () {
      $(this.element).madweekWordpress('listEvents')
        .then((events) => {
          let weekDays = events.map(event => {
            return this._formatEventTime(event.start);
          });
          
          weekDays = this.removeDuplicates(weekDays, 'eventTime');
          this._renderEventList(weekDays);
        });
    },
    
    openEventsByDate: function (data) {  
      const html = pugEventSwiper();
      $(".content").append(html);
      
      this.horizontalSwiper = new Swiper('.swiper-container', { });
      this._renderEventElements();
    },
    
    _renderEventElements: function () {
      $(this.element).madweekWordpress('listEvents')
        .then((events) => {
          let eventsFiltered = [];
          events.forEach((event) => {
            const dateDifference = this._checkDateDifference(event.start, this.selectedDate);
            
            if (dateDifference === 0) {
              eventsFiltered.push(event);
            }
          });
          
          eventsFiltered.forEach((event) => {
            const html = pugEvent({
              event: event
            });
            
            $(".swiper-wrapper").append(html);
          });  
        });
    },
    
    _renderEventList: function (weekDays) {
      weekDays.forEach((weekDay) => {
        const html = pugEventListItem({
          weekDay: weekDay.weekDay,
          eventTime: weekDay.eventTime,
          timestamp: weekDay.timestamp
        });
        $(".content").append(html);
      });
      
    },
    
    _formatEventTime: function (timestamp) {
      moment.locale("fi");
      const stamp = parseInt(timestamp);
      const date = new Date(stamp);
      const day = date.getDay();
      const time = moment(date).format('DD.M');
      const weekDay = moment(date).format('dddd');
      
      return {
        weekDay: weekDay,
        eventTime: time,
        timestamp: stamp
      };
    },
    
    _checkDateDifference: function (firstTime, secondTime) {
      const fisrtStamp = parseInt(firstTime);
      const secondStamp = parseInt(secondTime);
      
      const date1 = moment(new Date(fisrtStamp));
      const date2 = moment(new Date(secondStamp));
      
      return date1.diff(date2, 'days');
    },
    
    _onEventListItemClick: function (e) {
      const pageIndex = $(e.target).closest('.event-list-item').attr('data-pageIndex');
      const timestamp = $(e.target).closest('.event-list-item').attr('data-date');
      this.selectedDate = timestamp;
      
      $(".content").empty();
      $(this.element).madweek('changePage', pageIndex, timestamp);
    },
    
    removeDuplicates: function(arr, key) {
      return arr.filter((obj, index, arr) => {
        return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
      });
    }
    
  });

})();
