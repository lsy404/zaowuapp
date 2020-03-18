import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {
  SvgUri
} from 'react-native-svg';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
//默认应用的容器组件
export default class signin extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            responseText:null,
            username:null,
            password:null,
            text:null,
            csrftoken:null
        };
    }

    //渲染
    render() {
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
                      //secureTextEntry={true}
                      onChangeText={(password) => this.setState({password})}
                      value={this.state.password}
                />
                <TouchableOpacity style={{alignItems:'center'}}onPress={()=>{var csrftoken=0;this.setState(csrftoken)}}>
                    <SvgUri width="200" height="60" uri="http://192.168.1.105:8080/captcha" />
                </TouchableOpacity>
                <TextInput style={styles.item2}
                     placeholder="请输入验证码"
                     onChangeText={(text) => this.setState({text})}
                     value={this.state.text}
                />
                <Text style={styles.item1} onPress={this.doFetch1.bind(this)}>登录</Text>
            </View>
        );
    }
/*
    doFetch(){
           fetch('http://192.168.1.105:8080/signin')
           .then((response) => {return response.text();})
           .then((responseData) => {
                 alert("请求成功！");
                 var csrf=responseData;
                 var split1=csrf.split("csrf:'");
                 var split2=split1[1].split("'");
                 var csrftoken=split2[0];
                 console.log(csrftoken);
                 console.log('http://192.168.1.105:8080/signin');
                 this.setState({csrftoken});
           })
           .catch((error) => {
                 alert("请求失败！");
           });
     }
*/
    doFetch1(){
           let formData = new FormData();
           /*let param = {
                username:'13619083490',
                password:'78711673pP',
                method:'account',
                captcha:this.state.text,
                csrfToken:this.state.csrftoken,
                };*/
           formData.append("username",this.state.username);
           formData.append("password",this.state.password);
           formData.append("method","account");
           formData.append("captcha",this.state.text);
           //formData.append("_csrf",this.state.csrftoken);
           //console.log(this.state.csrftoken);
           fetch('http://192.168.1.105:8080/signin' , {
                 method: 'POST',
                 body: /*JSON.stringify(param)*/formData
           }).then((response) => {
                 return response.json();
           }).then((json) => {
                 alert(JSON.stringify(json));
                 if(json.success==false)this.props.navigation.navigate('main');
           }).catch((error) => {
                 console.error(error);
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
        padding:6,
        borderColor:'#ddd',
        textAlign:'center'
    },
    item2:{
        margin:10,
        height:30,
        padding:6,
        backgroundColor: Colors.white
    },
});