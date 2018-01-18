const request = require("supertest");

describe("loading express", () => {
  let app;
  beforeEach(() => {
    app = require("../app.js");
  });
  afterEach(() => {
    app.close();
  });

  it("responds to /", done => {
    request(app)
      .get("/")
      .expect(200, done);
  });

  it("404 everything else", done => {
    request(app)
      .get("/foo/bar")
      .expect(404)
      .end((err, res) => {
        if (err) return done.fail(err);
        done(res);
      });
  });
});
