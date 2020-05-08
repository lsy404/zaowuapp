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
import {Row, Rows, Table} from 'react-native-table-component';
import Gocollect from './gocollect.js';
import Gowant from './gowant.js';
//默认应用的容器组件
var width = Dimensions.get('window').width;
var url='http://101.201.237.173:8082';
export default class details extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            text:null,
            get:1,
            post_id:null,
            his_id:null,
            name:null,
            data:{title:null,tags:[],description:null,stuff:[],steps:[],tips:null,},
            csrftoken:null,
            comments:[],
            reply:null,//回复的创客ID
            reply_name:null,//回复的创客名
            type:null,
            project_id:null,
            step:0,
        };
    }
    //渲染
    onload(){
        let item = this.props.navigation.state.params;
        this.setState({project_id:item.item.item._id});
        fetch(url+'/p/'+item.item.item._id)
        .then((response) => {return response.text();})
        .then((responseData) => {
            var csrf=responseData;
            var split1=csrf.split("csrf:'");
            var split2=split1[1].split("'");
            var csrftoken=split2[0];
            this.setState({csrftoken});
            split1=responseData.split("14px;display:block\">由");
            split2=split1[1].split("发布");
            var text=split2[0];
            this.setState({name:text});
            split1=responseData.split("href=\"/u/");
            split2=split1[1].split("\">");
            text=split2[0];
            var user_id=text;
            this.setState({post_id:text});
            split1=responseData.split("zui button follow\" id=\"");
            if(split1[1]==undefined)split1=responseData.split("zui button unfollow\" id=\"");
            if(split1[1]==undefined)split1=responseData.split("zui button user_edit\" id=\"");
            split2=split1[1].split("\"");
            text=split2[0];
            console.log(text);
            var his_id=text;
            this.setState({his_id});
            split1=responseData.split("20px;display:block\">");
            split2=split1[1].split("</span>");
            text=split2[0];
            var title=text;
            this.setState((state) => {
                 state.data.title= title;
                 return { data: state.data }
            })
            if(this.state.data.tags.length==0)
            {
                split1=responseData.split("href=\"/p/tag/");
                for(let i=1;;i++)
                {
                    if(split1[i]==undefined)break;
                    else{
                        split2=split1[i].split("\">");
                        text=split2[0];
                        var tag=text;
                        this.state.data.tags.push(tag);
                    }
                }
            }
            split1=responseData.split("<p style=\"font-size:18px; margin-top: 50px\">  ");
            split2=split1[1].split("</p>");
            text=split2[0];
            text=text.replace(/<([^>]*)>/g, "")
            var description=text;
            this.setState((state) => {
                 state.data.description= description;
                 return { data: state.data }
            })
            if(this.state.data.stuff.length==0)
            {
                 split1=responseData.split("two wide column\">");
                 for(let i=2;;i++)
                 {
                       if(split1[i]==undefined)break;
                       else{
                             let stuff=[];
                             split2=split1[i].split("</td>");
                             stuff.push(split2[0]);
                             split2=split1[i].split("three wide column\">");
                             var split3=split2[1].split("</td>");
                             stuff.push(split3[0]);
                             split3=split2[2].split("</td>");
                             stuff.push(split3[0]);
                             this.state.data.stuff.push(stuff);
                       }
                 }
            }
            split1=responseData.split("<div style=\"font-size:16px\">");
            split2=split1[1].split("</div>");
            text=split2[0];
            var tips=text;
            this.setState((state) => {
                 state.data.tips= tips;
                 return { data: state.data }
            })
            var strings;
            var img,text,name,name2=null,id,id2=null,type,date,comment_id,num=0;
            if(this.state.data.steps.length==0)
            for(let i=1;;i++)
            {
                split1=csrf.split("Step"+i);
                if(split1[1]==undefined)break;
                else{
                    csrf=split1[1];
                    split1=csrf.split("ui reply form");
                    strings=split1[0];

                    var steps={_id:null,pictures:[],text:null}
                    split2=strings.split("<li id=\"");
                    split2=split2[1].split("\">");
                    steps._id=split2[0];
                    split2=strings.split("src=\"");
                    if(split2[1]!=undefined)
                    {
                        split2=split2[1].split("\">");
                        steps.pictures.push(split2[0]);
                    }
                    split2=strings.split("<p style=\"font-size:16px\">");
                    split2=split2[1].split("</p>");
                    steps.text=split2[0].replace(/<([^>]*)>/g, "");
                    this.state.data.steps.push(steps);

                    var comment_ids=[];
                    split2=strings.split("id=\"");
                    var split3;
                    for(let m=2;m<split2.length;m++)
                    {
                        split3=split2[m].split("\">");
                        comment_ids.push(split3[0]);
                    }
                        split2=strings.split("<img src=\"");
                        if(split2[1]!=undefined)
                            num=split2.length;
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
                            this.state.comments.push({'comment_id':comment_ids[m-1],
                                'step':i,'url':img,'id':id,'name':name,'type':type,
                                'id2':id2,'name2':name2,'time':date,'text':text});
                        }
                }
            }
            let params = {
                user_id:user_id,
                _csrf:csrftoken,
            };
            fetch(url+'/following',{
                 method: 'POST',
                 headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(params),
            }).then((response) => {
                 return response.json();
            }).then((json) => {
                 return json.data.list;
            }).then((data) => {
                 for(let i=0;i<data.length;i++)
                 {
                      if(data[i]._id===his_id)
                      {
                           this.setState({type:true});
                           break;
                      }
                 }
                 if(i===data.length)this.setState({type:false});
            }).catch((error) => {
            });
           /* let formData = new FormData();
            var uri=url+'/p/detail?_csrf='+csrftoken;
            formData.append("post_id",item.item.item._id);
            console.log(uri);
            console.log(formData);
            fetch(uri , {
                  method: 'POST',
                  body:formData,
            }).then((response) => {console.log(response);return response.json();})
            .then((json) => {
                console.log(json);
                this.setState({data:json.data});

            }).catch((error) => {
            });*/
            this.setState({user_id});
        }).catch((error) => {
        });
    }
    render() {
         if(this.state.get){this.onload();var get=0;this.setState({get})}
         var data=this.state.data;
         if (data) {
         return (
               <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                     <View style={styles.container}>
                            <View style={{padding:10,flexDirection: "row",
                                alignItems: 'center',backgroundColor: Colors.white,}}>
                                    <TouchableOpacity  style={{flexDirection: "row",flex:1,
                                        alignItems: 'center',}} onPress={this.other.bind(this)}>
                                        <Image style={styles.imgStyle}
                                            source={{uri:url+'/public/img/user/avatar/default_avatar_f.png'}}/>
                                        <Text style={{marginLeft:10}} >{this.state.name}</Text>
                                    </TouchableOpacity>
                                    {this.connection()}
                            </View>
                            <Text style={styles.title} >{data.title}</Text>
                            {
                                   this.state.data.tags[0] != null?(
                                          this._renderTagShow()
                                   ):(null)
                            }
                            <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                            <Text style={styles.item} >项目描述</Text>
                            <Text style={styles.item2} multiline={true} >{data.description}</Text>
                            <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                            <Text style={styles.item} >材料</Text>
                            <View style={{padding: 20}}>
                                 <Table borderStyle={{borderWidth: 1, borderColor: '#ddd'}}>
                                      <Row data={['名称', '数量', '备注']} style={{}} textStyle={{textAlign: 'center'}}/>
                                      <Rows data={this.state.data.stuff} textStyle={{textAlign: 'center'}}/>
                                 </Table>
                            </View>
                            <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                            <Text style={styles.item} >步骤</Text>
                            <FlatList
                                  data = {this.state.data.steps}
                                  renderItem={(item)=>this._renderItemView(item)}
                            />
                            <View style={{borderWidth:1,borderColor:'#ddd'}}/>
                            <Text style={styles.item} >贴士</Text>
                            <Text style={styles.item2} multiline={true} >{data.tips}</Text>
                            <View style={{flexDirection: "row",}}>
                                <Gowant project_id={this.state.project_id}/>
                                <Gocollect project_id={this.state.project_id}/>
                            </View>
                     </View>
               </ScrollView>

         );
          }
        else
         return (
               <TouchableOpacity  style={{alignItems:'center',marginTop:200,height:'100%',
                    width: '100%'}}>
                      <ActivityIndicator size={'large'}/>
                      <Text style={styles.item} >数据加载中</Text>
               </TouchableOpacity>
         );
    }
    other()
    {
        this.props.navigation.navigate('他的主页',this.state.his_id);
    }
    showAlertDialog = () => {
            this.setState({
                alertDialogVisible: true
            });
        }

    dismissAlertDialog = () => {
            this.setState({
                alertDialogVisible: false
            });
        }
    connection()
    {
            if(this.state.type===true)
            return(
                    <TouchableOpacity style={{alignItems:'center'}}  onPress={this.unfollow.bind(this)}>
                        <Text style={{marginRight:10,padding: 5,backgroundColor:'#a9a9a9',color:'#4d4d4d',textAlign:'center',width:width/3,}}>取消关注</Text>
                    </TouchableOpacity>
                    )
            else
            return(
                    <TouchableOpacity style={{alignItems:'center'}}  onPress={this.follow.bind(this)}>
                        <Text style={{marginRight:10,padding: 5,backgroundColor:'#1e90ff',color:'#ffffff',textAlign:'center',width:width/3,}} onPress={this.follow.bind(this)}>关注</Text>
                    </TouchableOpacity>
            )
    }
    unfollow()
        {
            let params = {
                 user_id:this.state.his_id,
                 _csrf:this.state.csrftoken,
            };
            this.setState({type:false});
            fetch(url+'/unfollow',{
                 method: 'POST',
                 headers: {
                     Accept: 'application/json',
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(params),
            }).catch((error) => {
            });
        }
    follow()
        {
            let params = {
                 user_id:this.state.his_id,
                 _csrf:this.state.csrftoken,
            };
            this.setState({type:true});
            fetch(url+'/follow',{
                 method: 'POST',
                 headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(params),
            }).catch((error) => {
            });
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
                     <Text style={{margin:10,height:30,padding:6,
                        backgroundColor: Colors.white,flex:2}}>{item.item.name}</Text>
                     <Text style={{margin:10,height:30,padding:6,
                        backgroundColor: Colors.white,flex:1}}>{item.item.amount}</Text>
                     <Text style={{margin:10,height:30,padding:6,
                        backgroundColor: Colors.white,flex:4}}>{item.item.memo}</Text>
                </View>
            )
        }
    _renderItemView(item){
            return(
                <View style={{margin:10,padding:6}}>
                      <Text style={{margin:5, padding:6}} >步骤{item.index+1}</Text>
                      <TouchableOpacity  style={{alignItems:'center'}}>
                      {
                            item.item.pictures[0]===undefined?(null
                            ):(
                                <Image style={{width:width/4*3,height:width,
                                    backgroundColor: Colors.white}}
                                    source={{uri:url+
                                        item.item.pictures[0]}}/>)
                      }
                      </TouchableOpacity>
                      <Text style={styles.item2}>{item.item.text}</Text>
                      {
                            this.comments(item)
                      }
                      <View style={{backgroundColor: Colors.white,}}>
                            {this.toreply(item.index)}
                            <TextInput style={styles.item2} multiline={true} placeholder={
                                this.state.reply_name!=null?(null)
                                :('评论区')}
                                onChangeText={(text) => this.setState({text})}
                            />
                      </View>
                      <Text style={styles.button1} onPress={this.doFetch1.bind(this,item.index)}>
                        发表评论</Text>
                </View>
            )
        }
    toreply(index)
    {
        if(this.state.reply_name!=null&&index==this.state.step)
        return(
            <TouchableOpacity  style={{alignSelf:'flex-start',padding:5,marginTop: 5,
                marginLeft: 5,borderRadius: 10,borderWidth: 0.5,}}
                onPress={()=>{this.setState({reply_name:null});this.setState({reply:null});}}>
                <Text >{'回复'+this.state.reply_name+'  ×'}</Text>
            </TouchableOpacity>
        )
    }
    comments(item)
    {
        let commentslist=this.state.comments;
        let commentsdata=[];
        if(commentslist!=null)
        for(let i=0;i<commentslist.length;i++)
        {
            if(commentslist[i].step===item.index+1)
            {
                commentsdata.push(
                    <View style={{flexDirection: "row",marginTop:5,
                        marginLeft:commentslist[i].type*25}} >
                        <Image style={{height:40,width:40,borderRadius:20}}
                            source={{uri:url+commentslist[i].url}}/>
                        <View style={{flex:1}}>
                            <Text style={{}}>{commentslist[i].name}</Text>
                            <Text style={{}}>{commentslist[i].text}</Text>
                        </View>
                        <TouchableOpacity style={{justifyContent:'flex-end'}}
                            onPress={() => {this.setState({step:commentslist[i].step-1})
                                this.setState({reply:commentslist[i].comment_id})
                                this.setState({reply_name:commentslist[i].name})}} >
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
    doFetch1(index){
               let formData = new FormData();
               //step_id 步骤id
               formData.append("step_id",this.state.data.steps[index]._id);
               formData.append("post_id",this.state.post_id);
               if(this.state.reply!=null)formData.append("parent_id",this.state.reply);
               formData.append("comment_text",this.state.text);
               fetch(url+'/c/add?_csrf='+this.state.csrftoken , {
                     method: 'POST',
                     body: formData
               }).then((response) => {
                     return response.json();
               }).then((json) => {
                     alert(JSON.stringify(json));
                     this.setState({comments:[]});
                     this.setState({data:{title:null,tags:[],description:null,stuff:[],steps:[],tips:null,}});
                     this.setState({text:null});
                     this.setState({reply_name:null});
                     this.setState({reply:null});
                     this.onload();
               }).catch((error) => {
                     console.error(error);
               });
         }
}

//样式定义
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    content:{
        margin:20,
        flexDirection: "row",
        padding: 20,
        borderWidth:1,
    },
    item:{
            margin:10,

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
        marginTop:10,
        height:30,
        fontSize:18,
        textAlign:'center',
    },
    item2:{
              margin:10,
              minHeight: 40,
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