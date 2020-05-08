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
export default class signin extends Component {

    //构造函数
    constructor(props) {
        super(props);
        fetch(url+'/n/count')
        .then((response) => {return response.json();})
        .then((json) => {
              this.setState({success:json.success});
                 if(json.success==true)this.props.navigation.navigate('main');
              }).catch((error) => {
        });
        this.state = {
            username:null,
            password:null,
            text:null,
            success:null,
            get:1,
        };

    }
    //渲染
    render() {
        if(this.state.success==false)
        return (
            <View style={styles.container}>
                <Text style={styles.item} >凿物</Text>
                <TextInput style={styles.item2}
                      placeholder="用户名"
                      onChangeText={(username) => this.setState({username})}
                      value={this.state.username}
                />
                <TextInput style={styles.item2}
                      placeholder="密码"
                      onChangeText={(password) => this.setState({password})}
                      secureTextEntry={true}
                />
                <TouchableOpacity style={{alignItems:'center'}}>
                    <SvgUri width="200" height="60" uri={url+'/captcha'} />
                </TouchableOpacity>
                <TextInput style={styles.item2}
                     placeholder="请输入验证码"
                     onChangeText={(text) => this.setState({text})}
                     value={this.state.text}
                />
                <Text style={styles.item1} onPress={this.doFetch1.bind(this)}>登录</Text>
                <Text style={{margin:10,marginLeft:width/6,height:30,padding:6}} onPress={this.signup.bind(this)}>注册账号</Text>
            </View>
        );
        else return(
            <TouchableOpacity  style={{alignItems:'center',marginTop:200,height:'100%',width: '100%'}}>
                <Image style={{width:width/2,height:width/6}} source={{uri:url+'/public/img/page/logot.png'}}></Image>
                <ActivityIndicator size={'large'}/>
            </TouchableOpacity>
        );
    }
    signup(){
        this.props.navigation.navigate('signup');
    }
    doFetch1(){
        fetch(url+'/signin')
        .then((response) => {return response.text();})
        .then((responseData) => {
              var csrf=responseData;
              var split1=csrf.split("csrf:'");
              var split2=split1[1].split("'");
              var csrftoken=split2[0];
              let params = {
                    username:this.state.username,
                    password:this.state.password,
                    method:"account",
                    captcha:this.state.text,
                    _csrf:csrftoken,
              };
              fetch(url+'/signin' , {
                    method: 'POST',
                    headers: {
                           Accept: 'application/json',
                           'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
              }).then((response) => {
                    return response.json();
              }).then((json) => {
                    alert(JSON.stringify(json));
                    if(json.success)this.props.navigation.navigate('main');
              }).catch((error) => {
              });
        })
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
            margin:15,
            height:30,
            padding:6,
            textAlign:'center'
        },
    item1:{
        margin:15,
        height:30,
        borderWidth:1,
        marginLeft:width/6,
        marginRight:width/6,
        padding:6,
        borderColor:'#ddd',
        textAlign:'center'
    },
    item2:{
        margin:10,
        marginLeft:width/6,
        marginRight:width/6,
        height:30,
        padding:6,
        backgroundColor: Colors.white
    },
});