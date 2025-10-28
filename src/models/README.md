# Realm模型使用指南

本文件夹包含了从TypeScript接口转换而来的Realm数据库模型，用于替换原有的SQLite数据库实现。

## 文件结构

```
src/models/
├── Book.ts - 书籍模型
├── BookSituation.ts - 阅读进度模型
├── Bookmark.ts - 书签模型
├── Chapter.ts - 章节模型
├── Note.ts - 笔记模型
├── ParagraphComment.ts - 段落评论模型
├── Tag.ts - 标签模型
├── UserSettings.ts - 用户设置模型
└── index.ts - 导出所有模型

src/tools/
└── realmManager.ts - Realm数据库管理工具
```

注意：realmConfig.ts已迁移到../config/realmConfig.ts

## 使用方法

### 1. 初始化Realm数据库

在应用启动时初始化Realm数据库：

```typescript
import realmManager from '../tools/realmManager';

// 初始化数据库
await realmManager.initialize();
```

### 2. 在React组件中使用

```typescript
import React, { useEffect, useState } from 'react';
import realmManager, { Book } from '../tools/realmManager';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // 查询所有书籍
    const allBooks = realmManager.query(Book);
    setBooks(Array.from(allBooks));
    
    // 监听数据变化
    const listener = () => {
      const updatedBooks = realmManager.query(Book);
      setBooks(Array.from(updatedBooks));
    };
    
    allBooks.addListener(listener);
    
    return () => {
      allBooks.removeListener(listener);
    };
  }, []);

  // 添加新书
  const addBook = () => {
    const newBook = {
      _id: Date.now(),
      title: '新书',
      type: 'novel',
      create_time: Date.now(),
      update_time: Date.now(),
    };
    
    realmManager.create(Book, newBook);
  };

  // 更新书籍
  const updateBook = (id: number, title: string) => {
    realmManager.update(Book, id, { title, update_time: Date.now() });
  };

  // 删除书籍
  const deleteBook = (id: number) => {
    realmManager.delete(Book, id);
  };

  return (
    // 渲染书籍列表
    <div>
      {books.map(book => (
        <div key={book._id}>
          <h3>{book.title}</h3>
          <button onClick={() => updateBook(book._id!, '新标题')}>更新</button>
          <button onClick={() => deleteBook(book._id!)}>删除</button>
        </div>
      ))}
      <button onClick={addBook}>添加书籍</button>
    </div>
  );
}
```

### 3. 使用RealmProvider（可选）

如果您使用React，可以使用RealmProvider包装应用：

```typescript
import { RealmProvider } from '@realm/react';
import { realmConfig } from '../config/realmConfig';

function App() {
  return (
    <RealmProvider {...realmConfig}>
      {/* 您的应用组件 */}
    </RealmProvider>
  );
}
```

### 4. 高级查询

```typescript
// 查询特定类型的书籍
const novels = realmManager.query(Book, "type == 'novel'");

// 查询特定书籍的章节
const bookChapters = realmManager.query(Chapter, `book_id == ${bookId}`);

// 排序查询
const sortedBooks = realmManager.query(Book).sorted('create_time', true);

// 分页查询
const pageSize = 20;
const pageNumber = 1;
const pagedBooks = realmManager.query(Book)
  .sorted('create_time', true)
  .slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
```

### 5. 事务处理

```typescript
// 使用事务方法
realmManager.transaction(() => {
  realmManager.create(Book, bookData);
  realmManager.create(Chapter, chapterData);
  // 如果任何操作失败，所有更改将自动回滚
});

// 或者手动控制事务
realmManager.beginTransaction();
try {
  realmManager.create(Book, bookData);
  realmManager.create(Chapter, chapterData);
  realmManager.commitTransaction();
} catch (error) {
  realmManager.cancelTransaction();
  throw error;
}
```

## 数据迁移

如果您需要从现有的SQLite数据库迁移到Realm，可以按照以下步骤：

1. 创建一个迁移脚本，读取SQLite数据并写入Realm
2. 在`../config/realmConfig.ts`中的onMigration函数中实现迁移逻辑
3. 确保数据类型和结构匹配

## 注意事项

1. Realm使用对象引用而非外键，但您仍然可以使用ID来关联对象
2. Realm对象是实时更新的，当数据变化时，所有引用都会自动更新
3. 记得在应用关闭时调用`realmManager.close()`关闭数据库连接
4. 对于大量数据插入，考虑使用批量插入方法提高性能

## 与原有SQLite代码的对应关系

| SQLite操作 | Realm操作 |
|-----------|-----------|
| `dbManager.query()` | `realmManager.query()` |
| `dbManager.insert()` | `realmManager.create()` |
| `dbManager.update()` | `realmManager.update()` |
| `dbManager.delete()` | `realmManager.delete()` |
| `dbManager.beginTransaction()` | `realmManager.beginTransaction()` |
| `dbManager.commit()` | `realmManager.commitTransaction()` |
| `dbManager.rollback()` | `realmManager.cancelTransaction()` |

## 性能优化建议

1. 对于大量数据操作，使用事务批量处理
2. 避免在主线程中进行大量数据库操作
3. 使用查询过滤器减少返回的数据量
4. 定期调用`realmManager.compact()`压缩数据库
5. 对于只读操作，考虑使用冻结对象提高性能