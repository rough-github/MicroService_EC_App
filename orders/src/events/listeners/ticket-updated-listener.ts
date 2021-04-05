import { Message } from "node-nats-streaming";
import { 
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError
 } from "@roughtickets/common";
 import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if(!ticket) {
      throw new NotFoundError();
    }

    const {title, price, version} = data;
    // update the ticket and version
    ticket.set({title, price, version});
    await ticket.save();

    msg.ack();
  }
}