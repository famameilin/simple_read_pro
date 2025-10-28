import React, {useRef} from 'react';
import {Text, View} from 'react-native';
import StatusBarPlaceholder from '../components/statusBarPlaceholder';
import Search from '../components/search.tsx';
import LinearGradient from 'react-native-linear-gradient';
import BookShelfNavBar from '../components/bookShelfNavBar.tsx';
import Swiper from 'react-native-swiper';
import BookShelfRecent from '../components/BookShelfRecent.tsx';

const BookShelf = () => {

  const swiperRef = useRef<Swiper>(null);

  function onSwiperSlide(index: number,prevIndex: number) {
    swiperRef.current!.scrollBy(index - prevIndex );
  }

  return (
    // #F6F8F9 #FAFCFF
    <LinearGradient
      colors={['#FCFCFF', '#F0F5FF']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      locations={[0, 0.4]}
      className="flex-1">
      <View className="flex-1 ">
        <StatusBarPlaceholder />
        <Search />
        <BookShelfNavBar
          onSwiper={onSwiperSlide}
        />
        <View className="flex-1">
          <Swiper showsButtons={false} showsPagination={false}  ref={swiperRef} scrollEnabled={false} >
            <View className="flex-1">
              <BookShelfRecent />
            </View>
            <View className="flex-1 ml-2 mr-2">
              <Text>小说</Text>
            </View>
            <View className="flex-1 ml-2 mr-2">
              <Text>漫画</Text>
            </View>
            <View className="flex-1 ml-2 mr-2">
              <Text>历史</Text>
            </View>
          </Swiper>
        </View>
      </View>
    </LinearGradient>
  );
};
export default BookShelf;
