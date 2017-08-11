/* jshint esversion: 6 */
/* global getConfig, StatusBar, WPAPI, Promise */

(function(){
  'use strict';
  
  $.widget("custom.madweekHamburgerMenu", {
    
    options: {
    },
    
    _create : function() {
      this.element.on('click', '.hamburger-menu-button', $.proxy(this._onMenuButtonClick, this));
      this.element.on('click', '.menu-item', $.proxy(this._onMenuItemSelected, this));
    },
    
    _onMenuButtonClick: function () {     
      if ($(".side-menu").hasClass('menu-open')) {
        this._closeMenu();
      } else {
        this._openMenu();
      }
    },
    
    _closeMenu: function () {
      $(".side-menu").removeClass('menu-open');
      $(".side-menu").hide("slide", { direction: "left" }, 200);
    },
    
    _openMenu: function () {
      $(".side-menu").addClass('menu-open');
      $(".side-menu").show("slide", { direction: "right" }, 200);
    },
    
    _onMenuItemSelected: function (e) {
      const pageIndex = $(e.target).closest('.menu-item').attr('data-pageIndex');   
      this._closeMenu();
      
      $(this.element).madweek('changePage', pageIndex);
    }
    
  });

})();

