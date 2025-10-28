import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookShelf from '../views/bookShelf';
import Home from '../views/home';
import Recommend from '../views/recommend';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabs from '../components/customTabs.tsx';
import Read from '../views/read.tsx';

const tabNavigator = createBottomTabNavigator({
    tabBar:(props)=>(<CustomTabs {...props} />),
    initialRouteName: 'BookShelf',
    screenOptions: {
        headerShown: false,
        animation: 'fade',
    },
    screens: {
        BookShelf: BookShelf,
        Home: Home,
        Recommend: Recommend,
    },
});
const RootStack = createNativeStackNavigator({
    screenOptions:{
        headerShown: false,
    },
    screens:{
        Tab: tabNavigator,
        Read:Read,
    },
});
const Navigation = createStaticNavigation(RootStack);
export default Navigation;
