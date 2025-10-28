import {Image, Pressable, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Book, RootStackParamList} from '../types';
import {useMemo} from 'react';
import {uint8ToBase64} from '../tools';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const BookShelfItem = ({book}: {book: Book}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const cover_base64 = useMemo(() => {
    return uint8ToBase64(book.cover_file);
  }, [book.cover_file]);
  const openRead = async () => {
    navigation.navigate('Read', {bookId: book._id});
  };
  return (
      <View className="w-1/3 pr-4 pl-4">
        <Pressable onPress={openRead}>
          <View className=" h-48 rounded-md overflow-hidden ">
            {cover_base64 ? (
              <Image src={cover_base64} />
            ) : (
              <LinearGradient
                colors={['#FFF8E8', '#FEE6DE']}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}
                locations={[0, 0.9]}
                className="w-full h-full flex justify-center items-center">
                <Text className="text-2xl">
                  {book.title
                    ? book.title
                    : '未命名'}
                </Text>
              </LinearGradient>
            )}
          </View>
        </Pressable>
        <View className="h-12 mt-2">
          <Text className="h-full">{book.title ? book.title : '未命名'}</Text>
        </View>
        <View className=" h-6 mt-1 ">
          <Text>共2351章未读</Text>
        </View>
      </View>
  );
};

export default BookShelfItem;
