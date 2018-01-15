const request = require('supertest');

describe('Factories', () => {
    let app;
    beforeEach(() => {
        app = require('../app.js');
    });
    afterEach(() => {
        app.close();
    });

    it('gets all factories', done => {
        request(app)
            .get('/factories')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.length).toBeGreaterThan(0);
                done(res);
            });
    });

    it('gets a single factory', done => {
        request(app)
            .get('/factories/0a75d3f4-c8ff-47bb-84c3-a874007d1b4f') // admittedly, this is an ugly id.
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('creates a new factory', done => {
        request(app)
            .post('/factories')
            .send({ name: 'Test Factory', email: 'example@example.com', city: 'New York', state: 'NY', phone_number: '212-555-5555' })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.name).toEqual('Test Factory');
                expect(res.body.email).toEqual('example@example.com');
                expect(res.body.city).toEqual('New York');
                expect(res.body.state).toEqual('NY');
                expect(res.body.phone_number).toEqual('212-555-5555');

                done(res);
            });
    });

    it('finds an existing factory', done => {
        request(app)
            .get('/factories/search?q=The Pattern Makers')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('returns 404 when it can\'t find a factory', done => {
        request(app)
            .get('/factories/search?q=foo bar')
            .expect(404)
            .end((err, res) => {
                if (err) return done.fail(err);
                done(res);
            });
    });
});
