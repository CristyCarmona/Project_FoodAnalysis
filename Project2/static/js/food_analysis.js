var initializeDesc = false;

// Initialize category dropdown
d3.request("http://127.0.0.1:5000/api/v1.0/category")
  .header("X-Requested-With", "XMLHttpRequest")
  .get(function(data){
    var category_obj = JSON.parse(data.response)
    
    
  d3.select("#inlineFormCustomSelect").selectAll(null)
    .data(category_obj)
    .enter() // creates placeholder for new data
    .append("option") // appends an "option" placeholder
    .text(function(d) { 
        return d.desc_category;
    }) // insert the description for each category 
    .attr('value',function(d) { 
      return d.id_category;
    }); // insert the value for each category 

    // initialize category selection
    document.getElementById("inlineFormCustomSelect").value = "3";
    onChangeCategory("3");
    initializeDesc = true;
  });

  
// Initialized nutrients dropdown for interesting facts 

d3.request("http://127.0.0.1:5000/api/v1.0/nutrients")
  .header("X-Requested-With", "XMLHttpRequest")
  .get(function(data){
    var nutrients_obj = JSON.parse(data.response)
  
  d3.select("#inlineFormCustomSelect3").selectAll(null)
    .data(nutrients_obj)
    .enter() // creates placeholder for new data
    .append("option") // appends an "option" placeholder
    .text(function(d) { 
        return d.nutrient_name;
    }) // insert the description for each category 
    .attr('value',function(d) { 
      return d.id_nutrient;
    }); // insert the value for each category 
  
  });


// OnChange category
function onChangeCategory (selected_value) {
  
  url = "http://127.0.0.1:5000/api/v1.0/onChangeCategory/" + selected_value
  
  d3.request(url)
  .header("X-Requested-With", "XMLHttpRequest")
  .get(function(data){

    var food_desc_obj = JSON.parse(data.response)
     

  d3.selectAll(".food_desc_opt").remove()
    
  d3.select("#inlineFormCustomSelect2").selectAll(null)
    .data(food_desc_obj)
    .enter() // creates placeholder for new data
    .append("option") // appends an "option" placeholder
    .attr("class","food_desc_opt")
    .text(function(d) { 
        return d.food_desc;
    }) // insert the description for each category 
    .attr('value',function(d) { 
      return d.id_food;
    }); // insert the value for each category 

    if(initializeDesc) {
      document.getElementById("inlineFormCustomSelect2").value = "154";
      onClickSubmit();
      initializeDesc = false;
    }

  });
}

// Onclick selected food description 

function onClickSubmit () {
  
  event.preventDefault(); 

  // Get the combo selected values
  selectedIdCategory = d3.select("#inlineFormCustomSelect").property("value");
  selectedIdFood = d3.select("#inlineFormCustomSelect2").property("value");
  console.log("Categoria: " + selectedIdCategory + "     Selected Food: " + selectedIdFood)

  if (selectedIdFood== "Choose description" || selectedIdCategory== "Choose category" ) {
    alert("Select category and food description")
    return;
  }  

  url = "http://127.0.0.1:5000/api/v1.0/onChangeFood/" + selectedIdCategory
  
  // Call the API to get the plot's DATA 
  d3.request(url)
  .header("X-Requested-With", "XMLHttpRequest")
  .get(function(data){
    var food_data_obj = JSON.parse(data.response)
  
  // -----------------------------Kilocalories Bar Graph------------------------------------------ 
  
  
  // Use filter() to pass the function as its argument
  var filteredfood = food_data_obj.filter(function(food) {
  return (food.nutrient_amount < 100) & ((food.nutrient_name) === "Kilocalories")});
  
  
  console.log(d3.select("#inlineFormCustomSelect2 option:checked").text());

  d3.select("#less100k_header").text("Category " + d3.select("#inlineFormCustomSelect option:checked").text());
  d3.select("#less100k_header_text").text("These are the results for the food with less than 100 kilocalories in the " + d3.select("#inlineFormCustomSelect option:checked").text() + " category..");
  
  // Use the map method with the arrow function to return Xvalues and Yvalues
  var lowcaloriefood = filteredfood.map(food => food.food_desc);
  var calories = filteredfood.map(food => food.nutrient_amount);

  // Color array
  
  function random_bg_color() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    return "rgb(" + x + "," + y + "," + z + ")";
  }
  var colorscheme = []
  for (var x=0; x<calories.length; x++){
    colorscheme.push(random_bg_color());
  }
  

  // Create the trace.
  var trace = {
  x: calories,
  y: lowcaloriefood,
  type: "bar",
  orientation: "h",
  marker: {
    color: colorscheme
  }
  };

  // Create the data array for the plot
  var data = [trace];

  // Define the plot layout
  var layout = {
  title: "Low Calorie Foods",
  xaxis: { title: "Calories" },
  yaxis: { automargin: true
    , title: "Food"
    , tickfont: {size:7}}
  };

  // Plot the chart to a div tag with id "bar-plot"
  Plotly.newPlot("bar-plot", data, layout);
  
  // -----------------------------Kilocalories Histogram Graph------------------------------------------
  
  d3.select("#histoHeader").text("Category " + d3.select("#inlineFormCustomSelect option:checked").text());
  d3.select("#histoHeader_text").text("This is the kilocalories distribution for the " + d3.select("#inlineFormCustomSelect option:checked").text() + " category..");

  var foodCalories = food_data_obj.filter(function(food) {
    return ((food.nutrient_name) === "Kilocalories")});
  
  // Get the calories values 
  var x_values = foodCalories.map(food => food.nutrient_amount);

  // Create the trace
  var trace = {
    x: x_values,
    type: 'histogram',
  };

  // Create the data array for the plot
  var data = [trace];

  // Define the plot layout
  var layout = {
    title: "Kilocalories Histogram",
    xaxis: { title: "Kilocalories" },
    yaxis: { automargin: true
      , title: "Frequency"}
    };

  // Plot the chart to a div tag with id "histogram_plot"
  Plotly.newPlot('histogram_plot', data);

  // ----------------------------- Radar Charts------------------------------------------
  // Set the title for the radar charts 
  d3.select("#radarHeader").text("Food: " + d3.select("#inlineFormCustomSelect2 option:checked").text());
  
  // -----------------------------Fat Radar Plot------------------------------------------
  
  // Filter by Fat
  var fatData = food_data_obj.filter(function(food) {
    return (food.id_food == parseInt(selectedIdFood)) && ((food.group_name) == "Fat")});
  
  // Get r and tehta values
  var r_fatValues = fatData.map(food => food.nutrient_amount);
  var theta_fatValues = fatData.map(food => food.nutrient_name);
  var max_fatValue = Math.max(...r_fatValues);
  
  // Define data information for the plot 
  data = [{
    type: 'scatterpolar',
    r: r_fatValues,
    theta: theta_fatValues,
    fill: 'toself'
  }]
  
  // Define the chart layout 
  layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, max_fatValue]
      }
    },
    showlegend: false
  }
  
  // Plot the chart to a div tag with id "fat_radar"
  Plotly.newPlot("fat_radar", data, layout)

  // -----------------------------Major Minerals Radar Plot------------------------------------------
  
  var mineralsData = food_data_obj.filter(function(food) {
    return (food.id_food == parseInt(selectedIdFood)) && ((food.group_name) == "Major Minerals")});
  
  // Get r and tehta values
  var r_fatValues = mineralsData.map(food => food.nutrient_amount);
  var theta_fatValues = mineralsData.map(food => food.nutrient_name);
  var max_fatValue = Math.max(...r_fatValues);
  
  // Define data information for the plot 
  data = [{
    type: 'scatterpolar',
    r: r_fatValues,
    theta: theta_fatValues,
    fill: 'toself'
  }]
  
  // Define the chart layout 
  layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, max_fatValue]
      }
    },
    showlegend: false
  }
  
  // Plot the chart to a div tag with id "minerals_radar"
  Plotly.newPlot("minerals_radar", data, layout)

  // -----------------------------Vitamins Radar Plot------------------------------------------

  var vitaminsData = food_data_obj.filter(function(food) {
    return (food.id_food == parseInt(selectedIdFood)) && ((food.group_name) == "Vitamins")});
  
  
  sel_food_desc = vitaminsData.map(food => food.food_desc);
  
  // Get r and tehta values
  var r_fatValues = vitaminsData.map(food => food.nutrient_amount);
  var theta_fatValues = vitaminsData.map(food => food.nutrient_name);
  var max_fatValue = Math.max(...r_fatValues);
  
  // Define data information for the plot 
  data = [{
    type: 'scatterpolar',
    r: r_fatValues,
    theta: theta_fatValues,
    fill: 'toself'
  }]
  
  // Define the chart layout 
  layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, max_fatValue]
      }
    },
    showlegend: false
  }
  
  // Plot the chart to a div tag with id "vitamins_radar"
  Plotly.newPlot("vitamins_radar", data, layout)

  // -----------------------------Nutrition Facts-----------------------------------------

  d3.select("#nut_fact_header").text("Nutrition Facts of: " + d3.select("#inlineFormCustomSelect2 option:checked").text());

  var nutFactsData = food_data_obj.filter(function(food) {
    return (food.id_food == parseInt(selectedIdFood)) && ((food.group_name) == "Others")});
  
  d3.selectAll("#food_table tr").remove()
  
  d3.select("tbody")
  .selectAll(null)
  .data(nutFactsData)
  .enter()
  .append("tr")
  .html(function(d) {
    var unit = d.nutrient_name == "Cholesterol"? "(mg)" : "(gr)";
    return `<td >${d.nutrient_name} ${unit}</td><td class="align-left">${d.nutrient_amount}</td>`;
  });
  

  });
  

}

function onClickFact() {
  event.preventDefault();

  selectedIdNutrient = d3.select("#inlineFormCustomSelect3").property("value");

  url = "http://127.0.0.1:5000/api/v1.0/onChangeNutrient/" + selectedIdNutrient
  
  d3.request(url)
  .header("X-Requested-With", "XMLHttpRequest")
  .get(function(data){
    var fact_data_obj = JSON.parse(data.response)

  d3.select("#nut_fact")
    .data(fact_data_obj)
    .text((function(d) { 
            return d.int_fact;
          }));
  });
}
