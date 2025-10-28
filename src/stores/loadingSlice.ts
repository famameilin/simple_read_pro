import {StateCreator} from 'zustand/vanilla';
import {LoadingStore} from '../types';

const LoadingSlice:StateCreator<LoadingStore> = (set): LoadingStore => ({
  loading: false,
  title: '',
  setLoading: (loading: boolean) => set({loading}),
  setTitle: (title: string) => set({title}),
});

export default LoadingSlice;
