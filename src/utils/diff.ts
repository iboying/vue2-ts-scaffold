import { isEqual } from 'lodash-es';

interface IObject {
  [key: string]: any;
}

function diff(oldObject: IObject, newObject: IObject) {
  if (oldObject === newObject) {
    return newObject;
  }
  return Object.keys(newObject).reduce((res: IObject, key: string) => {
    const oldValue = oldObject[key];
    const newValue = newObject[key];
    if (!isEqual(oldValue, newValue)) {
      Object.assign(res, { [key]: newValue });
    }
    return res;
  }, {});
}

export default diff;
