import { Realm } from 'realm';

export class Note extends Realm.Object<Note> {
  _id!: number;
  start_char!: number;
  end_char?: number;
  color!: string;
  content?: string;
  create_time?: number;
  read_count!: number;
  chapter_id?: number;

  static schema: Realm.ObjectSchema = {
    name: 'Note',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      start_char: 'int',
      end_char: 'int?',
      color: 'string',
      content: 'string?',
      create_time: 'int?',
      read_count: 'int',
      chapter_id: 'int?',
    },
  };
}