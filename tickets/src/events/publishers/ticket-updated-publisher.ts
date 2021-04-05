import {
  Publisher,
  Subjects,
  TicketUpdatedEvent
} from "@roughtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}