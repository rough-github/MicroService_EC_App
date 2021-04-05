import { Message } from "node-nats-streaming";
import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects
} from "@roughtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if(!ticket) {
      throw new NotFoundError();
    }

    // Mark the ticket as being reserved by its orderId property
    ticket.set({orderId: data.id});

    // Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId
    })

    // ack the message
    msg.ack();
  }
}