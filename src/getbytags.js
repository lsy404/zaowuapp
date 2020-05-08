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
export default class getbytags extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            name:null,
            success:null,
            csrftoken:null,
        };
    }
    onload(){
            let name=this.props.navigation.state.params;
                    fetch(url+'/')
                    .then((response) => {return response.text();})
                    .then((responseData) => {
                          var csrf=responseData;
                          var split1=csrf.split("csrf:'");
                          var split2=split1[1].split("'");
                          var csrftoken=split2[0];
                          this.setState({csrftoken});
                          let params = {
                                tag:name,
                                skip:0,
                                limit:10,
                                sort:'agree_down',
                                _csrf:csrftoken,
                          };
                          fetch(url+'/p/getByTags',{
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
                               this.setState({data});
                               this.setState({name});
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
              <Image style={styles.imgStyle} source={{uri:uri}}></Image>
              <Text style={styles.title} >{item.item.title}</Text>
          </TouchableOpacity>
        )
      }
    doFetch1(item){
        this.props.navigation.navigate('项目详情',{item:item});
    }
    back()
    {
        this.props.navigation.navigate('classify');
    }
    render() {
        let item = this.props.navigation.state.params;
        if(item!=this.state.name){this.setState({name:item});this.onload();}
        if(item===this.state.name&&this.state.data.length>0)
        return (
            <View style={styles.container}>
                <View style={{ elevation:5,height:55,flexDirection: "row",width:width,backgroundColor: Colors.white}}>
                    <TouchableOpacity style={{margin:20}} onPress={this.back.bind(this)}>
                          <Image source={require('../img/return.png')} style={{height: 20, width: 20}}/>
                    </TouchableOpacity>
                    <Text style={{margin:17}}>{this.state.name}</Text>
                </View>
                <FlatList
                     data = {this.state.data}
                     renderItem={(item)=>this._renderItemView(item)}
                     numColumns={3}
                     columnWrapperStyle={{alignItems:'center'}}
                />
            </View>
        )
        else if(item===this.state.name&&this.state.data.length==0&&this.state.success==true)
        return (
            <View style={styles.container}>
                 <View style={{ elevation:5,height:55,flexDirection: "row",width:width,backgroundColor: Colors.white}}>
                      <TouchableOpacity style={{margin:20}} onPress={this.back.bind(this)}>
                           <Image source={require('../img/return.png')} style={{height: 20, width: 20}}/>
                      </TouchableOpacity>
                      <Text style={{margin:17}}>{this.state.name}</Text>
                 </View>
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
        width:width/3-10,
        borderRadius:5,
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
        height:30,
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5,
        textAlign:'center',
        backgroundColor: Colors.white
    },
    imgStyle: {
        width:width/3-10,
        height:(width/3-10)/96*123,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    }
});