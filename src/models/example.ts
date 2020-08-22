import ActiveModel, { IModelConfig } from '@/lib/ActiveModel';

export interface IExample {
  id: number;
  name: string;
}

export class Example extends ActiveModel<IExample> {
  // super 默认可以什么都不填，模型名称，indexKey, 表名，已在内部根据类名做了自动转换
  // class Member => { name: 'member', resource: 'members', indexKey: 'member' }
  // 外部实力化，可以传一个新的配置，注意合并之后传给 super
  constructor(config?: IModelConfig) {
    super({
      namespace: '/namespace/role',
      parents: [{ type: 'projects', id: 1 }],
      actions: [{ name: 'action', method: 'post', on: 'collection' }],
      ...config,
    });
  }
}
