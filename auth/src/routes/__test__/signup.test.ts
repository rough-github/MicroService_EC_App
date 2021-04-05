import request from "supertest";
import app from "../../app";

it("returns a 201 on successfull signup", async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)
});
it("returns a 400 with an invald email", async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "9999999999",
      password: "password"
    })
    .expect(400)
});
it("returns a 400 with an invald password", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "999"
    })
    .expect(400)
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "1234567891011121314151617181920"
    })
    .expect(400)
});
it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com"
    })
    .expect(400)
  await request(app)
    .post('/api/users/signup')
    .send({
      password: "55555"
    })
    .expect(400)
});
it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(400)
})
it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
})