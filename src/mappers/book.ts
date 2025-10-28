import {Book, Chapter} from '../types';
import {insertChapter} from './chapter.ts';

const getAllBook = async (): Promise<Book[]> => {
  // TODO: 实现获取所有书籍的逻辑
  throw new Error('Function not implemented');
};

const insertBook = async (book: Book, chapters: Chapter[]): Promise<number> => {
  // TODO: 实现插入书籍的逻辑
  throw new Error('Function not implemented');
};

export {getAllBook, insertBook};