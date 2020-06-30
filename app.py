from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo 
import scrape_mars

app = Flask(__name__)

#use Pymongo to establish connection with MongoDB
app.config["MONGO_URI"]="mongodb://localhost:27017/Retirement_homes"
mongo = PyMongo(app)

#mongo.db.create_collection('test')

# Route to render index.html template using data from Mongo
@app.route("/")
def index():
    # Find one record of data from the mongo database
    rh = mongo.db.retirement_homes.find()
    result = [i for i in rh]
    # Return template and data
    return jsonify(result)
    #return render_template("index.html", rh_html = rh) 

# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():
    #run the scrape function 
    mars_data = scrape_mars.scrape_info()
    mars = mongo.db.mars
    mars.replace_one({},mars_data, upsert=True)

    #Update the Mongo database 
    #mongo.db.mars.update({}, mars_data, upsert = True)
    #Redirect back to home page
    #return "Scraping is done!"
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)