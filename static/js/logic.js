

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
    });

url="http://127.0.0.1:5000/api/launch_data";

var launch_markers = [];

// Grab the data with d3
d3.json(url).then(function(response) {
  console.log(response);
  var launch_data = [];

  for (var i = 0; i < response.length; i++) {
    var launch = {}
    launch.longitude = parseFloat(response[i].longitude);
    launch.lantitude = response[i].lantitude;
    launch.center = response[i].center;
    launch.countryoflaunch = response[i].countryoflaunch;
    launch.statusmission = response[i].statusmission;
    if (isNaN(launch.longitude)) {
      console.log("Bad longitude data: i=", i);
    }
    else{
      launch_data.push(launch);
    } 
  }

  console.log(launch_data);
  var groupby_center = groupBy(launch_data, "center");
  
  console.log("groupby_center=", groupby_center);

  var groupby_center_countby_status = {};
  Object.entries(groupby_center).forEach(([key, value]) => {
    var count_by_status = countBy(value, "statusmission");
    groupby_center_countby_status[key] = count_by_status;
  }); 
  console.log("groupby_center_countby_status=", groupby_center_countby_status);

  Object.entries(groupby_center).forEach(([key, value]) => {
    var center = key;
    var lat, long, country;
    if (value.length > 0) {
      lat = value[0].lantitude;
      long = value[0].longitude;
      country = value[0].countryoflaunch;
    }
    var status_info = "";
    var total_launch = 0;
    Object.entries(groupby_center_countby_status[key]).forEach(([key, value]) => {
      status_info = status_info + "<br>" + key + ": " + value;
      total_launch += value;
    });
    //status_info = status_info + "Total launch: " + total_launch;
    launch_markers.push(L.marker([lat, long]).bindPopup("<h3>" + center + "</h3><h4> Country of Launch: " + country + "</h4><h5>" + status_info + "</h5><h4>Total Launch: " + total_launch +"</h4>" ));
  });


  // console.log("launch_markers=", launch_markers);

  var baseMaps = {
    Light: light,
    Satellite: satellite
  };
  
  var marker_layer = L.layerGroup(launch_markers);
  var overlayMaps = {
    "Rocket Launches": marker_layer
  };
  
  // Creating map object
  var myMap = L.map("map", {
    center: [31.9258,34.7136],
    zoom: 2,
    layers: [satellite, marker_layer]
  });
  
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);  
});
