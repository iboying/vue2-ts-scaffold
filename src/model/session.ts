import ActiveModel, { IModelConfig } from '@/lib/ActiveModel';

export interface ISession {
  id?: number;
  name?: string;
}

export class Session extends ActiveModel<ISession> {
  constructor(config?: IModelConfig) {
    super({
      namespace: '/auth',
      name: 'session',
      ...config,
    });
  }
}
