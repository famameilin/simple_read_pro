import { Realm } from 'realm';

export class BookSituation extends Realm.Object<BookSituation> {
  _id!: number;
  book_id!: number;
  first_read_time?: number;
  last_read_time?: number;
  read_time_count?: number;
  current_char!: number;

  static schema: Realm.ObjectSchema = {
    name: 'BookSituation',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      book_id: 'int',
      first_read_time: 'int?',
      last_read_time: 'int?',
      read_time_count: 'int?',
      current_char: 'int',
    },
  };
}