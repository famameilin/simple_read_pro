import {create} from 'zustand';
import {BookShelfStore, LoadingStore} from '../types';
import BookShelfSlice from './bookShelfSlice.ts';
import LoadingSlice from './loadingSlice.ts';

const useReadStore = create<BookShelfStore & LoadingStore>()((...args)=>({
  ...BookShelfSlice(...args),
  ...LoadingSlice(...args),
}));
useReadStore.getState().fetchBooks();
export  default useReadStore;
