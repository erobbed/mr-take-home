const request = require("supertest");

describe("Factories", () => {
  let app;
  beforeEach(() => {
    app = require("../app.js");
  });
  afterEach(() => {
    app.close();
  });

  it("gets all factories", done => {
    request(app)
      .get("/factories")
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body.length).toBeGreaterThan(0);

        res.body.forEach(company => {
          expect(company).toEqual(
            jasmine.objectContaining({
              company_type: "factory"
            })
          );
          expect(company).not.toEqual(
            jasmine.objectContaining({
              company_type: "brand"
            })
          );
        });
        done(res);
      });
  });

  it("gets a single factory", done => {
    request(app)
      .get("/factories/0a75d3f4-c8ff-47bb-84c3-a874007d1b4f") // admittedly, this is an ugly id.
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        done(res);
      });
  });

  it("creates a new factory", done => {
    request(app)
      .post("/factories")
      .send({
        name: "Test Factory",
        email: "example@example.com",
        city: "New York",
        state: "NY",
        phone_number: "212-555-5555",
        company_type: "factory",
        id: "12345"
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body.name).toEqual("Test Factory");
        expect(res.body.email).toEqual("example@example.com");
        expect(res.body.city).toEqual("New York");
        expect(res.body.state).toEqual("NY");
        expect(res.body.phone_number).toEqual("212-555-5555");
        expect(res.body.company_type).toEqual("factory");
        expect(res.body.id).toEqual("12345");

        done(res);
      });
  });

  it("finds an existing factory", done => {
    let searchQuery = "The Pattern Makers";
    request(app)
      .get(`/factories/search?q=${searchQuery}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        expect(res.body.name).toEqual(searchQuery);
        expect(200);
        done(res);
      });
  });

  it("redirects query when searching for a brand", done => {
    let searchQuery = "DNA Group";
    request(app)
      .get(`/factories/search?q=${searchQuery}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        expect(res.text).toMatch(
          `Sorry but ${searchQuery} is not a factory.\n${searchQuery} is a brand.\nPlease try the brand search.`
        );
        expect(200);
        done(res);
      });
  });

  it("returns 404 when it can't find a factory", done => {
    request(app)
      .get("/factories/search?q=foo bar")
      .expect(404)
      .end((err, res) => {
        if (err) return done.fail(err);
        done(res);
      });
  });

  it("updates a factory", done => {
    let id = "12345";
    request(app)
      .patch(`/brands/${id}`)
      .send({ path: "/city", value: "Chappaqua" })
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body.city).toEqual("Chappaqua");
        done(res);
      });
  });

  it("deletes a factory and confirms it is not in the database", done => {
    let id = "12345";
    const check = i => {
      request(app)
        .get(`/factories/${i}`)
        .end((err, res) => {
          expect(res.statusCode).toEqual(404);
          done(res);
        });
    };

    request(app)
      .delete(`/factories/${id}`)
      .expect(200)
      .then(res => {
        expect(res.text).toMatch(`Deleted item ${id}`);
      })
      .then(() => {
        check(id);
      });
  });
});
