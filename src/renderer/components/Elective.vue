<template>
    <div id ="elective">
        <el-form :inline="true">
            <el-row type="flex" justify="center">
                <!-- 选择签到时间 -->
                <el-date-picker v-model="form.data" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" align="left" 
                    type="datetime" :clearable="false" :placeholder="$t('m.Inp_s')+$t('m.Inp_d1')" :picker-options="pickerOptions" style="width:22%">
                </el-date-picker>
                <!-- 选择兴趣课 -->
                <el-select v-model="form.elective_" value-key="subId" class="elec" :placeholder="$t('m.Ca_sign')" @change="sel_elective">
                    <el-option v-for="(item,index) in electiveList" :key="index"  :value="item" :label="item.subName"></el-option>    
                </el-select>
                <!-- 选择老师 -->
                <el-select value-key='tchId'  v-show="teacher.privilege.role==0" v-model="form.teacher_" class="elec" :placeholder="$t('m.Inp_te')" :disabled="disTeacher" @change="sel_teacher">
                    <el-option v-for="item in tchList" :key="item.tchId" :label="item.tchName" :value="item"></el-option>
                </el-select>
            </el-row>
            
        </el-form>
        <!-- 学生列表 -->
        <div class="stulist">
            <div class="scroll_0">
                <!-- @click="select(item,index)" :class="selectstu.indexOf(item)==-1?'no':'has'" -->
                <div class="card" v-for="(item, index) in stuArr" :key="index" @click="select(item,index)" :class="selectstu.indexOf(item)==-1?'no':'has'">
                    <div :style="item.stuIcon==0?'background-image:url('+require('../assets/img/stu.jpg')+')':'background-image:url('+item.stuIcon+')'" class="imgstu"></div>
                    <!--<div v-lazy="item.stuIcon" class="imgstu"></div>-->
                    <!-- 正面内容 onclick="document.querySelector('#flip-toggle').classList.toggle('hover');" -->
                    <!-- <div class="flip-container" id ="flip-toggle"> -->
                        <div class="flipper">
                            <span class="redfont" :span="24">{{item.stuName}}</span><br/>
                            <span class="EnName">{{item.stuNickname}}</span>
                            <span class="EnName1" :span="24">{{lan=='en'?item.className.substring(6):item.className.substring(0,5)}}</span>
                        </div>
                        <div class="back">
                            <!-- 反面内容 -->
                        </div>
                    <!-- </div> -->
                    <i>{{item.orderNo}}</i>
                </div>
            </div>
        </div>
        
        <!-- 底部学生操作按钮 -->
        <el-col  class="bottomBtn" >
            <el-button class="back_class red" icon="icon-menu iconfont" > {{$t('m.Co_Details')}}</el-button>
            <el-button class="evaluation red" icon="icon-qiandao iconfont" @click="elective_sign"> {{$t('m.Co_Sign')}}</el-button>
        </el-col>
    </div>
</template>
<script>
export default {
  name: "elective",
  props: ["teacher"],
  data() {
      return{
        lan:"",//语言
        electiveList:"",
        tchList:"",
        disTeacher:false,
        stuArr:[],
        selectstu:[],
        form:{
            elective_:"",//兴趣课
            teacher_:"",//授课教师
            data:"",//签到日期
        },
        pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now();
            },
            shortcuts: [{
            text: this.$t('m.Co_text1'),
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
            }
            }, {
            text: this.$t('m.Co_text2'),
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
                picker.$emit('pick', date);
            }
            }]
        },
      }
  },
  methods: {
    //选择兴趣课
    sel_elective() {
      var ths = this;
      ths.tchList = ths.form.elective_;
      if(ths.tchList.length==1){
        ths.form.teacher_ = ths.tchList[0];
        ths.stuArr = ths.tchList[0].students;
        ths.selectstu = [];
        ths.selectstu.push(...ths.stuArr);
      }else{
        ths.stuArr = "";
        ths.form.teacher_ = "";
      }
    },
    //选择教师
    sel_teacher(){
        var ths=this;
        if(ths.tchList.length>1){
            ths.stuArr=ths.form.teacher_.students;
            ths.selectstu = [];
            ths.selectstu.push(...ths.stuArr);
        }
      //console.log(ths.selectstu)
    },
    //选择学生
    select(stu, index) {
      var ths = this;
      if (ths.selectstu.indexOf(stu) == -1) {
        ths.selectstu.push(stu);
        stu.signType = 0;
      } else {
        ths.selectstu.splice(ths.selectstu.indexOf(stu), 1);
        stu.signType = 1;
      }
      //console.log(ths.stuArr)
    },
    //考勤
    elective_sign(){
        var ths = this;
        console.log(ths.form.elective_);
        var postData={
            signTime:ths.form.data,
            subId:ths.form.elective_.subId,
            tchId:ths.teacher.id,
            stuArr:ths.stuArr,
        }
        ths.$axios({
        method:'POST',
        url:`/v4/elective/sign/`,
        data:postData
      })
      .then(function(res){
        if(res.data.code == 403&&res.data.msg == '未登录'){        
            ths.$message.error(ths.$t('m.L_timeout'));              
            ths.$emit('out','登陆超时');
            return                  
        }}).catch(function(err){
          console.log(err)
      })
    }
  },
  mounted() {
    var ths = this;
    ths.lan = localStorage.lg;
    ths.form.data = new Date().toLocaleString('chinese', { hour12: false }).replace(/\//g,'-');
    console.log(ths.form.data)
    //验证网络连接
    if(!window.navigator.onLine){
        ths.$message.error(ths.$t('m.L_net'));
        ths.$emit('net',{network:false})
        return
    }else{
        ths.$emit('net',{network:true})
    }
    ths.$axios({
        method:'GET',
        url:`/v4/elective/stuList/${ths.teacher.id}`
      })
      .then(function(res){
        if(res.data.code == 403&&res.data.msg == '未登录'){        
            ths.$message.error(ths.$t('m.L_timeout'));              
            ths.$emit('out','登陆超时');
            return                  
        }
        if(res.data.code==0){
            res = res.data.data;
            ths.electiveList = res;
            ths.form.elective_ = ths.electiveList[0];
            //if(ths.electiveList.length==1){
                ths.form.elective_ = ths.electiveList[0];
                if(ths.electiveList[0].teacherStudents.length==1){
                    ths.form.teacher_ = ths.electiveList[0].teacherStudents[0];
                    if(ths.teacher.privilege.role!=0){
                        ths.stuArr = ths.electiveList[0].teacherStudents[0].students;
                        ths.selectstu.push(...ths.stuArr);
                    }
                }
                ths.tchList = ths.electiveList[0].teacherStudents;
            //}
            
            console.log(ths.form.elective_);
        }else{
            ths.$message.error(ths.$t('m.Co_err'));
        } 
      }).catch(function(err){
          console.log(err)
      })
   },
}
</script>
<style>
    .el-form{
        margin-top: 1%;
    }
    
</style>

<style lang="scss" scoped>
#elective {
    box-sizing: border-box;
    height: 84%;
    display: flex;
    flex-direction: column;
    .elec {
        width: 22%;
    }
}

//底部按钮
.bottomBtn {
    padding: 1% 6%;
    box-sizing: border-box;
    position: relative;
    z-index: 1000;
    text-align: right;
    box-shadow: 0 0 10px #f4f4f4;
    //border: #DB6A63 2px solid;
    .back_class {
        float: left;
    }
    
}

/* 整个容器，包括透视 */
.flip-container {
    -webkit-perspective: 1000;
    perspective: 1000;
}
/* 鼠标放上去的时候翻转 */
// .flip-container:hover .flipper, .flip-container.hover .flipper {
//     transform: rotateY(180deg);
// }
/* 翻转速度设置 */
.flipper {
    //border: #DB6A63 2px solid;
    transition: .5s;
    transform-style: preserve-3d;
    position: relative;
}
/* 翻转页的时候隐藏背面 */
.front, .back {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
}
/* 前面板放在上面 */
.front {
    z-index: 2;
    transform: rotateY(0deg);
}
/* 背面初始的时候隐藏 */
.back {
    transform: rotateY(180deg);
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
            text-indent: 8%;
            &.EnName{
                font-size: 15px;
            }
            &.EnName1{
                font-size: 12px;
            }
            &.redfont{
                font-size: 18px!important;
            }
        }
        .imgstu:hover{
            transform: scale(1.1);
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
</style>