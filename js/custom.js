




// Function to handle theme switching
function applyTheme(theme) {
    var link = 'css/' + theme + '.css';
    $("#palleon-theme-link").attr('href', link);
  }
  


  function loadPreferences() {
    if(preferencesJSON){
 
    var preferencesJSON = localStorage.getItem('palleon_preferences');
    var settings = JSON.parse(preferencesJSON);
    const themeVal = settings["custom-theme"]


    if (preferencesJSON) {
        for (var key in settings) {
            var value = settings[key];
            // Set the preference values in the corresponding DOM elements
            $('#' + key).val(value);
        }
    }
}

    applyTheme(themeVal)
}


(function($) {
    "use strict";

    $(function () {



      
        /* Initialize Palleon plugin */
        loadPreferences()

        $('#palleon').palleon({



            baseURL: "./", // The url of the main directory. For example; "http://www.mysite.com/palleon-js/"

            //////////////////////* CANVAS SETTINGS *//////////////////////
            fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // Should be a web safe font
            fontSize: 60, // Default font size
            fontWeight: 'normal', // e.g. bold, normal, 400, 600, 800
            fontStyle: 'normal', // Possible values: "", "normal", "italic" or "oblique".
            canvasColor: 'transparent', // Canvas background color
            fill: '#000', // Default text color
            stroke: '#fff', // Default stroke color
            strokeWidth: 0, // Default stroke width
            textBackgroundColor: 'rgba(255,255,255,0)', // Default text background color
            textAlign: 'left', // Possible values: "", "left", "center" or "right". 
            lineHeight: 1.2, // Default line height.
            borderColor: '#000', // Color of controlling borders of an object (when it's active).
            borderDashArray: [4, 4], // Array specifying dash pattern of an object's borders (hasBorder must be true).
            borderOpacityWhenMoving: 0.5, // Opacity of object's controlling borders when object is active and moving.
            borderScaleFactor: 2, // Scale factor of object's controlling borders bigger number will make a thicker border border is 1, so this is basically a border thickness since there is no way to change the border itself.
            editingBorderColor: 'rgba(0,0,0,0.5)', // Editing object border color.
            cornerColor: '#fff', // Color of controlling corners of an object (when it's active).
            cornerSize: 12, // Size of object's controlling corners (in pixels).
            cornerStrokeColor: '#000', // Color of controlling corners of an object (when it's active and transparentCorners false).
            cornerStyle: 'circle', // Specify style of control, 'rect' or 'circle'.
            transparentCorners: false, // When true, object's controlling corners are rendered as transparent inside (i.e. stroke instead of fill).
            cursorColor: '#000', // Cursor color (Free drawing)
            cursorWidth: 2, // Cursor width (Free drawing)
            enableGLFiltering: true, // set false if you experience issues on image filters.
            textureSize: 4096, // Required for enableGLFiltering
            watermark: false, // true or false
            watermarkText: 'https://palleon.website/', // The watermark text
            watermarkFontFamily: 'Georgia, serif', // Should be a web safe font
            watermarkFontStyle: 'normal', // Possible values: "", "normal", "italic" or "oblique".
            watermarkFontColor: '#000', // Watermark font color
            watermarkFontSize: 40, // Watermark font size (integer only)
            watermarkFontWeight: 'bold', // e.g. bold, normal, 400, 600, 800
            watermarkBackgroundColor: '#FFF', // Watermark background color
            watermarkLocation: 'bottom-right', // Possible values: "bottom-right", "bottom-left", "top-left" and "top-right".

            //////////////////////* CUSTOM FUNCTIONS *//////////////////////
            customFunctions: function(selector, canvas, lazyLoadInstance) {


                /* Load JSON */
 function loadJSON(json) {
    selector.find('#palleon-canvas-loader').css('display', 'flex');
    rotate = 5;
    scaleX = json.backgroundImage.scaleX;
    scaleY = json.backgroundImage.scaleY;
    originX = json.backgroundImage.originX;
    originY = json.backgroundImage.originY;
    canvas.clear();
    selector.find('#palleon-layers li').remove();

    mode = json.backgroundImage.mode;
    var blob = dataURLtoBlob(json.backgroundImage.src);
    imgurl = URL.createObjectURL(blob);
    selector.find('#palleon-canvas-img').attr("src",imgurl);
    originalWidth = json.backgroundImage.width;
    originalHeight = json.backgroundImage.height;
    var dimentions = {width:originalWidth, height:originalHeight};

    for (var i = 0; i < json.objects.length; i++) {
        if (json.objects[i].objectType == 'textbox') {
            json.objects[i].fontFamily = json.objects[i].fontFamily + '-palleon';
        }
    }

    canvas.loadFromJSON(json, function() {
        var objects = canvas.getObjects();
        var textboxes = objects.filter(element => element.objectType == 'textbox');
        loadTemplateFonts(textboxes);
        checkLayers();
        selector.find('#palleon-canvas-color').spectrum("set", canvas.backgroundColor);
        selector.find('#custom-image-background').spectrum("set", canvas.backgroundColor);
        img = selector.find('#palleon-canvas-img')[0];
        canvas.requestRenderAll();
        selector.find('#palleon-canvas-loader').hide();
    }, function() {}, {
        crossOrigin: 'anonymous'
    });

    setFileName(new Date().getTime(), '');
    setDimentions(dimentions);
    adjustZoom();
    modeCheck();
    canvas.fire('selection:cleared');
    setTimeout(function(){ 
        selector.find("#palleon-layers > li").removeClass('active');
        if (json.backgroundImage) {
            adjustFilterControls(json.backgroundImage["filters"]);
        }
        if (json.overlayImage) {
            selector.find('#palleon-overlay-wrap').show();
            selector.find('#palleon-overlay-preview').attr('src', json.overlayImage.src);
        } else {
            selector.find('#palleon-overlay-wrap').hide();
            selector.find('#palleon-overlay-preview').attr('src', '');
        }
    }, 100);
}


fetch('../files/templates/json/new.json')
.then(response => response.json())
.then(jsonData => {
  console.log(jsonData, 'dater')
  loadJSON(jsonData)
})
.catch(error => {
  console.error('Error loading JSON file:', error);
});

                /**
                 * @see http://fabricjs.com/fabric-intro-part-1#canvas
                 * You may need to update "lazyLoadInstance" if you are going to populate items of a grid with ajax. 
                 * lazyLoadInstance.update();
                 * @see https://github.com/verlok/vanilla-lazyload
                 */

                /* Template - Add to Favorite */
                selector.find('.template-grid').on('click','.template-favorite button.star',function(){
                    var button = $(this);
                    var templateid = button.data('templateid');
                    
                    /* Do what you want */
                    
                    toastr.success("To make 'saving functions' work, you should have a database on your server and integrate it to Palleon using a server-side language. See Documentation -> Integration.", "Info");
                    // toastr.error("Error!", "Lorem ipsum dolor");
                });

                /* Frame - Add to Favorite */
                selector.find('.palleon-frames-grid').on('click','.frame-favorite button.star',function(){
                    var button = $(this);
                    var frameid = button.data('frameid');
                    
                    /* Do what you want */

                    toastr.success("To make 'saving functions' work, you should have a database on your server and integrate it to Palleon using a server-side language. See Documentation -> Integration.", "Info");
                    // toastr.error("Error!", "Lorem ipsum dolor");
                });

                /* Element - Add to Favorite */
                selector.find('.palleon-grid').on('click','.element-favorite button.star',function(){
                    var button = $(this);
                    var elementid = button.data('elementid');
                    
                    /* Do what you want */

                    toastr.success("To make 'saving functions' work, you should have a database on your server and integrate it to Palleon using a server-side language. See Documentation -> Integration.", "Info");
                    // toastr.error("Error!", "Lorem ipsum dolor");
                });

                /* Delete Template From Library */
                selector.find('.palleon-template-list').on('click','.palleon-template-delete',function(){
                    var answer = window.confirm("Are you sure you want to delete the template permanently?");
                    if (answer) {
                        var target = $(this).data('target');
                        $(this).parent().parent().remove();

                        /* Do what you want */

                        toastr.success("To make 'saving functions' work, you should have a database on your server and integrate it to Palleon using a server-side language. See Documentation -> Integration.", "Info");
                        // toastr.error("Error!", "Lorem ipsum dolor");
                    }
                });

                /* Upload Image To Media Library */
                selector.find('#palleon-library-upload-img').on('change', function (e) {
                    var file_data = this.files[0];

                    /* Do what you want */

                    toastr.success("To make 'saving functions' work, you should have a database on your server and integrate it to Palleon using a server-side language. See Documentation -> Integration.", "Info");
                    // toastr.error("Error!", "Lorem ipsum dolor");
                });

                /* Delete Image From Media Library */
                selector.find('.media-library-grid').on('click','.palleon-library-delete',function(){
                    var answer = window.confirm("Are you sure you want to delete the image permanently?");
                    if (answer) {
                        var target = $(this).data('target');
                        $(this).parent().remove();

                        /* Do what you want */

                        toastr.success("Deleted!", "Lorem ipsum dolor");
                        // toastr.error("Error!", "Lorem ipsum dolor");
                    }
                });

                /* Upload SVG To Media Library */
                selector.find('#palleon-svg-library-upload-img').on('change', function (e) {
                    var file_data = this.files[0];

                    /* Do what you want */

                    toastr.success("To make 'saving functions' work, you should have a database on your server and integrate it to Palleon using a server-side language. See Documentation -> Integration.", "Info");
                    // toastr.error("Error!", "Lorem ipsum dolor");
                });

                /* Delete SVG From Media Library */
                selector.find('.svg-library-grid').on('click','.palleon-svg-library-delete',function(){
                    var answer = window.confirm("Are you sure you want to delete the image permanently?");
                    if (answer) {
                        var target = $(this).data('target');
                        $(this).parent().remove();

                        /* Do what you want */

                        toastr.success("Deleted!", "Lorem ipsum dolor");
                        // toastr.error("Error!", "Lorem ipsum dolor");
                    }
                });

                // Save preferences
                selector.find('#palleon-preferences-save').on('click', function() {
                    var button = $(this);
                    var settings = {};
                    console.log(settings, 'settings')
                    var keys = [];
                    var values = [];
                    selector.find('#palleon-preferences .preference').each(function(index, value) {

                        keys.push($(this).attr('id'));
                        values.push($(this).val());
                    });

                    for (let i = 0; i < keys.length; i++) {
                        settings[keys[i]] = values[i];
                    }

                    var preferences = JSON.stringify(settings);

                    console.log(preferences, 'preffs')

                    /* Do what you want */
                    localStorage.setItem('palleon_preferences', preferences);


                    toastr.success("Saved");
                    // toastr.error("Error!", "Lorem ipsum dolor");

                });



                // Function to load preferences from local storage and set them on page load



            },

            //////////////////////* SAVE TEMPLATE *//////////////////////
            saveTemplate: function(selector, template) {
                /**
                 * var template is JSON string
                 * @see http://fabricjs.com/docs/fabric.Canvas.html#toDataURL
                 */

                // var name = selector.find('#palleon-json-save-name').val();
                
                console.log(template, 'template');

                /* Do what you want */

                toastr.success("To make 'saving functions' work, you should have a database on your server and integrate it to Palleon using a server-side language. See Documentation -> Integration.", "Info");
                // toastr.error("Error!", "Lorem ipsum dolor");
            },

            //////////////////////* SAVE IMAGE *//////////////////////
            saveImage: function(selector, imgData) {
                var name = selector.find('#palleon-save-img-name').val();
                var quality = parseFloat(selector.find('#palleon-save-img-quality').val());
                var format = selector.find('#palleon-save-img-format').val();

                if (format == 'svg') {
                    // var imgData is raw svg code
                    console.log(imgData);

                    /* Do what you want */
                } else {
                    /**
                     * var imgData is DataURL
                     * @see https://flaviocopes.com/data-urls/
                     * @see http://fabricjs.com/docs/fabric.Canvas.html#toDataURL
                     */
                    console.log(imgData);

                    /* Do what you want */
                }

                toastr.success("To make 'saving functions' work, you should have a database on your server and integrate it to Palleon using a server-side language. See Documentation -> Integration.", "Info");
                // toastr.error("Error!", "Lorem ipsum dolor");
            }
        });
    });



})(jQuery);