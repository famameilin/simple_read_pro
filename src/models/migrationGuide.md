# 从SQLite迁移到Realm数据库指南

本指南将帮助您将项目从SQLite数据库迁移到Realm数据库。

## 迁移步骤

### 1. 安装依赖

```bash
npm install realm @realm/react
```

### 2. 更新应用入口

在您的应用入口文件（如App.tsx）中，添加RealmProvider：

```tsx
import { RealmProvider } from '@realm/react';
import { realmConfig } from './config/realmConfig';

function App() {
  return (
    <RealmProvider {...realmConfig}>
      {/* 您的应用组件 */}
      <MainApp />
    </RealmProvider>
  );
}
```

### 3. 替换数据访问层

#### 3.1 替换DBManager

将所有使用`DBManager`的地方替换为`realmManager`：

```typescript
// 原代码
import { DBManager } from './utils/dbManager';
const dbManager = DBManager.getInstance();

// 新代码
import realmManager from '../tools/realmManager';
```

#### 3.2 替换查询操作

```typescript
// 原SQLite代码
const books = dbManager.query('SELECT * FROM books');

// 新Realm代码
const books = realmManager.query(Book);
```

#### 3.3 替换插入操作

```typescript
// 原SQLite代码
dbManager.execute('INSERT INTO books (title, author) VALUES (?, ?)', ['书名', '作者']);

// 新Realm代码
realmManager.create(Book, { title: '书名', author: '作者' });
```

#### 3.4 替换更新操作

```typescript
// 原SQLite代码
dbManager.execute('UPDATE books SET title = ? WHERE _id = ?', ['新书名', bookId]);

// 新Realm代码
realmManager.update(Book, bookId, { title: '新书名' });
```

#### 3.5 替换删除操作

```typescript
// 原SQLite代码
dbManager.execute('DELETE FROM books WHERE _id = ?', [bookId]);

// 新Realm代码
realmManager.delete(Book, bookId);
```

#### 3.6 替换事务操作

```typescript
// 原SQLite代码
dbManager.beginTransaction();
try {
  // 多个数据库操作
  dbManager.commit();
} catch (error) {
  dbManager.rollback();
  throw error;
}

// 新Realm代码
realmManager.transaction(() => {
  // 多个数据库操作
});
```

### 4. 数据迁移

#### 4.1 创建迁移脚本

创建一个一次性脚本，将现有SQLite数据迁移到Realm：

```typescript
import { DBManager } from './utils/dbManager';
import realmManager from '../tools/realmManager';
import { Book, Chapter } from '../models/index';

async function migrateFromSQLiteToRealm() {
  try {
    // 1. 从SQLite读取所有书籍
    const dbManager = DBManager.getInstance();
    const books = dbManager.query('SELECT * FROM books');
    
    // 2. 将书籍数据插入Realm
    realmManager.transaction(() => {
      books.forEach(book => {
        realmManager.create(Book, {
          _id: book._id,
          title: book.title,
          type: book.type,
          file_path: book.file_path,
          // 其他字段...
        });
      });
      
      // 3. 迁移章节数据
      books.forEach(book => {
        const chapters = dbManager.query('SELECT * FROM chapters WHERE book_id = ?', [book._id]);
        chapters.forEach(chapter => {
          realmManager.create(Chapter, {
            _id: chapter._id,
            book_id: chapter.book_id,
            title: chapter.title,
            // 其他字段...
          });
        });
      });
    });
    
    console.log('数据迁移完成');
  } catch (error) {
    console.error('数据迁移失败:', error);
  }
}
```

#### 4.2 执行迁移

在应用启动时检查是否需要迁移：

```typescript
async function initializeApp() {
  // 检查是否是首次启动或需要迁移
  const hasMigrated = await AsyncStorage.getItem('realm_migrated');
  
  if (!hasMigrated) {
    await migrateFromSQLiteToRealm();
    await AsyncStorage.setItem('realm_migrated', 'true');
  }
}
```

### 5. 更新组件

#### 5.1 使用React Hooks

在React组件中使用Realm提供的Hooks：

```tsx
import { useRealm, useQuery, useObject } from '@realm/react';
import { Book } from '../models/index';

function BookList() {
  const books = useQuery(Book); // 获取所有书籍
  const realm = useRealm(); // 获取Realm实例
  
  const addBook = () => {
    realm.write(() => {
      realm.create(Book, {
        _id: Date.now(),
        title: '新书',
        author: '作者',
      });
    });
  };
  
  return (
    <View>
      {books.map(book => (
        <Text key={book._id}>{book.title}</Text>
      ))}
      <Button title="添加书籍" onPress={addBook} />
    </View>
  );
}
```

#### 5.2 使用RealmObject

对于单个对象的查询：

```tsx
function BookDetail({ bookId }) {
  const book = useObject(Book, bookId);
  
  if (!book) {
    return <Text>书籍不存在</Text>;
  }
  
  return <Text>{book.title}</Text>;
}
```

### 6. 性能优化

#### 6.1 批量操作

使用`createMultiple`进行批量插入：

```typescript
const chapters = chapterData.map(data => ({
  _id: data._id,
  book_id: data.book_id,
  title: data.title,
  // 其他字段...
}));

realmManager.createMultiple(Chapter, chapters);
```

#### 6.2 查询优化

使用索引和过滤条件：

```typescript
// 使用主键查询
const book = realmManager.objectForPrimaryKey(Book, bookId);

// 使用过滤条件
const recentBooks = realmManager.query(Book, 'create_time > ${Date.now() - 86400000}');
```

#### 6.3 内存管理

在组件卸载时关闭Realm实例：

```tsx
import React, { useEffect } from 'react';
import realmManager from '../tools/realmManager';

function MyComponent() {
  useEffect(() => {
    return () => {
      // 组件卸载时关闭Realm实例
      realmManager.close();
    };
  }, []);
  
  // 组件内容...
}
```

### 7. 测试迁移

#### 7.1 单元测试

为Realm操作编写单元测试：

```typescript
import realmManager from '../tools/realmManager';
import { Book } from '../models/index';

describe('Book Operations', () => {
  beforeEach(() => {
    realmManager.deleteAll(Book);
  });
  
  test('should create a book', () => {
    const bookData = {
      _id: 1,
      title: '测试书籍',
      author: '测试作者',
    };
    
    const book = realmManager.create(Book, bookData);
    expect(book.title).toBe('测试书籍');
  });
  
  // 其他测试...
});
```

#### 7.2 集成测试

测试完整的迁移流程：

```typescript
describe('SQLite to Realm Migration', () => {
  test('should migrate all data correctly', async () => {
    // 准备SQLite测试数据
    // 执行迁移
    // 验证Realm中的数据
  });
});
```

### 8. 常见问题

#### 8.1 数据类型转换

SQLite和Realm的数据类型可能不完全匹配，需要注意：

- SQLite的`TEXT`对应Realm的`string`
- SQLite的`INTEGER`对应Realm的`int`
- SQLite的`BLOB`对应Realm的`data`
- SQLite的`REAL`对应Realm的`float`
- SQLite的`NULL`对应Realm的可选类型（如`string?`）

#### 8.2 事务处理

Realm的事务处理与SQLite不同：

```typescript
// SQLite
dbManager.beginTransaction();
try {
  // 操作
  dbManager.commit();
} catch (error) {
  dbManager.rollback();
}

// Realm
realmManager.transaction(() => {
  // 操作
});
```

#### 8.3 线程安全

Realm是线程安全的，但需要注意：

- 每个线程有自己的Realm实例
- 不能在不同线程间传递Realm对象
- 使用`realmManager`可以处理线程问题

### 9. 回滚计划

如果迁移过程中遇到问题，可以：

1. 保留SQLite数据库文件作为备份
2. 使用版本控制回滚代码更改
3. 实现一个切换机制，允许在SQLite和Realm之间切换

```typescript
const useRealm = await AsyncStorage.getItem('use_realm') === 'true';

if (useRealm) {
  // 使用Realm
} else {
  // 使用SQLite
}
```

### 10. 完成迁移

迁移完成后，可以：

1. 删除SQLite相关代码
2. 更新文档
3. 培训团队使用Realm
4. 监控应用性能

## 总结

从SQLite迁移到Realm可以带来以下好处：

- 更简单的API
- 更好的性能
- 内置的响应式支持
- 更少的样板代码
- 更好的类型安全

遵循本指南，您可以顺利完成迁移过程。如有问题，请参考[Realm官方文档](https://docs.mongodb.com/realm/sdk/react-native/)。