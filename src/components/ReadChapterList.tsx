// 更新导入部分，增加 FlatList
import { Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Chapter } from '../types';

const ReadChapterList = ({
                           chapters,
                           onClose,
                           onSelectChapter,
                         }: {
  chapters: Chapter[];
  onClose: () => void;
  onSelectChapter: (chapter: Chapter) => void;
}) => (
  <Modal transparent animationType="fade" onRequestClose={onClose}>
    <View className="absolute inset-0 bg-black/30" onTouchEnd={onClose}>
      <View
        className="mt-20 mx-4 bg-white rounded-lg shadow-lg max-h-[70vh]"
        onTouchStart={e => e.stopPropagation()}>
        {/* 用 FlatList 替换 ScrollView */}
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.sequence.toString()}
          renderItem={({ item: chapter }) => (
            <TouchableOpacity
              className="px-4 py-3 border-b border-gray-100"
              onPress={() => {
                onSelectChapter(chapter);
                onClose();
              }}>
              <Text
                className="text-base"
                numberOfLines={1}
                ellipsizeMode="tail">
                {chapter.sequence}. {chapter.title}
              </Text>
            </TouchableOpacity>
          )}
          // 优化性能的配置项
          initialNumToRender={15}       // 初始渲染数量
          maxToRenderPerBatch={5}       // 每批渲染数量
          windowSize={21}               // 渲染窗口大小
          removeClippedSubviews={true}  // 移除不可见子组件
          // 样式保持与原来一致
          contentContainerStyle={{
            paddingVertical: 8
          }}
        />
      </View>
    </View>
  </Modal>
);
export default ReadChapterList;