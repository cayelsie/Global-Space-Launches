//Setting up for the flask url
// var url = "data/global_space_launches.json";
var url =  "http://127.0.0.1:5000/api/launch_data";

//Set variable for the filter button
var filterButton = d3.select("#filter-btn");
var filterButton2 = d3.select("#filter-btn2");

//Create a function for creating the dropdown menu - passing data pulled from JSON file
function dropdownCountry(launch_data) {

    // Set a variable to hold an empty array to collect unique country names
    countries = ["All"]

    // set dropdown menu to variable
    var dropdownMenu = d3.select("#country");

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

//Create a function for creating the dropdown menu - passing data pulled from JSON file
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

    // Loop through the status names and add to dropdownMenu
    status_mission.forEach(name => {
        dropdownMenu.append("option").text(name).property("value");
    });
};

//On change event handler for the dropdowns
d3.selectAll(".filter").on("change", updateFilters);

//Set a variable for empty javascrpt object that will collect the user inputs from the dropdown
var filters = {};

//Function to update the selections that will be used for the filter, based on user selection
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

//Function to filter the data based on user selection
function filterData() {
    d3.json(url).then((launch_data) => {
        var filteredData = launch_data;
        console.log("filterData filters=", filters);
        Object.entries(filters).forEach(([key, value]) => {
            filteredData = filteredData.filter(row => row[key] === value);
        });
        buildMainChart(filteredData);
    });
}


function buildMainChart(filteredData) {
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
        title: "Global Space Launches from 1957 - August 2020"
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
        buildMainChart(filteredData);
    });
}

initPage();

//Create an event handler for the filter date button
filterButton.on("click", buildEarlyDecades);
filterButton2.on("click", buildLateDecades);


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

        //Group by the successful missions only and get the total number of successful missions after the filtering
        var groupby_status = groupBy(status_filter, "status_mission");
        console.log(groupby_status);

        //Get the total number of successful mission and save in a variable for later equation
        var size = {}
        Object.entries(groupby_status).forEach(([key, value]) => {
            var total_array = value.length;
            size[key] = total_array;
        });
        var total = (Object.values(size));

        //Filter for USA and Russia only and then set the length of the array to a variable
        var filter_country = status_filter.filter(item => {
            return item.company_country === "Russia" || item.company_country === "USA";
        });
        console.log(filter_country);
        var USA_Russia_total = filter_country.length;

        //Group by the countries and then logging gives the count of each in the array
        var groupby_companyCountry = groupBy(filter_country, "company_country");
        console.log(groupby_companyCountry);

        //Get the total number of USA/Russia successful mission and save in a variable for later equation
        var USA_Russia = {}
        Object.entries(groupby_companyCountry).forEach(([key, value]) => {
            var total_USA_Russia = value.length;
            USA_Russia[key] = total_USA_Russia;
        });

        //Calculate the number of other launches besides USA and Russia within 1960s to 1980s
        var others = (total - USA_Russia_total);
        var USA_Russia_Others = USA_Russia;
        USA_Russia_Others["Others"] = others;


        var USA_Russia_Others_sorted = Object.entries(USA_Russia_Others).sort(function (a, b) { return USA_Russia_Others[b] - USA_Russia_Others[a] });
        var USA_Russia_filtered = USA_Russia_Others_sorted.map(item => item[1]);
        var USA_Russia_label = USA_Russia_Others_sorted.map(item => item[0]);
        console.log(USA_Russia_Others_sorted);

        //Define X and Y for bar graph
        var x = USA_Russia_label;
        var y = USA_Russia_filtered;


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
            yaxis: { title: "Total Successful Launches" },
            title: "Successful Global Space Launches, 1960-1980"
        };

        Plotly.newPlot('early', trace, layout);


    });
}

function buildLateDecades() {
    //Read the json file   
    d3.json(url).then((data) => {

        // Filter main dataset for the last decade, only successful launches
        var filter_decade = data.filter(item => {
            return item.year >= 2010;
        });

        var status_filter = filter_decade.filter(item => {
            return item.status_mission === "Success";
        });

        //Group by the successful missions only and get the total number of successful missions after the filtering
        var groupby_status = groupBy(status_filter, "status_mission");
        console.log(groupby_status);

        //Get the total number of successful missions and save in a variable for later equation
        var size = {}
        Object.entries(groupby_status).forEach(([key, value]) => {
            var total_array = value.length;
            size[key] = total_array;
        });
        var total = (Object.values(size));

        //Filter for USA and Russia only and then set the length of the array to a variable
        var filter_country = status_filter.filter(item => {
            return item.company_country === "Russia" || item.company_country === "USA" || item.company_country === "China";
        });
        console.log(filter_country);
        var countries_total = filter_country.length;

        //Group by the countries and then logging gives the count of each in the array
        var groupby_companyCountry = groupBy(filter_country, "company_country");
        console.log(groupby_companyCountry);

        //Get the total number of USA/Russia successful mission and save in a variable for later equation
        var USA_Russia_China = {}
        Object.entries(groupby_companyCountry).forEach(([key, value]) => {
            var total_USA_Russia = value.length;
            USA_Russia_China[key] = total_USA_Russia;
        });

        //Calculate the number of other launches besides USA and Russia within 1960s to 1980s
        var others = (total - countries_total);
        var USA_Russia_Others = USA_Russia_China;
        USA_Russia_Others["Others"] = others;


        var USA_Russia_Others_sorted = Object.entries(USA_Russia_Others).sort(function (a, b) { return USA_Russia_Others[b] - USA_Russia_Others[a] });
        var USA_Russia_filtered = USA_Russia_Others_sorted.map(item => item[1]);
        var USA_Russia_label = USA_Russia_Others_sorted.map(item => item[0]);
        console.log(USA_Russia_Others_sorted);

        //Define X and Y for bar graph
        var x = USA_Russia_label;
        var y = USA_Russia_filtered;


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
            yaxis: { title: "Total Successful Launches" },
            title: "Successful Global Space Launches, 2010 - August 2020"
        };

        Plotly.newPlot('late', trace, layout);

    });
}




