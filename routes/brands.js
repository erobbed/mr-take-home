const express = require('express');
const store = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    store.list((err, companies) => {
        if (err) throw err;
        let onlyBrands = companies.filter( c => c.company_type === 'brand')
        res.json(onlyBrands);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;

    store.list( (err, companies) => {
      let result = companies.filter( c => c.name === searchQuery )[0]
      if (result && result.company_type === 'brand'){
        res.json(result)
      } else if (result && result.company_type === 'factory'){
        res.send(`Sorry but ${searchQuery} is not a brand.\n${searchQuery} is a factory.\nPlease try the factory search.`)
      } else {
        res.sendStatus(404);
      }
    });
});

router.get('/:id', (req, res) => {
    store.load(req.params.id, (err, brand) => {
        if (err) throw err;
        res.json(brand);
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const newBrand = {
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      city: req.body.city,
      state: req.body.state,
      company_type: 'brand'
    };
    store.add(newBrand, err => {
        if (err) throw err;
        res.json(newBrand);
    });
});

module.exports = router;
