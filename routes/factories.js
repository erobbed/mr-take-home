const express = require('express');
const store = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    store.list((err, companies) => {
        if (err) throw err;
        let onlyFactories = companies.filter( c => c.company_type === 'factory')
        res.json(onlyFactories);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    /* Complete this function */
    store.list( (err, companies) => {
      let factory = companies.filter( c => c.name === searchQuery && c.company_type === 'factory' )[0]
      if (factory){
        res.json(factory)
      } else if ( companies.filter( c => c.name === searchQuery)[0].company_type === 'brand' )
        res.send(`Sorry but ${searchQuery} is not a factory.\n${searchQuery} is a brand.\nPlease try the brand search.`)
      else {
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
