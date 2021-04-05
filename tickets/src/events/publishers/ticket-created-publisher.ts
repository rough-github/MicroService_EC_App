import {
  Publisher,
  Subjects,
  TicketCreatedEvent
} from "@roughtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}