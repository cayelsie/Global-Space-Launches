//Setting up for the flask url
var url = "data/global_space_launches.json";

//Create a function for creating the dropdown menu - call it so the user can see the menu initially
function dropdownCountry(launch_data) {

    // Set a variable to hold an empty array to collect unique country names

    countries = ["All"]


    // set dropdown menu to variable
    var dropdownMenu = d3.select("#country");
    //Reads json data file: "data" encompasses the entire thing
    

        //Loop through the data to create a new array of countries
        launch_data.map(row => {
            var country = row.country

            //If the country isn't already present, push it to the array
            if (!countries.includes(country)) {
                countries.push(country);
            }
        });
        console.log(countries);

        //Loop through the country names and add to dropdownMenu
        countries.forEach(name => {
            dropdownMenu.append("option").text(name).property("value");
        });


};

//Create a function for creating the dropdown menu - call it so the user can see the menu initially
function dropdownStatus(launch_data) {

    // Set a variable to hold an empty array to collect unique country names

    status_mission = ["All"]


    // set dropdown menu to variable
    var dropdownMenu = d3.select("#status_mission");


    //Loop through the data to create a new array of countries
    launch_data.map(row => {
        var status = row.status_mission;

        //If the country isn't already present, push it to the array
        if (!status_mission.includes(status)) {
            status_mission.push(status);
        }
    });
    console.log(status_mission);


        //****Read file and push status to the empty array
        //Reads json data file: "data" encompasses the entire thing
        // d3.json(url).then((data) => {

        //     //Loop through the data to create a new array of status
        //     data.map(row => {
        //         var status = row.status_mission;

        //         //If the status isn't already present, push it to the array
        //         if (!status_mission.includes(status)) {
        //             status_mission.push(status);
        //         }
        //     });
        //     console.log(status);

        // Loop through the status names and add to dropdownMenu
        status_mission.forEach(name => {
            dropdownMenu.append("option").text(name).property("value");
        });


};


d3.selectAll(".filter").on("change", updateFilters);
var filters = {};
function updateFilters() {

        var changedElement = d3.select(this);
        var elementValue = changedElement.property("value");
        var filterId = changedElement.attr("id");
        if (elementValue === "All") {
            delete filters[filterId];
        }
        else {
            filters[filterId] = elementValue;
        }

        filterData();

}
function filterData() {
    d3.json(url).then((launch_data) => {
        var filteredData = launch_data;
        console.log("filterData filters=", filters);
        Object.entries(filters).forEach(([key, value]) => {
            filteredData = filteredData.filter(row => row[key] === value);
        });
        buildChartWithFilteredData(filteredData);
    });
}
function buildChartWithFilteredData(filteredData) {
    console.log("buildChartWithFilteredData filteredData=", filteredData);

    var groupby_year = groupBy(filteredData, "year");
    console.log("buildChartWithFilteredData groupby_year=", groupby_year);



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
            name: 'Privately Funded'
        };
        var trace2 = {
            x: x_axis,
            y: y_axis_S,
            type: 'scatter',
            name: 'State Funded'
        };


        var layout = {
            xaxis: { range: [1957, 2020] },
            yaxis: {
                range: [0, 110],
                title: "Total Launches"
            },
            title: "Global Space Launches from 1959 - August 2020"
        };

        var data = [trace1, trace2];
        Plotly.newPlot('trendline', data, layout);

};
function initPage() {
    d3.json(url).then((launch_data) => {
        dropdownCountry(launch_data);  
        dropdownStatus(launch_data);
        console.log("initPage filters=", filters);
        var filteredData = launch_data;
        Object.entries(filters).forEach(([key, value]) => {
            filteredData = filteredData.filter(row => row[key] === value);
        });
        buildChartWithFilteredData(filteredData);
    });
}

initPage();
// buildChart(countries[0]);
// buildEarlyDecades();


//Function for on change/user selection of country
// function optionChanged(new_country) {

//     buildChart(new_country);
// };

//Function for on change/user selection of country
// function nextoptionChanged(new_status) {

//     statusChange(new_status);
// };



//Everything to build the state/private chart is encompassed here - if I use filter_data it's controlled by dropdown; use data and it's all data
function buildChart(new_country) {

    //Read the json file   
    d3.json(url).then((data) => {
        console.log(data);

        // Filter main dataset for the selection from the country dropdown
        var filter_country = data.filter(item => {
            return item.country === new_country;
        });
        console.log(filter_country);

        // Setting a variable for the grouped JS object (by year), using the groupBy function from util.js, with a conditional to use ALL data if all is selected
        if (new_country === "All") {
            var groupby_year = groupBy(data, "year");
        }

        else {
            var groupby_year = groupBy(filter_country, "year");
        }
        console.log(groupby_year);




        //Setting variable for grouped JS object with conditionals for status dropdown
        //     if (new_status === "All") {
        //     var groupby_year = groupBy(data, "year");
        // }

        // else {
        //     var groupby_year = groupBy(filter_status, "year");
        // }
        // console.log(groupby_year);


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
            name: 'Privately Funded'
        };
        var trace2 = {
            x: x_axis,
            y: y_axis_S,
            type: 'scatter',
            name: 'State Funded'
        };


        var layout = {
            xaxis: { range: [1957, 2020] },
            yaxis: {
                range: [0, 110],
                title: "Total Launches"
            },
            title: "Global Space Launches from 1959 - August 2020"
        };

        var data = [trace1, trace2];
        Plotly.newPlot('trendline', data, layout);

    });
};


function buildEarlyDecades() {
    //Read the json file   
    d3.json(url).then((data) => {

        // Filter main dataset for the decades, only successful launches
        var filter_decade = data.filter(item => {
            return item.year <= 1980;
        });

        var status_filter = filter_decade.filter(item => {
            return item.status_mission === "Success";
        });

//This allowed me to console log the total  number of successful missions so I could have the number
        var groupby_status = groupBy(status_filter, "status_mission");
        console.log(groupby_status);

//Filter for USA and Russia only
        var filter_country = status_filter.filter(item => {
            return item.company_country === "USA" || item.company_country === "Russia";
        });
        console.log (filter_country);

//Group by the countries and then logging gives the count of each in the array
        var groupby_companyCountry = groupBy(status_filter, "company_country");
        console.log(groupby_companyCountry);

//Hard coding the numbers total successful minus USA and Russia
        var others = (1615 - (1165 + 399));

//Hard coding x and y axes for bar graph
        var x = ["Russia", "USA", "Others"];
        var y = ["1165", "399", others];
      

           //Plotly code for the bar graph Russia and US
           var trace = [
               {
            x: x,
            y: y,
            type: 'bar'
        }
    ];

        var layout = {
            xaxis: { title: "Funding Country" },
            yaxis: {title: "Total Successful Launches"},
            title: "Successful Global Space Launches, 1960-1980"
        };

        Plotly.newPlot('early', trace, layout);


    });

}


