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
            focus:[],
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
                      this.setState({num:json.data.total});
                      return json.data.list;
                 }).then((data) => {
                      this.setState({data});
                 }).catch((error) => {
                 });
                 params = {
                       user_id:this.state.user_id,
                       _csrf:csrftoken,
                 };
                 fetch(url+'/following',{
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
                 }).then((data) => {
                      if(this.state.focus.length==0)
                      for(let i=0;i<data.length;i++)
                      {
                           this.state.focus.push(data[i]._id);
                      }
                      this.setState({user_id});
                 }).catch((error) => {
                 });
            }).catch((error) => {
            });
    }
    //渲染
    _renderItemView(item){
        //console.log(item.index);
        var uri=url+item.item.profile.avatar_pic;
        return (
          <TouchableOpacity style={styles.content} onPress={this.doFetch1.bind(this,item)}>
              <Image style={{height:40,width:40,borderRadius:20}} source={{uri:uri}}/>
              <Text style={styles.title} >{item.item.profile.nickname}</Text>
              {this.connection(item)}
          </TouchableOpacity>
        )
      }
    doFetch1(item){
        this.props.navigation.navigate('他的主页',item.item._id);
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
    connection(item)
    {
        let type=true;
        let i=0;
        for(;i<this.state.focus.length;i++)
            if(this.state.focus[i]===item.item._id){type=true;break;}
        if(i===this.state.focus.length)type=false;
        if(type)
        return(
                <TouchableOpacity style={{alignItems:'center'}}  onPress={this.unfollow.bind(this,i)}>
                    <Text style={{marginRight:10,padding: 5,backgroundColor:'#a9a9a9',color:'#4d4d4d',textAlign:'center',width:width/3,}}>取消关注</Text>
                </TouchableOpacity>
        )
        else
        return(
                <TouchableOpacity style={{alignItems:'center'}}  onPress={this.follow.bind(this,item.item._id)}>
                    <Text style={{marginRight:10,padding: 5,backgroundColor:'#1e90ff',color:'#ffffff',textAlign:'center',width:width/3,}} >关注</Text>
                </TouchableOpacity>
        )
    }
    unfollow(a)
    {
         let params = {
              user_id:this.state.focus[a],
              _csrf:this.state.csrftoken,
         };
         this.setState((state) => {
              state.focus.splice(a,1);
              return { focus: state.focus }
         })
         fetch(url+'/unfollow',{
               method: 'POST',
               headers: {
                     Accept: 'application/json',
                     'Content-Type': 'application/json',
               },
               body: JSON.stringify(params),
         }).catch((error) => {
         });
    }
    follow(a)
    {
         let params = {
               user_id:a,
               _csrf:this.state.csrftoken,
         };
         this.state.focus.push(a);
         this.setState({num:this.state.num});
         fetch(url+'/follow',{
               method: 'POST',
               headers: {
                     Accept: 'application/json',
                     'Content-Type': 'application/json',
               },
               body: JSON.stringify(params),
         }).catch((error) => {
         });
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