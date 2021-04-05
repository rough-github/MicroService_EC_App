import { 
  Subjects,
  Publisher,
  PaymentCreatedEvent
} from "@roughtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}