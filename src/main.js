import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ImageBackground ,
    FlatList,
    Dimensions,
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Swiper from 'react-native-swiper';
//默认应用的容器组件
var width = Dimensions.get('window').width;
var url='http://192.168.1.106:8080';
export default class main extends Component {
    //构造函数
    navigationOptions:{
          header:null,
            }
    constructor(props) {
        super(props);
        this.props.navigation.navigate('signin');
        this.state = {
            responseText:null,
            text:null,
            data:[],
            get:1,
            csrftoken:null,
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
                  let params = {
                        skip:0,
                        limit:10,
                        _csrf:csrftoken,
                  };
                  fetch(url+'/zaos',{
                       method: 'POST',
                       headers: {
                             Accept: 'application/json',
                             'Content-Type': 'application/json',
                       },
                       body: JSON.stringify(params),
                  }).then((response) => {
                       return response.json();
                  }).then((json) => {
                       return json.data;
                  }).then((data) => {
                       this.setState({data});
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
    doFetch2(){
        this.props.navigation.navigate('创建项目');
    }
    search(text){
        if(text.length>0)
        {
            let params = {
                 keyword:text,
                  _csrf:this.state.csrftoken,
             };
             fetch(url+'/search',{
                   method: 'POST',
                   headers: {
                       Accept: 'application/json',
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify(params),
              }).then((response) => {
                    return response.json();
             }).then((json) => {
                    return json.data.posts;
             }).then((data) => {
                   this.setState({data});
             }).catch((error) => {
             });
        }
        else{this.onload();}
    }
    render() {
        let item = this.props.navigation.state.params;
        if(this.state.get||item){this.onload();var get=0;this.setState({get});this.props.navigation.state.params=0}
        return (
            <View style={styles.container}>
                <View style={{backgroundColor: Colors.white}}>
                    <View style={styles.item}>
                        <Image source={require('../img/搜索.png')} style={{margin:10,marginRight:5,height: 20, width: 20}}/>
                        <TextInput style={{}}
                            placeholder="搜索"
                            allowFontScaling={false}
                            onChangeText={(text) => this.search(text)}
                        />
                    </View>
                </View>
                <View style={{width:width}} height={width*60/192 }>
                <Swiper style={{width:width}} height={width*60/192 }  showsButtons={false} autoplay={true}
                    paginationStyle={{bottom: 6}}
                    dotStyle={{width: 22,height: 3,backgroundColor:'#fff',opacity: 0.4, borderRadius: 0 }}
                    activeDotStyle={{width: 22,height: 3,backgroundColor:'#fff',borderRadius: 0}}>
                   <Image source={{uri:url+'/public/img/page/slider/1.jpg'}} style={{width:width,height:width/192*60}} />
                   <Image source={{uri:url+'/public/img/page/slider/2.jpg'}} style={{width:width,height:width/192*60}} />
                   <Image source={{uri:url+'/public/img/page/slider/3.jpg'}} style={{width:width,height:width/192*60}} />
                   <Image source={{uri:url+'/public/img/page/slider/4.jpg'}} style={{width:width,height:width/192*60}} />
                   <Image source={{uri:url+'/public/img/page/slider/5.jpg'}} style={{width:width,height:width/192*60}} />
                </Swiper>
                </View>
                <Text style={{marginTop:10,margin:5,height: 40,padding:10,textAlign:'center',backgroundColor: Colors.white}} onPress={this.doFetch2.bind(this)}>新建</Text>

                <FlatList
                     data = {this.state.data}
                     renderItem={(item)=>this._renderItemView(item)}
                     numColumns={3}
                     columnWrapperStyle={{alignItems:'center'}}
                />
            </View>
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