/* jshint esversion: 6 */
/* global getConfig */

(function(){
  'use strict';
  
  $.widget("custom.madweek", { 
    
    options: {
    },
    
    _create : function() {
    }
    
  });
  
  $(document).on("deviceready", () => {
    $(document.body).madweek();
  });

})();

