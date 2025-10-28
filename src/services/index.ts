import {
  DocumentPickerResponse, pick,
  types,
} from '@react-native-documents/picker';
import {analysisTextChapter, getUtf8Content, saveFileInDocument} from '../tools';
import {getAllBook, getAllChaptersByBook, insertBook} from '../mappers';
import useReadStore from '../stores';
import { Book, Chapter } from '../types';

const addNewBook = async () => {
  const {setLoading} = useReadStore.getState();
  console.log("open");
  const files = await pick({
    type: types.plainText,
    allowMultiSelection: false,
  });
  console.log(files);
  setLoading(true);
  for (const file of files) {
    if (file.type === 'text/plain') {
      await addText(file);
    }
  }
  setLoading(false);
};

const getAllBooks = async () => {
  return await getAllBook();
};

const addText = async (file: DocumentPickerResponse ) => {
  // const newFile = await saveFileInDocument(file.uri);
  const result = await getUtf8Content(file.uri);
  const chapterDataList = analysisTextChapter(result);
  
  // 创建Book对象（只包含必要的字段）
  const book: Partial<Book> = {
    type:'novel',
    mime_type:'text/plain',
    title: file.name || '未命名',
    file_path:file.uri,
  };
  
  // 将ChapterData转换为Chapter对象（只包含必要的字段）
  const chapters: Partial<Chapter>[] = chapterDataList.map(data => ({
    title: data.title || '',
    sequence: data.sequence || 0,
    start_char: data.start_char || 0,
    end_char: data.end_char || 0,
    chapter_content: data.chapter_content || '',
  }));
  
  await insertBook(book as Book, chapters as Chapter[]);
};

const getAllChapters = async (bookId: number) => {
  return await getAllChaptersByBook(bookId);
};

export {addNewBook,getAllBooks,getAllChapters};
