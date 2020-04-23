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
    FlatList,
    ActivityIndicator
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import RadioModal from 'react-native-radio-master';
import PropTypes from 'prop-types';
//默认应用的容器组件
var width = Dimensions.get('window').width;
var url='http://192.168.1.106:8080';
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
            comments:[],
            reply:null,
        };
    }
    //渲染
    onload(){
        let item = this.props.navigation.state.params;
        fetch(url+'/p/'+item.item.item._id)
        .then((response) => {return response.text();})
        .then((responseData) => {
            var csrf=responseData;
            var split1=csrf.split("csrf:'");
            var split2=split1[1].split("'");
            var csrftoken=split2[0];
            this.setState({csrftoken});
            var strings;
            var img,text,name,name2=null,id,id2=null,type,date;
            for(let i=1;;i++)
            {
                split1=csrf.split("Step"+i);
                if(split1[1]==undefined)break;
                else{
                    csrf=split1[1];
                    split1=csrf.split("ui reply form");
                    strings=split1[0];
                        split2=strings.split("<img src=\"");
                        if(split2[1]!=undefined)
                        var num=split2.length;
                        for(let m=1;m<num;m++)
                        {
                            var uri=split2[m].split("\">");
                            img=uri[0];
                            var id0=split2[m].split("href='/u/");
                            id0=id0[1].split("'>");
                            id=id0[0];
                            var name0=id0[1].split("</a>");
                            name=name0[0];
                            var date0=split2[m].split("date\">");
                            date0=date0[1].split("</span>");
                            date0=date0[0].split("\n");
                            date=date0[0];
                            var text0=split2[m].split("text\">\n");
                            text0=text0[1].split("\n");
                            text=text0[0].replace(/(^\s*)|(\s*$)/g, "");
                            var type0=name0[1].split("回复了");
                            if(type0[1]!=undefined)
                            {
                                type=1;
                                id0=split2[m].split("href='/u/");
                                id0=id0[2].split("'>");
                                id2=id0[0];
                                name0=id0[1].split("</a>");
                                name2=name0[0];
                            }
                            else type=0;
                            this.state.comments.push({'step':i,'url':img,'id':id,'name':name,'type':type,'id2':id2,'name2':name2,'time':date,'text':text});
                        }
                }
            }
            let formData = new FormData();
            var uri=url+'/p/detail?_csrf='+csrftoken;
            formData.append("post_id",item.item.item._id);
            fetch(uri , {
                  method: 'POST',
                  body:formData,
            }).then((response) => {return response.json();})
            .then((json) => {
                this.setState({data:json.data});
            }).catch((error) => {
            });
        }).catch((error) => {
        });
        fetch(url+'/u/update')
        .then((response) => {return response.text();})
        .then((responseData) => {
             var split1=responseData.split("href=\"/u/");
             var split2=split1[1].split("\">");
             var text=split2[0];
             this.setState({post_id:text});
        }).catch((error) => {
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
                                    <Image style={styles.imgStyle} source={{uri:url+'/public/img/user/avatar/default_avatar_f.png'}}/>
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
               <TouchableOpacity  style={{alignItems:'center',marginTop:200,height:'100%',width: '100%'}}>
                      <ActivityIndicator size={'large'}/>
                      <Text style={styles.item} >数据加载中</Text>
               </TouchableOpacity>
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
                      {
                            this.comments(item)
                      }
                      <TextInput style={styles.item2} placeholder="评论区"
                            onChangeText={(text) => this.setState({text})} value={this.state.text}/>
                      <Text style={styles.button1} onPress={this.doFetch1.bind(this)}>发表评论</Text>
                </View>
            )
        }
    comments(item)
    {
        let commentslist=this.state.comments;
        let commentsdata=[];
        for(let i=0;i<commentslist.length;i++)
        {
            if(commentslist[i].step===item.index+1)
            {
                commentsdata.push(
                    <View style={{flexDirection: "row",marginTop:5,marginLeft:commentslist[i].type*25}} >
                        <Image style={{height:40,width:40,borderRadius:20}} source={{uri:url+commentslist[i].url}}/>
                        <View style={{flex:1}}>
                            <Text style={{}}>{commentslist[i].name}</Text>
                            <Text style={{}}>{commentslist[i].text}</Text>
                        </View>
                        <TouchableOpacity style={{justifyContent:'flex-end'}} onPress={() => this.setState({reply:commentslist[i].name2})} >
                            <Text style={{color:'#4d4d4d'}}>回复</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
        return (
            <View style={{margin:5}}>
                 {commentsdata}
            </View>
        );
    }
    doFetch1(){
               let formData = new FormData();
               //step_id 步骤id
               formData.append("step_id",this.state.data.steps[0]._id);
               //console.log(this.state.post_id);
               formData.append("post_id",this.state.post_id);
               formData.append("comment_text",this.state.text);
               fetch(url+'/c/add?_csrf='+this.state.csrftoken , {
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
            borderRadius:25,
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