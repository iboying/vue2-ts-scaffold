import * as fp from 'lodash/fp';

type func = (item: any) => string;

export default {
  only(obj: IObject, keys: string | string[]) {
    obj = obj || {};
    if ('string' == typeof keys) {
      keys = keys.split(/ +/);
    }
    return keys.reduce((ret: IObject, key: string) => {
      if (null == obj[key]) {
        return ret;
      }
      ret[key] = obj[key];
      return ret;
    }, {});
  },
  except(obj: IObject, exceptKeys: string | string[]) {
    obj = obj || {};
    if ('string' == typeof exceptKeys) {
      exceptKeys = exceptKeys.split(/ +/);
    }
    const keys = Object.keys(obj);
    return keys.reduce((ret: IObject, key: string) => {
      if (null == obj[key]) {
        return ret;
      }
      if (exceptKeys.includes(key)) {
        return ret;
      }
      ret[key] = obj[key];
      return ret;
    }, {});
  },
  // resolve async function one by one
  promiseSerial(funcs: Array<Promise<any>>) {
    const concat = (res: any) => Array.prototype.concat.bind(res);
    const promiseConcat = (func: any) => (res: any) => func().then(concat(res));
    const promiseReduce = (acc: any, func: any) => acc.then(promiseConcat(func));
    funcs.reduce(promiseReduce, Promise.resolve([]));
  },
  groupBy(array: any[], func: any) {
    return array.map(typeof func === 'function' ? func : val => val[func]).reduce(
      (group: any, val: any, index: number) => ({
        ...group,
        [val]: (group[val] || []).concat(array[index]),
      }),
      {},
    );
  },
  objectify(ary: any[], key: string | func, valueKey?: string | number) {
    return ary.reduce((obj, item) => {
      const v = valueKey ? item[valueKey] : item;
      const k = typeof key === 'function' ? key(item) : item[key];
      Object.assign(obj, { [k]: v });
      return obj;
    }, {});
  },
  isIsoDate(str: string) {
    return /\d{4}-\d{2}-\d{2}/.test(str) || /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str);
  },
  deepCopy(obj: object) {
    return fp.cloneDeep(obj);
  },
  debounce(fn: (...args: any) => void, wait = 100, immediate = false) {
    let timer: any = null;
    return (...args: any) => {
      if (timer) {
        clearTimeout(timer);
      } else if (immediate) {
        fn(...args);
      }
      timer = setTimeout(() => {
        fn(...args);
      }, wait);
    };
  },
  parseSearchStringToArray(str: string) {
    if (!str) {
      return [];
    }
    const pattern = /[,，;；\s、!@#$%^&*_\-+=《》<>?\\/[\]()（）'"‘’“”]/g;
    const formatString = str
      .replace(pattern, ' ')
      .trim()
      .replace(/\s{2,}/g, ' ');
    return formatString.split(' ');
  },
  open(path: string, target = '_blank') {
    const publicPath = process.env.VUE_APP_PUBLIC_PATH || '';
    if (path.includes('http') || path.includes(publicPath)) {
      window.open(path, target);
      return;
    }
    const newPath = path.charAt(0) === '/' ? path.slice(1) : path;
    window.open(`${publicPath}${newPath}`, target);
  },
  parseSeconds(seconds: number) {
    const secPerMinute = 60;
    const secPerHour = 60 * 60;
    const hours = Math.floor(seconds / secPerHour);
    const hourString = String(hours).padStart(2, '0');
    const minutesLeft = seconds - hours * secPerHour;
    const minutes = Math.floor(minutesLeft / secPerMinute);
    const minuteString = String(minutes).padStart(2, '0');
    const secondsCount = minutesLeft - minutes * secPerMinute;
    const secondString = String(secondsCount).padStart(2, '0');
    return {
      hour: hourString,
      minute: minuteString,
      second: secondString,
      toString() {
        return `${hourString}:${minuteString}:${secondString}`;
      },
    };
  },
};
