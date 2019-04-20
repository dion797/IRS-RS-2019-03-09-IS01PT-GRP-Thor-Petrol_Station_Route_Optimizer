/*
MiniMap Generator by 
OneMap Development Team

This generates embedded
minimap for OneMap Users
*/

// URLs for generating/exporting minimap
const MINIMAPBASEURL = "amm?";
const directURL = "https://tools.onemap.sg/amm/amm.html?";

// Load from local storage, else initialise as empty array
var currentMarkers = JSON.parse(localStorage.getItem("storedMarkers")) || [];
var Waypoints = JSON.parse(localStorage.getItem("storedWaypoints")) || []; //Pong Added

// Set limit for amount of markers user can place (adjust if needed in the future)
const MAX_MARKERS_COUNT = 10;

// Display the map and any other frontend related components
$(window).on("load", function() {
  $("#accordion").accordion({collapsible: true, heightStyle: "fill", icons: {"header": "fa-angle-right", "activeHeader": "fa-angle-down"}});
  refreshDisplay();
});

// Refresh preview display if map settings got change
$('form :input').on("change", function() {
  if(this.checkValidity() === true)
    refreshDisplay();
});

// This function to cloud search for location that users inputted
$("#location").autocomplete({
  minLength: 2,
  source: function(request, response) {
    $.ajax({
      url: `https://developers.onemap.sg/commonapi/search?searchVal=${encodeURI($("#location").val())}&returnGeom=Y&getAddrDetails=Y`,
      method: "GET",
      success: function(data) {
        response(data.results);
      }
    });
  },
  select: function(event, ui) {
    selectedLocation(ui.item.LATITUDE, ui.item.LONGTITUDE, ui.item.ADDRESS);
  }
}) // The below modifies what the autocomplete suggestions displays
.autocomplete("instance")._renderItem = function(ul, item) {
  return $("<li>")
  .append(`<div> ${item.BUILDING != "NIL" ? item.BUILDING + "<br><label style='font-size:x-small'>" + item.ADDRESS + "</label>" : item.ADDRESS} </div>`)
  .appendTo(ul);
}

var localStorageManager = {
  // Saves current markers into local storage
  updateLocalStorage: () => {
    localStorage.setItem("storedMarkers", JSON.stringify(currentMarkers));
    localStorage.setItem("storedWaypoints", JSON.stringify(Waypoints)); // Pong added
    document.getElementById("wayPts").value = JSON.stringify(currentMarkers);
  },
  // Clear local storage
  clearLocalStorage: () => {
    localStorage.removeItem("storedMarkers");
    localStorage.removeItem("storedWaypoints"); // Pong added
    document.getElementById("wayPts").value = "";
  }
}

// On location selection
function selectedLocation(lat,lng,currentLocation) {
  // Unable to spam add >10 locations.
  if(currentMarkers.length >= MAX_MARKERS_COUNT) {
    swal({title: "Reached maximum number of markers", text: `Only a maximum of ${MAX_MARKERS_COUNT} annotation markers can be placed on the map`, type: "error"});
    return;
  }
  var marker = {
    no: null,
    location: currentLocation,
    latLng: lat + "," + lng,
    lat1: lat, //Pong added
    lng1: lng, // Pong added
    iwt: null,
    icon: null,
    colour: null,
    rType: null,
    // Target a marker to route to
    rDestTarget: null
  }
  
  openEditor(marker);
}

// Edit location
function editLocation(index) {
  var arrIndex = currentMarkers.findIndex(function(item, i) {
    return item.no === index;
  });
  openEditor(currentMarkers[arrIndex]);
}

// New marker -> Assign index if confirm create
// Exisiting marker -> Replace itself in the currentMarkers array
function openEditor(marker) {

  var html_insert =
    "<form id='markerForm'>" +
      "<h3>" + marker.location + "</h3>" +
      "<div id='markerPreview'></div>" +
      "<div class='column' style='display:none'>" +
        "<div class='col-sm-6 col-md-7 col-lg-8 col-xl-8 marker-form-col'>" +
          "<div class='form-inline'>" +
            "<label for='colourselector' class='col-6'>Marker colour</label>" +
            "<select id='colourselector'>" +
              "<option value='red' data-color='#d53e2a'>red</option>" +
              "<option value='darkred' data-color='#9f3235'>darkred</option>" +
              "<option value='lightred' data-color='#ff8e7f'>lightred</option>" +
              "<option value='orange' data-color='#f49630'>orange</option>" +
              "<option value='beige' data-color='#ffca92'>beige</option>" +
              "<option value='green' data-color='#72b026'>green</option>" +
              "<option value='darkgreen' data-color='#728224'>darkgreen</option>" +
              "<option value='lightgreen' data-color='#bbf970'>lightgreen</option>" +
              "<option value='blue' data-color='#38aadd'>blue</option>" +
              "<option value='darkblue' data-color='#0067a3'>darkblue</option>" +
              "<option value='lightblue' data-color='#89dbff'>lightblue</option>" +
              "<option value='purple' data-color='#d051b8'>purple</option>" +
              "<option value='darkpurple' data-color='#5b396b'>darkpurple</option>" +
              "<option value='pink' data-color='#ff90e9'>pink</option>" +
              "<option value='cadetblue' data-color='#426877'>cadetblue</option>" +
              "<!--<option value='white' data-color='#fbfbfb'>white</option>-->" +
              "<option value='gray' data-color='#575757'>gray</option>" +
              "<option value='lightgray' data-color='#a3a3a3'>lightgray</option>" +
              "<option value='black' data-color='#303030'>black</option>" +
            "</select>" +
          "</div>" +
        "</div>" +
        "<div class='col-sm-6 col-md-7 col-lg-8 col-xl-8 marker-form-col'>" +
          "<div class='form-inline'>" +
            "<label for='iconPicker' class='col-6'>Marker icon</label>" +
            "<input id='iconPicker' class='iconPicker'/>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "<div id='mkRtChkBxWrapper' class='form-check' style='display:none'>" +
        "<label class='form-check-label'>" +
          "<input type='checkbox' id='mkRtChkBx' checked='true' class='form-check-input'/>" +
          "Enable marker-to-marker routing?" +
        "</label>" +
      "</div>" +
      "<div id='mkRtWrapper' class='column'>" +
        "<div class='col-sm-6 col-md-7 col-lg-8 col-xl-8 marker-form-col'>" +
          "<div class='form-inline'>" +
            "<label for='rDestInput' class='col-6'>Destination</label>" +
            "<select id='rDestInput' class='custom-select col-6' style='width: 75px; font-family: fontawesome;''>" +
              "<!--<option value=''>&#xf05e</option>-->" +
            "</select>" +
          "</div>" +
        "</div>" +
        "<div class='col-sm-6 col-md-7 col-lg-8 col-xl-8 marker-form-col'>" +
          "<div class='form-inline'>" +
            "<label for='rTypeInput' class='col-6'>Type</label>" +
            "<select id='rTypeInput' class='selectpicker show-tick' data-width='75px' style='font-family: fontawesome;'>" +
              "<option data-icon='fa-subway' value='TRANSIT'></option>" +
              "<option data-icon='fa-bus' value='BUS'></option>" +
              "<option data-icon='fa-automobile' value='drive'></option>" +
              "<option data-icon='fa-male' value='walk'></option>" +
              "<option data-icon='fa-bicycle' value='cycle'></option>" +
            "</select>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "<div class='form-check' style='display:none'>" +
        "<label class='form-check-label'>" +
          "<input type='checkbox' id='popupDesigner' checked='true' class='form-check-input'/>" +
          "Enable text popup?" +
        "</label>" +
      "</div>" +
      "<div id='editorWrapper'>" +
        "<textarea id='popupTextField' style='height:200px;width:380px'/>" +
      "</div>" +
    "</form>"
  ;
  swal({
    html: html_insert,
    confirmButtonText: marker.no != null ? "Save" : "Create",
    showCancelButton: true,
    preConfirm: () => {
      marker.iwt = $("#popupDesigner").prop("checked") ? $('#popupTextField').tinymce().getContent() : null;
      marker.icon = $(".iconPicker").val().trim() != "" ? $(".iconPicker").val() : null;
      marker.colour = $("#colourselector").val();
      // Saving marker-to-marker routing info
      if($("#mkRtChkBx").prop("checked")) {
        marker.rDestTarget = $("#rDestInput").val();
        marker.rType = $("#rTypeInput").val();
      }
      else {
        marker.rDestTarget = null;
        marker.rType = null;
      }
    }
  }).then((result) => {
    if(result.value)
      saveOrUpdate(marker);
  })

  // Colour selector initialize, default color is red
  var init_colourSelector = () => {
    $("#colourselector").val(marker.colour || "red").colorselector();
  }
  
  // Icon picker initialize, default icon is circle
  var init_iconPicker = () => {
    // Find icons from font awesome css file (for icon selector)
    var icons = $.map($.map(document.styleSheets, function(s) {
      if(s.href && s.href.endsWith("font-awesome.min.css"))
        return s;
      return null;
    })[0].cssRules, function(r) {
      if(r.cssText.indexOf("::before { content: ") > 0) {
        return r.cssText.substring(1, r.cssText.indexOf("::"));
      }
      return null;
    });
    // Set icon to Icon picker if marker has icon
    $(".iconPicker").fontIconPicker({theme: "fip-bootstrap", source: icons}).setIcon(marker.icon || "");
  }
  
  var init_editor = async () => {
    // Remove any existing editor(s) then initialize TinyMCE text editor
    if(tinymce.editors.length > 0)
      tinymce.remove(tinymce.editors[0]);
    var init = () => {
      tinymce.init({
        selector: "#popupTextField",
        menubar: false,
        resize: false,
        height: "100%", width: "100%",
        // Link plugin is edited to always append "http://" to url
        plugins: "textcolor lists link image hr charslimit",
        link_assume_external_targets: true,
        default_link_target: "_blank",
        toolbar: "fontselect fontsizeselect bold italic underline strikethrough removeformat forecolor backcolor | subscript superscript | alignleft aligncenter alignright alignjustify numlist bullist outdent indent | hr image link unlink | undo redo",
        init_instance_callback: function(editor) {
          // Hide/show editor when the checkbox is toggled
          $("#popupDesigner").on("change", (event) => {
            $("#editorWrapper").toggle(event.target.checked);
          });
          // Hide text editor if marker has no popup text
          $("#popupDesigner").prop("checked", marker.iwt != null).trigger("change");
        },
        setup: function(editor) {
          // Set content to editor
          editor.on("init", () => {
            editor.setContent(marker.iwt || "");
          });
          // For text input and toolbar usage
          editor.on("ExecCommand Input", tinymce.util.Delay.debounce(() => updatePreview(), 1200));
          // For Image insertion, don't have to use debounce
          editor.on("SetContent", (e) => {if(e.selection === true) updatePreview()});
        }
      });
    }
    await init();
  }
  
  // Marker-to-marker settings init
  var init_routing = () => {
    if(!(currentMarkers.length > 0 && (currentMarkers.length != 1 || currentMarkers[0].no != marker.no ))) {
      $("#mkRtChkBxWrapper, #mkRtWrapper").hide();
      $("#mkRtChkBx").prop("checked", false);
      return;
    }
    currentMarkers.forEach(function(otherMarker) {
      if(otherMarker.no != marker.no)
        $("#rDestInput").append(`<option value='${otherMarker.no}'>${otherMarker.location}</option>`)
    });
    $("#mkRtChkBx").on("change", (event) => {
      $("#mkRtWrapper").toggle(event.target.checked);
    })
    var arrIndex = currentMarkers.findIndex(function(item) {
      return item.no == marker.rDestTarget;
    });
    if(arrIndex >= 0) {
      $("#rDestInput").val(marker.rDestTarget);
      $("#rTypeInput").val(marker.rType);
    }
    $("#mkRtChkBx").prop("checked", arrIndex >= 0).trigger("change");
    // init bootstrap-select
    $(".selectpicker").selectpicker({
      iconBase: 'fa',
      tickIcon: 'fa-check'
    });
  }
  
  // Update marker preview
  var updatePreview = () => {
    var markerURL = `&marker=latLng:${marker.latLng}!colour:${$("#colourselector").val()}`;
    if($("#popupDesigner").prop("checked")) {
      markerURL += "!iwt:" + window.btoa($('#popupTextField').tinymce().getContent());
    }
    if($(".iconPicker").val() != "") {
      markerURL += "!icon:" + $(".iconPicker").val();
    }
    if($("#mkRtChkBx").prop("checked")) {
      var arrIndex = currentMarkers.findIndex(function(item) {
        return item.no == $("#rDestInput").val();
      });
      if(arrIndex >= 0) {
        markerURL += `!rType:${$("#rTypeInput").val()}!rDest:${currentMarkers[arrIndex].latLng}`;
      }
    }
    $("#markerPreview").html(`<iframe src='${MINIMAPBASEURL}${markerURL}&zoomLevl=${$("#zoom").val()}&popupWidth=${$("#popupInput").val()}&popupHeight=500&design=${$("#mapDesign").val()}' height=200px width=100% scrolling='no' frameborder='0' allowfullscreen='allowfullscreen'></iframe>`);
  }

  // On document ready, start displaying marker options
  $(() => {
    init_colourSelector();
    init_iconPicker();
    init_routing();
    init_editor();
    // Display marker preview on pop up
    updatePreview();
    // Trigger marker preview update when input changes
    $("#markerForm :input").on("change", () => updatePreview());
  });

}

// New marker --> No index --> Push into array
// Existing marker --> Have index --> Replace
function saveOrUpdate(marker) {
  if(marker.no == null) {
    marker.no = currentMarkers[currentMarkers.length-1] != undefined ? currentMarkers[currentMarkers.length-1].no + 1 : 0;
    currentMarkers.push(marker);
    Waypoints.push({x:marker.lat1, y:marker.lng1})
  }
  else {
    var arrIndex = currentMarkers.findIndex(function(item, i) {
      return item.no === marker.no;
    });
    currentMarkers[arrIndex] = marker;
  }
  // **********************************************************Pong code*********************************************
  //Waypoints.push({x:marker.lat1, y:marker.lng1})
  //Test = marker.lat1 + " " + marker.lng1
  //document.getElementById('status').innerHTML += Test ;
  
  localStorageManager.updateLocalStorage();
  refreshDisplay();
}

// Refresh the map and any other frontend related components
function refreshDisplay() {
  // Refresh map preview
  $("#mapdiv").html(generateMiniMap("p"));
  localStorage.removeItem("resultWayPoint");

  // Show clear all button when >2 marker
  currentMarkers.length > 1 ? $("#removeAllMarker").show() : $("#removeAllMarker").hide();
  // Disable zoom control when >1 marker
  $("#zoom").prop("disabled", currentMarkers.length > 1).tooltip($("#zoom").is(":disabled") ? "enable" : "disable");

  // Update elements when no markers placed
  if(currentMarkers.length === 0) {
    $("#markerNo").empty();
    $("#placesList").html('<div>No markers added<br><br>Type a location in the search bar and select one from the dropdown list<br><br>Marker-to-marker routing can be enabled when there is more than 1 marker present</div>');
    //$("#removeAllMarker").hide();
    $("#embedBtn, #linkBtn").prop("disabled", true).tooltip("enable");
    document.getElementById("wayPts").value = "";
    Waypoints = [];
    return; // End here
  }
  else {
    // Clear list first
    $("#placesList").empty();
    // Display marker counter
    $("#markerNo").html(`Added Markers <span class="badge badge-secondary">${currentMarkers.length}/${MAX_MARKERS_COUNT}</span>`);
    //$("#removeAllMarker").show();
    $("#embedBtn, #linkBtn").prop("disabled", false).tooltip("disable");
    // Add marker list to page

    document.getElementById("wayPts").value = JSON.stringify(currentMarkers);

    currentMarkers.forEach((marker) => {
      var listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.innerHTML = marker.location;

      //listItem.id = marker.no; // Not needed
      //Display edit and delete button
      listItem.innerHTML +=
      "<span class='pull-right button-group' style='display:none'>" +
        "<button type='button' onclick='editLocation(" + marker.no + ")' class='editMode btn btn-primary'>" +
          "<i class='fa fa-pencil-square-o'></i>" +
        "</button>" +
        "<button type='button' onclick='deleteLocation(" + marker.no + ")' class='btn btn-danger' style='margin-left: 0.25em;'>" +
          "<i class='fa fa-trash'></i>" +
        "</button>" +
      "</span>";
      $("#placesList").append(listItem);

    });
  }
}

// Generate mini map preview/hyperlink/iframe
function generateMiniMap(option) {
  // Take user inputs
  //var height = $("#heightInput").val();
  var height = "450";
  //var width = $("#widthInput").val();
  var width = "650";
  const popupH = 500; // Fixed value, sets the maximum height of popups
  var popupW = $("#popupInput").val();
  var zoom = $("#zoom").val();
  var layerSelected = $("#mapDesign").val();

  // Checks for inputs entered
  if(height == "" || width == "" || popupH == "" || popupW == "") {
    swal({title: "ERROR", text: "Your height or width is/are empty.", toast: true});
    return;
  }
  else if(width<200 || height<200) {
    swal({title: "ERROR", text: "Your height and width has to be greater or equal to 200 x 200.", toast: true});
    return;
  }
  else if(popupW < 200) {
    swal({title: "ERROR", text: "Your global popup width size has to be greater or equal to 200", toast: true});
    return;
  }

  if(currentMarkers != undefined) {
    var location_url = "";
    currentMarkers.forEach(function(marker) {
      // Use base64 to encode user input
      location_url += `&marker=latLng:${marker.latLng}`;
      if(marker.iwt != null) {
        location_url += `!iwt:${window.btoa(marker.iwt)}`;
      }
      if(marker.icon != null) {
        location_url += `!icon:${marker.icon}`;
      }
      if(marker.colour != null) {
        location_url += `!colour:${marker.colour}`;
      }
      if(marker.rDestTarget != null) {
        var arrIndex = currentMarkers.findIndex(function(item) {
          return item.no == marker.rDestTarget;
        });
        if(arrIndex >= 0) {
          location_url += `!rType:${marker.rType}!rDest:${currentMarkers[arrIndex].latLng}`
        }
        
      }
    })
  }

  //This makes the map fit into the iframe
  var iframeH = height;//parseInt(height)-5;
  var iframeW = width;//parseInt(width)-10;
  if(option == 'p') { // preview map
    var previewFrame = `<iframe src='${MINIMAPBASEURL}${location_url}&zoomLevl=${zoom}&popupWidth=${popupW}&popupHeight=${popupH}&design=${layerSelected}' height=${height}px width=${width}px scrolling='no' frameborder='0' allowfullscreen='allowfullscreen'></iframe>`;
    return previewFrame;
  }
  else if(option == 'e') { // embed map
    var iFrame = `<iframe src='${directURL}${location_url}&zoomLevl=${zoom}&popupWidth=${popupW}&popupHeight=${popupH}&design=${layerSelected}' height=${height}px width=${width}px scrolling='no' frameborder='0' allowfullscreen='allowfullscreen'></iframe>`;
    swal({
      title: 'Embed map in HTML',
      type: 'success',
      html:
      "<p class='copyToClipboard'>" +
        "<a href='#embed' id='selectAll' onclick='callSelect();'>Click here to copy embedded Iframe</a>" +
      "</p>" +
      "<textarea style='width:100%;height:100px;'>" + iFrame + "</textarea>",
      focusConfirm: false,
    });
  }
  else if(option == 'h') {  // map hyperlink
    var htmlURL = `${directURL}mWidth=${iframeW}&mHeight=${iframeH}${location_url}&zoomLevl=${zoom}&popupWidth=${popupW}&popupHeight=${popupH}&design=${layerSelected}`;
    swal({
      title: 'Get Hyperlink',
      type: 'success',
      html:
      "<p class='copyToClipboard'>" +
        "<a href='#hyperlink' id='selectAll' onclick='callSelect();'>Click here to copy embedded Iframe</a>" +
      "</p>" +
      "<textarea style='width:100%;height:100px;'>" + htmlURL + "</textarea>",
      focusConfirm: false,
    });
  }
}

function isInt(value) {
  return Number(parseFloat(value))==value;
}

//Enable you to copy text to clipboard
function callSelect(){
  $(".copyToClipboard").closest(".swal2-content").find("textarea").select();
  document.execCommand('copy');
}

//Deletion at index
function deleteLocation(index) {
  swal({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if(result.value) {
      var arrIndex = currentMarkers.findIndex(function(item) {
        return item.no === index;
      });
      currentMarkers.splice(arrIndex, 1);
      localStorageManager.updateLocalStorage();
      //localStorage.setItem('storedMarkers', JSON.stringify(currentMarkers));
      refreshDisplay();
      swal('Deleted!', 'The marker has been deleted', 'success')
    }
  })
}

// Remove all markers
$('#removeAllMarker').on('click', function() {
  swal({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, clear it!"
  }).then((result) => {
    if(result.value) {
      swal('Cleared!', 'All Markers has been cleared!', 'success');
      // Remove the item(s) in localstorage
      localStorageManager.clearLocalStorage();
      currentMarkers = [];
      Waypoints = [];
      refreshDisplay();
    }
  })
});