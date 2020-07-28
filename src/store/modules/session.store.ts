import { ActiveModule, ActiveStore, getModule } from '@/lib/ActiveStore';
import { Session, ISession } from '@/models/session';
import { getModulePersistState } from '@/store';

const initialState = getModulePersistState('session');

@ActiveModule(Session, { name: 'SessionStore' })
export class SessionStore extends ActiveStore<ISession> {
  session: ISession = initialState || {};
}

export const sessionStore = getModule(SessionStore);
