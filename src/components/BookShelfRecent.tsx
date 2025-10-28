import {ScrollView, View} from 'react-native';
import BookShelfItemBlack from './BookShelfItemBlack.tsx';
import {Book} from '../types';
import useReadStore from '../stores';
import BookShelfItem from './BookShelfItem.tsx';

const BookShelfRecent = () => {

  const books = useReadStore((state)=>state.books);

  return (
<ScrollView>
  <View className="flex flex-row flex-wrap justify-between pt-4 gap-y-6">
    {books.map((book: Book, index: number) => (
      <BookShelfItem book={book} key={index} />
    ))}
    <BookShelfItemBlack/>
  </View>
</ScrollView>
  );
};
export default BookShelfRecent;
