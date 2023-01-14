// Requiring all the npm packages we installed
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// creating a app using express module
const app = express();

// to use local css and img resources

app.use(express.static("public"));

// body parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // console.log({firstName,lastName,email});
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_feilds: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/6e0a1b3f74";

  const options = {
    method: "POST",
    auth: "vimaljoshi:c986950ff20fd86b91197ff3423ae0d2-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});


app.post("/failure.html", function (req,res) {
  res.redirect("/");
})



// setting up the server
app.listen(process.env.PORT || 3000, function () {      // process.env.port -> for dynamic port allocation by HEROKU
  console.log("Server running at port 3000");
});

// API key
// c986950ff20fd86b91197ff3423ae0d2-us21

// List ID
// 6e0a1b3f74
