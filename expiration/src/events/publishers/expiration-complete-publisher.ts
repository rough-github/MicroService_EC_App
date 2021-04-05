import { 
  Subjects,
  Publisher,
  ExpirationCompleteEvent
 } from "@roughtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}