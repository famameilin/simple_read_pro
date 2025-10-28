import {StatusBar, View} from "react-native";
import {useEffect, useState} from "react";

const StatusBarPlaceholder=()=>{
    const [statusBarHeight,setStatusBarHeight] = useState(StatusBar.currentHeight||0);
    useEffect(()=>{
        setStatusBarHeight(StatusBar.currentHeight || 0);
        StatusBar.setBarStyle('dark-content');
    },[]);
    return (
        <View className="bg-transparent flex" style={{
            height:statusBarHeight,
        }}></View>
    );
}

export default StatusBarPlaceholder;
