const express = require("express");
const store = require("json-fs-store")("store/companies");
const router = express.Router();
const jsonpatch = require("jsonpatch");

router.get("/", (req, res) => {
  store.list((err, companies) => {
    if (err) throw err;
    let onlyBrands = companies.filter(c => c.company_type === "brand");
    res.json(onlyBrands);
  });
});

router.get("/search", (req, res) => {
  const searchQuery = req.query.q;
  store.list((err, companies) => {
    let result = companies.filter(c => c.name === searchQuery)[0];
    if (result && result.company_type === "brand") {
      res.json(result);
    } else if (result && result.company_type === "factory") {
      res.send(
        `Sorry but ${searchQuery} is not a brand.\n${searchQuery} is a factory.\nPlease try the factory search.`
      );
    } else {
      res.sendStatus(404);
    }
  });
});

router.get("/:id", (req, res) => {
  store.load(req.params.id, (err, brand) => {
    if (err) throw err;
    res.json(brand);
  });
});

router.post("/", (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const newBrand = {
    name: req.body.name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    city: req.body.city,
    state: req.body.state,
    company_type: "brand"
  };

  if (req.body.id) {
    newBrand.id = req.body.id;
  }

  store.add(newBrand, err => {
    if (err) throw err;
    res.json(newBrand);
  });
});

router.delete("/:id", (req, res) => {
  const company = req.params.id;
  store.remove(company, err => {
    if (err) throw err;
    res.send(`Deleted item ${company}`);
  });
});

router.patch("/:id", (req, res) => {
  const company = req.params.id;
  let path = req.params.path;
  let value = req.params.value;

  patch = [
    { op: "replace", path: req.body.path, value: req.body.value },
    { op: "add", path: "/id", value: company }
  ];

  store.load(company, (err, brand) => {
    if (err) throw err;
    let newBrand = jsonpatch.apply_patch(brand, patch);
    store.remove(company, err => {
      if (err) throw err;
      store.add(newBrand, err => {
        if (err) throw err;
        res.json(newBrand);
      });
    });
  });
});

module.exports = router;
