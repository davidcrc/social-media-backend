// import { User } from "./user.js";

import { UserMetaData } from "@prisma/client";

export type Session = {
  user: UserMetaData | null;
  token: string | null;
};

export type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED";

export interface Subscription {
  id: string;
  callback: (
    event: AuthChangeEvent,
    session: Session | null
  ) => void | Promise<void>;
  unsubscribe: () => void;
}

export interface AuthStateManager {
  stateChangeEmitters: Map<string, Subscription>;
  currentSession: Session | null;
}
