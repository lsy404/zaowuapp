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
export default class user extends Component {

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
            num:null,
            get:1,
        };
    }
    onload()
    {
        fetch(url+'/u/update')
                .then((response) => {return response.text();})
                .then((responseData) => {
                     var split1=responseData.split("server_data_nickname\">");
                     var split2=split1[1].split("</i>");
                     var text=split2[0];
                     this.setState({name:text});
                }).catch((error) => {
                });
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
                     fetch(url+'/u/'+user_id)
                     .then((response) => {return response.text();})
                     .then((responseData) => {
                           var split1=responseData.split("关注 <b>");
                           var split2=split1[1].split("</b>");
                           var text=split2[0];
                           this.setState({focus:text});
                           split1=responseData.split("粉丝 <b>");
                           split2=split1[1].split("</b>");
                           text=split2[0];
                           this.setState({fans:text});
                     }).catch((error) => {
                     });
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
                }).catch((error) => {
                });
                fetch(url+'/n/unread')
                .then((response) => {
                     return response.json();
                }).then((json) => {
                     return json.data;
                }).then((data) => {
                     this.setState({num:data.length});
                }).catch((error) => {
                });
    }
    //渲染
    render() {
        if(this.state.get){this.onload();var get=0;this.setState({get});}
        return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View style={styles.container}>
                <ImageBackground style={{width:width,height:width/192*60,flexDirection: "row"}} source={{uri:url+'/public/img/post/cover/default.jpg'}}>
                    <Image style={{marginTop:100,marginLeft:20,width:80,height:80,borderRadius:40}} source={{uri:url+'/public/img/user/avatar/default_avatar_f.png'}}/>
                    <TouchableOpacity  onPress={this.message.bind(this)}>
                        <ImageBackground  source={require('../img/message.png')} style={{marginTop:10,marginLeft:width-140,height: 30, width: 30,}}>
                            {this.unreadnum()}
                        </ImageBackground>
                    </TouchableOpacity>
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

                <Text style={styles.item}>{this.state.name}</Text>
                <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                <View style={{margin:5,backgroundColor: Colors.white}}>
                    <Text style={{margin:5,padding:6}}>我的发布</Text>
                    <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                    <FlatList
                         data = {this.state.mydata}
                         renderItem={(item)=>this.publish(item)}
                         horizontal={true}
                    />
                </View>
                <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                <TouchableOpacity  style={{flexDirection: "row",backgroundColor: Colors.white}} onPress={this.collect.bind(this)}>
                    <Image source={require('../img/yishoucang.png')} style={{marginTop:10,marginLeft:20,height: 20, width: 20}}/>
                    <Text style={{height: 40,padding:10,marginLeft:10,flex:1}} >我的收藏</Text>
                    <Image source={require('../img/qianjin.png')} style={{marginTop:10,marginRight:10,height: 20, width: 20}}/>
                </TouchableOpacity>

                <TouchableOpacity  style={{flexDirection: "row",backgroundColor: Colors.white}} onPress={this.about.bind(this)}>
                    <Image source={require('../img/want.png')} style={{marginTop:10,marginLeft:20,height: 20, width: 20}}/>
                    <Text style={{height: 40,padding:10,marginLeft:10,flex:1}} >我想做</Text>
                    <Image source={require('../img/qianjin.png')} style={{marginTop:10,marginRight:10,height: 20, width: 20}}/>
                </TouchableOpacity>

                <TouchableOpacity  style={{flexDirection: "row",backgroundColor: Colors.white}} onPress={this.signout.bind(this)}>
                    <Image source={require('../img/tuichudenglu.png')} style={{marginTop:10,marginLeft:22,height: 20, width: 20}}/>
                    <Text style={{height: 40,padding:10,marginLeft:8,flex:1}}>退出登录</Text>
                    <Image source={require('../img/qianjin.png')} style={{marginTop:10,marginRight:10,height: 20, width: 20}}/>
                </TouchableOpacity>

            </View>
        </ScrollView>
        );
    }
    unreadnum()
    {
        console.log(this.state.num);
        if(this.state.num>0)
        {
            return(
                <View style={{marginLeft:15,width:20,height:20, borderRadius:10,backgroundColor:'#ff0000'}}>
                    <Text style={{textAlign:'center',color:'#ffffff'}}>{this.state.num}</Text>
                </View>
            )
        }
    }
    message()
    {
        this.props.navigation.navigate('消息',{callback:()=>{this.setState({get:1})}});
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
    about()
    {
        this.props.navigation.navigate('我想做');
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
    collect()
    {
        this.props.navigation.navigate('我的收藏',this.state.user_id);
    }
    signout(){
        fetch(url+'/signout')
        .then(()=>{this.props.navigation.navigate('signin');})
        .catch((error) => {
        });

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