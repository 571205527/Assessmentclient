<template>
  <div id="facts">
    <!-- :model="form"  -->
    <el-form  label-width="120px">
      <el-row>
        <el-form-item :label="$t('m.Fa_lb0')" required class="lineblock" >
          <!-- 选择年级 -->
          <!-- <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" @change="sel_grade">
            <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
          </el-select> -->
          <!-- 选择班级 -->
          <el-select  value-key='classId' v-model="form.class_" :placeholder="$t('m.Inp_c')"  @change="disStu=false,showStu($event)">
            <el-option v-for="(item,index) in classList" :key="index" :label="item.className" :value="item"></el-option>
          </el-select>
          <!-- 选择学生 -->
          <el-button type="primary" :disabled="disStu" @click="selstuPop=true" class="red">{{$t('m.Fa_dtitle1')}}</el-button>
        </el-form-item>
      </el-row>

      <!-- 已经选择的学生 -->
      <div class="selecte selected"  v-show="selectstu.length==0?false:true">
        <el-button v-for="(item,index) in selectstu" :key="index"  @click.native="del(item)">{{item.stuNickname+" "+item.stuName}}</el-button>
      </div>
 
      <el-row>
        <el-form-item  :label="$t('m.Fa_lb1')" required >
          <div>
            <!-- 时间 -->
            <el-date-picker
              style="float:left"
              v-model="form.data"
              :picker-options='picker_options'
              type="datetime"
              :clearable="false"
              :placeholder="$t('m.Inp_d1')"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd hh:mm:ss"
              >
            </el-date-picker>
          </div>
        </el-form-item>
      </el-row>

      <el-row >
        <!-- 地点 -->
        <el-form-item :label="$t('m.Fa_lb2')"  required>
          <!-- <el-input type="input" v-model="form.address" :maxlength=15></el-input> -->
          <el-select :placeholder="$t('m.Inp_s')+$t('m.Inp_a')" filterable v-model="form.address" allow-create>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <!-- 内容 -->
        <el-form-item :label="$t('m.Fa_lb3')" required>
          <el-input type="textarea" resize='none' :rows="4" v-model="form.desc"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <!-- 事件标签 -->
        <el-form-item :label="$t('m.Fa_lb4')" required>
          <el-select v-model="form.categorySid" value-key="id" :placeholder="$t('m.Inp_s')+$t('m.Inp_t')" clearable @focus="getEventTag"  @change="category_sub">
            <el-option v-for='(item,index) in eventCategory' :key = index :label="item.tagName" :value="item"></el-option>
          </el-select>
          <el-select value-key="id" v-model="form.categorySub" :placeholder="$t('m.Inp_s')+$t('m.Inp_e2')" :disabled="(form.categorySid==''||events_ =='')?true:false">
            <el-option :label="item.itemName" :value="item" v-for="(item,index) in events_" :key="index" v-if="index<15"></el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <!-- 能量 -->
      <el-row>    
        <el-form-item :label="$t('m.Fa_Energy')" class="lineblock unrequired" required>
          <el-select value-key="id" clearable v-model="form.tagItem" :placeholder="$t('m.Fa_Energy')" @change="pingjia_sub">           
            <el-option :label="item.tagName" :value="item" v-for="(item,index) in pingjia" :key="index"></el-option>
          </el-select>           
          <el-select value-key="id" v-model="form.tag_Item" :placeholder="$t('m.Inp_s')+$t('m.Inp_e1')" :disabled="form.tagItem==''?true:false" filterable>
            <el-option :label="item.itemName" :value="item" v-for="(item,index) in pingjia_" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-row>  

      <el-form-item style="margin-bottom:0!important;">
        <!-- 推送 复选框 -->
        <el-row>
          <el-checkbox v-model="send_parents" @change="toggle()">{{$t('m.Fa_send')}}</el-checkbox><b v-show="send_parents&&pictureUrl==''?true:false" style="margin-left:10px;font-size:14px;color:rgb(255,0,0);">{{$t('m.Fa_pic')}}</b><b v-show="send_parents&&pictureUrl!=''?true:false" style="margin-left:10px;font-size:14px;color:rgb(49,148,208);">{{pictureUrl}}</b><br />
        </el-row>
        <el-button type="primary" @click="submitForm('form')" class="red" style="width:18%;">{{$t('m.Fa_record')}}</el-button>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <el-col  class="bottomBtn" >
      <router-link to="/querytag">
        <el-button class="iconfont el-icon-search red" type="primary"> {{$t('m.Fa_Query')}}</el-button>
       </router-link>
       <router-link to="/timeline">
        <el-button class="iconfont icon-shijianzhou red" type="primary"> {{$t('m.Fa_timeline')}}</el-button>
       </router-link>
    </el-col>

<!-- 选择图片弹窗 -->
    <el-dialog
    :title="$t('m.Fa_pic')"
    :visible.sync="selpicPop"
    width="70%"
    center
    class="dialog_pic"
    >
      <div class="piclist scroll_1">
        <div class="card" v-for="(item, index) in pics" :key="index" @click="active(item,index)" :class="pictureUrl!=item?'no':'yes'" >
          <!-- <div :src="'http://118.25.65.152/images/push/'+item" :title="item" class="imgstu" style="width:100%;" ></div> -->
          <div :style="'background-image:url(http://118.25.65.152/images/push/'+item+')'" :title="item" class="imgstu"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="medium" @click="selpicPop = false">{{$t('m.B_add')}}</el-button>
      </span>
    </el-dialog>

<!-- 选择学生弹窗 -->
    <el-dialog
    :title="$t('m.Fa_dtitle1')"
    :visible.sync="selstuPop"
    width="70%"
    center
    class="dialog_stu"
    >
      <div class="select select_list" >
        <el-button  v-for="(item,index) in stuList1" :key="index" @click="sel_stu(item)" :class="selectstu.indexOf(item)==-1?'no':'has'">{{item.stuNickname+" "+item.stuName}}</el-button>
      </div>   
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="medium" @click="selstuPop = false">{{$t('m.B_add')}}</el-button>
      </span>
    </el-dialog>

    <!-- 记录确认弹窗 -->
    <el-dialog
    :title="$t('m.Fa_dtitle0')"
    :visible.sync="confirmPop"
    width="70%"
    :before-close="handleClose"
    center>
       <ul class="confirm">
        <li>
          <span>{{$t('m.Fa_lb0')}}：</span>
          <div>
            <!-- <el-categorySid v-for="(item,index) in selectstu" :key = index type="info">{{item.stuName}}</el-categorySid> -->
            <span v-for="(item,index) in selectstu" :key = index>{{item.stuNickname+" "+item.stuName}}</span>
          </div>
        </li>
        <li>
          <span>{{$t('m.Fa_lb1')}}：</span>
          <span>{{form.data}}</span>
        </li>
        <li>
          <span>{{$t('m.Fa_lb2')}}：</span>
          <span>{{form.address}}</span>
        </li>
        <li>
          <span>{{$t('m.Fa_lb3')}}：</span>
          <span>{{form.desc}}</span>
        </li>
        <li>
          <span>{{$t('m.Fa_lb4')}}：</span>
          <span>{{form.categorySid.tagName}}</span>
        </li>
        <li v-show="flag==1?false:true">
          <span>{{$t('m.Fa_Energy')}}：</span>
          <span>{{form.tagItem.tagName}}  &nbsp;&nbsp;{{form.tag_Item.itemName}} {{form.tag_Item.itemType == 0?'+':'-'}}{{form.tag_Item.itemScore}}</span>
        </li>
      </ul> 
      <span slot="footer" class="dialog-footer">
          <el-button class="red" type="primary" @click="confirm_submit">{{$t('m.B_ok')}}</el-button>
          <el-button style="color:#f4f4f4;background-color:#aaa" type="primary" @click="confirmPop=false">{{$t('m.B_cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "facts",
  props:['grade','teacher','pingjia'],
  data() {
    return {
       disClass:true,//选择班级
       disStu:true,//选择学生
       dispic:true,//选择图片
       selstuPop:false,//选择学生弹窗
       selpicPop:false,//选择图片弹窗
       confirmPop:false,//记录确认弹窗
       send_parents:false,//是否推送家长
       is_send:false,//推送状态
       is_record:false,//记录状态
       pictureUrl:'',
       selectstu:[],
       eventCategory:[],//事件标签
       events_:[],//事件子标签
       pingjia_:[],//评价项列表
       pics:[],//图片列表
       options: [{
         value: this.$t('m.L_addr'),
         label: this.$t('m.L_addr'),
       }, {
         value: this.$t('m.L_din'),
         label: this.$t('m.L_din')
       }, {
         value: this.$t('m.L_play'),
         label: this.$t('m.L_play')
       }],
       form: {
          data:'',//日期时间
          dataHour:'',//小时
          dataMin:'',//分钟
          grade_:'',//年级
          class_:'',//班级
          address:'',//地点
          desc:'',//内容
          categorySid:'',//事件标签
          categorySub:'',//事件子标签
          tagItem:'',//能量标签
          tag_Item:'',//评价项
        },
        stuList:[],
        classList:[],
        stuList1:[],       
        picker_options:{//可选时间限制
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
      flag:1,//是否评价
      flage:1,//是否推送
    };
  },
  methods: {
    //关闭确认窗
    handleClose(done) {
      var ths = this;
        ths.$confirm(ths.$t('m.Fa_close'))
          .then(_ => {
            done();
            ths.confirmPop = false;
            ths.send_parents==false
            ths.is_record = false;
            ths.selectstu = [];
            ths.form.desc='';
            ths.form.categorySid='';
            ths.form.categorySub='';
            ths.form.tagItem='';
            ths.form.tag_Item='';
          })
          .catch(_ => {});
      },
      //获取学生名单
      showStu: function (event) {
        if(event.length<=0){
            //this.form.stu="";
            this.stuList1="";
        }
        for (var i = 0;i<this.classList.length;i++) {
            if (this.stuList[i].classId == this.form.class_.classId){
                  this.stuList1=this.stuList[i].students;
                  break;
            }
        }
    },
    //获取事件标签
    getEventTag(){
      var ths = this;
      ths.$axios({
        url:`/v1/tag/2`,// 1-能量站评价项标签  2-事件标签
        method:'GET'
      })
      .then(function(res){
        if(res.data.code == 403&&res.data.msg == '未登录'){
              ths.$message.error(ths.$t('m.L_timeout'));
              ths.$emit('out','登陆超时');
              return
          }
        res = res.data.data;
        // console.log(res)
        ths.eventCategory = res;
      })
    },
    //获取图片列表
    get_pics(obj){
      var ths = this;
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
        url:`/v2/pics/list`,
      })
      .then(function(res){
        if(res.data.code == 403&&res.data.msg == '未登录'){
            ths.$message.error(ths.$t('m.L_timeout'));
            ths.$emit('out','登陆超时');
            return
        }
        ths.loading = false;
        res = res.data.data;
        ths.pics= res;
        //默认选中第一个评价项
        ths.pictureUrl = res[0];
      })
    },
    //设置图片选中
    active (pics,index) {
      var ths = this;
      if (ths.pictureUrl != pics) {
        ths.pictureUrl = pics;
        console.log("选中："+ths.pictureUrl);
      } else {
        ths.pictureUrl = "";
      }
    },
    //改变复选框状态
    toggle(){
      var ths = this; 
      if(ths.send_parents == true){
        //ths.ok=true;
        ths.selpicPop=true;
        console.log("selpicPop:"+ths.selpicPop);
      }else{
        //ths.ok=false;
        ths.selpicPop=false;
      }
    },
    //选择事件子标签
      category_sub(){
        var ths = this; 
        // console.log(ths.form.tagItem)
        //验证网络连接
        if(!navigator.onLine){                       
            ths.$message.error(ths.$t('m.L_net'));
            ths.$emit('net',{network:false})
            return
        }else{
            ths.$emit('net',{network:true})
        }
        if(ths.form.categorySid.id == undefined){return}
        ths.$axios({
          method:'GET',
          url:`/v1/tag/${ths.form.categorySid.id}/eventItems/`
        })
        .then(function(res1){
          if(res1.data.code == 403&&res1.data.msg == '未登录'){
              ths.$message.error(ths.$t('m.L_timeout'));
              ths.$emit('out','登陆超时');
              return
          }
          ths.events_ = [];
          if(res1.data.data.length != 0){
            res1 = res1.data.data[0].items;
            ths.events_ = res1;
          }
          ths.form.categorySub = '';
        })
      },
    //选择评价项
      pingjia_sub(){
        var ths = this; 
        // console.log(ths.form.tagItem)
        //验证网络连接
        if(!navigator.onLine){                       
            ths.$message.error(ths.$t('m.L_net'));
            ths.$emit('net',{network:false})
            return
        }else{
            ths.$emit('net',{network:true})
        }
        if(ths.form.tagItem.tagId == undefined){return}
        ths.$axios({
          method:'GET',
          url:`/v1/tag/${ths.form.tagItem.tagId}/tagItem`
        })
        .then(function(res1){
          if(res1.data.code == 403&&res1.data.msg == '未登录'){
              ths.$message.error(ths.$t('m.L_timeout'));
              ths.$emit('out','登陆超时');
              return
          }
          res1 = res1.data.data[0].items;
          // console.log(res1)
          ths.pingjia_ = [];
          ths.pingjia_ = res1;
          ths.form.tag_Item = '';
        })
      },
    //确认记录
      confirm_submit(){
        var ths= this;        
        // onsole.log(ths.form,ths.selectstu)
        if(!navigator.onLine){
          ths.$message.error(ths.$t('m.L_net'));
          ths.$emit('net',{network:false})
          return
        }else{
          ths.$emit('net',{network:true})
        }
        var stuSidsArr = [];
        var classIdArr = [];
        for(var item of ths.selectstu){
            stuSidsArr.push(item.id);
            classIdArr.push(item.classId);
        }
        // console.log(stuSidsArr,classIdArr)
        
        //记录事件
        var tagId =[];
        tagId.push(ths.form.tagItem.tagId);
        //console.log(ths.form.data)
        var postdata = {
            schId:ths.teacher.schId,//学校
            classId:classIdArr,//班级
            tchId:ths.teacher.id,//老师
            stuIds:stuSidsArr,//学生
            eventCategory:ths.form.categorySid.id,//事件标签
            eventItem:ths.form.categorySub.id,//事件子标签
            eventLocation:ths.form.address,//地点
            eventNote:ths.form.desc,//事件内容
            eventTime:ths.form.data,//时间
            assessTime:ths.form.data,
            itemId:ths.form.tag_Item.id,//评价项id
            tagId:tagId,//评价标签id
            assessSrc:1,//评价来源
            assessType:ths.form.tag_Item.itemType,//评价项反馈类型(0-正反馈, 1-负反馈
            assessNum:'1',//数量
            assessScore:ths.form.tag_Item.itemScore ,//分数
          }
          if(ths.is_record==false){
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
            //console.log(res.msg);
            //评价成功提示
            if(res.msg == 'success'){
              var success_msg = null;       
              ths.$message({
                message: ths.$t('m.Fa_msg0'),
                type: 'success', 
                showClose:true
              });
              //console.log(" 子标签："+ ths.form.categorySub.id);
              ths.is_record = true; 
              if(ths.send_parents==false||(ths.send_parents&&ths.is_send)){
                ths.confirmPop = false;
                ths.send_parents==false
                ths.is_record = false;
                ths.selectstu = [];
                ths.form.desc='';
                ths.form.categorySid='';
                ths.form.categorySub = '';
                ths.form.tagItem='';
                ths.form.tag_Item='';
              }
              //console.log("1send:"+ths.is_send+",record:"+ths.is_record);
            }else{
              ths.is_record = false;
              ths.$message.error(ths.$t('m.Co_err'));
            }
          }).catch(function(){
              ths.$message.error(ths.$t('m.L_servererr'));
          })
        }
      if(ths.send_parents && ths.is_send==false){
        ths.pushParent();
          console.log("2send:"+ths.is_send+",record:"+ths.is_record);
      }
    },
    //推送
    pushParent(){
      var ths = this;
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
    //推送事件
    var postdata1 = {
        tchId:ths.teacher.id,//老师
        stuIds:stuSidsArr,//学生
        eventLocation:ths.form.address,//地点
        eventNote:ths.form.desc,//事件内容
        eventTime:ths.form.data,//时间
        pictureUrl:ths.pictureUrl,//图片路径
    }
    if(ths.send_parents == true){
      if(ths.pictureUrl==''||ths.form.data==''||ths.form.address==''||ths.form.desc==''){
          ths.$message.error(ths.$t('m.Fa_msg1'));
        }else{
          if(ths.pictureUrl){
            ths.flag = 0;
            ths.$axios({
              method:'POST',
              url:`/v2/push/send`,
              data:postdata1
            }).then(function(res2){
                if(res2.data.code == 403&&res2.data.msg == '未登录'){
                  ths.$message.error(ths.$t('m.L_timeout'));
                  ths.$emit('out','登陆超时');
                  return
              }
              //console.log(res2.data.data.returnCode);
              //推送成功提示
              if(res2.data.data.returnCode == 1 || res2.data.data.msg == 'Success'){
                //if(res2.data.code==0){
                var success_msg = null;
                ths.$message({
                  message: ths.$t('m.Fa_msg3'),
                  type: 'success',
                  showClose:true,
                  duration: 10000
                });
                if(ths.is_record==true){
                  ths.confirmPop = false;
                  ths.send_parents=false;
                  ths.is_send = false;
                  ths.is_record = false;
                  ths.selectstu = [];
                  ths.form.desc='';
                  ths.form.categorySid='';
                  ths.form.categorySub='';
                  ths.form.tagItem='';
                  ths.form.tag_Item='';
                  ths.pictureUrl='';
                }else{
                  ths.is_send = true;
                }
                //console.log("3send:"+ths.is_send+",record:"+ths.is_record);
              }else if(res2.data.data.returnCode == 0 ||res2.data.data.msg == 'Student is not found'){
                ths.is_send = false;
                ths.confirmPop = true;
                ths.$message({
                  message: ths.$t('m.Co_push_err1'),
                  type: 'error',
                  showClose: true,
                  duration: 10000
                });
              }else{
                ths.is_send = false;
                ths.confirmPop = true;
                ths.$message({
                  message: ths.$t('m.Co_push_err'),
                  type: 'error',
                  showClose: true
                });
                console.log("error");
              }
              }).catch(function(e){
                console.log(e);
                ths.$message.error(ths.$t('m.L_servererr'));
            })
          }
        }     
      }
    },
      //记录
      submitForm(formName) {
        var ths = this;    
        if(ths.selectstu.length<=0||ths.form.data==''||ths.form.address==''||ths.form.desc==''||ths.form.categorySid==''||(ths.send_parents==true&&ths.pictureUrl=='')){
           ths.$message.error(ths.$t('m.Fa_msg1'));
        }else{
          ths.confirmPop = true;
          // console.log(ths.form,ths.selectstu)
          if(ths.form.tagItem!=''){
            ths.flag = 0;
          }  
        }
      },
      //选择学生
      sel_stu(stu){
          var ths = this;
          stu.classId = ths.form.class_.classId*1;
          // console.log(stu);
          ths.selectstu2 = [];
          if(ths.selectstu.indexOf(stu) == -1){  
              if(ths.selectstu.length>=10){
                ths.$message({
                  message: ths.$t('m.Fa_msg2'),
                  type: 'warning'
                });
                return
              }    
              ths.selectstu.push(stu);
          }else{            
              ths.selectstu.splice(ths.selectstu.indexOf(stu),1)
          }
      },
      //删除已选学生
      del(stu){    
        this.selectstu.splice(this.selectstu.indexOf(stu),1);
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
      sel_grade(){
        var ths = this;
        ths.disClass=false;
        //ths.classList=ths.form.grade_;
        ths.form.class_ = ''
        ths.disStu = true;
        
        var date = new Date();
        var curYear = date.getFullYear();
        var curMonth = date.getMonth();
        var mark=[];
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
              mark.push(str);
              ths.stuList.push(item[j]);
          }
          ths.classList = mark;
        }
        //console.log(ths.stuList)
      },
  },
  mounted(){   
    var ths = this;
    var curTime = new Date().toLocaleString('chinese', { hour12: false }).replace(/\//g,'-');//24小时制时间
    ths.form.data = curTime;
    console.log(ths.form.data);
    ths.form.address = ths.options[0].value;
    if(!navigator.onLine){
      ths.$message.error(ths.$t('m.L_net'));
      ths.$emit('net',{network:false})
      return
    }else{
      ths.$emit('net',{network:true})
    }
    ths.get_pics(ths.pics);
    ths.sel_grade();
  },
  created(){}
}
</script>

<style lang="scss" scoped>
#facts {
    box-sizing: border-box;
    padding: 3% 6% 0;
    height: 84%;
    display: flex;
    flex-direction: column;
    
    .stulist {
        height: 100%;
        padding: 0 1%;
        flex: 1;
        border: rgb(155, 158, 158) 1px solid;
        overflow: hidden;
        > div {
          padding: 1% 0 0 1%;
          overflow: auto;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          overflow: auto;       
        }
    }
    .select_list .has {
        color: #fff;
        background: #27b5bd;
      }
  .piclist{
      height: 100%;
      padding: 0 1%;
      flex: 1;
      max-height: 320px;
      overflow-y: auto; 
    .yes {
        background: #ebe4da !important;
        }
    .card {
        margin: 0 1% 1% 0;
        width: 30%;
        height: 20%;
        //min-height: 100px;
        border: 1px solid #ccc;
        background: #fff;          
        cursor: pointer;
        padding: 10px;
        box-sizing: border-box;
        float: left;
        display: flex;
        align-items: right;
        position: relative; 
        &:nth-child(5n) {
          margin-right: 0;
        }
      .imgstu {
          width: 100%;
          //min-width: 100px;
          background-size: cover;
          //height: 100%;
          min-height: 100px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border: 0;
          float: left;
        }
      &:hover {
            background: #ebe4da;
            .imgstu{
              transform: scale(1.1);
            }
          }
      }
    }

    .el-form{
      flex: 1;
      padding: 0;
      .el-form-item{
        margin-bottom: 1%;
      }
    }
    
    .lineblock{
      .el-select{
        float: left;
      }
    }
  // 已选学生
  .selected{
    margin:0 0% 1%;
    padding: 1% 0 0 2%;
    margin-left: 12%;
    background: #7DD3D7;
  }
  //底部按钮
  .bottomBtn{   
    padding: 0 0 1%;
    box-sizing: border-box;
    position: relative;
    z-index: 1000; 
    text-align: right;
    
  }

  .selecte{
      button{
        margin:0 1% 1% 0;
        width: 19%;
        padding: 0;
        height: 40px;
      }
  }
  //记录确认弹窗
  .confirm{
    li{
      margin-bottom: 3%;
      span{
        font-weight: 700;
        font-size: 18px;
        max-width: 85%;
        display: inline-block;
        vertical-align: top;
        >&:nth-child(1){
          width: 14%;
          max-width: 120px;
          display: inline-block;         
        }
              
      }
      div{
        display: inline-block;
        width: 85%;
        font-size: 16px;
        font-weight: 100;
        span{
          width:30%!important;
          // max-width: 80px!important;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis; 
          white-space: nowrap;
          // text-align: center;
        }
      }
    }
  }
}


/* CSS */
</style>


