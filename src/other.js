import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    FlatList,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import {
  SvgUri
} from 'react-native-svg';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
//默认应用的容器组件
var width = Dimensions.get('window').width;
var url='http://101.201.237.173:8082';
export default class other extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            name:null,
            address:null,
            user_id:null,
            focus:null,
            fans:null,
            mydata:null,
            mycollection:null,
            csrftoken:null,
            type:null,
        };
    }

    onload(){
        let user_id=this.props.navigation.state.params;
        fetch(url+'/u/'+user_id)
        .then((response) => {return response.text();})
        .then((responseData) => {
             var split1=responseData.split("<h2><b>");
             var split2=split1[1].split("</b></h2>");
             var text=split2[0];
             this.setState({name:text});
             split1=responseData.split("关注 <b>");
             split2=split1[1].split("</b>");
             text=split2[0];
             this.setState({focus:text});
             split1=responseData.split("粉丝 <b>");
             split2=split1[1].split("</b>");
             text=split2[0];
             this.setState({fans:text});
        }).catch((error) => {
        });
        fetch(url+'/')
        .then((response) => {return response.text();})
        .then((responseData) => {
             var csrf=responseData;
             var split1=csrf.split("csrf:'");
             var split2=split1[1].split("'");
             var csrftoken=split2[0];
             split1=csrf.split("href=\"/u/");
             split2=split1[1].split("\">");
             var my_id=split2[0];
             this.setState({csrftoken});
             let params = {
                   user_id:user_id,
                   skip:0,
                   limit:20,
                   _csrf:csrftoken,
             };
             fetch(url+'/u/release',{
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
                   this.setState({mydata:data});
                   this.setState({mycollection:data});
             }).catch((error) => {
             });
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
                       for(let i=0;i<data.length;i++)
                       {
                            if(data[i]._id===my_id)
                            {
                                this.setState({type:true});
                                break;
                            }
                       }
                       if(i===data.length)this.setState({type:true});
                       this.setState({user_id});
                  }).catch((error) => {
                  });
        }).catch((error) => {
        });
    }

    //渲染
    render() {
        let user_id = this.props.navigation.state.params;
        if(user_id!=this.state.user_id){this.setState({user_id});this.onload();}
        return (
            <View style={styles.container}>
                <ImageBackground style={{width:width,height:width/192*60}} source={{uri:url+'/public/img/post/cover/default.jpg'}}>
                    <TouchableOpacity style={{margin:10}} onPress={this.back.bind(this)}>
                         <Image source={require('../img/return.png')} style={{height: 20, width: 20}}/>
                    </TouchableOpacity>
                    <Image style={{marginLeft:20,marginTop:70,width:80,height:80,borderRadius:40}} source={{uri:url+'/public/img/user/avatar/default_avatar_f.png'}}/>
                </ImageBackground>
                <TouchableOpacity style={{flexDirection: "row"}}>
                      <TouchableOpacity  onPress={this.myinterest.bind(this)}>
                            <Text style={{marginLeft:150,fontSize:20,textAlign:'center'}} >{this.state.focus}</Text>
                            <Text style={{marginLeft:150,textAlign:'center',color:'#4d4d4d'}}>关注</Text>
                      </TouchableOpacity>
                      <Text style={{marginLeft:50, fontSize:30,color:'#ddd'}}>|</Text>
                      <TouchableOpacity  onPress={this.myfuns.bind(this)}>
                            <Text style={{marginLeft:50,fontSize:20,textAlign:'center'}}>{this.state.fans}</Text>
                            <Text style={{marginLeft:50,textAlign:'center',color:'#4d4d4d'}} >粉丝</Text>
                      </TouchableOpacity>
                </TouchableOpacity>
                <View style={{flexDirection: "row"}}>
                <Text style={styles.item}>{this.state.name}</Text>
                {this.connection()}
                </View>
                <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                <View style={{marginTop:5,margin:5,backgroundColor: Colors.white}}>
                    <Text style={{margin:5,padding:6}}>发布</Text>
                    <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                    <FlatList
                         data = {this.state.mydata}
                         renderItem={(item)=>this.publish(item)}
                         numColumns={3}
                         columnWrapperStyle={{alignItems:'center'}}
                    />
                </View>
            </View>
        );
    }
    back()
    {
            this.props.navigation.goBack();
    }
    connection()
    {
        if(this.state.type===true)
        return(
        <TouchableOpacity style={{marginTop:25,alignItems:'center'}}  onPress={this.unfollow.bind(this)}>
            <Text style={{marginRight:10,padding: 5,backgroundColor:'#a9a9a9',color:'#4d4d4d',textAlign:'center',width:width/2,}}>取消关注</Text>
        </TouchableOpacity>
        )
        else
        return(
        <TouchableOpacity style={{marginTop:25,alignItems:'center'}}  onPress={this.follow.bind(this)}>
            <Text style={{marginRight:10,padding: 5,backgroundColor:'#1e90ff',color:'#ffffff',textAlign:'center',width:width/2,}} onPress={this.follow.bind(this)}>关注</Text>
        </TouchableOpacity>
        )
    }
    unfollow()
    {
        let params = {
             user_id:this.state.user_id,
             _csrf:this.state.csrftoken,
        };
        this.setState({type:false});
        this.onload();
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
    follow()
    {
        let params = {
             user_id:this.state.user_id,
             _csrf:this.state.csrftoken,
        };
        this.setState({type:true});
        this.onload();
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
    myinterest(){
            this.props.navigation.navigate('我的关注',this.state.user_id);
        }
    myfuns(){
            this.props.navigation.navigate('我的粉丝',this.state.user_id);
        }
    doFetch1(item){
            this.props.navigation.navigate('项目详情',{item:item});
        }
    publish(item)
    {
        var uri=url+item.item.cover_pic_card;
            return (
              <TouchableOpacity style={styles.content} onPress={this.doFetch1.bind(this,item)}>
                  <Image style={styles.imgStyle} source={{uri:uri}}></Image>
                  <Text style={styles.title} >{item.item.title}</Text>
              </TouchableOpacity>
            )
    }
}

//样式定义
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    item:{
            marginTop:30,
            marginLeft:20,
            marginBottom:10,
            fontSize:18,
            flex:2,
            },
    content:{
            margin:5,
            width:122,
            borderRadius:5,
            backgroundColor: Colors.white,
        },
    item1:{
        margin:15,
        height:30,
        borderWidth:1,
        padding:10,
        borderColor:'#ddd',
        textAlign:'center'
    },
    item2:{
        margin:10,
        height:30,
        padding:6,
        backgroundColor: Colors.white
    },
    title:{
            marginTop:5,
            flex:1,
            textAlign:'center',
            backgroundColor: Colors.white
        },
    imgStyle: {
         width:122,
         height:122/96*123,
         borderRadius:5
    },
});