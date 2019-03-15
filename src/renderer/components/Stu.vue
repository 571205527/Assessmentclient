<template>
  <div id="stu">
    <div class="topStu">
      <!-- 选中学生标签 -->
      <div class="selected" v-show="selectstu==''?false:true">
        <el-col :span="21" class="scroll_1">
          <el-button v-for="(item,index) in selectstu" :key="index" @click="del_stu(item)">{{item.stuNickname+" "+item.stuName}}</el-button>
        </el-col>
        <el-col :span="3">
          <el-button class="delall_btn red" icon="el-icon-delete" @click="delall">{{$t('m.C_empty')}}</el-button>
        </el-col>
      </div>
      <!-- 学生列表 -->
      <div class="stulist">
        <div class="scroll_0">
          <div class="card" v-for="(item, index) in stuArr" :key="index" @click="select(item,index)" :class="selectstu.indexOf(item)==-1?'no':'has'">
            <div :style="item.stuIcon==0?'background-image:url('+require('../assets/img/stu.jpg')+')':'background-image:url('+item.stuIcon+')'" class="imgstu"></div>
            <!--<div v-lazy="item.stuIcon" class="imgstu"></div>-->
            <div>
              <span class="redfont" :span="24">{{item.stuName}}</span><br/>
              <span class="EnName">{{item.stuNickname}}</span>
            </div>
            <i>{{item.orderNo}}</i>      
            <!-- <i>{{item.stuNo.substring(item.stuNo.length-2)}}</i> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 底部学生操作按钮 -->
    <el-col  class="bottomBtn" >
      <router-link tag="div" to="/class">
        <el-button class="back_class" icon="el-icon-back">{{$t('m.C_class')}}</el-button>
      </router-link>
      <el-button class="selall" icon="icon-720bianjiqi_quanxuan iconfont" @click="selall"> {{$t('m.C_Select_all')}}</el-button>
      <el-button class="evaluation red" icon="icon-unie60b iconfont" @click="evaluation"> {{$t('m.C_evaluation')}}</el-button>
    </el-col>

    <!-- 评价弹框 -->
    <el-dialog
    :title="$t('m.C_dtitle')"
    :visible.sync="centerDialogVisible"
    width="70%"
    center
    v-loading="loading" 
    :element-loading-text="$t('m.C_loading')">
      <!-- 选择标签 -->
      <div class="top_btn">
        <el-button v-for="(item,index) in pingjia" :key="index" @click.native="tag1_btn(item)" :class="tagItem.tagId==item.tagId?'has':''">{{item.tagName}}</el-button>        
      </div>  
      <!-- 选择评价项 -->
      <div class="img">
        <el-carousel :autoplay="false" trigger="click" height="130px" arrow="always" indicator-position="none" type="card" @change="tag3_btn">
          <el-carousel-item v-for="(item,index) in items_tags" :key="index" class="image" :class="tag_Item.id!=''&&tag_Item.id==item.id?'has':''">
           <img :src="item.itemIcon==0?require('../assets/img/pingjia.png'):item.itemIcon">  <!--  @click="tag2_btn(item)" -->
          </el-carousel-item>
        </el-carousel>
      </div>

      <el-form ref="form" >
          <el-form-item :label="$t('m.C_label')+'：'" style="margin-bottom:0">
              <el-input type="textarea" v-model="event_text"></el-input>
          </el-form-item>
          <el-form-item >
              {{$t('m.C_label1')}} 
          </el-form-item>
      </el-form> 

      <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">{{$t('m.C_cancel')}}</el-button>
          <el-button class="red" type="primary" @click="submit">{{$t('m.C_submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "stu",
  props: ["grade", "teacher",'pingjia' ],
  data() {
    return {
      stuArr: [],
      selectstu: [], //已选学生
      msg: "全选",
      centerDialogVisible: false, //评价弹窗
      items_tags: [],//评价标签
      tagItem: "",//评价项
      tag_Item: {},
      event_text: "",    
      loading:false,
      tags:[],
      flag:0,
    };
  },
  methods: {
    //获取评价项
    get_pingjia(obj){
      // console.log(obj)
      var ths = this;
      ths.$axios({
        method:'GET',
        url:`/v1/tag/${obj.tagId}/tagItem`,
      })
      .then(function(res){
        if(res.data.code == 403&&res.data.msg == '未登录'){
            ths.$message.error(ths.$t('m.L_timeout'));
            ths.$emit('out','登陆超时');
            return
        }
        ths.loading = false;
        res = res.data.data[0].items;
        ths.items_tags= res;
        // console.log(res,'评价项');
        //默认选中第一个评价项
        ths.tagItem = res[0];
      })
    },
    //选择学生
    select(stu, index) {
      var ths = this;
      if (ths.selectstu.indexOf(stu) == -1) {
        ths.selectstu.push(stu);
      } else {
        ths.selectstu.splice(ths.selectstu.indexOf(stu), 1);
      }
    },
    //评价按钮
    evaluation() {
      var ths = this;
      if (ths.selectstu == "") {
        ths.$message.error(ths.$t("m.C_msg"));
      } else {
        ths.centerDialogVisible = true;
      }
    },
    //全选
    selall() {
      var ths = this;
      ths.selectstu = [];
      ths.selectstu.push(...ths.stuArr);
    },
    //清空
    delall() {
      var ths = this;
      ths.selectstu = [];
    },
    // 提交评价
    submit() {
        var ths = this;       
        var stuSidsArr = [];
        var classIdArr = [];
        var id = ths.$route.params.classId;
        // console.log(ths.selectstu)
        for(var item of ths.selectstu){
          stuSidsArr.push(item.id);
          classIdArr.push(id)
        }
        var tagId =[];
        tagId.push(ths.tagItem.tagId);
        //var date = new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        var date = new Date().toLocaleString('chinese', { hour12: false }).replace(/\//g,'-');//24小时制时间
        var postdata = {
            schId:ths.teacher.schId,
            classId:classIdArr,
            tchId:ths.teacher.id,
            stuIds:stuSidsArr,
            eventCategory:'3',//事件标签id,默认课堂
            eventLocation:'教室',
            eventNote:ths.event_text,//事件内容
            eventTime:date,
            assessTime:date,
            itemId:ths.tag_Item.id,
            tagId:tagId,
            assessSrc:0,
            assessType:ths.tag_Item.itemType,//评价项反馈类型(0-正反馈, 1-负反馈)
            assessNum:'1',          
            assessScore:ths.tag_Item.itemScore ,
            // assess_id:0
          }
          // console.log(postdata)          
           
       //验证网络连接
        if(!navigator.onLine){                       
            ths.$message.error(ths.$t('m.L_net'));
            ths.$emit('net',{network:false})
            return
        }else{
            ths.$emit('net',{network:true})
        }

        //记录事件
        ths.$axios({
          url:`/v1/event/log`,
          method:'POST',
          data:postdata
        }).then(function(res){
          if(res.data.code == 403&&res.data.msg == '未登录'){
            ths.$message.error(ths.$t('m.L_timeout'));
            ths.$emit('out','登陆超时');
            return
        }
          res = res.data;
          // console.log(res);
          //评价成功提示          
          if(res.msg == 'success'&&res.code == 0){                               
              var success_msg = null;        
              if (ths.selectstu.length > 1) {
                var success_msg = `<span style="color:red">${
                  ths.selectstu.length+" "+ths.$t('m.L_mess1')
                }</span> <span style="color:red">${
                  ths.tag_Item.itemName
                }</span> ${
                  ths.tag_Item.itemType == 0?'+':'-'
                } <span style="color:red">${ths.tag_Item.itemScore}</span>`;
              } else {
                success_msg = `<span style="color:red">${
                  ths.selectstu[0].stuNickname+" "+ths.selectstu[0].stuName+" "+ths.$t('m.L_mess')
                }</span>  <span style="color:red">${
                  ths.tag_Item.itemName
                }</span>  ${
                  ths.tag_Item.itemType == 0?'+':'-'
                } <span style="color:red">${ths.tag_Item.itemScore}</span>`;
              }
              ths.$message({
                dangerouslyUseHTMLString: true,
                message: success_msg,
                type: "success",
                center: true
              });
              //评价成功清空上次评价内容
              ths.selectstu = [];
              ths.event_text = '';
              ths.centerDialogVisible = false;
          }else{
            ths.$message.error(ths.$t('m.Stu_err'));
          }
        })
        .catch(function(){
            ths.$message.error(ths.$t('m.L_servererr'));
        })
      // }
    },
    del_stu(stu) {
      var ths = this;
      ths.selectstu.splice(ths.selectstu.indexOf(stu), 1);
    },
    // 选择标签
    tag1_btn(item) {
      var ths = this;
      ths.tagItem = item;
      //验证网络连接
      if(!navigator.onLine){                       
          ths.$message.error(ths.$t('m.L_net'));
          ths.$emit('net',{network:false})
          return
      }else{
          ths.$emit('net',{network:true})
      }
      ths.$axios({
          method: "GET",
          url: `/v1/tag/${item.tagId}/tagItem`
        })
        .then(function(res1) {
          if(res1.data.code == 403&&res1.data.msg == '未登录'){
            ths.$message.error(ths.$t('m.L_timeout'));
            ths.$emit('out','登陆超时');
            return
        }
          res1 = res1.data.data[0].items;
          ths.items_tags = [];
          for (var item of res1) {            
            if (item.tagid == ths.tagItem.tagid) {
              ths.items_tags.unshift(item);
            }
          }
          ths.tag_Item = ths.items_tags[ths.flag];
        });
    },
    //选择评价项
    tag2_btn(item) {
      var ths = this;
      ths.tag_Item = item;
    },
    tag3_btn: function(key1, key2) {
      var ths = this;
      ths.tag_Item = ths.items_tags[key1];
      ths.flag = key1;//设置选默认中项跟着轮播一起移动
      console.log(key1 + ",,,*," + key2);
    },
  },
  mounted() {
    var ths = this;
    //document.addEventListener("offline", ths.onOffline(), false);
    var gradId = ths.$route.params.gradId
    var classNo = ths.$route.params.classNo;     
    for(var item of ths.grade){
      if(gradId == item.grade.gradeId){
          for(var classItem of item.classId.classStudentses){
            if(classItem.classNo == classNo){
              ths.stuArr = classItem.students;
              //console.log(ths.stuArr)
              break
            }
          }  
      }              
    }
    ths.tag1_btn(ths.pingjia[0]);
  },
};
</script>

<style lang="scss" scoped>
#stu {
  box-sizing: border-box;
  height: 84%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .topStu {
    height: 90%;
    flex: 1;
    display: flex;
    flex-direction: column;
    //已选学生
    .selected {
      padding: 1% 3%;
      padding-left: 2%;
      background: #7dd3d7;
      position: relative;
      .el-col.el-col-21 {
        max-height: 152px;
        overflow: auto;
        button {
          width: 15.5%;
          padding:12px 0; 
        }
      }
      button {
        margin: 0 10px 1% 0;
      }
      .delall_btn {
        float: right;
        position: absolute;
        right: 2%;
        top: 48%;
        margin-top: -18px;
        background: #cc5952;
        color: #fff;
        border: 0;
      }
    }
    // 学生列表
    .stulist {
      height: 100%;
      padding: 0 1%;
      flex: 1;
      overflow: hidden;
      > div {
        padding: 1% 0 0 1%;
        overflow: auto;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;       
      }
      .has{     
          background: #ebe4da!important;             
      }
      .card {
          margin: 0 1% 1% 0;
          width: 19%;
          height: 19%;
          min-height: 100px;
          border: 1px solid #ccc;
          background: #fff;          
          cursor: pointer;
          padding: 10px;
          box-sizing: border-box;
          overflow: hidden;
          float: left;
          display: flex;
          align-items: center;
          position: relative;
          &:nth-child(5n) {
            margin-right: 0;
          }
          .imgstu {
            width: 45%;
            min-width: 82px;
            background-size: cover;
            height: 100%;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border: 0;
            float: left;
          }
          div{
            width: 100%;
          }  
          span {
            display: inline-block;
            font-size: 22px;
            font-weight: 700;
            color: #606266;
            overflow: hidden;
            //text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            text-indent: 7%;
           &.EnName{
             font-size: 16px;
           } 
          }
          &:hover {
            background: #ebe4da;
            .imgstu{
              transform: scale(1.1);
            }
          }
          i{
            font-style: normal;
            background: #DB6A63 !important;
            color:#fff;
            padding: 1%;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
    }
  }

  //底部按钮
  .bottomBtn {
    padding: 1% 3%;
    box-sizing: border-box;
    position: relative;
    z-index: 1000;
    text-align: right;
    box-shadow: 0 0 10px #f4f4f4;
    .evaluation {
      margin-right: 3%;
    }
    .back_class {
      float: left;
    }
  }

  //评价弹窗
  .el-dialog__wrapper {
    overflow: hidden;
  }
  .el-dialog {
    overflow: hidden;
    .top_btn {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      button {
        width: 13%;
        padding: 12px 10px;
      }
      .has {
        color: #fff;
        background: #27b5bd;
      }
    }

    // .img {
    //   padding: 0 10% 0;
    //   margin: 5px 0;
    //   width: 100%;
    //   box-sizing: border-box;
    //   //border: 2px solid #ccc;
    //   .container {
    //     white-space: nowrap;
    //     overflow:auto;
    //     padding: 0;
    //     text-align: center;
    //     &::-webkit-scrollbar-track {
    //       //滚动条的轨道
    //       -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
    //       border-radius: 10px; /*滚动条的背景区域的圆角*/
    //       background-color: #fcfafa; /*滚动条的背景颜色*/
    //     }
    //     &::-webkit-scrollbar-thumb {
    //       // 滚动条里面的小方块
    //       background: #d2d2d2;
    //       border-radius: 5px;
    //     }
    //     &::-webkit-scrollbar {
    //       height: 6px; /*滚动条高度*/
    //     }
    //     li {
    //       &.has{border: 3px solid #27b5bd}
    //       margin:0 6% 5px;
    //       box-sizing: border-box;
    //       display: inline-block;
    //       border-radius: 4px;
    //       border: 2px solid #ccc;
    //       width: 120px;
    //       height:135px ;
    //       overflow: hidden;
    //       img {
    //         margin: 0 -7px;
    //         position: relative;
    //         width: 110px;
    //         height: 120px;
    //         &:hover {
    //           width: 115px;
    //           height: 125px;
    //         }
    //       }
    //     }
    //   }
    //   .container{
    //     //border: 2px solid #971adf;
    //     width: 100%;
    //     //display:flex;
    //     position: relative;
    //   }
    //   .left, .right{
    //     position: relative;;
    //     transform:translateY(-50%);
    //     width:40px;
    //     height:40px;
    //     background-color:rgba(0,0,0,.2);
    //     border-radius:50%;
    //     cursor:pointer;
    //      &:hover {
    //         background-color:rgba(0,0,0,.3);
    //       }
    //   }
    //   .left{
    //     float: left;
    //     margin: -18% -17%;
    //     .icon{
    //       margin: 20% 25%;
    //     }
    //   }
    //   .right{
    //     float: right;
    //     margin: -18% -10%;
    //     .icon{
    //       margin: 20% 10%;
    //     }
    //   }
    // }

    .img {
      margin: 20px 35px;
      width: 90%;
      height: 160px;
      box-sizing: border-box;
      //border: 2px solid #ccc;
      .el-carousel{
        height: 100%;
        //border: 2px solid #e48458;
      }
      .el-carousel__item{
        margin:1% 15% 5px;
      }
      // .el-carousel__item:nth-child(2n) {
      //     margin:1% 35% 5px;
      //     width: 120px;
      //     height:130px ;
      //     background-color: #c0ebbe;
      // }
      // .el-carousel__item:nth-child(2n+1) {
      //     margin:1% 35% 5px;
      //     width: 120px;
      //     height:130px ;
      //     background-color: #d3dce6;
      // }
        .image {
          &.has{border: 3px solid #27b5bd}
          //margin:0 30% 0 40%;
          box-sizing: border-box;
          border-radius: 4px;
          border: 2px solid #ccc;
          width: 130px;
          height:140px ;
          overflow: hidden;
          img {
            margin: 10px 2px;
            position: relative;
            width: 120px;
            height: 130px;
          }
      }
    }
    .el-form {
      padding: 0 5%;
      margin-bottom: -30px;
    }
    .el-button.el-button--primary {
      background: #27b5bd;
      border: 0;
    }
  }
}
/* CSS */
</style>
<style>
    .el-carousel__arrow {
      margin-top: 2%;
    }
</style>
