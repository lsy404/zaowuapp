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
export default class collect extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            user_id:null,
            csrftoken:null,
            get:1,
        };
    }
    onload(){
            let user_id=this.props.navigation.state.params;
            fetch(url+'/')
            .then((response) => {return response.text();})
            .then((responseData) => {
                  var csrf=responseData;
                  var split1=csrf.split("csrf:'");
                  var split2=split1[1].split("'");
                  var csrftoken=split2[0];
                  this.setState({csrftoken});
                  let params = {
                                user_id:user_id,
                                skip:0,
                                limit:10,
                                _csrf:csrftoken,
                  };
                  fetch(url+'/f/getFavorites',{
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
                               this.setState({user_id});
                  }).catch((error) => {
                  });
            }).catch((error) => {
            });
    }
    //渲染
    _renderItemView(item){
        //console.log(item.index);
        var uri=[];
        for(let i=0;i<3;i++)
        {
            if(item.item.collects[i]!=undefined)uri.push({uri:url+item.item.collects[i].cover_pic_card});
            else uri.push(require('../img/collectnull.png'));
        }
        var type;
        if(item.item.public===true)type='公开';
        else type='隐藏';
        return (
          <TouchableOpacity style={styles.content} onPress={this.doFetch1.bind(this,item.item._id)}>
              <View style={{flexDirection: "row",}}>
                  <Image style={styles.imgStyle} source={uri[0]}></Image>
                  <View>
                      <Image style={styles.imgStyle2} source={uri[1]}></Image>
                      <Image style={styles.imgStyle2} source={uri[2]}></Image>
                  </View>
              </View>
              <Text style={styles.title} >{item.item.name}</Text>
              <View style={{flexDirection: "row",}}>
                    <Text style={{marginLeft:10,height:30,color:'#4d4d4d'}} >{item.item.collects.length}个内容</Text>
                    <Text style={{marginLeft:20,height:30,color:'#4d4d4d'}} >{type}</Text>
              </View>
          </TouchableOpacity>
        )
      }
    doFetch1(item){
        this.props.navigation.navigate('collectitem',item);
    }
    render() {
        let user_id = this.props.navigation.state.params;
        if(this.state.get){this.onload();var get=0;this.setState({get});}
        if(this.state.data.length>0)
        return (
            <View style={styles.container}>
                <FlatList
                     data = {this.state.data}
                     renderItem={(item)=>this._renderItemView(item)}
                     numColumns={2}
                     columnWrapperStyle={{alignItems:'center'}}
                />
            </View>
        )
        else if(this.state.data.length==0)
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
        width:(width-30)/2,
        backgroundColor: Colors.white,
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
        marginLeft:10,
        height:30,
    },
    imgStyle: {
        margin:1,
        width:(width-30)/2/3*2,
        height:(width-30)/2/3*2/96*123,
    },
    imgStyle2: {
        margin:1,
        width:(width-30)/2/3,
        height:(width-30)/2/3/96*123,
    }
});