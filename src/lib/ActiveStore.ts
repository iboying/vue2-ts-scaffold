import ActiveModel, { IActiveModel, IModelConfig, IParent } from '@/lib/ActiveModel';
import store from '@/store';
import diff from '@/utils/diff';
import { AxiosRequestConfig } from 'axios';
import { cloneDeep } from 'lodash/fp';
import {
  Action,
  config,
  getModule as getMod,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

config.rawError = true;

interface IModelRequired {
  id?: number | string | null | undefined;
  noCompare?: boolean;
}
interface IParams {
  shouldAppend?: boolean; // 是否追加元素，而不是整页替换
  [key: string]: any;
}
interface ICollectionPayload {
  action: string;
  config?: AxiosRequestConfig;
}

interface IMemberPayload {
  action: string;
  id: number | string;
  config?: AxiosRequestConfig;
}

type ConstructorOf<C> = {
  new (...args: any[]): C;
};

interface ModuleOptions {
  name: string;
  store?: any;
  dynamic?: boolean;
  namespaced?: boolean;
}

function checkInit(model: IActiveModel) {
  if (Object.getPrototypeOf(model).constructor === ActiveModel) {
    throw new Error('\n\n 请确保 store.init 方法执行之后，再调用其他接口方法。\n');
  }
}

function diffAttributes(originAttributeObjects: IObject[], currentAttributeObjects: IObject[]) {
  const originAttributeObjectIds = originAttributeObjects.map((o: any) => o.id);
  const currentAttributeObjectIds = currentAttributeObjects.map((o: any) => o.id);
  const newObjects = currentAttributeObjects.filter(
    (o: any) => !originAttributeObjectIds.includes(o.id),
  );
  const deleteObjects = originAttributeObjects
    .filter((o: any) => !currentAttributeObjectIds.includes(o.id))
    .map((o: any) => ({
      ...o,
      _destroy: o.id,
    }));
  return newObjects.concat(deleteObjects);
}

function getDiffResourceAttributes(record: IObject) {
  const attributesKeys = Object.keys(record).filter((key: string) => key.includes('_attributes'));
  return attributesKeys.reduce((obj, key) => {
    const keyValue =
      record[key] instanceof Array
        ? diffAttributes(record[key.split('_attributes').shift() || ''] || [], record[key])
        : record[key];
    return {
      ...obj,
      [key]: keyValue,
    };
  }, {});
}

export class ActiveStore<IModel extends IModelRequired = IModelRequired> extends VuexModule {
  private ActiveModel: any = null;
  model: IActiveModel = new ActiveModel();
  // data
  perPage = 15;
  currentPage = 1;
  totalPages = 0;
  totalCount = 0;
  records: IModel[] = [];
  record: IModel | IObject = {};
  parentMap: { [key: string]: IParent } = {};
  // form
  formData: IModel | IObject = {};
  // control
  loading = false;

  @Action({})
  init(modelOrConfig?: IActiveModel | IModelConfig) {
    const ModelClass = this.ActiveModel;
    if (!ModelClass) {
      throw new Error('\n\n 请使用 init 方法初始化 store. 确保 store 在声明时已关联模型。\n');
    }
    if (modelOrConfig) {
      if (modelOrConfig instanceof ModelClass) {
        this.context.commit('SET_MODEL', modelOrConfig);
      } else {
        this.context.commit('SET_MODEL', new ModelClass(modelOrConfig));
      }
    } else {
      this.context.commit('SET_MODEL', new ModelClass());
    }
  }

  // =============== actions ===============
  @Action({})
  async index(params?: IParams) {
    try {
      checkInit(this.model);
      this.context.commit('SET_LOADING', true);
      this.context.commit('SET_PARAMS', params);
      const { data } = await this.model.index({
        ...params,
        per_page: this.perPage,
        page: this.currentPage,
      });
      if (params && params.shouldAppend) {
        this.context.commit('APPEND_RECORDS', data);
      } else {
        this.context.commit('SET_RECORDS', data);
      }
      this.context.commit('SET_LOADING', false);
      return { data };
    } catch (error) {
      this.context.commit('SET_LOADING', false);
      throw error;
    }
  }

  @Action({})
  async find(id?: number | string) {
    try {
      checkInit(this.model);
      this.context.commit('SET_LOADING', true);
      const res = await this.model.find(id);
      this.context.commit('SET_RECORD', res.data);
      this.context.commit('SET_FORM_DATA', res.data);
      this.context.commit('SET_LOADING', false);
      return Promise.resolve(cloneDeep(res));
    } catch (error) {
      this.context.commit('SET_LOADING', false);
      throw error;
    }
  }

  @Action({})
  async create(formData: IModel) {
    try {
      checkInit(this.model);
      this.context.commit('SET_LOADING', true);
      const { data } = await this.model.create(formData);
      this.context.commit('ADD_RECORD', data);
      this.context.commit('SET_LOADING', false);
      return { data };
    } catch (error) {
      this.context.commit('SET_LOADING', false);
      throw error;
    }
  }

  @Action({})
  async update(formData: IModel) {
    try {
      checkInit(this.model);
      this.context.commit('SET_LOADING', true);
      // Get origin record
      let originData: any = null;
      if (this.record.id === formData.id) {
        originData = this.record;
      } else {
        const existOne: any = this.records.find(o => o.id === formData.id);
        if (existOne) {
          originData = existOne;
        } else if (formData.id) {
          const { data } = await this.model.find(formData.id);
          originData = data;
        } else {
          originData = Object.create(null);
        }
      }
      // support resources_attributes
      const diffAttributes = getDiffResourceAttributes(formData);
      // diff origin data and formData
      const patchData: IObject = diff(originData, formData);
      Object.assign(patchData, { id: formData.id, ...diffAttributes });
      // update api
      await this.model.update(patchData);
      this.context.commit('UPDATE_RECORD', formData);
      this.context.commit('SET_LOADING', false);
    } catch (error) {
      this.context.commit('SET_LOADING', false);
      throw error;
    }
  }

  @Action({})
  async updateWithoutDiff(formData: IModel) {
    try {
      checkInit(this.model);
      this.context.commit('SET_LOADING', true);
      await this.model.update(formData);
      this.context.commit('UPDATE_RECORD', formData);
      this.context.commit('SET_LOADING', false);
    } catch (error) {
      this.context.commit('SET_LOADING', false);
      throw error;
    }
  }

  @Action({})
  async delete(id?: number | string) {
    try {
      checkInit(this.model);
      this.context.commit('SET_LOADING', true);
      await this.model.delete(id);
      this.context.commit('DELETE_RECORD', id);
      this.context.commit('SET_LOADING', false);
    } catch (error) {
      this.context.commit('SET_LOADING', false);
      throw error;
    }
  }

  @Action({})
  async sendCollectionAction(payload: ICollectionPayload) {
    try {
      checkInit(this.model);
      this.context.commit('SET_LOADING', true);
      const { action, config } = payload;
      const res = await this.model.sendCollectionAction(action, config);
      this.context.commit('SET_LOADING', false);
      return res;
    } catch (error) {
      this.context.commit('SET_LOADING', false);
      throw error;
    }
  }

  @Action({})
  async sendMemberAction(payload: IMemberPayload) {
    try {
      checkInit(this.model);
      this.context.commit('SET_LOADING', true);
      const { action, id, config } = payload;
      const res = await this.model.sendMemberAction(id, action, config);
      this.context.commit('SET_LOADING', false);
      return res;
    } catch (error) {
      this.context.commit('SET_LOADING', false);
      throw error;
    }
  }

  @Action({})
  async reset() {
    this.context.commit('SET_RECORD', {});
    this.context.commit('SET_FORM_DATA', {});
    this.context.commit('SET_LOADING', false);

    this.context.commit('SET_RECORDS', {
      current_page: 1,
      total_pages: 1,
      total_count: 0,
      [this.model.dataIndexKey || this.model.pathIndexKey]: [],
    });
  }

  // =============== mutations ===============
  @Mutation
  public SET_RECORD(this: any, payload: IModel | IObject) {
    this.record = cloneDeep(payload);
  }
  @Mutation
  public SET_FORM_DATA(this: any, payload: IModel | IObject) {
    this.formData = cloneDeep(payload);
  }
  @Mutation
  public SET_PARAMS(this: any, payload: IObject) {
    this.currentPage = payload.page || this.currentPage;
    this.perPage = payload.per_page || this.perPage;
  }
  @Mutation
  public SET_RECORDS(this: any, payload: IObject) {
    this.currentPage = payload.current_page || this.currentPage;
    this.totalPages = payload.total_pages || this.totalPages;
    this.totalCount =
      typeof payload.total_count === 'number' ? payload.total_count : this.totalCount;
    const records = cloneDeep(payload[this.model.dataIndexKey] || this.records);
    this.records = records.map((o: any, i: number) => ({ _index: i + 1, ...o }));
  }
  @Mutation
  public APPEND_RECORDS(this: any, payload: IObject) {
    this.currentPage = payload.current_page || this.currentPage;
    this.totalPages = payload.total_pages || this.totalPages;
    this.totalCount =
      typeof payload.total_count === 'number' ? payload.total_count : this.totalCount;
    if (this.currentPage === 1) {
      this.records = payload[this.model.dataIndexKey]
        ? cloneDeep(payload[this.model.dataIndexKey])
        : this.records;
    } else {
      this.records = this.records.concat(cloneDeep(payload[this.model.dataIndexKey] || []));
    }
  }
  @Mutation
  public ADD_RECORD(this: any, payload: IModel) {
    this.totalCount += 1;
    this.records.push(cloneDeep(payload));
  }
  @Mutation
  public UPDATE_RECORD(this: any, payload: IModel) {
    const index = this.records.findIndex((o: IModel) => o.id === payload.id);
    if (index >= 0) {
      Object.assign(this.records[index], payload);
    }
    if (payload.id === this.record.id) {
      Object.assign(this.record, payload);
    }
  }
  @Mutation
  public DELETE_RECORD(this: any, id: number) {
    const index = this.records.findIndex((o: IModel) => o.id === id);
    this.totalCount -= 1;
    if (index >= 0) {
      this.records.splice(index, 1);
    }
    if (id === this.record.id) {
      this.record = {};
    }
  }
  @Mutation
  public SET_LOADING(this: any, payload: boolean) {
    this.loading = payload;
  }
  @Mutation
  public SET_MODEL(this: any, model: ActiveModel) {
    this.model = model;
    this.parentMap = model.parentMap;
  }
}

// 用于获取 store 实例
export const getModule = getMod;

// Store 装饰器，为 Store 绑定 Model
export function ActiveModule(ModelClass: ConstructorOf<ActiveModel>, options: ModuleOptions) {
  return (StoreClass: any) => {
    const decorator = Module(Object.assign({ store, dynamic: true, namespaced: true }, options));
    decorator(StoreClass);
    StoreClass.state.ActiveModel = ModelClass;
  };
}
