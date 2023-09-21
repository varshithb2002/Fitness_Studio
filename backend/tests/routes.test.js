const request = require('supertest');
const Event = require('../src/models/Event');
let app;
describe("Integration testing on different routes of the server.",() => {
    beforeAll(async ()=>{
        app = await require('../src/server');
    }),
    afterAll( ( done ) => {
        app.close();
        delete require.cache[require.resolve( '../src/server' )]
        done()
     })
    it("return a 200 status when getting /status", async ()=>{
        const res = await request(app)
            .get('/');
        expect(res.status).toBe(200)
    })
    it("returns all the dashboard events", async()=>{
        const res = await request(app)
            .get('/dashboard');
        expect(res.body).toBeTruthy();
    })
    it("returns all the events by Sport tag", async()=>{
        const res = await request(app)
            .get('/dashboard/swimming');
        expect(res.body[0].sport).toBe('swimming')
    })
})