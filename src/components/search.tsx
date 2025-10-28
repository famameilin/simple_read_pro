import {Text, View} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

const Search = () => {
  return (
    <View className="flex flex-row items-center bg-white p-2 m-2 mr-4 ml-4 shadow-2xl rounded-lg">
      <View className="mr-4">
        <Icon name="search" size={24} color="#7E858C" />
      </View>
      <View>
        <Text className="color-[#7E858C]">搜索书籍或作者</Text>
      </View>

    </View>
  );
};

export default Search;
