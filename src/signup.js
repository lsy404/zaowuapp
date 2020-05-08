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
export default class signup extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            phone:null,
            text:null,
            code:null,
            newpassword:null,
            newpassword_repeat:null,
        };
    }

    //渲染
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.item} >凿物</Text>
                <TextInput style={styles.item2}
                      placeholder="请输入手机号"
                      onChangeText={(phone) => this.setState({phone})}
                      value={this.state.phone}
                />
                <TouchableOpacity style={{alignItems:'center'}} >
                      <SvgUri width="200" height="60" uri={url+'/captcha'} />
                </TouchableOpacity>
                <TextInput style={styles.item2}
                      placeholder="请输入验证码"
                      onChangeText={(text) => this.setState({text})}
                      value={this.state.text}
                />
                <View style={{flexDirection: "row",margin:10,marginLeft:width/6,marginRight:width/6}}>
                    <TextInput style={{marginRight:10,height:30,padding:6,flex:2,backgroundColor: Colors.white}}
                         placeholder="请输入短信验证码"
                         onChangeText={(code) => this.setState({code})}
                         value={this.state.code}
                    />
                    <Text style={{height:30,padding:6,flex:1,borderWidth:1,borderColor:'#ddd',textAlign:'center'}} onPress={this.sms.bind(this)}>发送验证码</Text>
                </View>
                <TextInput style={styles.item2}
                     placeholder="请输入密码"
                                      //secureTextEntry={true}
                     onChangeText={(newpassword) => this.setState({newpassword})}
                     value={this.state.newpassword}
                />
                <TextInput style={styles.item2}
                     placeholder="请再输入一次密码"
                     onChangeText={(newpassword_repeat) => this.setState({newpassword_repeat})}
                     value={this.state.newpassword_repeat}
                />
                <Text style={styles.item1} onPress={this.doFetch1.bind(this)}>注册</Text>
            </View>
        );
    }
    sms(){
        if(!this.state.phone)alert('请输入手机号');
        else if(!this.state.text)alert('请输入验证码');
        else fetch(url+'/signup')
                .then((response) => {return response.text();})
                .then((responseData) => {
                      var csrf=responseData;
                      var split1=csrf.split("csrf:'");
                      var split2=split1[1].split("'");
                      var csrftoken=split2[0];
                      let params = {
                            phone:this.state.phone,
                            captcha:this.state.text,
                            _csrf:csrftoken,
                      };
                      fetch(url+'/sms' , {
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
                      }).catch((error) => {
                            console.error(error);
                      });
                })
                .catch((error) => {
                      console.error(error);
                });
    }
    doFetch1(){
        fetch(url+'/signup')
        .then((response) => {return response.text();})
        .then((responseData) => {
              var csrf=responseData;
              var split1=csrf.split("csrf:'");
              var split2=split1[1].split("'");
              var csrftoken=split2[0];
              let params = {
                    phone:this.state.phone,
                    code:this.state.code,
                    newpassword:this.state.newpassword,
                    newpassword_repeat:this.state.newpassword_repeat,
                    _csrf:csrftoken,
              };
              fetch(url+'/signup' , {
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
                    console.error(error);
              });
        })
        .catch((error) => {
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
        marginLeft:width/6,
        marginRight:width/6,
        height:30,
        borderWidth:1,
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