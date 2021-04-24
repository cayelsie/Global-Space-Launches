

// var data;


// Papa.parse('data/Global_Space_Launches_rows_deleted.csv', {

	// delimiter: ",",

	// newline: "",	// auto-detect
	// quoteChar: '"',
	// escapeChar: '"',

	// header: true,

	// transformHeader: undefined,
	// dynamicTyping: false,
	// preview: 0,
	// encoding: "",
	// worker: false,
	// comments: false,
	// step: undefined,
	// complete: undefined,
	// error: undefined,

	// download: true,

	// downloadRequestHeaders: undefined,
	// downloadRequestBody: undefined,
	// skipEmptyLines: false,
	// chunk: undefined,
	// chunkSize: undefined,
	// fastMode: undefined,
	// beforeFirstChunk: undefined,
	// withCredentials: undefined,
	// transform: undefined,
	// delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],

    // complete: function(results) {
    //     console.log(results);
    //     data = results.data;
    //     console.log(data);



//This was for closing out the papaparse
    //   }
    // });


         //Create a function for creating the dropdown menu - call it so the user can see the menu initially
        //  function buildChart() {

        //     var year_fund = {}
        //     var funding = []

        //     //Reads json data file: "subject" encompasses the entire thing
        //     d3.json("data/global_space_launches.json").then((data) => {
        //         console.log(data);
        //         var location = data.map(row => row.private_state);
        //         console.log(location);
        //         data.map(row => {
        //             // funding.push(row.country);
        //             // funding.push(row.private_state);
        //             // console.log(funding);
                
        //         });

        //         for (var key in data) {
        //             var year = data[key].year;
        //         }

                
            

     
        
        //     });
        // };   
        // buildChart();

    //Setting up for the flask url
        var url = "data/global_space_launches.json";
    //Read the json file   
        d3.json(url).then((data) => {
            console.log(data);

               //This section will allow for filtering the data by whatever I want - use this for on change event w/dropdown
            // var filter_by = "USA";
            // var filter_data = data.filter(item => {
            //     return item.country === filter_by;
            // });

            //Setting a variable for the grouped JS object (by year), using the groupBy function from util.js
            var groupby_year = groupBy(data, "year");
            console.log(groupby_year);

            //Setting a variable for a empty JS object that will hold my years as main key with S and P as sub-keys with their counts as values
            //Use the countBy function from util.js to get the counts and then add to the empty JS object
            var count_by_PS_year = {};
            Object.entries(groupby_year).forEach(([key, value]) => {
                var count_by_PS = countBy(value, "private_state");
                count_by_PS_year[key] = count_by_PS;
            });
            console.log(count_by_PS_year);

            //Getting arrays for the graphing:

            //To get the x-axis I just need the keys from my JS object I created after my counting (which are the years)
            var x_axis = Object.keys(count_by_PS_year);
            console.log(x_axis);

            //To get the two y-axes, use the get_display_data function from util.js. 
            var y_axis_P = get_display_data(count_by_PS_year, "P");
            var y_axis_S = get_display_data(count_by_PS_year, "S");
            console.log(y_axis_P);
            console.log(y_axis_S);

            //Plotly code for the private/state line graph: need two traces for two lines
            var trace1 = {
                x: x_axis,
                y: y_axis_P,
                type: 'scatter',
                name: 'Private'
              };
              var trace2 = {
                x: x_axis,
                y: y_axis_S,
                type: 'scatter',
                name: 'State'
              };
              var data = [trace1, trace2];
              Plotly.newPlot('trendline', data);
            
        });


   

