# 项目使用说明

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
- `src/router.ts` 路由器内导入 resources route；

## 六、代码提交格式

格式：`type(scope?): message`

- type 提交类型
- scope 提交代码的作用范围（可选）
- message 提交说明

```shell
git commit -m "feat(apis): add new api config."
```

支持的类型：[ 'build', 'ci', 'chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style',
'test' ]

### 更多配置

See [Configuration Reference](https://cli.vuejs.org/config/).
