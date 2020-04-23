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
var url='http://192.168.1.106:8080';
export default class funs extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            num:null,
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
                                limit:20,
                                _csrf:csrftoken,
                          };
                          fetch(url+'/follower',{
                               method: 'POST',
                               headers: {
                                     Accept: 'application/json',
                                     'Content-Type': 'application/json',
                               },
                               body: JSON.stringify(params),
                          }).then((response) => {
                               return response.json();
                          }).then((json) => {
                               return json.data.list;
                               this.setState({num:json.data.total});
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
        console.log(item);
        var uri=url+item.item.profile.avatar_pic;
        return (
          <TouchableOpacity style={styles.content} onPress={this.doFetch1.bind(this,item)}>
              <Image style={{height:40,width:40,borderRadius:20}} source={{uri:uri}}/>
              <Text style={styles.title} >{item.item.profile.nickname}</Text>
              <Text style={{marginRight:10,borderWidth:1,padding: 5,}} >关注</Text>
          </TouchableOpacity>
        )
      }
    doFetch1(item){
        this.props.navigation.navigate('项目详情',{item:item});
    }
    render() {
        let user_id = this.props.navigation.state.params;
        if(this.state.get||user_id!=this.state.user_id){this.setState({user_id});this.onload();var get=0;this.setState({get});}
        if(user_id===this.state.user_id&&this.state.data.length>0)
        return (
            <View style={styles.container}>
                <FlatList
                     data = {this.state.data}
                     renderItem={(item)=>this._renderItemView(item)}
                />
            </View>
        )
        else if(user_id===this.state.user_id&&this.state.num!=null)
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
        backgroundColor: Colors.white,
    },
    content:{
        marginTop:10,
        marginLeft:10,
        flexDirection: "row",
        alignItems: 'center',
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
        flex:1,
    },
    imgStyle: {
        width:width/3-10,
        height:(width/3-10)/96*123,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    }
});