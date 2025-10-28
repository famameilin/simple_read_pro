interface LoadingStore {
  loading: boolean,
  title:string,
  setLoading: (loading: boolean) => void,
  setTitle: (title: string) => void
};

export type {LoadingStore};
