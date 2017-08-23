/* jshint esversion: 6 */
/* global getConfig, StatusBar, WPAPI, Promise, CameraPreview, Camera */

(function(){
  'use strict';
  
  $.widget("custom.madweekImage", {
    
    options: { },
    
    _create: function() {
    },
    
    startCamera: function() {
      navigator.camera.getPicture($.proxy(this._onImageCapture, this), $.proxy(this._onImageCaptureError, this), {
        correctOrientation: true,
        targetWidth: 905,
        targetHeight: 1280,
        cameraDirection: 0
      });
    },
    
    _onImageCapture: function(imageURI) {
      $('.content').empty();
      $(".content").append('<div class="loader"></div>');
      const imageCanvas = $('<canvas>')
        .addClass('image-preview')
        .appendTo($(".content"));

      const processedImage = Caman('.image-preview', 'gfx/mad-tausta-small.jpg', function() {
        this.newLayer(function() {
          this.overlayImage({src: imageURI});
          this.opacity(70);
          this.filter.greyscale();
          this.filter.contrast(10);
          this.filter.gamma(0.9);
          this.newLayer(function() {
            this.setBlendingMode("multiply");
            this.opacity(40);
            this.copyParent();
            this.filter.exposure(15);
            this.filter.contrast(15);
            return this.filter.channels({
              green: 10,
              red: 5
            });
          });
          this.filter.sepia(30);
          this.filter.curves('rgb', [0, 10], [120, 90], [180, 200], [235, 255]);
          this.filter.channels({
            red: 5,
            green: -2
          });
          this.filter.exposure(15);
        });

        this.newLayer(function() {
          this.overlayImage({src: 'gfx/mad-logo-small.png'});
        });

        this.render(function() {
          const imageData = this.toBase64('png');
          cordova.base64ToGallery(imageData, {
            prefix: 'img_',
            mediaScanner: true
          }, function(path) {
            PhotoViewer.show(imageData);
            $(document.body).madweek('changePage', 'index');
          }, function(err) {
            $(document.body).madweek('changePage', 'index');
            console.log(err);
          });
        });
      }); 
    },
    
    _onImageCaptureError: function() {
      $(".loader").remove();
      $(this.element).madweek('changePage', 'index');
      console.error('Error capturing image');
    }
    
  });

})();