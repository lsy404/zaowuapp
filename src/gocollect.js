import React, {Component} from 'react';
import {
    Modal,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View ,
    StyleSheet,
    Dimensions,
    Image,
    TextInput} from 'react-native';
import RadioModal from 'react-native-radio-master';
import PropTypes from 'prop-types';
let screenWidth = Dimensions.get('window').width;
let dialogWidth = screenWidth-80;
var width = Dimensions.get('window').width;
var url='http://101.201.237.173:8082';

export default class Gocollect extends Component {
    static propTypes ={
                project_id: PropTypes.string,
         }
    constructor(props) {
        super(props);
        this.state = {
            _collect:0,
            user_id:null,
            collectdata:null,
            collectitemdata:null,
            csrftoken:null,
            fid:null,
            get:1,
            modalVisibility:null,
            modalVisible: false,
        };
    }
    onload()
    {
        fetch(url+'/')
            .then((response) => {return response.text();})
            .then((responseData) => {
                  var csrf=responseData;
                  var split1=csrf.split("csrf:'");
                  var split2=split1[1].split("'");
                  var csrftoken=split2[0];
                  this.setState({csrftoken});
                  split1=csrf.split("href=\"/u/");
                  split2=split1[1].split("\">");
                  var user_id=split2[0];
                  this.setState({user_id});
                  let params = {
                            user_id:user_id,
                            _csrf:csrftoken,
                        };
                  fetch(url+'/f/getFavorites',{
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
                              this.setState({collectdata:data});
                              for(let i=0;i<data.length;i++)
                              {
                                    let fid=data[i]._id;
                                    params = {
                                         fid:fid,
                                         skip:0,
                                         limit:10,
                                         _csrf:csrftoken,
                                    };
                                    fetch(url+'/f/posts',{
                                         method: 'POST',
                                         headers: {
                                              Accept: 'application/json',
                                              'Content-Type': 'application/json',
                                         },
                                         body: JSON.stringify(params),
                                    }).then((response) => {
                                         return response.json();
                                    }).then((json) => {
                                          for(let p=0;p<json.data.posts.length;p++)
                                                if(json.data.posts[p]._id==this.props.project_id)
                                                {
                                                    this.setState({fid});
                                                    this.setState({collectitemdata:json.data.posts});
                                                    this.setState({_collect:1});
                                                    break;
                                                }
                                    }).catch((error) => {
                                    });
                              }

                        }).catch((error) => {
                        });
            }).catch((error) => {
            });
    }
    collect()
        {
            if(this.state._collect===0)
            return(
                 <TouchableOpacity  style={{flexDirection: "row",marginTop:5,marginLeft:10}} onPress={() => {this.setModalVisible(!this.state.modalVisible) }}>
                      <Image source={require('../img/weishoucang.png')} style={{marginLeft:5,height: 30, width: 30}}/>
                      <Text  style={{marginLeft:5,marginTop:3}} >收藏</Text>
                 </TouchableOpacity>
                        )
            else
            return(
                 <TouchableOpacity  style={{flexDirection: "row",marginTop:5,marginLeft:10}} onPress={() => {this.cancelcollect()}}>
                      <Image source={require('../img/yishoucang.png')} style={{marginLeft:5,height: 30, width: 30}}/>
                      <Text  style={{marginLeft:5,marginTop:3}}>已收藏</Text>
                 </TouchableOpacity>
                        )
        }
    tocollect()
    {
        let params = {
             f_id:this.state.fid,
             collect_id:this.props.project_id,
             _csrf:this.state.csrftoken,
        };
        fetch(url+'/f/addCollect',{
             method: 'POST',
             headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
             },
             body: JSON.stringify(params),
        }).then((response) => {
            this.setState({_collect:1});
            this.setModalVisible(!this.state.modalVisible);
        }).catch((error) => {
        });
    }
    cancelcollect()
    {
        let params = {
             f_id:this.state.fid,
             collect_id:this.props.project_id,
             _csrf:this.state.csrftoken,
        };
        fetch(url+'/f/delCollect',{
             method: 'POST',
             headers: {
                   Accept: 'application/json',
                   'Content-Type': 'application/json',
             },
             body: JSON.stringify(params),
        }).then((response) => {
            this.setState({_collect:0});
        }).catch((error) => {
        });
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    onClose() {
        this.setState({modalVisible: false});
    }
    render() {
        if(this.state.get){this.onload();var get=0;this.setState({get})}
        return (
            <View style={{}}>
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setModalVisible(false)}}
                >
                    <TouchableOpacity style={{flex:1}} onPress={this.onClose.bind(this)}>
                    <View style={styles.container}>
                        <View style={styles.innerContainer}>
                            <Text>收藏到哪一个收藏夹？</Text>
                            {this.collectcheck()}

                            <View style={styles.btnContainer}>
                                <TouchableHighlight onPress={() => {
                                     this.tocollect();
                                }}>
                                     <Text  style={styles.hidemodalTxt}>确定</Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => {
                                     this.setModalVisible(!this.state.modalVisible);
                                }}>
                                     <Text  style={styles.hidemodalTxt}>取消</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                </Modal>

                {this.collect()}

            </View>
        );
    }
    collectcheck()
    {
        let collect=[];
        if(this.state.collectdata!=null)
        {
        for(let i=0;i<this.state.collectdata.length;i++)
            collect.push(
                <Text value={this.state.collectdata[i]._id}>{this.state.collectdata[i].name}</Text>
            )
        return(
            <RadioModal
                 selectedValue={this.state.fid}
                 onValueChange={(value) => this.setState({fid: value})}
                 style={{ alignItems:'center',padding:5,margin:10}}>
                 {collect}
            </RadioModal>
        )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20

    },
    btnContainer:{
        width:dialogWidth,
        borderTopWidth:1,
        borderTopColor:'#777',

        flexDirection: "row",
    },
    hidemodalTxt: {
        marginTop:10,
        width:dialogWidth/2,
        textAlign:'center',
    },
});