import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import {
  SvgUri
} from 'react-native-svg';
//默认应用的容器组件
export default class signin extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            responseText:null,
            text:null,
            csrftoken:null
        };
    }

    //渲染
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.item} >登录页面</Text>
                <Text style={styles.item1} onPress={this.doFetch1.bind(this)}>获取</Text>
                <SvgUri width="200" height="60" uri="http://192.168.1.105:8080/captcha" />
                <TextInput style={{height: 40}}
                     placeholder="Type here to translate!"
                     onChangeText={(text) => this.setState({text})}
                     value={this.state.text}
                />
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
           formData.append("username","13619083490");
           formData.append("password","78711673pP");
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
});