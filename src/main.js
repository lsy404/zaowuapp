import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    FlatList,
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
//默认应用的容器组件
export default class main extends Component {
    //构造函数
    navigationOptions:{
          header:null,
            }
    constructor(props) {
        super(props);
        this.state = {
            responseText:null,
            text:null,
            data:[],
            get:1,
            csrftoken:null,
        };
    }
    onload(){
        fetch('http://192.168.1.106:8080/')
            .then((response) => {return response.text();})
            .then((responseData) => {
                  var csrf=responseData;
                  var split1=csrf.split("csrf:'");
                  var split2=split1[1].split("'");
                  var csrftoken=split2[0];
                  this.setState({csrftoken});
                  let params = {
                         skip:0,
                         limit:10,
                         _csrf:csrftoken,
                  };
                  fetch('http://192.168.1.106:8080/zaos',{
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
                       this.setState({data});
                  }).catch((error) => {
                       console.error(error);
                  });
            }).catch((error) => {
                  console.error(error);
            });
    }
    //渲染
    _renderItemView(item){
        //console.log(item.index);
        //console.log(item);
        var uri='http://192.168.1.106:8080'+item.item.cover_pic_card;
        return (
          <View style={styles.content} >
              <Image style={styles.imgStyle} source={{uri:uri}}></Image>
              <Text style={styles.title} onPress={this.doFetch1.bind(this,item)}>{item.item.title}</Text>
          </View>
        )
      }
    doFetch1(item){
        this.props.navigation.navigate('details',{item:item});
    }
    doFetch2(){
            this.props.navigation.navigate('createPage');
        }
    doFetch(){
        if(this.state.text)
        {
            let params = {
                 keyword:this.state.text,
                  _csrf:this.state.csrftoken,
             };
             fetch('http://192.168.1.106:8080/search',{
                   method: 'POST',
                   headers: {
                       Accept: 'application/json',
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify(params),
              }).then((response) => {
                    return response.json();
             }).then((json) => {
                    return json.data.posts;
             }).then((data) => {
                   this.setState({data});
             }).catch((error) => {
                   console.error(error);
             });
        }
        else{this.onload();}
    }
    signout(){
        fetch('http://192.168.1.106:8080/signout')
        .catch((error) => {
              console.error(error);
        });
        this.props.navigation.navigate('signin');
    }
    render() {
        let item = this.props.navigation.state.params;
        if(this.state.get||item){this.onload();var get=0;this.setState({get});this.props.navigation.state.params=0}
        return (
            <View style={styles.container}>
                <Text style={{margin:15,height: 40,padding:6,textAlign:'center',backgroundColor: Colors.white}} onPress={this.signout.bind(this)}>退出登录</Text>
                <Text style={{margin:15,height: 40,padding:6,textAlign:'center',backgroundColor: Colors.white}} onPress={this.doFetch2.bind(this)}>新建</Text>
                <TextInput style={styles.item}
                     placeholder="搜索"
                     onChangeText={(text) => this.setState({text})}
                     onKeyPress={this.doFetch.bind(this)}
                     value={this.state.text}
                />
                <FlatList
                     data = {this.state.data}
                     renderItem={(item)=>this._renderItemView(item)}
                />
            </View>
        )
    }
}

//样式定义
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    content:{
        margin:5,
        flexDirection: "row",
        padding: 15,
        backgroundColor: Colors.white
    },
    item:{
            margin:5,
            height: 40,
            textAlign:'center',
            backgroundColor: Colors.white
        },
    title:{
        height:30,
        flex:1,
        textAlign:'center',
        backgroundColor: Colors.white
    },
    imgStyle: {
            width:100,
            height:100,
    }
});