import pandas as pd
import numpy as np
from sqlalchemy import create_engine, inspect
import sqlalchemy as db
 # Import Dependencies
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import func
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

launch_data_df = pd.read_csv('Global Space Launches -seperate columns final2.csv',encoding="ISO-8859-1")
launch_data_df.head()

url = 'postgresql://postgres:postgres@localhost:5432/gt_project2'

engine = db.create_engine(url)
launch_data_df.to_sql(name='launch_data', con=engine, if_exists='replace', index=False)

connection = engine.connect()
metadata = db.MetaData()
launch_data = db.Table('launch_data', metadata, autoload=True, autoload_with=engine)


##########
# HOME PAGE 
##########
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/index.html")
def home():
    """Return the homepage."""
    return render_template("index.html")


##########
# API DATA
##########

# launch Data
@app.route("/api/launch_data")
def launchdata():
    session = Session(bind = engine)

    # sel = [
    #     launch_data.companyname,
    #     launch_data.location,
    #     launch_data.center,
    #     launch_data.lantitude,
    #     launch_data.longitude,
    #     launch_data.state,
    #     launch_data.countryoflaunch,
    #     launch_data.rocket,
    #     launch_data.flightnumber,
    #     launch_data.statusrocket,
    #     launch_data.rocketcost,
    #     launch_data.statusmission,
    #     launch_data.companyscountryoforigin,
    #     launch_data.privateorstaterun,
    #     launch_data.launchtimestamp,
    #     launch_data.launchyear,
    #     launch_data.launchmonth,
    #     launch_data.launchday,
    #     launch_data.launchdate,
    #     launch_data.launchtime,

    # ]

    results = session.query(launch_data).all()
    print(results)
    # Create a dictionary entry for each row of data information
    inspector = inspect(engine)
    columns = inspector.get_columns('launch_data')
    column_names = [column['name'] for column in columns]

    final_results = []
    for result in results:
        my_dict = {}
        for index, value in enumerate(result):
            my_dict[column_names[index]] = value
        final_results.append(my_dict)
    print(final_results)
    session.close()
    # print(space_launch_data)
    return jsonify(final_results)

##########
# VISUALIZATIONS
##########
@app.route("/graphs.html")
def build_year_Chart():
    """Return the graphs page."""
    return render_template("graphs.html")	
	
@app.route("/maps.html")
def build_maps():
    """Return the US_OP page."""
    return render_template("maps.html")	
	
@app.route("/aboutus.html")
def aboutus():
    """Return the states_map page."""
    return render_template("aboutus.html")

@app.route("/data.html")
def rawData():
    """Return the states_map page."""
    return render_template("data.html")		

if __name__ == "__main__":
    app.run(debug=True)
