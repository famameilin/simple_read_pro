import {Pressable, Text, View} from 'react-native';
import {useState} from 'react';

const BookShelfNavBar = ({onSwiper }:{onSwiper:(index:number,prevIndex:number)=>void})=>{
  const [activeIndex,setActiveIndex] = useState(0);
  const tabs = ['最近','小说','漫画','历史'];
  return (
    <View className="flex flex-row items-end mt-3 h-9 ml-4">
      {
        tabs.map((tab,index)=>{
          return (
            <Pressable
              key={index}
              onPress={() => {
                console.log("press")
                onSwiper(index,activeIndex);
                setActiveIndex(index);
              }}>
              <Text
                className={`w-16 transition-all  ${
                  activeIndex === index
                    ? 'text-2xl color-[#3071FF] font-black'
                    : 'text-xl color-[#7E8A8C]'
                }`}>
                {tabs[index]}
              </Text>
            </Pressable>
          );
        })
      }
    </View>
  );
};

export default BookShelfNavBar;
