# 基于 vue 和 TypeScript 的前端项目脚手架

> 搭配脚手架命令行工具，可以实现业务的款速开发 https://github.com/iboying/boy-web-cli

## 基础命令

### 1. 安装依赖

```
yarn
```

### 2. 编译并启动开发服务

```
npm run dev
```

### 3. 构建是生产环境应用

```
npm run build
```

### 4. 运行测试

```
npm run test
```

### 5. 运行测试，并统计测试覆盖率

```
npm run test:coverage
```

### 6. 代码检查，错误不会自动修复，请手动修复

```
npm run lint
```

### 7. 格式化项目代码

```
npm run format
```

## 四、资源管理

- `assets/images` 存在项目图片
- `assets/styles` 全局和复用样式

根据开发需要，可配置 `assets/fonts`, `assets/icons` 等；

## 五、路由配置

- 项目页面按照 Restful resources 风格进行管理；
- 每个资源设置自身的路由：`router/session.route.ts`；
- router/index.ts 会自动导入所有路由，无需手动 import

## 六、Model 使用

### 1. Model 定义

```javascript
import ActiveModel, { IModelConfig } from '@/lib/ActiveModel';

export interface IExample {
  id: number;
  name: string;
}

interface IResponse {
  examples: IExample[];
}

export class Example extends ActiveModel<IExample, IResponse> {
  constructor(config?: IModelConfig) {
    super({
      namespace: '/namespace/role',
      actions: [{ name: 'action', method: 'post', on: 'collection' }],
      ...config,
    });
  }
}
```

### 2. Model 的使用

模型一般搭配 store 一起使用，由 store 进行初始化，并发起接口调用，直接使用 model 调用接口方法如下：

```javascript
const instance = new Example({
  parents: [{ type: 'projects', id: 1 }],
});
...
async fetchExamples() {
  const { data } = await instance.index({ page: 1, per_page: 15 });
  // 相当于发起了接口：get /namespace/role/projects/1/examples?page=1&per_page=15
}
```

### 3. Model 配置参数

```typescript
interface IModelConfig {
  baseUrl?: string; // 接口的 baseUrl, 一般由项目统一设置，模型可以通过此属性进行覆盖
  rootPath?: string; // 路由的命名空间
  name?: string; // 模型名称
  namespace?: string; // 路由的命名空间
  dataIndexKey?: string; // 资源名称，一般是模型名的复数形式
  pathIndexKey?: string; //路由上的模型名复数形式
  parents?: IParent[]; // 关联父资源
  actions?: IAction[]; // 自定义接口方法
  mode?: ModeType; // default: Restful 默认模式， shallow: 对于后台 shallow: true, single: 单例模式
  params?: IObject; // 默认的请求参数
}
```

## 七、Store 的使用

### 1. Store 的定义

在 `src/store/modules` 下定义 Store module

```javascript
import { ActiveModule, ActiveStore, getModule } from '@/lib/ActiveStore';
import { Example, IExample } from '@/models/example';

@ActiveModule(Example, { name: 'ExampleStore' })
export class ExampleStore extends ActiveStore<IExample> {}

export const exampleStore = getModule(ExampleStore);
```

### 2. Store 的使用

store 实例在调用内部的请求方法之前，必须先初始化，store.init()，init 方法参数为：空、模型配置参数、模型实例;

```javascript
created() {
  exampleStore.init();
  // or
  exampleStore.init(new Example());
  // or
  exampleStore.init({ parents: [{ type: 'projects', id: 1 }] });
}
```

store 内置了如下常用状态：

```
loading: 接口加载状态
records: 资源列表
record: 资源实例, find 之后会设置
currentPage: 当前页
totalPages: 总页数
totalCount: 总数量
```

```javascript
import { exampleStore } from '@/store/modules/example.store';

created() {
  exampleStore.init({
    parents: [{ type: 'projects', id: 1 }],
  });
}
...
async fetchData() {
  await exampleStore.index({ page: 1, per_page: 10 });
  // 相当于发起了接口：get /namespace/role/projects/1/examples?page=1&per_page=10
  this.examples = exampleStore.records;
}
```

### 3. Store 内置方法

| 方法   | 参数                 | 说明         | http 请求            |
| ------ | -------------------- | ------------ | -------------------- |
| index  | params（query 参数） | 获取资源列表 | get /examples        |
| find   | id （资源 id）       | 获取资源实例 | get /examples/:id    |
| create | formData (表单数据)  | 创建资源     | post /examples       |
| update | instance (资源实例)  | 更新资源     | patch /examples/:id  |
| delete | id （资源 id）       | 删除资源     | delete /examples/:id |

## 九、代码规范

### 1. 目录接口

| 目录      | 路径              | 示例                                            |
| --------- | ----------------- | ----------------------------------------------- |
| Model     | src/models        | src/models/example.ts                           |
| Store     | src/store/modules | src/store/modules/example.store.ts              |
| route     | src/route         | src/router/example.route.ts                     |
| View      | src/views         | src/views/examples/Index.vue                    |
| Component | src/components    | src/components/examples/ComExampleInstances.vue |

### 2. 文件、文件夹命名规范：

| 文件/文件夹  | 格式                 | 示例            |
| ------------ | -------------------- | --------------- |
| 页面文件名   | 首字母大写           | Index.vue       |
| 组件文件名   | 首字母大写，Com 开头 | ComTable.vue    |
| 模型文件名   | 驼峰命名             | fooBar.ts       |
| store 文件名 | 驼峰命名, store 后缀 | fooBar.store.ts |
| route 文件名 | 驼峰命名, route 后缀 | fooBar.route.ts |
| 文件夹命名   | 下划线链接           | node_modules    |

### 2. 编码命名规范：

| 目标         | 格式                                                       | 示例                              |
| ------------ | ---------------------------------------------------------- | --------------------------------- |
| css          | 短横线链接                                                 | .module-container                 |
| Model 类名   | 首字母大写, 需要匹配 namespace                             | SvrAdminMember                    |
| Store 类名   | 首字母大写, 需要匹配 namespace                             | SvrAdminMemberStore               |
| 页面组件类名 | 首字母大写, 需要匹配路径                                   | SvrAdminCardMembersIndex          |
| 组件类名     | 首字母大写, 以 Com 开头                                    | ComAdminTable、ComMeetingActivity |
| 方法名称     | 驼峰命名, 多利用 get、set、check、fetch 等动词，命名有含义 | getUserInfo、updateUser           |

## 九、代码提交格式

格式：`type(scope?): message`

- type 提交类型
- scope 提交代码的作用范围（可选）
- message 提交说明

```shell
git commit -m "feat(apis): add new api config."
```

支持的类型：[ 'build', 'ci', 'chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test' ]

### 更多 vue-cli 配置

See [Configuration Reference](https://cli.vuejs.org/config/).
