import { Realm } from 'realm';

export class Chapter extends Realm.Object<Chapter> {
  _id?: number;
  book_id?: number;
  title!: string;
  start_char?: number;
  end_char?: number;
  sequence!: number;
  chapter_content?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Chapter',
    primaryKey: '_id',
    properties: {
      _id: 'int?',
      book_id: 'int?',
      title: 'string',
      start_char: 'int?',
      end_char: 'int?',
      sequence: 'int',
      chapter_content: 'string?',
    },
  };
}