import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Swiper from 'react-native-swiper';
//默认应用的容器组件
var width = Dimensions.get('window').width;
var url='http://101.201.237.173:8082';
export default class want extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            user_id:null,
            csrftoken:null,
            success:null,
            get:1,
        };
    }
    onload(){
            fetch(url+'/')
            .then((response) => {return response.text();})
            .then((responseData) => {
                 var csrf=responseData;
                 var split1=csrf.split("csrf:'");
                 var split2=split1[1].split("'");
                 var csrftoken=split2[0];
                 this.setState({csrftoken});
                 split1=csrf.split("href=\"/u/");
                 split2=split1[1].split("\">");
                 var user_id=split2[0];
                 this.setState({user_id});
                 let params = {
                                       user_id:user_id,
                                       skip:0,
                                       limit:10,
                                       _csrf:csrftoken,
                 };
                 fetch(url+'/u/wantToMake',{
                       method: 'POST',
                       headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                       },
                       body: JSON.stringify(params),
                       }).then((response) => {
                            return response.json();
                       }).then((json) => {
                            this.setState({success:json.success});
                            return json.data;
                       }).then((data) => {
                            this.setState({data:data});
                       }).catch((error) => {
                       });
            }).catch((error) => {
            });
    }
    //渲染
    _renderItemView(item){
            //console.log(item.index);
            //console.log(item);
            var uri=url+item.item.cover_pic_card;
            return (
              <TouchableOpacity style={styles.content} onPress={this.doFetch1.bind(this,item)}>
                  <Image  style={styles.imgStyle} source={{uri:uri}}/>
                  <Text style={styles.title} >{item.item.title}</Text>
                  <Text style={{color:'#4d4d4d',flexWrap:'wrap'}} >创客:{item.item.owner.profile.nickname}</Text>
              </TouchableOpacity>
            )
          }
    doFetch1(item){
        this.props.navigation.navigate('项目详情',{item:item});
    }
    render() {
        if(this.state.get){this.onload();var get=0;this.setState({get});}
        if(this.state.data.length>0)
        return (
            <View style={styles.container}>
                <FlatList
                     data = {this.state.data}
                     renderItem={(item)=>this._renderItemView(item)}
                     numColumns={3}
                     columnWrapperStyle={{alignItems:'center'}}
                />
            </View>
        )
        else if(this.state.success==true)
        return (
            <View style={styles.container}>
                 <TouchableOpacity  style={{alignItems:'center',marginTop:250,height:'100%',width: '100%'}}>
                     <Text style={{marginTop:5}} >空空如也</Text>
                 </TouchableOpacity>
            </View>
        )
        else return(
            <TouchableOpacity  style={{alignItems:'center',marginTop:250,height:'100%',width: '100%'}}>
                 <ActivityIndicator size={'large'}/>
                 <Text style={{marginTop:5}} >数据加载中</Text>
            </TouchableOpacity>
        )
    }
}

//样式定义
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    content:{
            marginTop:10,
            marginLeft:10,
            width:width/3-15,
            borderRadius:5,
            backgroundColor: Colors.white
        },
    item:{
            margin:5,
            marginBottom:10,
            height: 40,
            borderRadius:20,
            flexDirection: "row",
            backgroundColor:"#f3f3f3",
        },
    title:{
            borderBottomLeftRadius:5,
            borderBottomRightRadius:5,
            backgroundColor: Colors.white
        },
        imgStyle: {
            width:width/3-15,
            height:(width/3-15)/96*123,
            borderTopLeftRadius:5,
            borderTopRightRadius:5,
        }
});