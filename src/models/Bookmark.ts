import { Realm } from 'realm';

export class Bookmark extends Realm.Object<Bookmark> {
  _id!: number;
  book_id!: number;
  location_char!: number;
  created_time!: number;
  read_count?: number;
  chapter_id?: number;

  static schema: Realm.ObjectSchema = {
    name: 'Bookmark',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      book_id: 'int',
      location_char: 'int',
      created_time: 'int',
      read_count: 'int?',
      chapter_id: 'int?',
    },
  };
}