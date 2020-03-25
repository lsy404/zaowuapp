import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import RadioModal from 'react-native-radio-master';
import PropTypes from 'prop-types';
//默认应用的容器组件
var width = Dimensions.get('window').width;
export default class details extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            text:null,
            get:1,
            post_id:null,
            data:null,
            csrftoken:null,
        };
    }
    //渲染
    onload(){
        let item = this.props.navigation.state.params;
        fetch('http://192.168.1.106:8080/p/'+item.item.item._id)
        .then((response) => {return response.text();})
        .then((responseData) => {
            var csrf=responseData;
            var split1=csrf.split("csrf:'");
            var split2=split1[1].split("'");
            var csrftoken=split2[0];
            this.setState({csrftoken});
            let formData = new FormData();
            var uri='http://192.168.1.106:8080/p/detail?_csrf='+csrftoken;
            formData.append("post_id",item.item.item._id);
            fetch(uri , {
                  method: 'POST',
                  body:formData,
            }).then((response) => {return response.json();})
            .then((json) => {
                this.setState({data:json.data});
                console.log(json.data.reference_post);
            }).catch((error) => {
                 console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
        fetch('http://192.168.1.106:8080/n/unread')
        .then((response) => {return response.json();})
        .then((json) => {
             this.setState({post_id:json.data[0]._id});
        }).catch((error) => {
             console.error(error);
        });
    }
    render() {
         if(this.state.get){this.onload();var get=0;this.setState({get})}
         var data=this.state.data;
         //specialText.map((obj, i) => { console.log(specialText[i]);console.log(i);});
         if (data) {
         return (
               <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                     <View style={styles.container}>
                            <View style={{marginLeft:20}}>
                                    <Image style={styles.imgStyle} source={{uri:'http://192.168.1.106:8080/public/img/user/avatar/default_avatar_f.png'}}/>
                            </View>
                            <Text style={styles.title} >{data.title}</Text>
                            {
                                   this.state.data.tags[0] != null?(
                                          this._renderTagShow()
                                   ):(null)
                            }
                            <Text style={styles.item} >项目描述</Text>
                            <Text style={styles.item2} multiline={true} >{data.description}</Text>

                            <Text style={styles.item} >材料</Text>
                            <FlatList
                                  data = {this.state.data.stuff}
                                  renderItem={(item)=>this.materiallistItem(item)}
                            />

                            <Text style={styles.item} >步骤</Text>
                            <FlatList
                                  data = {this.state.data.steps}
                                  renderItem={(item)=>this._renderItemView(item)}
                            />
                            <Text style={styles.item} >贴士</Text>
                            <Text style={styles.item2} multiline={true} >{data.tips}</Text>
                     </View>
               </ScrollView>

         );
          }
         return (
               <Text style={styles.item} >错误</Text>
         );
    }
    _renderTagShow(){
            let tagData = this.state.data.tags;
            let len = tagData.length;
            let TagShow=[];
            for (let i = 0; i < len; i++) {
                 let item=tagData[i];
                 TagShow.push(
                       <Text style={styles.showtag}>{item}</Text>
                 )
            }
            return (
                 <View style={{marginLeft:10,flexDirection: "row",flexWrap:'wrap'}}>
                       {TagShow}
                 </View>
            );
        }
    materiallistItem(item){
            return(
                <View style={{flexDirection: "row"}}>
                     <Text style={{margin:10,height:30,padding:6,backgroundColor: Colors.white,flex:2}}>{item.item.name}</Text>
                     <Text style={{margin:10,height:30,padding:6,backgroundColor: Colors.white,flex:1}}>{item.item.amount}</Text>
                     <Text style={{margin:10,height:30,padding:6,backgroundColor: Colors.white,flex:4}}>{item.item.memo}</Text>
                </View>
            )
        }
    _renderItemView(item){
            return(
                <View style={{margin:10,padding:6}}>
                      <Text style={{margin:5, padding:6}} >步骤{item.index+1}</Text>
                      <TouchableOpacity  style={{alignItems:'center'}}>
                      {
                            item.item.pictures===undefined?(<Image style={{width:width/4*3,height:width/1127*431/4*3,backgroundColor: Colors.white}}/>
                            ):(<Image style={{width:width/4*3,height:width/1127*431/4*3,backgroundColor: Colors.white}} source={{uri:'http://192.168.1.106:8080'+item.item.pictures[0]}}/>)
                      }
                      </TouchableOpacity>
                      <Text style={styles.item2}>{item.item.text}</Text>
                      <TextInput style={styles.item2} placeholder="评论区"
                            onChangeText={(text) => this.setState({text})} value={this.state.text}/>
                      <Text style={styles.button1} onPress={this.doFetch1.bind(this)}>发表评论</Text>
                </View>
            )
        }
    doFetch1(){
               let formData = new FormData();
               //step_id 步骤id
               formData.append("step_id",this.state.data.steps[0]._id);
               //console.log(this.state.post_id);
               formData.append("post_id",this.state.post_id);
               formData.append("comment_text",this.state.text);
               fetch('http://192.168.1.106:8080/c/add?_csrf='+this.state.csrftoken , {
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
            margin:10,
            height:30,
            padding:6,
            flexDirection: "row",
        },
    showtag:{
               padding:5,
               marginBottom: 5,
               marginRight: 5,
               borderRadius: 10,
               borderWidth: 0.5,
               backgroundColor: Colors.white,
            },
    title:{
        height:30,
        flex:1,
        textAlign:'center'
    },
    item2:{
              margin:10,
              height:90,
              padding:6,
              textAlign:'left',
              textAlignVertical:'top',
              backgroundColor: Colors.white
        },
    imgStyle: {
            width:50,
            height:50,
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