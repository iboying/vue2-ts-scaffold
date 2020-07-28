import createRequestClient from '@/utils/request';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { snakeCase } from 'change-case';
import { isInteger, merge } from 'lodash';
import { plural } from 'pluralize';

type IdType = number | string;
type IObject = Record<string, any>;
type ModeType = 'default' | 'shallow' | 'single';

export interface IParent {
  type: string;
  id: number;
}

interface IAction {
  name: string;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
  on: 'member' | 'collection';
}

export interface IActiveModel {
  baseUrl: string;
  rootPath: string;
  namespace: string;
  name: string;
  pathIndexKey: string;
  dataIndexKey: string;
  parents: IParent[];
  mode?: ModeType;
  params?: IObject;
  resourcePath: string;
  parentMap: { [key: string]: IParent };
  index(params: IObject, config?: AxiosRequestConfig): any;
  find(id?: IdType, config?: AxiosRequestConfig): any;
  create(payload: any, config?: AxiosRequestConfig): any;
  update(instance: any, config?: AxiosRequestConfig): any;
  delete(id?: IdType, config?: AxiosRequestConfig): any;
  sendCollectionAction(actionName: string, config?: AxiosRequestConfig): any;
  sendMemberAction(id: IdType, actionName: string, config?: AxiosRequestConfig): any;
}

export interface IModelConfig {
  baseUrl?: string;
  rootPath?: string; // 路由的命名空间
  name?: string; // 模型名称
  namespace?: string; // 路由的命名空间
  dataIndexKey?: string; // 资源名称，一般是模型名的复数形式
  pathIndexKey?: string; //路由上的模型名复数形式
  parents?: IParent[]; // 关联父资源
  actions?: IAction[]; // 自定义接口方法
  mode?: ModeType; // default: Restful 默认模式， shallow: 对于后台 shallow: true, single: 单例模式
  params?: IObject;
}

// index 接口返回接口
interface IIndex {
  id?: number;
  current_page: number;
  total_pages: number;
  total_count: number;
}

// 模型实例基础结构
interface IModel {
  id?: IdType;
}

/**
 * 模型抽象基础类
 * api_path: baseUrl + rootPath + namespace + resource
 * examples:
 *  http://www.api.com/v2/finance/user/activities
 *  http://www.api.com + /v2 + /finance/user + /activities
 */
export default class ActiveModel<T extends IModel = IModel, IResponse = {}> implements IActiveModel {
  public request!: AxiosInstance;
  public baseUrl!: string;
  public rootPath = '/';

  public namespace = '';
  public name = '';
  public dataIndexKey = '';
  public pathIndexKey = '';
  public parents: IParent[] = [];
  public actions: IAction[] = [];
  public mode: ModeType = 'default';
  public params: object = {};

  constructor(config: IModelConfig = {}) {
    this.request = createRequestClient();
    const { baseUrl, rootPath, name, namespace, dataIndexKey, pathIndexKey, parents, actions, mode, params } = config;

    if (baseUrl) {
      this.request.defaults.baseURL = baseUrl;
    }
    if (rootPath) {
      this.request.defaults.baseURL += rootPath;
    }
    this.namespace = namespace || this.namespace;
    const modelName = name || this.constructor.name;
    this.name = snakeCase(modelName);
    this.dataIndexKey = dataIndexKey || plural(this.name);
    this.pathIndexKey = pathIndexKey || plural(this.name);
    this.parents = parents || [];
    this.actions = actions || [];
    this.mode = mode || 'default';
    this.params = params || {};
  }

  get parentMap() {
    return this.parents.reduce((map, parent) => {
      map[parent.type] = parent;
      return map;
    }, Object.create(null));
  }

  get resourcePath() {
    return `${this.namespace}/${this.pathIndexKey}`;
  }

  get indexPath() {
    const parentPath = this.parents.reduce((path, parent) => `${path}/${parent.type}/${parent.id}`, this.namespace);
    if (this.mode === 'single') {
      return `${parentPath}/${this.name}`;
    }
    return `${parentPath}/${this.pathIndexKey}`;
  }

  get memberActionMap() {
    return this.actions
      .filter(a => a.on === 'member')
      .reduce((map, action: IAction) => {
        map[action.name] = action;
        return map;
      }, Object.create(null));
  }

  get collectionActionMap() {
    return this.actions
      .filter(a => a.on === 'collection')
      .reduce((map, action: IAction) => {
        map[action.name] = action;
        return map;
      }, Object.create(null));
  }

  /**
   * index
   * 模型列表接口
   */
  public index(params?: object, config?: AxiosRequestConfig) {
    return this.request.get<IResponse & IIndex>(this.indexPath, {
      ...config,
      params: merge(this.params, params),
    });
  }

  /**
   * find
   * 模型详情接口
   */
  public find(id?: IdType, config?: AxiosRequestConfig) {
    return this.request.get<T>(this.getActionPath(id), config);
  }

  /**
   * create
   * 创建记录
   */
  public create(payload: T, config?: AxiosRequestConfig) {
    return this.request.post<T>(
      this.indexPath,
      {
        [this.name]: payload,
      },
      config,
    );
  }

  /**
   * update
   * 更新记录
   */
  public update(instance: T, config?: AxiosRequestConfig) {
    return this.request.patch(
      this.getActionPath(instance.id),
      {
        [this.name]: instance,
      },
      config,
    );
  }

  /**
   * delete
   * 删除记录
   */
  public delete(id?: IdType, config?: AxiosRequestConfig) {
    return this.request.delete(this.getActionPath(id), config);
  }

  /**
   * 出发自定义方法
   */
  public sendCollectionAction(actionName: string, config?: AxiosRequestConfig) {
    const action: IAction = this.collectionActionMap[actionName];

    if (!action) {
      throw new Error(`\n${actionName} on collection 接口不存在，请检查模型配置。\n`);
    }
    return this.request({
      method: action.method,
      url: `${this.indexPath}/${actionName}`,
      ...config,
    });
  }

  /**
   * 出发自定义方法
   */
  public sendMemberAction(id: IdType, actionName: string, config?: AxiosRequestConfig) {
    const action: IAction = this.memberActionMap[actionName];
    if (!action) {
      throw new Error(`\n ${actionName} on member 接口不存在，请检查模型配置。\n`);
    }
    return this.request({
      method: action.method,
      url: `${this.getActionPath(id)}/${actionName}`,
      ...config,
    });
  }

  private getActionPath(action?: IdType | string) {
    if (action) {
      if (this.mode === 'shallow' && isInteger(Number(action))) {
        return `${this.resourcePath}/${action}`;
      }
      return `${this.indexPath}/${action}`;
    }
    return this.indexPath;
  }
}
