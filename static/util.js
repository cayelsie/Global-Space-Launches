
//This function will allow you to group an object by a property (specific key, in our case). 
//data_array is your JS object to pass, property is the key you want to group by
function groupBy(data_array, property) {
    return data_array.reduce(function (accumulator, current_object) {
      let key = current_object[property];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(current_object);
      return accumulator;
    }, {});
} 


//This function will allow you to count up the instances of values within an object and create a new JS object with this info.
//object_array is the object to pass and, property is the key you want to use to count values within ("private_state" for S or P counts)
function countBy (object_array, property) {
    return object_array.reduce(function (accumulator, current_object) {
        let key = current_object[property];
        if (!accumulator[key]) {
          accumulator[key] = 0;
        }
        accumulator[key]++; 
    return accumulator;
  }, {});
}

//This function is very specific for the plotting needs of this dashboard, after using the countBy function.
//This allows the creation of separate arrays from the countBy JS object that was created.
//count_by_data is the JS object created in countBy, property is the value you want in your array.
//This will also put a 0 in place where the value does not exist in the JS object you pass.  
function get_display_data(count_by_data, property) {
    return Object.values(count_by_data).map(item => {
        return item[property] || 0;
    });
}
