import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

// 支持的模块
type TypeModuleName = 'session';

// 定义持久化插件
const NAMESPACE = process.env.VUE_APP_VUEX_STORAGE_KEY || '';
const persistModules: TypeModuleName[] = ['session'];
const persistPlugin = createPersistedState({
  key: NAMESPACE,
  paths: persistModules,
});

/**
 * 获取 localStorage 存储的数据
 * @param moduleName 持久化数据模块
 */
export function getModulePersistState(moduleName: TypeModuleName): IObject {
  const state = JSON.parse(window.localStorage.getItem(NAMESPACE) || '{}');
  return state[moduleName] || {};
}

/**
 * 基础 store
 */
export default new Vuex.Store<any>({
  state: {},
  mutations: {},
  actions: {},
  getters: {
    authFileHeader(state) {
      return {
        Accept: 'application/json',
        authorization: `Token ${state.fileToken}`,
      };
    },
  },
  plugins: [persistPlugin],
});
