
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
        console.log(d.desc_category)
        return d.desc_category;
    }) // insert the description for each category 
    .attr('value',function(d) { 
      return d.id_category;
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
  });
}

// Onclick selected food description 

function onClickSubmit () {
  var sel_category = document.getElementById('inlineFormCustomSelect');
  var sel_food = document.getElementById('inlineFormCustomSelect2');
  console.log(sel_category.options[sel.selectedIndex].value)
  console.log(sel_food.options[sel.selectedIndex].value)

  event.preventDefault();
}