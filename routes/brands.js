const express = require('express');
const store = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    store.list((err, brands) => {
        if (err) throw err;
        let onlyBrands = brands.filter( brand => brand.company_type === 'brand')
        res.json(onlyBrands);
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
