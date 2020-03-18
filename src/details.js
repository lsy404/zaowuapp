import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image
} from 'react-native';
//默认应用的容器组件
export default class details extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            normalText:[],
            specialText:[],
            text:null,
            get:1,
            parent_id:null,
            post_id:null
        };
    }
    //渲染
    onload(){
            let item = this.props.navigation.state.params;
            let formData = new FormData();
            var uri='http://192.168.1.105:8080/p/'+item.item.item._id;
            fetch(uri)
            .then((response) => {return response.text();})
            .then((responseData) => {
                console.log(responseData);
                let normalText = [];
                let specialText = [];
                let post_id;
                let tempText = responseData;
                if (tempText && tempText !== '' && tempText.length > 0) {
                     try {
                          tempText = tempText.replace(/[ ]/g,"");
                          tempText = tempText.replace(/\n/g,"");
                          tempText = tempText.replace(/<[^>]*>/g, 'tmd');
                          tempText.trim().split('tmd').forEach((obj, index) => {
                               if(obj&&obj!=""&&obj.length>0)
                                    normalText.push(obj)
                          })
                     } catch (e) { }
                }
                this.setState({normalText});
                tempText = responseData;
                if (tempText && tempText !== '' && tempText.length > 0) {
                     try {
                          tempText = tempText.replace(/[ ]/g,"");
                          tempText = tempText.replace(/\n/g,"");
                          tempText = tempText.replace(/>[^<]*</g, 'tmd');
                          tempText.trim().split('tmd').forEach((obj, index) => {
                               if(obj.indexOf("liid")!=-1)
                              {
                                    var split1=obj;
                                    var split1=split1.split("id=");
                                    var split2=split1[1].replace("\"", "").replace("\"", "");
                                    specialText.push(split2);
                               }
                               if(!this.state.post_id)
                               {
                                    if(obj.indexOf("ahref")!=-1)
                                    {
                                    var split1=obj;
                                    var split2=split1.split("ahref=");
                                    post_id=split2[1].replace("\"", "").replace("\"", "");
                                    post_id=post_id.replace("/u/", "");
                                    console.log(post_id);
                                    this.setState({post_id});
                                    }
                               }
                          })
                     } catch (e) { }
                }
                this.setState({specialText});

                //console.log(normalText);
            }).catch((error) => {
                 console.error(error);
            });
    }
    render() {
         if(this.state.get){this.onload();var get=0;this.setState({get})}
         var normalText=this.state.normalText;
         var specialText=this.state.specialText;
         //specialText.map((obj, i) => { console.log(specialText[i]);console.log(i);});
         if (normalText && normalText.length > 0) {
         return (
               <View style={styles.container}>
                     <Text style={styles.item}>{normalText[0]}</Text>
                     <TextInput style={{height: 40}}
                            placeholder="评论区"
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                     />
                     <Text style={styles.button1} onPress={this.doFetch1.bind(this,specialText[0])}>发表评论</Text>
               </View>
         );
          }
         return (
               <Text style={styles.item} >主页面</Text>
         );
    }
    doFetch1(a){
               let formData = new FormData();
               //step_id 步骤id
               formData.append("step_id",a);
               //console.log(this.state.post_id);
               formData.append("post_id",this.state.post_id);
               formData.append("comment_text",this.state.text);
               fetch('http://192.168.1.105:8080/c/add' , {
                     method: 'POST',
                     body: formData
               }).then((response) => {
                     return response.json();
               }).then((json) => {
                     alert(JSON.stringify(json));
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
    },
    button1:{
            margin:15,
            height:30,
            borderWidth:1,
            padding:6,
            borderColor:'#ddd',
            textAlign:'center'
        },
});