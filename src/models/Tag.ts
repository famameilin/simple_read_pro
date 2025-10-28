import { Realm } from 'realm';

export class Tag extends Realm.Object<Tag> {
  _id!: number;
  tag_name!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Tag',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      tag_name: 'string',
    },
  };
}