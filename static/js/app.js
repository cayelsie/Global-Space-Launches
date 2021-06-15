function buildCharts(new_country){
//Setting up for the flask url
var url = "http://127.0.0.1:5000/api/launch_data";
//Read the json file   
    d3.json(url).then((data) => {

        var filter_data = data.filter(item=>{
            return item.companyscountryoforigin == new_country;
        })


        //Setting a variable for the grouped JS object (by year), using the groupBy function from util.js
        var groupby_year = groupBy(filter_data, "launchyear");


        //Use the countBy function from util.js to get the counts and then add to the empty JS object
        var count_by_PS_year = {};
        Object.entries(groupby_year).forEach(([key, value]) => {
            var count_by_PS = countBy(value, "statusmission");
            count_by_PS_year[key] = count_by_PS;
        });

        //Getting arrays for the graphing:
   
        var x_axis = Object.keys(count_by_PS_year);

        //To get the two y-axes, use the get_display_data function from util.js. 
        var y_axis_P = get_display_data(count_by_PS_year, "Success");
        var y_axis_S = get_display_data(count_by_PS_year, "Failure");

        //Plotly code for the private/state line graph: need two traces for two lines
        var trace1 = {
            x: x_axis,
            y: y_axis_P,
            type: 'bar',
            name: 'Sucess'
          };
          var trace2 = {
            x: x_axis,
            y: y_axis_S,
            type: 'bar',
            name: 'Failure'
          };
          var data = [trace1, trace2];
          var layout = {
            barmode: 'stack',
            title : "Global Space Launches from 1957- August 2020",
            xaxis: { title: "Company name" },
            yaxis: {
                range: [0, 110],
                title: "Total Launches"
            }
          };

          Plotly.newPlot('country', data,layout);

        var groupby_year = groupBy(filter_data, "companyname");


        var launch_size = {};
        Object.entries(groupby_year).forEach(([key, value]) => {
            var count_by_PS = value.length;
            launch_size [key] = count_by_PS;
    
        });

        
        //Getting arrays for the graphing:
        var x_axis = Object.keys(launch_size);
   
        var y_axis = Object.values(launch_size);


        var trace3 = {
            x: x_axis,
            y: y_axis,
            type :'bar'
          };

        var layout2 ={
            title: "Global Space Launch Companies from 1957 - August 2020",
            xaxis: { title: "Company name" },
            margin: { t: 30},
            yaxis: {
                range: [0, 200],
                title: "Total Launches"
            }
          };

          var data2 = [trace3];

          Plotly.newPlot("company", data2,layout2);
    });

};
function init() {
    // Assign the value of the dropdown menu option to a variable
    var dropdown = d3.select("#CountryofLaunch");

    var url = "http://127.0.0.1:5000/api/launch_data";

    countries = [];
    // Populate the drop down value using the names from data.json
    d3.json(url).then((data) => {

        data.map(row => {
            var country = row.companyscountryoforigin


            if (country !== "Arme de l'Air" && !countries.includes(country)) {
              countries.push(country);
          }
            
        });


        //append each of the options to the drop down
      countries.forEach((sample) => {
        dropdown.append("option").text(sample).property("value", sample);
      });

      
      // Use the first sample from the list to build the initial plots
      var firstSample = countries[0];
      buildCharts(firstSample);

    });
};
function optionChanged(newSampleData) {
    // Fetch new data each time a new id is selected
    buildCharts(newSampleData);
};

// Initialize the dashboard
init();