type IObject = { [key: string]: any };

declare interface RouteMeta {
  title: string;
  requireAuth?: boolean;
  keepAlive?: true | false;
  layout?: 'default' | 'menu' | 'header';
  role?: 'admin' | 'user';
}

declare interface IRoute {
  path: string;
  name?: string;
  component: any;
  meta?: RouteMeta;
  children?: IRoute[];
}
