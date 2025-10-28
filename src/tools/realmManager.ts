import Realm from 'realm';
import { realmConfig } from '../config/realmConfig';
import { 
  Book, 
  Bookmark, 
  BookSituation, 
  Chapter, 
  Note, 
  ParagraphComment, 
  Tag, 
  UserSettings 
} from '../models/index';

// 获取Realm实例的函数
export const getRealm = async (): Promise<Realm> => {
  try {
    const realm = await Realm.open(realmConfig);
    return realm;
  } catch (error) {
    console.error('Failed to open Realm:', error);
    throw error;
  }
};

// Realm数据库管理工具类
export class RealmManager {
  private static instance: RealmManager;
  private realm: Realm | null = null;

  private constructor() {}

  // 单例模式获取实例
  static getInstance(): RealmManager {
    if (!RealmManager.instance) {
      RealmManager.instance = new RealmManager();
    }
    return RealmManager.instance;
  }

  // 初始化Realm数据库
  async initialize(): Promise<void> {
    try {
      this.realm = await getRealm();
      console.log('Realm数据库初始化成功');
    } catch (error) {
      console.error('Realm数据库初始化失败:', error);
      throw error;
    }
  }

  // 获取Realm实例
  getRealmInstance(): Realm {
    if (!this.realm) {
      throw new Error('Realm数据库未初始化,请先调用initialize()方法');
    }
    return this.realm;
  }

  // 检查表是否存在
  tableExists(tableName: string): boolean {
    const realm = this.getRealmInstance();
    return realm.schema.find(schema => schema.name === tableName) !== undefined;
  }

  // 通用查询方法
  query<T>(modelClass: string, filter?: string) {
    const realm = this.getRealmInstance();
    if (filter) {
      return realm.objects<T>(modelClass).filtered(filter);
    }
    return realm.objects<T>(modelClass);
  }

  // 根据主键查询单个对象
  findByPrimaryKey<T>(modelClass: any, primaryKey: any): T | null {
    const realm = this.getRealmInstance();
    return realm.objectForPrimaryKey<T>(modelClass, primaryKey);
  }

  // 插入单个对象
  create<T>(modelClass: any, data: any): boolean {
    const realm = this.getRealmInstance();
    let success = false;
    
    realm.write(() => {
      const createdObject = realm.create<T>(modelClass, data);
      success = createdObject !== null && createdObject !== undefined;
    });
    
    return success;
  }

  // 批量插入对象
  createMultiple<T>(modelClass: any, dataArray: any[]): number {
    const realm = this.getRealmInstance();
    const createdObjects: T[] = [];
    
    realm.write(() => {
      for (const data of dataArray) {
        createdObjects.push(realm.create<T>(modelClass, data));
      }
    });
    
    return createdObjects.length;
  }

  // 更新对象
  update<T>(modelClass: any, primaryKey: any, updateData: Partial<T>): boolean {
    const realm = this.getRealmInstance();
    let updatedObject: T | null = null;
    
    realm.write(() => {
      const object = realm.objectForPrimaryKey<T>(modelClass, primaryKey);
      if (object) {
        Object.assign(object, updateData);
        updatedObject = object;
      }
    });
    
    return updatedObject !== null;
  }

  // 删除对象
  delete<T>(modelClass: any, primaryKey: any): boolean {
    const realm = this.getRealmInstance();
    let deleted = false;
    
    realm.write(() => {
      const object = realm.objectForPrimaryKey<T>(modelClass, primaryKey);
      if (object) {
        realm.delete(object);
        deleted = true;
      }
    });
    
    return deleted;
  }

  // 删除所有匹配条件的对象
  deleteAll<T>(modelClass: any, filter?: string): number {
    const realm = this.getRealmInstance();
    let deletedCount = 0;
    
    realm.write(() => {
      const objects = filter ? 
        realm.objects<T>(modelClass).filtered(filter) : 
        realm.objects<T>(modelClass);
      
      deletedCount = objects.length;
      realm.delete(objects);
    });
    
    return deletedCount;
  }

  // 开始事务
  beginTransaction(): void {
    const realm = this.getRealmInstance();
    realm.beginTransaction();
  }

  // 提交事务
  commitTransaction(): void {
    const realm = this.getRealmInstance();
    realm.commitTransaction();
  }

  // 回滚事务
  cancelTransaction(): void {
    const realm = this.getRealmInstance();
    realm.cancelTransaction();
  }

  // 在事务中执行操作
  transaction<T>(action: () => T): T {
    const realm = this.getRealmInstance();
    return realm.write(() => action());
  }

  // 压缩数据库
  compact(): boolean {
    const realm = this.getRealmInstance();
    return realm.compact();
  }

  // 关闭数据库
  close(): void {
    if (this.realm) {
      this.realm.close();
      this.realm = null;
    }
  }

  // 获取数据库文件路径
  getPath(): string {
    const realm = this.getRealmInstance();
    return realm.path;
  }

  // 获取数据库大小（字节）
  getSize(): Promise<number> {
    return new Promise((resolve, reject) => {
      const realm = this.getRealmInstance();
      const fs = require('react-native-fs');
      
      fs.stat(realm.path)
        .then((result: any) => resolve(result.size))
        .catch((error: any) => reject(error));
    });
  }
}

// 导出单例实例
export default RealmManager.getInstance();