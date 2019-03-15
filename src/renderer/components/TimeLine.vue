<template>
  <div id="timeline">
    <!-- :model="form"  -->
    <el-form >
      <!-- 选择学生 -->
      <el-row type="flex" justify="center">      
        <el-date-picker
          :picker-options='picker_options'
          v-model="form.data"
          value-format= 'yyyy-MM-dd'
          format = 'yyyy-MM-dd'
          type='date'
          :clearable= 'false'
          :placeholder="$t('m.Inp_s')+$t('m.Inp_d1')">
        </el-date-picker>

        <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" @change="sel_grade">
          <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
        </el-select>

        <el-select  value-key='classId' v-model="form.class_" :placeholder="$t('m.Inp_c')" :disabled="disClass" @change="disStu=false;form.stu=''">
          <el-option v-for="item in classList" :key="item.classSid" :label="item.className" :value="item"></el-option>
        </el-select>

        <el-button type="primary" :disabled="disStu" @click="centerDialogVisible=true;form.stu=''" class="red" style="width:15%;" >{{form.stu==''?$t('m.Fa_dtitle1'):form.stu.stuNickname+" "+form.stu.stuName}}</el-button>
        
        <el-button type="primary" :disabled="form.data == ''|| form.grade_ == '' || form.class_ == '' || form.stu=='' ? true:false"  @click="submit()">{{$t('m.Ti_Query')}}</el-button>
       
      </el-row>
    </el-form>
    <!-- 时间轴 -->
    <el-main>
      <ul  v-show="check_" name="el-fade-in">
        <!-- 已选同学 -->
        <li class="stu_info" name="el-fade-in">
          <span>{{form.data}}</span>
          <span></span>
          <div>
            {{form.grade_==''?$t('m.Inp_s')+$t('m.Inp_g'):form.grade_.gradeName}} 
            {{form.class_==''?$t('m.Inp_s')+$t('m.Inp_c'):form.class_.className}} 
            {{form.stu==''?$t('m.Fa_dtitle1'):form.stu.stuNickname+" "+form.stu.stuName}}
          </div>
        </li>
        <!-- 时间轴 -->
        <el-collapse-transition>
          <div v-show="check_"  class="scroll_0">
            <li v-for="(item,index) in line" :key="index"  class="transition-box">
              <span> {{item.eventTime}}</span>
              <span></span>
              <div>                
                <input type="text" maxlength="15" v-model="item.eventLocation" @focus="editEvent(item.eventLocation,item.eventNote,item.id)" @blur="saveEdit(item.eventLocation,item.eventNote,item.id)"/><br />
                <textarea class="scroll_1" style="width:100%;height:40px;"  maxlength="110" v-model="item.eventNote" @focus="editEvent(item.eventLocation,item.eventNote,item.id)" @blur="saveEdit(item.eventLocation,item.eventNote,item.id)"/><br />                                           
                from：{{item.tchName}}  {{item.tagName==null?'':item.tagName}}                
              </div>  
            </li>               
          </div>
        </el-collapse-transition>
      </ul>
    </el-main>

    <!-- 底部按钮 -->
    <el-col  class="bottomBtn" >
      <router-link to="/facts">
       <el-button class=" iconfont" icon="el-icon-back" > {{$t('m.Fa_to_Record')}}</el-button>      
      </router-link>
      <router-link to="/QueryTag" class="right">
      </router-link>
    </el-col>
    <!-- 选择学生弹框 -->
    <el-dialog
    :title="$t('m.Fa_dtitle1')"
    :visible.sync="centerDialogVisible"
    width="70%"
    center
    class="dialog_stu">
      <div class="selecte select_list" >
        <el-button v-for="(item,index) in form.class_.students" :key="index" @click="sel_stu(item)" :class="item == form.stu?'has':' '">
          {{item.stuNickname+" "+item.stuName}}
        </el-button>
        
      </div>   
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>

  </div>
  
</template>

<script>

import  app  from 'electron'
import  BrowserWindow from 'electron'
export default {
  name: "timeline",
  props:['grade','teacher'],
  data() {
    return {
       disClass:true,//选择班级
       disStu:true,//选择学生
       centerDialogVisible:false,//选择学生弹窗
       check_:false,
       classList:[],
       form: {
          grade_:'',
          class_:'',
          data:'',
          stu:''
        },     
        line:[],
        picker_options:{//可选时间限制
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }, 
        location:'',//地点
        note:'',    //内容
    };
  },
  methods: {
    //保存修改事件
    saveEdit(location,note,id){
      var ths = this;
      if(location!=ths.location||note!=ths.note){
        //验证网络连接
        if(!navigator.onLine){                       
            ths.$message.error(ths.$t('m.L_net'));
            ths.$emit('net',{network:false})
            return
        }else{
            ths.$emit('net',{network:true})
        }
        ths.$axios({
          method:'POST',
          url:`v1/event/update/?id=${id}&eventNote=${note}&eventLocation=${location}`,
        })
        .then(function(res){
          if(res.data.code == 403&&res.data.msg == '未登录'){
            ths.$message.error(ths.$t('m.L_timeout'));
            ths.$emit('out','登陆超时');
            return
        }
          res = res.data;
          // console.log(res);
          if(res.msg == 'success'){
            ths.$message({
              dangerouslyUseHTMLString: true,
              message:ths.$t('m.Ti_success'),
              type: "success",
            });
          }         
        }).catch(function(){
            ths.$message.error(ths.$t('m.L_servererr'));
        })       
      }   
    },
    //修改事件
    editEvent(a,b){
      var ths = this;
      // console.log(a,b);
      ths.location = a,
      ths.note = b;
    },
    //选择年级
      sel_grade(){
        var ths = this;
        ths.disClass=false;
        ths.classList= ths.classList=ths.form.grade_;
        ths.disClass=false;
        ths.form.class_='';
        ths.form.stu='';
        ths.disStu=true;
      },
      sel_stu(stu){
        var ths = this;    
        ths.form.stu=stu;
        console.log(ths.form.stu.id);
        ths.centerDialogVisible = false;                
      },
      //确认
      submit(){
        var ths = this;
        if(!navigator.onLine){
          ths.$message.error(ths.$t('m.L_net'));
          ths.$emit('net',{network:false})
          return
        }else{
          ths.$emit('net',{network:true})
        }
        ths.$axios({
          url:`/v1/event/query?date=${ths.form.data}&classId=${ths.form.class_.classId}&stuId=${ths.form.stu.id}&tchId=${ths.teacher.id}`,//`/v1/event/time/${time}/stuSid/${ths.form.stu.stuSid}/events-info`,
          method:'GET'
        }).then(function(res){
          if(res.data.code == 403&&res.data.msg == '未登录'){
            ths.$message.error(ths.$t('m.L_timeout'));
            ths.$emit('out','登陆超时');
            return
          }
        // console.log(res)
          res = res.data.data;
          ths.line = res;
            
        })
        ths.check_ = true;
      },
      
  },
  mounted(){}
   
}
</script>

<style lang="scss" scoped>
#timeline {
    box-sizing: border-box;
    padding: 3% 6% 0;
    height: 84%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .el-form{
      padding: 0;
    }
    //时间轴
    .el-main{
      height: 100%;
      overflow: hidden;
      padding-left: 0;
      padding-right: 0;
      ul{
        height: 100%;
        font-weight: 100;
        background: url(../assets/img/time_line.png) 161px 0 repeat-y;
        &>div{
          overflow-y: auto;
          overflow-x: hidden;
          height: 90%;
        }
        
        margin: 0;
        padding: 0;
        color: #fff;
        padding: 10px 0;
        
        li{
          
          background-size:  4px 100%;
          overflow: hidden;
          padding-bottom: 20px;
          span:nth-child(1){
            padding: 8px;
            float: left;
            background:#27b5bd; 
            border-radius: 6px;
            position: relative;
            position: relative;
            width: 56px;    
            margin-left: 44px; 
            text-align: center;  
      
          }
          span:nth-child(1)::after{
            content: '';
            height: 0;
            width: 0;
            display: inline-block;
            border: 10px solid #f5f5f5;
            border-left: 10px solid #27b5bd;
            position: absolute;
            right: -20px;            
          }
          span:nth-child(2){
            background: #27b5bd;
            background-image: linear-gradient(#27b5bd,#C9EDEF);
            height: 14px;
            width: 14px;
            display: block;
            border-radius: 50%;
            float: left;
            margin: 0 40px;
            margin-top: 7px;
          }         
          div{
            float: left;
            background: #27b5bd;
            margin: 0;
            padding: 10px 20px;
            box-sizing: border-box;
            border-radius: 6px;
            width: 70%;  
                     
            position: relative;
            box-shadow: 5px 5px 5px #ccc;
            &::before{
                content: '';
                height: 0;
                width: 0;
                display: inline-block;
                border: 10px solid #f5f5f5;
                border-right: 10px solid #27b5bd;
                position: absolute;
                left: -20px;
            }
          }
          &:nth-child(1).stu_info{            
            height: 10%;
            padding-bottom:10px; 
            
            span:nth-child(1){
              width: 104px;
              margin-left: 0;
            }
            span:nth-child(2){
              height: 20px;
              width: 20px;
              margin-left: 33px;
            }
            div{     
              background: #f5f5f5;
              color: #606266;
              font-size: 20px;
              font-weight: 700;
              margin-left: -20px;  
              box-shadow: none;            
              &::before{
                border: 0;
              }
            }
            
          }
          input,textarea{
            background: none;
            border: 0;
            width: 100%;
            color: #fff;
            resize:none; 
            outline: none;
            line-height: 20px;
           
          }
          .edit{
            float: right;
            margin-right: 3%;
            // width: 1%;
          }
        }
      }
    }
    //底部按钮
    .bottomBtn{   
      padding: 1% 0;
      box-sizing: border-box;
      position: relative;
      z-index: 1000; 
      box-shadow: 0 0 10px #f4f4f4;
      .right{
        float: right;
      }
    }  

}


/* CSS */
</style>


