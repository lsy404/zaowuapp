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
//默认应用的容器组件
export default class main extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            responseText:null,
            text:null,
            data:[],
            get:1
        };
    }
    onload(){
        let formData = new FormData();
        formData.append("skip","0");
        formData.append("limit","10");
        fetch('http://192.168.1.105:8080/zaos',{
               method: 'POST',
               body:formData
        })
        .then((response) => {
               return response.json();
        }).then((json) => {
               //alert(JSON.stringify(json.data));
               return json.data;
        }).then((data) => {
               this.setState({data});
        }).catch((error) => {
               console.error(error);
        });
    }
    //渲染
    _renderItemView(item){
        //console.log(item.index);
        //console.log(item);
        var uri='http://192.168.1.105:8080'+item.item.cover_pic_card;
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
    doFetch(){
        if(this.state.text!="")
        {
        let formData = new FormData();
        formData.append("keyword",this.state.text);
        fetch('http://192.168.1.105:8080/search',{
              method: 'POST',
              body:formData
        })
        .then((response) => {
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
    render() {
        if(this.state.get){this.onload();var get=0;this.setState({get})}
        return (
            <View style={styles.container}>
                <Text style={styles.item} >主页面</Text>
                <TextInput style={{height: 40,textAlign:'center'}}
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
        );
    }
}

//样式定义
const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop:25
    },
    content:{
        margin:20,
        flexDirection: "row",
        padding: 20,
        borderWidth:1,
    },
    item:{
            margin:15,
            height:30,
            padding:6,
            textAlign:'center'
        },
    title:{
        height:30,
        flex:1,
        textAlign:'center'
    },
    imgStyle: {
            width:100,
            height:100,
    }
});