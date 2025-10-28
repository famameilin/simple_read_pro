import Realm from 'realm';
import { realmModels } from '../models/index';

// Realm数据库配置
export const realmConfig: Realm.Configuration = {
  schema: realmModels,
  schemaVersion: 1,
  // 如果需要迁移，可以在这里添加迁移逻辑
  onMigration: (oldRealm, newRealm) => {
    // 这里可以处理数据迁移的逻辑
    // 通常需要一次性迁移脚本
    console.log('Realm migration started');
    
    // 示例：从旧版本迁移数据
    if (oldRealm.schemaVersion < 1) {
      // 迁移逻辑
      const oldBooks = oldRealm.objects('Book');
      const newBooks = newRealm.objects('Book');
      
      // 这里可以添加具体的数据迁移逻辑
    }
  },
  
  // 可选：数据库文件路径
  // path: 'myApp.realm',
  
  // 可选：是否在启动时压缩数据库
  shouldCompact: (totalSize, usedSize) => {
    // 当数据库使用率低于50%时压缩
    return (usedSize / totalSize) < 0.5;
  },
  
  // 可选：如果迁移需要，可以删除旧数据库
  // deleteRealmIfMigrationNeeded: true,
};

// 默认导出配置
export default realmConfig;