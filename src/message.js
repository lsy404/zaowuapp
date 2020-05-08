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
export default class message extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            type:0,
            get:1,
            csrftoken:null,
            deleteall:[],
        };
    }
    onload(){
         fetch(url+'/n/all')
         .then((response) => {
                      return response.json();
         }).then((json) => {
                      return json.data;
         }).then((data) => {
                      this.setState({data});
                      if(this.state.deleteall.length==0)
                      for(let i=0;i<data.length;i++)
                          this.state.deleteall.push(0);
                      var get=0;
                      this.setState({get});
         }).catch((error) => {
         });
    }
    //渲染
    _renderItemView(item){
        var uri=url+item.item.related_user.profile.avatar_pic;
        var _color='#ffffff';
        if(this.state.deleteall[item.index]==1)_color='#ff0000';
        return (
          <TouchableOpacity style={[styles.content,{backgroundColor:_color}]} onPress={this.check.bind(this,item.index)}>
              <Image style={{height:40,width:40,borderRadius:20}} source={{uri:uri}}/>
              <View style={{flex:1}}>
                  <Text style={styles.title} >{item.item.related_user.profile.nickname}</Text>
                  <Text style={styles.title} >{item.item.msg}</Text>
              </View>
              <Text style={{marginRight:10,color:'#4d4d4d',}} >{item.item.time}</Text>
          </TouchableOpacity>
        )
      }
    check(index)
    {
        if(this.state.deleteall[index]==0&&this.state.type==1)
            this.setState((state) => {
                 state.deleteall[index]= 1;
                 return { deleteall: state.deleteall }
            })
        else
            this.setState((state) => {
                 state.deleteall[index]= 0;
                 return { deleteall: state.deleteall }
            })
    }
    back()
    {
        this.props.navigation.navigate('user');
        if (this.props.navigation.state.params.callback) {
            this.props.navigation.state.params.callback();
        }
    }
    render() {
        if(this.state.get){this.onload();}
        if(this.state.data.length>0)
        return (
            <View style={styles.container}>
                <View style={{ elevation:5,height:55,flexDirection: "row",width:width,backgroundColor: Colors.white}}>
                     <TouchableOpacity style={{margin:20}} onPress={this.back.bind(this)}>
                          <Image source={require('../img/return.png')} style={{height: 20, width: 20}}/>
                     </TouchableOpacity>
                     {this.edit()}
                </View>

                <FlatList
                     data = {this.state.data}
                     renderItem={(item)=>this._renderItemView(item)}
                />
            </View>
        )
        else if(this.state.data.length==0&&this.state.get==0)
        return (
            <View style={styles.container}>
                <View style={{ elevation:5,height:55,flexDirection: "row",width:width,backgroundColor: Colors.white}}>
                       <TouchableOpacity style={{margin:20}} onPress={this.back.bind(this)}>
                            <Image source={require('../img/return.png')} style={{height: 20, width: 20}}/>
                       </TouchableOpacity>
                       {this.edit()}
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
    edit()
    {
        if(this.state.type==0)
        return (
            <TouchableOpacity  style={{marginTop:5,marginLeft:width-110}} onPress={this.change.bind(this)}>
                 <Image source={require('../img/bianji.png')} style={{marginTop:10,marginLeft:10,height: 25, width: 25}}/>
            </TouchableOpacity>
        )
        else
        return(
            <View style={{marginLeft:width-280,flexDirection: "row"}}>
                <Text style={{marginTop:10,margin:5,width:60,padding:10,borderWidth:1,borderRadius:5,textAlign:'center'}} onPress={this.checkall.bind(this)}>全选</Text>
                <Text style={{marginTop:10,margin:5,width:60,padding:10,borderWidth:1,borderRadius:5,textAlign:'center'}} onPress={this.change.bind(this)}>取消</Text>
                <Text style={{marginTop:10,margin:5,width:60,padding:10,borderWidth:1,borderRadius:5,textAlign:'center'}} onPress={this.deleteall.bind(this)}>删除</Text>
            </View>
        )
    }
    checkall(){
        this.setState((state) => {
            let a=0
            for(let i=0;i<state.deleteall.length;i++)
                a=a+state.deleteall[i];
            if(a==state.deleteall.length)a=0;
            else a=1;
            for(let i=0;i<state.deleteall.length;i++)
                state.deleteall[i]= a;
            return { deleteall: state.deleteall }
        })
    }
    deleteall(){
        let deleteall=[];
        for(let i=0;i<this.state.deleteall.length;i++)
             if(this.state.deleteall[i]==1)deleteall.push(this.state.data[i]._id);
        fetch(url+'/')
             .then((response) => {return response.text();})
             .then((responseData) => {
                  var csrf=responseData;
                  var split1=csrf.split("csrf:'");
                  var split2=split1[1].split("'");
                  var csrftoken=split2[0];
                  this.setState({csrftoken});
                  let params = {
                       notifys:deleteall,
                       _csrf:csrftoken,
                  };
                  fetch(url+'/n/del',{
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(params),
                    }).then((response) => {
                        this.onload();
                    }).catch((error) => {
                    });
             }).catch((error) => {
             });
    }
    change()
    {
        if(this.state.type==0)this.setState({type:1});
        else
        {   this.setState({type:0});
            this.setState((state) => {
                for(let i=0;i<state.deleteall.length;i++)
                     state.deleteall[i]= 0;
                return { deleteall: state.deleteall }
            })
        }
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
    },
    imgStyle: {
        width:width/3-10,
        height:(width/3-10)/96*123,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    }
});