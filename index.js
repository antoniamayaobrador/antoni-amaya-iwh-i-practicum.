const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

const CUSTOM_OBJECT_TYPE = '2-72678693';
const CUSTOM_PROPERTIES = 'name,investment,known_for';

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// Homepage: retrieve Theranos records and render them in a table.
app.get('/', async (req, res) => {
    const customObjects = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=${CUSTOM_PROPERTIES}&limit=100`;

    try {
        const resp = await axios.get(customObjects, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Homepage | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Unable to load custom object records.');
    }
});

// Form: render the template used to create a new Theranos record.
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Create: send the form values to HubSpot, then return to the homepage.
app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            name: req.body.name,
            investment: req.body.investment,
            known_for: req.body.known_for
        }
    };

    const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    try {
        await axios.post(createUrl, newRecord, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        res.status(500).send('Unable to create the custom object record.');
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));