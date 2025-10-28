# Simple Read Pro

一个基于React Native的阅读应用，使用Realm数据库存储数据。

## 功能特点

- 支持多种格式的电子书
- 书架管理
- 阅读进度记录
- 书签功能
- 笔记功能

## 技术栈

- React Native
- TypeScript
- Redux Toolkit
- Realm数据库
- Tailwind CSS

## 开发环境设置

1. 安装依赖：
   ```
   npm install
   ```

2. 运行应用：
   ```
   # Android
   npm run android

   # iOS
   npm run ios
   ```

## 项目结构

```
src/
├── components/    # UI组件
├── config/        # 配置文件
├── models/        # 数据模型
├── services/      # 服务层
├── stores/        # Redux状态管理
├── tools/         # 工具函数
├── types/         # TypeScript类型定义
└── views/         # 页面组件
```

## 数据库迁移

项目已从SQLite迁移到Realm数据库，详细迁移指南请参考 `src/models/migrationGuide.md`。

## 许可证

MIT