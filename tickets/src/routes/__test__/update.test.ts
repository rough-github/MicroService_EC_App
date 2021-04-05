import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signup())
    .send({
      title: "asdfg",
      price: 20
    })
    .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdfg",
      price: 20
    })
    .expect(401)
})

it('returns a 401 if the user does not own the tickets', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: "asdfg",
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({
      title: "sbmsbnmwonmw",
      price: 1000
    })
    expect(401);
})

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: "asdfg",
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: "",
      price: 10
    })
    .expect(400)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: "vpibnap",
      price: -10
    })
    .expect(400)
})

it('update the tickets provided valid inputs', async () => {
  const cookie = global.signup();
  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: "asdfg",
      price: 20
    })

  const updatedTicket = await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: "new title",
      price: 50
    })
    .expect(200)
  
  const responseTicket = await request(app)
    .get(`/api/tickets/${updatedTicket.body.id}`)
    .send();

  expect(responseTicket.body.title).toEqual("new title");
  expect(responseTicket.body.price).toEqual(50);
})

it('publishes an event', async () => {
  const title = "vsbonsb";
  const cookie = global.signup();

  const newTicket = await request(app)
    .post('/api/tickets')
    .set("Cookie", cookie)
    .send({
      title,
      price: 20
    })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: "new title",
      price: 50
    })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects, updates if the ticket is reserved', async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: "asdfg",
      price: 20
    })

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({
    orderId: mongoose.Types.ObjectId().toHexString()
  })
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${ticket!.id}`)
    .set('Cookie', cookie)
    .send({
      title: "new title",
      price: 50
    })
    .expect(400)
})