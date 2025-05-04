import { signal } from "@preact/signals-react";
import { DataElement } from "@stream/webREventReader";

export const population = signal(10);
export const dataSignal = signal<DataElement[]>([]);