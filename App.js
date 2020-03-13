/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Image
} from 'react-native';
import {
  createAppContainer
} from "react-navigation";
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import signin from './src/signin';
import main from './src/main';
import details from './src/details';

/**
 * 配置底部标签
 */
const Tab = createBottomTabNavigator({
    //每一个页面的配置
    signin: {
                  screen: signin,
                  navigationOptions: ({navigation}) => ({
                        header:null,
                        tabBarLabel: '登录',
                        tabBarVisible:false,
                        header:null,
                        tabBarIcon: ({tintColor}) => (
                               <Image source={require('./img/card_checked.png')}
                                      style={[{height: 24, width: 24}, {tintColor: tintColor}]}/>
                        ),

                  }),
            },
    main: {
          screen: main,
          navigationOptions: ({navigation}) => ({
                header:null,
                tabBarLabel: '主页',
                tabBarVisible:true,
                tabBarIcon: ({tintColor}) => (
                       <Image source={require('./img/card_checked.png')}
                              style={[{height: 24, width: 24}, {tintColor: tintColor}]}/>
                ),

          }),
    },

}, {
    //设置TabNavigator的位置
    tabBarPosition: 'bottom',
    //是否在更改标签时显示动画
    animationEnabled: true,
    //是否允许在标签之间进行滑动
    swipeEnabled: true,
    //按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    backBehavior: "none",
    //设置Tab标签的属性

    tabBarOptions: {
        //Android属性
        upperCaseLabel: false,//是否使标签大写，默认为true
        //共有属性
        showIcon: true,//是否显示图标，默认关闭
        showLabel: true,//是否显示label，默认开启
        activeTintColor: '#EB3695',//label和icon的前景色 活跃状态下（选中）
        inactiveTintColor: 'gray',//label和icon的前景色 活跃状态下（未选中）
        style: { //TabNavigator 的背景颜色
            backgroundColor: 'white',
            height: 55,
        },
        indicatorStyle: {//标签指示器的样式对象（选项卡底部的行）。安卓底部会多出一条线，可以将height设置为0来暂时解决这个问题
            height: 0,
        },
        labelStyle: {//文字的样式
            fontSize: 13,
            marginTop: -5,
            marginBottom: 5,
        },
        iconStyle: {//图标的样式
            marginBottom: 5,
        }
    },
  });

  /*
 * 配置堆栈导航
 */
const Stack = createStackNavigator({
    Tab: {
        screen: Tab,
    },
    main: {
        screen: main,
        },
    details: {
        screen: details,
    },
    signin: {
        screen: signin,
        navigationOptions:{
              header:null,
        }
    },

});

/**
 * 配置侧滑菜单
 */
const Drawer = createDrawerNavigator({
    Main: {
        screen: Stack,
        navigationOptions: {
            drawerLabel: '首页',
            drawerIcon: ({tintColor}) => (
                <Image
                    source={require('./img/card_checked.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        }
    },

}, {
    drawerWidth: 250, // 展示的宽度
    drawerPosition: 'left', // 抽屉在左边还是右边
    // contentOptions: {
    //     // activeTintColor: 'black',  // 选中文字颜色
    //     activeBackgroundColor: '#fff', // 选中背景颜色
    //     inactiveTintColor: '#EB3695',  // 未选中文字颜色
    //     inactiveBackgroundColor: '#fff', // 未选中背景颜色
    //     style: {  // 样式
    //
    //     }
    // },
  });

const AppContainer = createAppContainer(Drawer);

export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  }
});
