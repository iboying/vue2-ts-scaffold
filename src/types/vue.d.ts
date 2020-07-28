// 1. Make sure to import 'vue' before declaring augmented types
import moment from 'moment';

type func = (item: any) => string;

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $moment: typeof moment;
    $utils: {
      only(obj: IObject, keys: string | string[]): IObject;
      except(obj: IObject, keys: string | string[]): IObject;
      groupBy: (array: any[], func: any) => IObject;
      objectify: (ary: any[], key: string | func, valueKey?: string | number) => IObject;
      stringToArray: (string: string, char: string, shouldRemoveEmptyItem?: boolean) => string[];
      openUrl: (path: string, target?: string) => void;
      toCurrency: (price: number | string, decimalCount?: number, suffix?: string) => string;
    };
  }
}
