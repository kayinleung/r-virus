import { signal } from "@preact/signals-react";

export const NavigationKeys = {
  Controls: { value: 'Controls', label: 'Controls' },
  About: { value: 'About', label: 'About' },
} as const;

export type NavigationKey = keyof typeof NavigationKeys;
export const selectedMetric = signal<NavigationKey>(NavigationKeys.Controls.value);