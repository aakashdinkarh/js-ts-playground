export const PROMISE_STATES = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

export type PromiseState = typeof PROMISE_STATES[keyof typeof PROMISE_STATES];
