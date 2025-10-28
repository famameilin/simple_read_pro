import { Book } from './Book';
import { Bookmark } from './Bookmark';
import { BookSituation } from './BookSituation';
import { Chapter } from './Chapter';
import { Note } from './Note';
import { ParagraphComment } from './ParagraphComment';
import { Tag } from './Tag';
import { UserSettings } from './UserSettings';

// 导出所有Realm模型类
export { Book } from './Book';
export { Bookmark } from './Bookmark';
export { BookSituation } from './BookSituation';
export { Chapter } from './Chapter';
export { Note } from './Note';
export { ParagraphComment } from './ParagraphComment';
export { Tag } from './Tag';
export { UserSettings } from './UserSettings';

// 导出所有模型类数组，方便在Realm配置中使用
export const realmModels = [
  Book,
  Bookmark,
  BookSituation,
  Chapter,
  Note,
  ParagraphComment,
  Tag,
  UserSettings,
];