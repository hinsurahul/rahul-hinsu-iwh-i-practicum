require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;


app.get('/', async (req, res) => {
    const contacts = 'https://api.hubapi.com/crm/v3/objects/2-53855425?properties=area__sq__ft_,name,price,property_type,status&archived=false';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        // res.json(data)
        res.render('homepage', { title: 'Home | Real Estate', data });      
    } catch (error) {
        console.error(error);
    }
});


app.get("/update-real-estate", (req, res) => {
  try {
    res.render("updates", {
      title: "Add Record"
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading form");
  }
});


// Add Record
app.post("/update-real-estate", async (req, res) => {
  const payload = {
    properties: {
      name: req.body.name,
      price: req.body.price,
      area__sq__ft_: req.body.area,
      property_type: req.body.property_type,
      status: req.body.status
    }
  };

  try {
    
    await axios.post(
      "https://api.hubapi.com/crm/v3/objects/2-53855425",
      payload,
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.redirect("/");

  } catch (err) {
    console.error(err.response?.data || err);
    res.send("Error saving record");
  }
});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));