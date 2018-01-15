const express = require('express');
const store = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    store.list((err, factories) => {
        if (err) throw err;
        let onlyFactories = factories.filter( factory => factory.company_type === 'factory')
        res.json(onlyFactories);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    /* Complete this function */
    store.list( (err, factories) => {
      let factory = factories.filter( f => f.name === searchQuery )[0]
      if (factory){
        res.json(factory)
      } else {
        res.sendStatus(404);
      }
    });
});

router.get('/:id', (req, res) => {
    store.load(req.params.id, (err, factory) => {
        if (err) throw err;
        res.json(factory);
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    //added new factory fields
    const newFactory = {
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      city: req.body.city,
      state: req.body.state,
      company_type: 'factory'
    };
    store.add(newFactory, err => {
        if (err) throw err;
        res.json(newFactory);
    });
});

module.exports = router;
