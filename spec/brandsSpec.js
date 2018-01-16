const request = require('supertest');

describe('Brands', () => {
    let app;
    beforeEach(() => {
      app = require('../app.js');
    });
    afterEach(() => {
      app.close();
    });

    it('gets all brands', done => {
      request(app)
        .get('/brands')
        .expect(200)
        .end((err, res) => {
          if (err) return done.fail(err);
          expect(res.body.length).toBeGreaterThan(0);

          res.body.forEach( company => {
            expect(company).toEqual(jasmine.objectContaining({
                company_type: 'brand'
              }));
            expect(company).not.toEqual(jasmine.objectContaining({
              company_type: 'factory'
            }));
          })
          done(res);
        });
    });

    it('gets a single brand', done => {
      request(app)
        .get('/brands/44763ebb-032c-4ba7-b3b4-2e2cc1b2fff3')
        .expect(200)
        .end((err, res) => {
            if (err) return done.fail(err);
            expect(res.body).not.toBeNull();
            done(res);
        });
    });

    it('creates a new brand', done => {
      request(app)
        .post('/brands')
        .send({ name: 'Test Brand', email: 'example@example.com', city: 'Brooklyn', state: 'NY', phone_number: '212-888-8888', company_type: 'brand', id: '67890' })
        .expect(200)
        .end((err, res) => {
          if (err) return done.fail(err);
          expect(res.body.name).toEqual('Test Brand');
          expect(res.body.email).toEqual('example@example.com');
          expect(res.body.city).toEqual('Brooklyn');
          expect(res.body.state).toEqual('NY');
          expect(res.body.phone_number).toEqual('212-888-8888');
          expect(res.body.company_type).toEqual('brand');
          expect(res.body.id).toEqual('67890')

          done(res);
        });
    });

    it('finds an existing brand', done => {
      let searchQuery = "DNA Group";
      request(app)
        .get(`/brands/search?q=${searchQuery}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done.fail(err);
            expect(res.body).not.toBeNull();
            expect(res.body.name).toEqual(searchQuery)
            expect(200);
            done(res);
        });
    });

    it('redirects query when searching for a factory', done => {
      let searchQuery = "Polt Design";
      request(app)
        .get(`/brands/search?q=${searchQuery}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done.fail(err);
            expect(res.body).not.toBeNull();
            expect(res.text).toMatch(`Sorry but ${searchQuery} is not a brand.\n${searchQuery} is a factory.\nPlease try the factory search.`)
            expect(200);
            done(res);
        });
    });

    it('returns 404 when it can\'t find a brand', done => {
      request(app)
        .get('/brands/search?q=foo bar')
        .expect(404)
        .end((err, res) => {
            if (err) return done.fail(err);
            done(res);
        });
    });



    it('updates a brand', done => {
      let id = '67890'
      request(app)
        .patch(`/brands/${id}`)
        .send({path: "/city" , value: "Queens"})
        .expect(200)
        .end( (err, res) => {
          if (err) return done.fail(err);
          expect(res.body.city).toEqual('Queens');
          done(res);
        });
    });



    it('deletes a brand', done => {
      let id = '67890'
      request(app)
        .delete(`/brands/${id}`)
        .end((err, res) => {
          if (err) return done.fail(err);
          expect(200);
        });

      request(app)
        .get(`/brands/${id}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done.fail(err);
          expect(res.body).not.toBeNull();
          done(res);
        });
    });
});
