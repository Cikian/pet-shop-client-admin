# 电商管理后台

基于Vue3+Vite+TypeScript构建的现代化电商管理后台系统。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **开发语言**: TypeScript
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP客户端**: Axios
- **样式预处理**: SCSS
- **测试框架**: Vitest + Vue Test Utils
- **代码规范**: ESLint + Prettier

## 项目结构

```
src/
├── components/           # 通用组件
│   ├── common/          # 基础组件
│   ├── layout/          # 布局组件
│   └── business/        # 业务组件
├── views/               # 页面组件
│   ├── auth/           # 认证相关页面
│   ├── product/        # 商品管理页面
│   ├── category/       # 分类管理页面
│   ├── spec/           # 规格管理页面
│   └── dashboard/      # 仪表板页面
├── stores/             # Pinia状态管理
├── api/                # API服务层
├── utils/              # 工具函数
├── composables/        # 组合式函数
├── types/              # TypeScript类型定义
├── router/             # 路由配置
└── styles/             # 样式文件
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行测试
npm run test

# 运行测试（监听模式）
npm run test:watch

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 开发规范

- 使用TypeScript进行类型安全开发
- 遵循Vue3 Composition API最佳实践
- 使用ESLint和Prettier保证代码质量
- 编写单元测试和属性测试确保代码正确性
- 使用语义化的Git提交信息

## 环境配置

项目支持多环境配置：

- `.env` - 通用配置
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
