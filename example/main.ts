import { EventBus } from "../lib/event-bus/event-bus.rxjs.ts";
import { BusEvent } from "@mod";

const bus = new EventBus();

export class PauseEvent extends BusEvent<void> {
  public type = "PauseEvent";
}

export class SetCellValue extends BusEvent<{ value: number }> {
  public type = "SetCellValue";
}

bus.eventStream$.subscribe((event: unknown) => {
  console.log(`Received Event: `, event);
});

bus.on$(PauseEvent).subscribe(() => {
  console.log(`Pause called!`);
});

bus.on$(SetCellValue).subscribe((payload: { value: number }) => {
  console.log(`Set Cell Value called!`, payload);
});

bus.emit(new PauseEvent());

bus.emit(new SetCellValue({ value: 10 }));
