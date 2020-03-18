import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Dimensions,
    FlatList,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import RadioModal from 'react-native-radio-master';
//默认应用的容器组件
var width = Dimensions.get('window').width;
export default class createPage extends Component {
    static defaultProps = {
            taglist: [
                {"id": "0","name": "户外探险",select: false},
                {"id": "1","name": "办公需求",select: false},
                {"id": "2","name": "家居",select: false},
                {"id": "3","name": "课堂教学",select: false},
                {"id": "4","name": "厨房",select: false},
                {"id": "5","name": "实验室|工作坊",select: false},
                {"id": "6","name": "3D打印",select: false},
                {"id": "7","name": "影音处理",select: false},
                {"id": "8","name": "机器视觉",select: false},
                {"id": "9","name": "无线",select: false},
                {"id": "10","name": "通信",select: false},
                {"id": "11","name": "电子制作",select: false},
                {"id": "12","name": "可穿戴",select: false},
                {"id": "13","name": "网站开发",select: false},
                {"id": "14","name": "激光切割",select: false},
                {"id": "15","name": "三维建模",select: false},
                {"id": "16","name": "人工智能",select: false},
                {"id": "17","name": "木工",select: false},
                {"id": "18","name": "折纸",select: false},
                {"id": "19","name": "缝纫",select: false},
                {"id": "20","name": "园艺",select: false},
                {"id": "21","name": "飞行器",select: false},
                {"id": "22","name": "机械人",select: false},
                {"id": "23","name": "CNC",select: false},
                {"id": "24","name": "生物技术",select: false},
                {"id": "25","name": "汽修",select: false},
                {"id": "26","name": "春节",select: false},
                {"id": "27","name": "元宵节",select: false},
                {"id": "28","name": "情人节",select: false},
                {"id": "29","name": "清明节",select: false},
                {"id": "30","name": "端午节",select: false},
                {"id": "31","name": "中秋节",select: false},
                {"id": "32","name": "七夕",select: false},
                {"id": "33","name": "万圣节",select: false},
                {"id": "34","name": "圣诞节",select: false},
                {"id": "35","name": "教师节",select: false},
                {"id": "36","name": "儿童节",select: false},
                {"id": "37","name": "婴幼儿",select: false},
                {"id": "38","name": "儿童",select: false},
                {"id": "39","name": "特殊人群",select: false},
                {"id": "40","name": "老人",select: false},
                {"id": "41","name": "宠物",select: false},
                {"id": "42","name": "中美青年创客大赛",select: false},
                {"id": "43","name": "hackathon",select: false},
                {"id": "44","name": "makerfaire",select: false}
            ]
        };
    //构造函数
    constructor(props) {
        super(props);
        let taglist=[];
        for (let i = 0; i < 45; i++) {
             let tag = this.props.taglist[i];
             if(tag.select)taglist.push({"id": tag.id,"name":tag.name,select: false});
             else taglist.push(tag);
        }
        this.state = {
            name:null,
            tagData:taglist,
            selectTagItem: [],
            needToTag:false,
            uri:null,
            uri1:null,
            description:null,
            materiallist:[],
            step:1,
            stepdata:[],
            parent_id:null,
            post_id:null,
            tips:null,
            star:0,
            is_original:false
        };
        if(this.state.materiallist.length==0)this.state.materiallist.push({'id':0,'name':null,'amount':0,'memo':null});
        if(this.state.stepdata.length==0)this.state.stepdata.push({'text':null,'pictures':[]});
    }
    //渲染
    render() {
         return (
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                  <View style={styles.container}>

                        <TextInput style={styles.title} placeholder="输入项目名称" onChangeText={(name) => this.setState({name})} value={this.state.name}/>

                        <TouchableOpacity  onPress ={() => {this.state.needToTag == true?(this.setState({needToTag:false})):(this.setState({needToTag:true}))} }>
                            <Text style={styles.item}>选择分类标签</Text>
                        </TouchableOpacity>
                        {
                             this.state.needToTag == true?(
                                  this._renderTagMark()
                             ):(null)
                        }
                        {
                             this.state.selectTagItem[0] != null?(
                                  this._renderTagShow()
                             ):(null)
                        }

                        <TouchableOpacity  onPress={()=>this.doFetch(1127,431)}>
                              <Image style={{width:width,height:width/1127*431,backgroundColor: Colors.white}} source={{uri:this.state.uri}}/>
                        </TouchableOpacity>
                        <Text style={{textAlign:'center',margin:10,}} >设置缩略图</Text>
                        <TouchableOpacity style={{alignItems:'center'}} onPress={()=>this.doFetch(290,370)}>
                              <Image style={{width:width/1127*290,height:width/1127*370,backgroundColor: Colors.white}} source={{uri:this.state.uri1}}/>
                        </TouchableOpacity>

                        <Text style={styles.item} >项目描述</Text>
                        <TextInput style={styles.item2} multiline={true} placeholder="输入项目描述" onChangeText={(description) => this.setState({description})} value={this.state.description}/>

                        <Text style={styles.item} >添加材料</Text>
                        <FlatList
                             data = {this.state.materiallist}
                             renderItem={(item)=>this.materiallistItem(item)}
                        />
                        <Text style={styles.button1} onPress={this.newmaterial.bind(this)}>增加新材料</Text>

                        <Text style={styles.item} >编辑步骤</Text>
                        <FlatList
                             data = {this.state.stepdata}
                             renderItem={(item)=>this._renderItemView(item)}
                        />
                        <Text style={styles.button1} onPress={this.newstep.bind(this)}>增加步骤</Text>

                        <Text style={styles.item} >贴士</Text>
                        <TextInput style={styles.item2} multiline={true} placeholder="贴士" onChangeText={(tips) => this.setState({tips})} value={this.state.tips}/>

                        <View style={{flexDirection: "row"}}>
                             <Text style={styles.item} >难度选择</Text>
                             {this.setstar()}
                        </View>

                        <View>
                             <RadioModal
                                   selectedValue={this.state.is_original}
                                   onValueChange={(id) => this.setState({is_original: id})}
                                   style={{ flexDirection:'row',flexWrap:'wrap',
                                           alignItems:'flex-start',padding:5,marginTop:10
                                              }}>
                                   <Text value="true">原创声明</Text>
                                   <Text value="false">转载声明</Text>
                             </RadioModal>
                        </View>

                        <Text style={styles.button1} onPress={this.doFetch1.bind(this)}>发表</Text>
                  </View>
            </ScrollView>
         );
    }
    _renderTagShow(){
        let selectTagItem=this.state.selectTagItem;
        let tagData = this.state.tagData;
        let len = this.state.selectTagItem.length;
        let TagShow=[];
        for (let i = 0; i < len; i++) {
             let tag = selectTagItem[i];
             let item=tagData[tag];
             TagShow.push(
                   <TouchableOpacity style={styles.showtag} onPress={() => this._selectTagItemPress(item)} >
                        <Text style={{}}>{item.name}</Text>
                   </TouchableOpacity>
             )
        }
        return (
             <View style={{flexDirection: "row",flexWrap:'wrap'}}>
                   {TagShow}
             </View>
        );
    }
    _selectTagItemPress(item){
        if (item.select) {
             this.state.selectTagItem.splice(this.state.selectTagItem.findIndex(function (x) {
                   return x === item.id;
             }), 1);
        } else {
             this.state.selectTagItem.push(item.id);
        }
        this.state.tagData[item.id].select = !item.select;
        this.setState({tagData: this.state.tagData});
    }
    _renderTagMark(){
        var tagData = this.state.tagData;
        let len =tagData.length;
        let TagArr1 = [];
        let TagArr2 = [];
        let TagArr3 = [];
        let TagArr4 = [];
        let TagArr5 = [];
        let TagArr=[];
        for (let i = 0; i < len; i++) {
            let item = tagData[i];
            if(i==6){TagArr1=TagArr;TagArr=[];}
            if(i==26){TagArr2=TagArr;TagArr=[];}
            if(i==37){TagArr3=TagArr;TagArr=[];}
            if(i==42){TagArr4=TagArr;TagArr=[];}
            TagArr.push(
                 <TouchableOpacity
                      onPress={() => this._selectTagItemPress(item)} >
                      <Text style={styles.tag}>{item.name}</Text>
                 </TouchableOpacity>
            )
            if(i==44){TagArr5=TagArr;}
        }
        return (
            <View>
                <View style={styles.tagPage}>
                    <Text style={styles.tag}>场景：</Text>
                    <View style={styles.tagPageItem}>
                        {TagArr1}
                    </View>
                </View>
                <View style={styles.tagPage}>
                    <Text style={styles.tag}>技术：</Text>
                    <View style={styles.tagPageItem}>
                         {TagArr2}
                    </View>
                </View>
                <View style={styles.tagPage}>
                    <Text style={styles.tag}>节日：</Text>
                    <View style={styles.tagPageItem}>
                         {TagArr3}
                    </View>
                </View>
                <View style={styles.tagPage}>
                    <Text style={styles.tag}>人群：</Text>
                    <View style={styles.tagPageItem}>
                         {TagArr4}
                    </View>
                </View>
                <View style={styles.tagPage}>
                    <Text style={styles.tag}>活动：</Text>
                    <View style={styles.tagPageItem}>
                         {TagArr5}
                    </View>
                </View>
            </View>
        );
    }
    setstar(){
        var star=this.state.star;
        var starpage=[];
        for(let i=1;i<=5;i++)
        {
            if(i<=star)
            starpage.push(
                <TouchableOpacity onPress={() => {var star=i;this.setState({star});}} >
                      <Text style={{marginTop:15}} >★</Text>
                </TouchableOpacity>
            )
            else
                 starpage.push(
                      <TouchableOpacity onPress={() => {var star=i;this.setState({star});}} >
                           <Text style={{marginTop:15}} >☆</Text>
                      </TouchableOpacity>
                 )
        }
        return(
            <View style={{flexDirection: "row"}}>
                  {starpage}
            </View>
        );
    }
    doFetch(a,b){
        ImagePicker.openPicker({
           width: a,
           height: b,
           cropping: true
         }).then(image => {
            if(a==1127){let uri=image.path;this.setState({uri});}
            let uri1=image.path;
            this.setState({uri1});
         });
    }
    dostep(item){
            ImagePicker.openPicker({
               width: 1127,
               height: 431,
               cropping: true
             }).then(image => {
                item.item.pictures[0]=image.path;
                this.setState((state) => {
                     state.stepdata[item.index]= item.item;
                     return { stepdata: state.stepdata }
                })
             });

        }
    newstep(){
        var stepdata=this.state.stepdata;
        stepdata.push({'text':null,'pictures':[]});
        this.setState({stepdata});
    }
    newmaterial(){
        var materiallist=this.state.materiallist;
        let a=materiallist.length;
        materiallist.push({'id':a,'name':null,'amount':0,'memo':null});
        this.setState({materiallist});
    }
    _renderItemView(item){
        return(
            <View style={{margin:10,padding:6}}>
                  <Text style={{margin:5, padding:6}} >步骤{item.index+1}</Text>
                  <TouchableOpacity  style={{alignItems:'center'}} onPress={()=>this.dostep(item)}>
                       {
                            item.item.pictures===undefined?(<Image style={{width:width/4*3,height:width/1127*431/4*3,backgroundColor: Colors.white}}/>
                            ):(<Image style={{width:width/4*3,height:width/1127*431/4*3,backgroundColor: Colors.white}} source={{uri:item.item.pictures[0]}}/>)
                       }
                  </TouchableOpacity>
                  <TextInput style={styles.item2} multiline={true} placeholder="步骤描述"
                        onChangeText={(text) => this.setState((state) => {
                            //item.item.text=text;
                            state.stepdata[item.index].text = text;
                            return { stepdata: state.stepdata }
                         })}
                        value={item.item.text}
                 />
            </View>
        )
    }
    materiallistItem(item){
        return(
            <View style={{flexDirection: "row"}}>
                 <TextInput style={{margin:10,height:30,padding:6,backgroundColor: Colors.white,flex:2}}
                    onChangeText={(name) =>this.setState((state) => {
                        item.item.name = name;
                        state.materiallist[item.index] = item;
                        return { materiallist: state.materiallist }
                    })} value={item.item.name} placeholder="材料名" />
                 <TextInput style={{margin:10,height:30,padding:6,backgroundColor: Colors.white,flex:1}}
                    onChangeText={(amount) =>this.setState((state) => {
                        item.item.amount = amount;
                        state.materiallist[item.index] = item;
                        return { materiallist: state.materiallist }
                    })} value={item.item.amount} placeholder="材料数" />
                 <TextInput style={{margin:10,height:30,padding:6,backgroundColor: Colors.white,flex:4}}
                    onChangeText={(memo) =>this.setState((state) => {
                        item.item.memo = memo;
                        state.materiallist[item.index] = item;
                        return { materiallist: state.materiallist }
                    })} value={item.item.memo} placeholder="备注" />
            </View>
        )
    }
    doFetch1(){
        let selectTagItem=this.state.selectTagItem;
        let tagData = this.state.tagData;
        let len = this.state.selectTagItem.length;
        let ShowTagItem=[];
        for (let i = 0; i < len; i++) {
             let tag = selectTagItem[i];
             let item=tagData[tag];
             ShowTagItem.push(tagData[tag].name);
        }
        let formData = new FormData();
        formData.append("title",this.state.name);
        formData.append("cover_pic",this.state.uri);
        formData.append("cover_pic_card",this.state.uri1);
        formData.append("is_original",this.state.is_original);
        formData.append("difficulty",this.state.star);
        formData.append("tags",ShowTagItem);
        formData.append("description",this.state.description);
        formData.append("stuff",this.state.materiallist);
        formData.append("steps",this.state.stepdata);
        //formData.append("reference_post",this.state.post_id);
        formData.append("tips",this.state.tips);
        //formData.append("reprint_memo",this.state.text);
        //formData.append("attachments",this.state.text);
        //formData.append("draft_of",this.state.text);
        fetch('http://192.168.1.105:8080/p/create' , {
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
    tag:{
            margin:5,
            color:'#808080',
    },
    showtag:{
           padding:5,
           marginBottom: 5,
           marginRight: 5,
           borderRadius: 10,
           borderWidth: 0.5,
           backgroundColor: Colors.white,
        },
    tagPage:{
        flexDirection: "row",
    },
    tagPageItem:{
            flexDirection: "row",
            flexWrap:'wrap',
            width:'85%'
        },
    item:{
        margin:10,
        height:30,
        padding:6,
        flexDirection: "row",
    },//小标题文本框
    item1:{
        margin:10,
        height:30,
        padding:6,
        backgroundColor: Colors.white
    },//小输入框
    item2:{
          margin:10,
          height:90,
          padding:6,
          textAlign:'left',
          textAlignVertical:'top',
          backgroundColor: Colors.white
    },//大输入框
    title:{
        height:50,
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