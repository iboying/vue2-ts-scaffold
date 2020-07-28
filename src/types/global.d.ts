type IObject = Record<string, any>;

interface RouteMeta {
  title: string;
  requireAuth?: boolean;
  keepAlive?: true | false;
  layout?: 'default' | 'menu' | 'header';
  role?: 'admin' | 'user';
}

interface IRoute {
  path: string;
  name?: string;
  component: any;
  meta?: RouteMeta;
  children?: IRoute[];
}
