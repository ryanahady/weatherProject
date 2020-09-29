//jshint esversion:6
const express = require('express');
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

//catch root and post necessary text to index.html
app.post("/", function(req, res){

  const query = req.body.cityName;
  const apiKey = "519d08c4e60918faffaf67a1138a7bc6";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  //const url = "https://api.openweathermap.org/data/2.5/weather?q=Australia&appid=519d08c4e60918faffaf67a1138a7bc6";

    //use a get request to get back a response
    https.get(url, function(response) {
      console.log(response.statusCode);  //print back the status code with response

    response.on("data", function(data) {
      const weatherData = JSON.parse(data); //get a javascript object
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const windSpeed = weatherData.wind.speed;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<h1>The temperature in <span style='text-transform: capitalize;'>" + query + "</span> is " + temp + " Degrees Celcius</h1>");
      res.write("<h1>The weather is currently " + weatherDescription + "</h1>");
      res.write("<p>The wind speed today is " + windSpeed + "</p>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});


app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
