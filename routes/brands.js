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
    /* Complete this function */
    store.list( (err, companies) => {
      let factory = companies.filter( c => c.name === searchQuery && c.company_type === 'brand' )[0]
      if (factory){
        res.json(factory)
      } else {
        res.sendStatus(404);
      }
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
