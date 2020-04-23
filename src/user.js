import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
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
var url='http://192.168.1.106:8080';
export default class user extends Component {

    //构造函数
    constructor(props) {
        super(props);
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
        this.state = {
            name:null,
            address:null,
            user_id:null,
            focus:null,
            fans:null,
            mydata:null,
            mycollection:null,
            csrftoken:null,
        };
    }

    //渲染
    render() {
        return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View style={styles.container}>
                <TouchableOpacity style={{alignItems:'center'}}>
                      <Image style={{width:100,height:100,borderRadius:50}} source={{uri:url+'/public/img/user/avatar/default_avatar_f.png'}}/>
                      <Text style={styles.item}>{this.state.name}</Text>
                      <View style={{flexDirection: "row"}}>
                            <Text style={{margin:5,height: 30,padding:5,borderRadius:10,borderWidth:1,textAlign:'center'}} onPress={this.myinterest.bind(this)}>关注{this.state.focus}</Text>
                            <Text style={{margin:5,height: 30,padding:5,borderRadius:10,borderWidth:1,textAlign:'center'}} onPress={this.myfuns.bind(this)}>粉丝{this.state.fans}</Text>
                      </View>
                </TouchableOpacity>
                <View style={{marginTop:5,margin:5,backgroundColor: Colors.white}}>
                    <Text style={{margin:5,padding:6}}>我的发布</Text>
                    <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                    <FlatList
                         data = {this.state.mydata}
                         renderItem={(item)=>this.publish(item)}
                         horizontal={true}
                    />
                </View>
                <View style={{marginTop:5,margin:5,backgroundColor: Colors.white}}>
                     <Text style={{margin:5,padding:6}}>我的收藏</Text>
                     <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                     <FlatList
                          data = {this.state.mycollection}
                          renderItem={(item)=>this.publish(item)}
                          horizontal={true}
                     />
                </View>
                <Text style={{marginTop:5,margin:5,height: 40,padding:10,textAlign:'center',backgroundColor: Colors.white}} onPress={this.signout.bind(this)}>退出登录</Text>
            </View>
        </ScrollView>
        );
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
        marginTop:25
    },
    item:{
        margin:5,
        height:20,
        textAlign:'center'
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