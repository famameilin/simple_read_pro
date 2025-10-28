import React, {useState} from 'react';
import { Pressable, Text, View } from 'react-native';
import {useRoute} from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

interface TabItem {
    name: string;
    href: string;
    iconName: string;
    iconNameOutline: string;
}

const TABS: TabItem[] = [
    {
        name: '首页',
        href: 'BookShelf',
        iconName: 'book',
        iconNameOutline: 'book-outline',
    },
    {
        name: '推荐',
        href: 'Recommend',
        iconName: 'cube',
        iconNameOutline: 'cube-outline',
    },
    {
        name: '我的',
        href: 'Home',
        iconName: 'home',
        iconNameOutline: 'home-outline',
    },
];

const CustomTabs = ({navigation}: BottomTabBarProps) => {
  const route = useRoute();
  const [activeIndex, setActiveIndex] = useState(0);
  const onPressTab = (tab: TabItem, isActive: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isActive && !event.defaultPrevented) {
      navigation.navigate(tab.href, route.params);
      setActiveIndex(TABS.indexOf(tab));
    }
  };
  return (
    <View className="flex-row justify-around items-center h-16 bg-white shadow-2xl">
      {TABS.map((tab, index) => {
        const isActive = activeIndex === index;
          return (
          <Pressable
            key={tab.href}
            onPress={() => onPressTab(tab, isActive)}
            className="flex-1 items-center justify-center py-2 active:opacity-70">
            <Icon
              name={(isActive ? tab.iconName : tab.iconNameOutline) as any}
              size={26}
              color={isActive ? '#2563eb' : '#6b7280'}
            />
            <Text
              className={`text-xs mt-1 ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default CustomTabs;
