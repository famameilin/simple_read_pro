import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useEffect, useState} from 'react';
import {getAllChapters} from '../services';
import {Chapter} from '../types';
import StatusBarPlaceholder from '../components/statusBarPlaceholder.tsx';
import ReadChapterList from '../components/ReadChapterList.tsx';

const Read = ({route}: {route: any}) => {
  const {bookId} = route.params;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter>(chapters[0]);
  const [showChapterList, setShowChapterList] = useState(false);
  console.log(bookId);
  useEffect(() => {
    async function fetchChapters() {
      const result = await getAllChapters(bookId);
      setChapters(result);
      setCurrentChapter(result[0]);
    }

    fetchChapters();
  }, [bookId]);
  return (
      <View className="h-full w-full">
        <StatusBarPlaceholder />
        <View className="flex justify-between items-center p-4">
          <Text>{currentChapter?.title}</Text>
          <TouchableOpacity
            onPress={() => setShowChapterList(true)}
            className="ml-4 px-3 py-1.5 bg-blue-100 rounded-lg">
            <Text className="text-blue-800 text-sm">目录</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text className="p-2 pt-0 pb-0">{currentChapter?.chapter_content}</Text>
        </ScrollView>
        <View className="h-4 w-full"></View>
        {showChapterList && (
          <ReadChapterList
            chapters={chapters}
            onClose={() => setShowChapterList(false)}
            onSelectChapter={setCurrentChapter}
          />
        )}
      </View>
  );
};

export default Read;
