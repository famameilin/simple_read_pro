import {Pressable, Text, View} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {addNewBook} from '../services';
import useReadStore from '../stores';
import {stat} from 'react-native-fs';

const BookShelfItemBlack = () => {
  const {increase} = useReadStore.getState();
  const addBook = async () => {
    increase();
  };

  return (
      <View className="w-1/3 pr-4 pl-4 ">
        <Pressable onPress={addBook}>
          <View className=" h-48 rounded-md overflow-hidden ">
            <LinearGradient
              colors={['#FFF8E8', '#FEE6DE']}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
              locations={[0, 0.9]}
              className="w-full h-full flex justify-center items-center">
              <Icon name={'add-circle-outline'} size={36} color={'#84705D'} />
              <Text className="color-[#84705D]">添加更多书籍</Text>
            </LinearGradient>
          </View>
        </Pressable>
        <View className="bg-amber-600 h-12 mt-2 opacity-0">
          <Text>
            标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题
          </Text>
        </View>
        <View className="bg-amber-700 h-6 mt-1 opacity-0">
          <Text>状态栏</Text>
        </View>
      </View>
  );
};

export default BookShelfItemBlack;
