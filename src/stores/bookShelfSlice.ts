import {BookShelfStore} from '../types';
import {addNewBook, getAllBooks} from '../services';
import {StateCreator} from 'zustand/vanilla';

const BookShelfSlice:StateCreator<BookShelfStore> = (set): BookShelfStore => ({
  books: [],
  decrease: book => {},
  increase: async () => {
    await addNewBook();
    const book = await getAllBooks();
    console.log(book);
    set({books: book});
  },
  alter: book => {},
  fetchBooks: async () => {
    const book = await getAllBooks();
    set({books: book});
  },
});

export default BookShelfSlice;
