<template>
  <div id="interest">
    <!-- 选择学生表单 -->
    <el-form id="sign">
      <el-row type="flex" justify="center">
        <el-date-picker v-model="form.data" v-show="teacher.privilege.role==0" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          align="left" type="datetime" :clearable="false" :placeholder="$t('m.Inp_s')+$t('m.Inp_d1')" :picker-options="pickerOptions1" style="width:22%">
        </el-date-picker>
        <!-- 普通老师兴趣课 -->
        <el-select v-model="form.inId" value-key="subId"  :placeholder="$t('m.Inp_s')+$t('m.F_Interest')"  @change="disDate = false" v-show="teacher.privilege.role!=0"> 
          <el-option v-for="(item,index) in inClassList" :key="index"  :value="item" :label="item.subName" :disabled="item.subName==''?true:false"></el-option>    
        </el-select>
        <!-- 管理员 -->
        <el-select v-model="formD.inId" value-key="subId"  :placeholder="$t('m.Inp_s')+$t('m.F_Interest')" @focus="getInClass" @change="selIn" v-show="teacher.privilege.role==0">
          <el-option v-for="(item,index) in inClassList" :key="index"  :value="item" :label="item.subName" :disabled="item.subName==''?true:false"></el-option>    
        </el-select>
        <el-select v-model="formD.Inteacher1" value-key="id" :placeholder="$t('m.Inp_s')+$t('m.H_teacher')" @change="disDate=false" v-show="teacher.privilege.role==0">
          <el-option v-for="(item,index) in Inteacher" :key="index"  :value="item" :label="item.tchName"></el-option>    
        </el-select>
        <!-- <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" :disabled="disDate" @change="sel_grade" >
          <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
        </el-select> -->

        <el-select v-model="form.class_"  value-key='classId' :placeholder="$t('m.Inp_c')" @change="showStu($event)">
          <el-option v-for="(item,index) in classList" :key="index" :label="item.className" :value="item"></el-option>
        </el-select>
      </el-row>
    </el-form>   
    <!-- 学生列表 -->
      <div class="stulist scroll_1">
        <p v-show="signStuNum == 0?false:true">{{$t('m.Co_num')}}：{{signStuNum}}</p>
        <div>
          <div class="card" v-for="(item,index) in stuList1" :key="index" @click="select(item,index)" :class="selectstu.indexOf(item)==-1?'no':'has'">
            <div :style="item.stuIcon==0?'background-image:url('+require('../assets/img/stu.jpg')+')':'background-image:url('+item.stuIcon+')'" class="imgstu"></div>
            <div>
              <span class="redfont" :span="24">{{item.stuName}}</span>
              <span class="EnName" :span="24">{{item.stuNickname}}</span>
            </div>           
            <i>{{item.orderNo}}</i>
          </div>
        </div>
      </div>
    <!-- 底部学生操作按钮 -->
    <el-col  class="bottomBtn" >
        <el-button class="back_class red" icon="icon-menu iconfont" @click="signDetailPop=true" > {{$t('m.Co_Details')}}</el-button>
      <el-button class="evaluation red" icon="icon-qiandao iconfont" @click="signIn" > {{$t('m.Co_Sign')}}</el-button>
    </el-col>

   <!-- 签到详情弹窗 -->
    <el-dialog
    :title="$t('m.Co_Details')"
    :visible.sync="signDetailPop"
    width="70%"
    center
    class="dialog_stu"
    >
      <el-form label-width="" id="details">
        <el-select v-model="formD.inId" value-key="subId"  :placeholder="$t('m.Inp_s')+$t('m.F_Interest')" @change="selIn" class="sub">
          <el-option v-for="(item,index) in inClassList" :key="index"  :value="item" :label="item.subName" :disabled="item.subName==''?true:false"></el-option>    
        </el-select>
        <el-select v-model="formD.Inteacher" value-key="id"  :placeholder="$t('m.Inp_s')+$t('m.H_teacher')" @change="detailStu=[]" class="tch">
          <el-option v-for="(item,index) in Inteacher" :key="index"  :value="item" :label="item.tchName"></el-option>    
        </el-select>
        <el-date-picker
          :readonly = "administrator"
          v-model="formD.date"
          type="date"
          :placeholder="$t('m.Inp_s')+$t('m.Inp_d1')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :picker-options='picker_options'
          >
        </el-date-picker>
        <el-button type="primary" class="red" @click="signDetail" :disabled="formD.Inteacher==''||formD.date==''||formD.inId==''?true:false">{{$t('m.Ti_Query')}}</el-button>
      </el-form>
      <div class="selecte select_list" >
        <el-button  v-for="(item,index) in detailStu" :key="index" @click="cancelStu(item)" :class="canStu==item?'has':'no'" :title="item.className">{{item.students[0].stuNickname+" "+item.students[0].stuName}}</el-button>
        <p  class="tishi" v-show="nodata">{{$t('m.Ca_msg1')}}</p>
      </div>   
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" icon="el-icon-delete" @click="cancelSign" :disabled="canStu==''?true:false">{{$t('m.Co_Delete')}}</el-button>
          <el-button type="primary"  @click="hideForm">{{$t('m.B_ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "interest",
  props: ["grade", "teacher"],
  data() {
    return {
      disDate: true, //选择时间
      disClass: true, //选择班级
      signDetailPop: false,//签到详情弹窗
      classList: [],
      stuList:[],
      stuList1:[],
      signStuNum:0,//已签到学生数
      inClassList: [],
      detailStu:[],//已签到学生
      selectstu: [],//已选学生
      pickerOptions1: {
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
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      form: {
        inId:"",//兴趣课
        grade_: "",//年级
        class_: "",//班级
        data: "",//时间
      },
      Inteacher:[],//兴趣课老师
      formD:{//签到详情
        date:`${new Date().toLocaleDateString().replace(/\//g,'-')}`,
        inId:'',
        Inteacher:'',
        Inteacher1:''
      },
      nodata:false,//暂无数据
      canStu:'',//修改签到学生
      administrator:true,//管理员
      picker_options: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    };
  },
  methods: {
    hideForm(){
      this.signDetailPop = false;
      this.formD.inId = '';
      this.formD.Inteacher = '';
    },
    //选择兴趣课
    selIn(){
      var ths = this;
      ths.Inteacher=[];
      ths.Inteacher.push(...ths.formD.inId.teachers);
      ths.detailStu=[];
      ths.formD.Inteacher = '';
    },
    cancelStu(obj){//取消签到的学生
      this.canStu = obj;      
    },
    cancelSign(){//取消签到
      var ths = this;
      var obj = ths.canStu;
      var data = {
        id:obj.signId,
        schId:ths.teacher.schId,
        tchId:ths.teacher.id,
        classId:obj.students[0].classId,
        subId:ths.formD.inId.subId,
        stuId:obj.students[0].id,
        signTime:obj.signTime          
      }
      //验证网络连接
      if(!navigator.onLine){                       
          ths.$message.error(ths.$t('m.L_net'));
          ths.$emit('net',{network:false})
          return
      }else{
          ths.$emit('net',{network:true})
      }
      ths.$axios({
        method:'GET',
        url:`/v2/subject/modify`,
        params:{
          id:obj.signId,
          schId:ths.teacher.schId,
          tchId:ths.teacher.id,
          classId:obj.students[0].classId,
          subId:ths.formD.inId.subId,
          stuId:obj.students[0].id,
          signTime:obj.signTime
        }
      })
      .then(function(res){
        ths.canStu = '';
        if(res.data.code == 403&&res.data.msg == '未登录'){        
            ths.$message.error(ths.$t('m.L_timeout'));              
            ths.$emit('out','登陆超时');
            return                  
        }
        res = res.data;
        // console.log(res)
        if(res.msg == 'success'){
          ths.signDetail();
          ths.$message({
            message:ths.$t('m.Co_success'),
            type:'success'
          });
        }else{
          ths.$message.error(ths.$t('m.Co_err'));
        }        
      })
      .catch(function(){
        ths.$message.error(ths.$t('m.L_servererr'));
      })

    },  
    signDetail(){//签到详情
      var ths = this;
      // console.log(ths.formD);
      
      //验证网络连接
      if(!navigator.onLine){                       
          ths.$message.error(ths.$t('m.L_net'));
          ths.$emit('net',{network:false})
          return
      }else{
          ths.$emit('net',{network:true})
      }
      
      ths.$axios({
        method:'GET',
        url:`/v2/subject/list/${ths.formD.inId.subId}/${ths.formD.Inteacher.id}/${ths.formD.date}`
      })
      .then(function(res){               
        if(res.data.code == 403&&res.data.msg == '未登录'){        
            ths.$message.error(ths.$t('m.L_timeout'));              
            ths.$emit('out','登陆超时');
            return                  
        }
        ths.canStu = '';
        res = res.data.data;
        ths.detailStu = [];
        if(res.length == 0){
          ths.nodata = true;
        }else{
          ths.detailStu = res;
          ths.nodata = false;
        }
      })
    },
    //格式化
    formatNum(e){
      if(localStorage.lg=='en'){
        switch(e){
            //case 0:return "日";break;
            case 1:return "Grade "+e+" Class ";break;
            case 2:return "Grade "+e+" Class ";break;
            case 3:return "Grade "+e+" Class ";break;
            case 4:return "Grade "+e+" Class ";break;
            case 5:return "Grade "+e+" Class ";break;
            case 6:return "Grade "+e+" Class ";break;
            default: return e+" ";
        }
      }else{
        switch(e){
            //case 0:return "日";break;
            case 1:return "一";break;
            case 2:return "二";break;
            case 3:return "三";break;
            case 4:return "四";break;
            case 5:return "五";break;
            case 6:return "六";break;
            default: return e;
        }
      }
    },
    //选择年级
    sel_grade() {
      var ths = this;
      //ths.classList = ths.classList = ths.form.grade_;
      //ths.classYear = ths.classList[0].classYear;
      ths.disClass = false;
      ths.form.class_ = "";
      var date = new Date();
      var curYear = date.getFullYear();
      var curMonth = date.getMonth();
      //var mark=[];
      for(let i in ths.grade){
        var item = ths.grade[i].classId.classStudentses;
        //console.log(item)
        for(let j in item){
            if(curMonth >= 8){
                var classYear = (curYear-item[j].classYear<0)?item[j].classYear:curYear-item[j].classYear+1;
            }else{
                classYear = (curYear-item[j].classYear<=0)?item[j].classYear:curYear-item[j].classYear;
            }
            var str={
              classId:item[j].classId,
              className:ths.formatNum(classYear)+'('+item[j].classNo+')'
            }
            ths.classList.push(str);
            ths.stuList.push(item[j]);
        }
        //ths.classList=mark;
      }
        //console.log(ths.stuList)
    },
    //获取学生名单
    showStu: function (event) {
        this.selectstu = [];
        if(event.length<=0){
            this.stuList1="";
        }
        for (var i = 0;i<this.classList.length;i++) {
            if (this.stuList[i].classId == this.form.class_.classId){
                  this.stuList1=this.stuList[i].students;
                  break;
            }
        }
    },
    //选择学生
    select(stu, index) {
      var ths = this;
      if (ths.selectstu.indexOf(stu) == -1) {
        ths.selectstu.push(stu);
      } else {
        ths.selectstu.splice(ths.selectstu.indexOf(stu), 1);
      }
      console.log(ths.selectstu);
    },
    //签到
    signIn(){
      var ths = this;
      if(ths.selectstu.length<=0||ths.teacher.privilege.role==0?ths.formD.inId=='':ths.form.inId==''||ths.form.class_==''){
        ths.$message.error(ths.$t('m.Co_emptyStu'));
      }else if(ths.form.data==''&&ths.teacher.privilege.role==0){
          ths.$message.error(ths.$t('m.Co_slelectDate'));
      }else{
        var date = new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        //验证网络连接
        if(!navigator.onLine){                       
            ths.$message.error(ths.$t('m.L_net'));
            ths.$emit('net',{network:false})
            return
        }else{
            ths.$emit('net',{network:true})
        }   
        var stuSidsArr = [];
        for(var item of ths.selectstu){
            stuSidsArr.push(item.id);
        }
        if(ths.teacher.privilege.role!=0){
          ths.form.data = date;
          var url = `/v2/subject/sign?schId=${ths.teacher.schId}&tchId=${ths.teacher.id}&classId=${ths.form.class_.classId}&stuIds=${stuSidsArr}&subId=${ths.form.inId.subId}&signTime=${ths.form.data}`;
        }else{
          url = `/v2/subject/sign?schId=${ths.teacher.schId}&tchId=${ths.formD.Inteacher1.id}&classId=${ths.form.class_.classId}&stuIds=${stuSidsArr}&subId=${ths.formD.inId.subId}&signTime=${ths.form.data}`;
        }
        console.log("date："+Date);
        console.log("stus："+stuSidsArr);
        ths.$axios({
          method:'GET',
          url:url //`/v2/subject/sign?schId=${ths.teacher.schId}&tchId=${ths.formD.Inteacher.id}&classId=${ths.form.class_.classId}&stuIds=${stuSidsArr}&subId=${ths.formD.inId.subId}&signTime=${ths.form.data}`,
        })
        .then(function(res){
          if(res.data.code == 403&&res.data.msg == '未登录'){        
            ths.$message.error(ths.$t('m.L_timeout'));              
            ths.$emit('out','登陆超时');
            return                  
          }        
          if(res.data.msg == 'success'){
            ths.$message.success(ths.$t('m.Co_success'));
            ths.signStuNum = res.data.data;
          }else if(res.data.code == 1){
            ths.signStuNum = res.data.data;
            console.log(res.data.msg+ths.$t('m.Co_repeatsign')),
            ths.$message({
                message: res.data.msg+ths.$t('m.Co_repeatsign'),
                type: 'warning',
                //duration: 5,
                showClose: true
            });
            //ths.$message.error(res.data.msg+ths.$t('m.Co_repeatsign'));
            //ths.$message.error(ths.$t('m.Co_repeatsign'));
          }else if(res.data.msg == '今日签到人数已达上限！'&&res.data.code == 1){
            ths.$message.error(ths.$t('m.Co_upperlimit'));
          }else{
            ths.$message.error(ths.$t('m.Co_err'));
          }
          ths.selectstu = [];
        })
      }
    },
    getInClass(){//获取兴趣课
      var ths = this;
      ths.$axios({
        method:'GET',
        url:`/v2/subject/lesson/${ths.teacher.id}`
      })
      .then(function(res){
        if(res.data.code == 403&&res.data.msg == '未登录'){        
            ths.$message.error(ths.$t('m.L_timeout'));              
            ths.$emit('out','登陆超时');
            return                  
        }
        res = res.data.data;
        ths.inClassList = res;
        if(ths.teacher.privilege.role!=0 && ths.inClassList.length!=0){
          ths.form.inId = ths.inClassList[0];
          //console.log(ths.form.inId)
        }
      })
      .catch(function(err){
      })
    },
  },
  mounted() {
    this.form.data = new Date().toLocaleString('chinese', { hour12: false }).replace(/\//g,'-');
    console.log(this.form.data)
    this.sel_grade();
    if(this.teacher.privilege.role === 0){
      this.administrator = false;
    }
    // else{
      this.getInClass();
    // }
  }
};
</script>

<style lang="scss" scoped>
#interest {
  box-sizing: border-box;
  // padding: 1% 0 1%;
  height: 84%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  #sign {
    padding: 3% 6% 1%;
    text-align: center;
    .el-select{
      //border: aqua 1px solid;
        width: 30%;
    }
  }
  #details{
    padding: 1% 0 1%;
    text-align: center;
    .sub{
      width: 35%;
    }
    .tch{
      width: 25%;
    }
  }
  //无数据时提示
  .tishi {
    color: #777777;
    font-size: 40px;
    font-weight: 700;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translatex(-50%);
  }
  .stulist {
    height: 100%;
    padding: 0 1%;
    flex: 1;
    overflow: auto;
    >p{
      text-align: center;
      margin-top: 0;
    }
    > div {
      padding: 0 0 0 1%;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    .has {
      background: #ebe4da !important;
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
      &:nth-of-type(5n) {
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
        .imgstu {
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
  //底部按钮
  .bottomBtn {
    padding: 1% 6%;
    box-sizing: border-box;
    position: relative;
    z-index: 1000;
    text-align: right;
    box-shadow: 0 0 10px #f4f4f4;
    .back_class {
      float: left;
    }
  }
}

/* CSS */
</style>
<style>
#interest .el-form .el-select{
  margin-left:10%;
}
</style>




