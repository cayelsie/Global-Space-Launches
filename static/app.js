



//Setting up for the flask url
var url = "data/global_space_launches.json";

//Create a function for creating the dropdown menu - call it so the user can see the menu initially
function dropdown() {

    //Set a variable to hold an empty array to collect unique country names

    countries = []
    // set dropdown menu to variable
    var dropdownMenu = d3.select("#selDataset");
    //Reads json data file: "data" encompasses the entire thing
    d3.json(url).then((data) => {

        //Loop through the data to create a new array of countries
        data.map(row => {
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

    });
};
dropdown();

//Function for on change/user selection
function optionChanged(new_country) {

    buildChart(new_country);
};

//Everything to build the state/private chart is encompassed here - if I use filter_data it's controlled by dropdown; use data and it's all data
function buildChart(new_country) {

//Read the json file   
d3.json(url).then((data) => {
    console.log(data);

        var filter_data = data.filter(item => {
            return item.country === new_country;
        });
        console.log(filter_data);

    //Setting a variable for the grouped JS object (by year), using the groupBy function from util.js
    var groupby_year = groupBy(filter_data, "year");
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
}




