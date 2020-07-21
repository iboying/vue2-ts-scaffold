import Axios from 'axios';
import qs from 'qs';

export default () => {
  const apiUrl = process.env.VUE_APP_API_DOMAIN || '';
  const rootPath = process.env.VUE_APP_API_ROOT_PATH || '/';

  const request = Axios.create({
    baseURL: apiUrl + rootPath,
    headers: {
      Accept: 'application/json',
    },
    paramsSerializer(params) {
      return qs.stringify(params, {
        encode: true,
        arrayFormat: 'brackets',
        skipNulls: true,
      });
    },
  });

  request.interceptors.request.use(
    (config: any) => {
      if (!config.headers.authorization) {
        Object.assign(config.headers, {
          authorization: `Token ${''}`,
        });
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  request.interceptors.response.use(
    response => response,
    error => {
      if (!error || !error.response) {
        return Promise.reject(error);
      }
      switch (error.response.status) {
        case 401:
          console.error('未授权');
          break;
        case 500:
          console.error('服务器异常');
          break;
        case 404:
          console.error('资源不存在');
          break;
        default:
          break;
      }
      return Promise.reject(error);
    },
  );
  return request;
};
