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

export default class Gowant extends Component {
    static propTypes ={
                project_id: PropTypes.string,
         }
    constructor(props) {
        super(props);
        this.state = {
            _want:0,
            user_id:null,
            csrftoken:null,
            wantdata:null,
            get:1,
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
                       skip:0,
                       limit:10,
                       _csrf:csrftoken,
                  };
                  fetch(url+'/u/wantToMake',{
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
                              this.setState({wantdata:data});
                              for(let i=0;i<data.length;i++)
                              {
                                    if(data[i]._id==this.props.project_id)
                                    {
                                         this.setState({_want:1});
                                         break;
                                    }
                              }
                        }).catch((error) => {
                        });
            }).catch((error) => {
            });
    }
    want()
        {
            if(this.state._want===0)
            return(
                 <TouchableOpacity  style={{flexDirection: "row",marginTop:5,marginRight:14,marginLeft:width-180,}} onPress={() => {this.towant()}}>
                      <Image source={require('../img/want.png')} style={{marginLeft:5,height: 30, width: 30}}/>
                      <Text  style={{marginLeft:5,marginTop:3}} >想做</Text>
                 </TouchableOpacity>
                        )
            else
            return(
                 <TouchableOpacity  style={{flexDirection: "row",marginTop:5,marginLeft:width-180,}} onPress={() => {this.cancelwant()}}>
                      <Image source={require('../img/nowant.png')} style={{marginLeft:5,height: 30, width: 30}}/>
                      <Text  style={{marginLeft:5,marginTop:3}}>不想做</Text>
                 </TouchableOpacity>
                        )
        }
    towant()
    {
        let params = {
             user_id:this.state.user_id,
             post_id:this.props.project_id,
             _csrf:this.state.csrftoken,
        };
        fetch(url+'/u/wantToMake/add',{
             method: 'POST',
             headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
             },
             body: JSON.stringify(params),
        }).then((response) => {
            this.setState({_want:1});
        }).catch((error) => {
        });
    }
    cancelwant()
    {
        let params = {
             user_id:this.state.user_id,
             post_id:this.props.project_id,
             _csrf:this.state.csrftoken,
        };
        fetch(url+'/wtm/del',{
             method: 'POST',
             headers: {
                   Accept: 'application/json',
                   'Content-Type': 'application/json',
             },
             body: JSON.stringify(params),
        }).then((response) => {
            this.setState({_want:0});
        }).catch((error) => {
        });
    }
    render() {
        if(this.state.get){this.onload();var get=0;this.setState({get})}
        return (
            <View style={{}}>
                {this.want()}
            </View>
        );
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