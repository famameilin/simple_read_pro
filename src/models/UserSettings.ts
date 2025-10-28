import { Realm } from 'realm';

export class UserSettings extends Realm.Object<UserSettings> {
  _id!: number;
  font_size?: number;
  font_family?: string;
  background_color?: string;
  theme?: 'light' | 'dark' | 'sepia';
  char_spacing?: number;
  page_turn_mode?: 'swipe' | 'simulation' | 'scroll_x' | 'scroll_y';
  line_height?: number;
  created_time?: number;
  updated_time?: number;
  page_spacing_top?: number;
  page_spacing_left?: number;
  page_spacing_bottom?: number;
  page_spacing_right?: number;
  font_weight?: number;

  static schema: Realm.ObjectSchema = {
    name: 'UserSettings',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      font_size: 'int?',
      font_family: 'string?',
      background_color: 'string?',
      theme: 'string?',
      char_spacing: 'int?',
      page_turn_mode: 'string?',
      line_height: 'int?',
      created_time: 'int?',
      updated_time: 'int?',
      page_spacing_top: 'int?',
      page_spacing_left: 'int?',
      page_spacing_bottom: 'int?',
      page_spacing_right: 'int?',
      font_weight: 'int?',
    },
  };
}