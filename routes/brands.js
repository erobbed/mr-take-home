const express = require('express');
const brandStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const newBrand = {
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      city: req.body.city,
      state: req.body.state
    };
    brandStore.add(newBrand, err => {
        if (err) throw err;
        res.json(newBrand);
    });
});

module.exports = router;
