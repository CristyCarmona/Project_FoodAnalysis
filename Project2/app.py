from flask import Flask
import json
from flask_cors import CORS
from config import key as password
import pandas as pd
from sqlalchemy import create_engine

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# Posgre connection
parameters = f'postgresql+psycopg2://postgres:{password}@localhost:5432/food_AnalysisDb'
engine = create_engine(parameters)

@app.route("/")
def home():
    ## API Description 
    return (
        f"Welcome to the food analysis API!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/category<br/>"
        f"/api/v1.0/nutrients<br/>"
        f"/api/v1.0/onChangeCategory/idCategory<br/>"
        f"/api/v1.0/onChangeFood/idCategory<br/>"
        f"/api/v1.0/onChangeNutrient/idNutrient"
    )
    
@app.route("/api/v1.0/category")
def combo_cat_route():
    ## Retrieve category data 
    postgreSQL_select_food_cat = "SELECT * FROM food_category;"
    connection = engine.connect()
    food_cat = connection.execute(postgreSQL_select_food_cat)
    connection.close()
    
    # Return json with category id and descriptions 
    return json.dumps([dict(r) for r in food_cat])


@app.route("/api/v1.0/nutrients")
def combo_nut_route():
    ## Retrieve category data 
    postgreSQL_select_nut_cat = ("SELECT intfac.id_nutrient, nut.nutrient_name" 
                                "	FROM interesting_facts intfac" +
                                "		INNER JOIN essential_nutrients nut" +
                                "		ON intfac.id_nutrient = nut.id_nutrient")
    connection = engine.connect()
    nut_cat = connection.execute(postgreSQL_select_nut_cat)
    connection.close()
    
    # Return json with category id and descriptions 
    return json.dumps([dict(r) for r in nut_cat])


@app.route("/api/v1.0/onChangeCategory/<idCategory>")
def combo_dec_route(idCategory):
    ## Retrieve food descriptions in selected category 
    postgreSQL_select_food_cat = ("SELECT DISTINCT ft.id_food, fc.food_desc " +
                                    " FROM food_tbl ft" + 
	                                "   INNER JOIN food_catalog fc" +
	                                "   ON ft.id_food = fc.id_food and ft.id_category = " + idCategory)
    connection = engine.connect()
    food_desc = connection.execute(postgreSQL_select_food_cat)
    connection.close()
    
    # Return json with descriptions 
    return json.dumps([dict(r) for r in food_desc])


@app.route("/api/v1.0/onChangeFood/<idCategory>")
def food_data_route(idCategory):
    ## Retrieve food data 
    postgreSQL_select_food = ("SELECT  " +
                                "fc.desc_category," +
                                "fcat.food_desc," +
                                "eng.group_name," +
                                "en.nutrient_name," +
                                "f.id_food," +
                                "f.nutrient_amount " +
                            "FROM food_tbl f" +
                            "   INNER JOIN essential_nutrients en" +
                            "   ON f.id_nutrient=en.id_nutrient and f.id_category = " + idCategory +
                            "      INNER JOIN food_category fc" +
                            "      ON f.id_category = fc.id_category" +
                            "           INNER JOIN essential_nutrient_group eng "+
                            "           ON en.id_essengroup  = eng.id_essengroup" +
                            "		        INNER JOIN food_catalog fcat" +
                            "		        ON f.id_food = fcat.id_food")                       
    connection = engine.connect()
    food = connection.execute(postgreSQL_select_food)
    connection.close()
    
    # Return json with all the food data in selected category   
    return json.dumps([dict(r) for r in food])
    
   
@app.route("/api/v1.0/onChangeNutrient/<idNutrient>")
def nutrient_route(idNutrient):
    ## Retrieve food data    
    postgreSQL_select_food_fact = "SELECT int_fact FROM interesting_facts WHERE id_nutrient = "+ idNutrient 
    connection = engine.connect()
    fact = connection.execute(postgreSQL_select_food_fact)
    connection.close()

    # Return json with descriptions 
    return json.dumps([dict(r) for r in fact])

if __name__ == '__main__':
    app.run(debug=True)