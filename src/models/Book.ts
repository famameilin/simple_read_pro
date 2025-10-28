import { Realm } from 'realm';

export class Book extends Realm.Object<Book> {
  _id!: number;
  title?: string | null;
  type?: 'novel' | 'comic';
  file_path?: string;
  cover_file?: Uint8Array;
  mime_type?: string;
  author?: string;
  description?: string;
  create_time?: number;
  update_time?: number;

  static schema: Realm.ObjectSchema = {
    name: 'Book',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      title: 'string?',
      type: 'string?',
      file_path: 'string?',
      cover_file: 'data?', // Uint8Array is stored as data
      mime_type: 'string?',
      author: 'string?',
      description: 'string?',
      create_time: 'int?',
      update_time: 'int?',
    },
  };
}