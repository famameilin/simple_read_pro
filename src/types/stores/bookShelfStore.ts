import {Book} from '../../models';

interface BookShelfStore {
  books:Book[],
  increase:()=>void,
  decrease:(book:number[])=>void,
  alter:(book:Book)=>void,
  fetchBooks:()=>void
}
export type {BookShelfStore};
