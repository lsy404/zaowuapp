import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    FlatList,
    Dimensions,
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
//默认应用的容器组件
var width = Dimensions.get('window').width;
var url='http://192.168.1.106:8080';
export default class classify extends Component {
    //构造函数
    navigationOptions:{
          header:null,
            }
    constructor(props) {
        super(props);
        this.state = {
            tabs:[
                                 {"id": "0","name": '户外探险',url:require('../img/户外探险.png')},
                                 {"id": "1","name": "办公需求",url:require('../img/办公.png')},
                                 {"id": "2","name": "家居",url:require('../img/家居.png')},
                                 {"id": "3","name": "课堂教学",url:require('../img/课堂教学.png')},
                                 {"id": "4","name": "厨房",url:require('../img/厨房.png')},
                                 {"id": "5","name": "实验室|工作坊",url:require('../img/实验室.png')},
                                 {"id": "6","name": "3D打印",url:require('../img/3D打印.png')},
                                 {"id": "7","name": "影音处理",url:require('../img/影音.png')},
                                 {"id": "8","name": "机器视觉",url:require('../img/机器视觉.png')},
                                 {"id": "9","name": "无线",url:require('../img/无线.png')},
                                 {"id": "10","name": "通信",url:require('../img/通信.png')},
                                 {"id": "11","name": "电子制作",url:require('../img/电子.png')},
                                 {"id": "12","name": "可穿戴",url:require('../img/穿戴设备.png')},
                                 {"id": "13","name": "网站开发",url:require('../img/网站开发.png')},
                                 {"id": "14","name": "激光切割",url:require('../img/激光切割.png')},
                                 {"id": "15","name": "三维建模",url:require('../img/三维建模.png')},
                                 {"id": "16","name": "人工智能",url:require('../img/人工智能.png')},
                                 {"id": "17","name": "木工",url:require('../img/木工.png')},
                                 {"id": "18","name": "折纸",url:require('../img/折纸.png')},
                                 {"id": "19","name": "缝纫",url:require('../img/缝纫机.png')},
                                 {"id": "20","name": "园艺",url:require('../img/园艺.png')},
                                 {"id": "21","name": "飞行器",url:require('../img/飞行器.png')},
                                 {"id": "22","name": "机械人",url:require('../img/机器人.png')},
                                 {"id": "23","name": "CNC",url:require('../img/CNC.png')},
                                 {"id": "24","name": "生物技术",url:require('../img/生物技术.png')},
                                 {"id": "25","name": "汽修",url:require('../img/汽修汽配.png')},
                                 {"id": "26","name": "春节",url:require('../img/春节.png')},
                                 {"id": "27","name": "元宵节",url:require('../img/元宵节.png')},
                                 {"id": "28","name": "情人节",url:require('../img/情人节.png')},
                                 {"id": "29","name": "清明节",url:require('../img/清明节.png')},
                                 {"id": "30","name": "端午节",url:require('../img/端午节.png')},
                                 {"id": "31","name": "中秋节",url:require('../img/中秋节.png')},
                                 {"id": "32","name": "七夕",url:require('../img/七夕.png')},
                                 {"id": "33","name": "万圣节",url:require('../img/万圣节.png')},
                                 {"id": "34","name": "圣诞节",url:require('../img/圣诞节.png')},
                                 {"id": "35","name": "教师节",url:require('../img/教师节.png')},
                                 {"id": "36","name": "儿童节",url:require('../img/儿童节.png')},
                                 {"id": "37","name": "婴幼儿",url:require('../img/婴幼儿.png')},
                                 {"id": "38","name": "儿童",url:require('../img/儿童.png')},
                                 {"id": "39","name": "特殊人群",url:require('../img/特殊人群.png')},
                                 {"id": "40","name": "老人",url:require('../img/老人.png')},
                                 {"id": "41","name": "宠物",url:require('../img/宠物.png')},
                                 {"id": "42","name": "中美青年创客大赛",url:require('../img/创客.png')},
                                 {"id": "43","name": "hackathon",url:require('../img/黑客.png')},
                                 {"id": "44","name": "makerfaire",url:require('../img/makerfaire.png')}
            ],
            csrftoken:null,
        };
    }
    onload(name){
        this.props.navigation.navigate('getbytags',name);
    }
    //渲染
    render() {
        return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View style={styles.container}>
                <Text  style={{marginBottom:10,marginTop:10,width:width/5,textAlign:'center'}}>场景</Text>
                <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                {this.tagtab(0,5)}
                <Text  style={{marginBottom:10,marginTop:10,width:width/5,textAlign:'center'}}>技术</Text>
                <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                {this.tagtab(6,25)}
                <Text  style={{marginBottom:10,marginTop:10,width:width/5,textAlign:'center'}}>节日</Text>
                <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                {this.tagtab(26,36)}
                <Text  style={{marginBottom:10,marginTop:10,width:width/5,textAlign:'center'}}>人群</Text>
                <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                {this.tagtab(37,41)}
                <Text  style={{marginBottom:10,marginTop:10,width:width/5,textAlign:'center'}}>活动</Text>
                <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                {this.tagtab(42,44)}
            </View>
        </ScrollView>
        )
    }
    tagtab(a,b)
    {
        var tagData = this.state.tabs;
        let len =tagData.length;
        let TagArr=[];
        for (let i = a; i <= b; i++) {
             let item = tagData[i];
             TagArr.push(
                 <TouchableOpacity
                       onPress={() => this.onload(item.name)} >
                       <Image source={item.url} style={{marginTop:30,marginLeft:30,marginBottom:2,height: (width-150)/4, width:(width-150)/4}}/>
                       <Text style={styles.title} >{item.name}</Text>
                 </TouchableOpacity>
             )
        }
        return (
            <View style={{flexDirection: "row",flexWrap:'wrap',}}>
                {TagArr}
            </View>
        )
    }
}

//样式定义
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Colors.white
    },
    content:{
        margin:20,
        width:122,
        borderRadius:5,
        backgroundColor: Colors.white
    },
    title:{
        marginBottom:20,
        marginLeft:30,
        textAlign:'center',
    },
    imgStyle: {
            width:96,
            height:123,
            borderRadius:5
    }
});