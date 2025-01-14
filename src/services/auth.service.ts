import { v4 as uuid } from "uuid";
import {
  AuthChangeEvent,
  Session,
  Subscription,
  AuthStateManager,
} from "../types/auth.js";

export class AuthStateService implements AuthStateManager {
  stateChangeEmitters: Map<string, Subscription>;
  currentSession: Session | null;
  private initializePromise: Promise<void>;
  private lock: Promise<void>;

  constructor() {
    this.stateChangeEmitters = new Map();
    this.currentSession = null;
    this.initializePromise = Promise.resolve();
    this.lock = Promise.resolve();
  }

  private async _acquireLock<T>(
    timeout: number,
    callback: () => Promise<T>
  ): Promise<T> {
    const acquired = await Promise.race([
      this.lock.then(() => true),
      new Promise((resolve) => setTimeout(() => resolve(false), timeout)),
    ]);

    if (!acquired) {
      throw new Error("Lock timeout");
    }

    let release: () => void;
    this.lock = new Promise((resolve) => {
      release = resolve;
    });

    try {
      return await callback();
    } finally {
      release!();
    }
  }

  private async _emitInitialSession(id: string) {
    const subscription = this.stateChangeEmitters.get(id);
    if (!subscription) return;

    const event: AuthChangeEvent = this.currentSession
      ? "SIGNED_IN"
      : "SIGNED_OUT";
    await subscription.callback(event, this.currentSession);
  }

  onAuthStateChange(
    callback: (
      event: AuthChangeEvent,
      session: Session | null
    ) => void | Promise<void>
  ): { data: { subscription: Subscription } } {
    const id: string = uuid();
    const subscription: Subscription = {
      id,
      callback,
      unsubscribe: () => {
        this.stateChangeEmitters.delete(id);
      },
    };

    this.stateChangeEmitters.set(id, subscription);

    (async () => {
      await this.initializePromise;
      await this._acquireLock(-1, async () => {
        await this._emitInitialSession(id);
      });
    })();

    return { data: { subscription } };
  }

  async handleAuthChange(event: AuthChangeEvent, session: Session | null) {
    this.currentSession = session;

    const emitPromises = Array.from(this.stateChangeEmitters.values()).map(
      (subscription) => subscription.callback(event, session)
    );

    await Promise.all(emitPromises);
  }
}
