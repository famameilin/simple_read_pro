import { Realm } from 'realm';

export class ParagraphComment extends Realm.Object<ParagraphComment> {
  _id!: number;
  book_id!: number;
  content?: string;
  create_time!: number;
  is_mine!: number;
  start_char!: number;
  end_char!: number;
  chapter_id?: number;

  static schema: Realm.ObjectSchema = {
    name: 'ParagraphComment',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      book_id: 'int',
      content: 'string?',
      create_time: 'int',
      is_mine: 'int',
      start_char: 'int',
      end_char: 'int',
      chapter_id: 'int?',
    },
  };
}