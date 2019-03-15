<template>
  <div id="timeline">
    <el-form >
      <!-- 选择标签 -->
      <el-row type="flex" justify="center">    
        <el-date-picker
          :picker-options='picker_options'
          v-model="form.data"
          value-format= 'yyyy-MM-dd'
          format = 'yyyy-MM-dd'
          type="daterange"
          :clearable= 'false'
          range-separator="-"
          :start-placeholder="$t('m.Ca_start')"
          :end-placeholder="$t('m.Ca_end')"
          style="width:26%">
        </el-date-picker>

        <!-- <el-select v-model="form.categorySid" value-key="id" collapse-tags :placeholder="$t('m.Inp_s')+$t('m.Inp_t')" >
          <el-option v-for='(item,index) in eventCategory' :key = index :label="item.tagName" :value="item"></el-option>
        </el-select> -->
        <!-- 事件标签 -->
        <el-select v-model="form.categorySid" value-key="id" collapse-tags :placeholder="$t('m.Inp_s')+$t('m.Inp_t')" clearable  @change="category_sub">
          <el-option v-for='(item,index) in eventCategory' :key = index :label="item.tagName" :value="item"></el-option>
        </el-select>
        <el-select value-key="id" v-model="form.categorySub" :placeholder="$t('m.Inp_s')+$t('m.Inp_e2')" :disabled="(form.categorySid==''||events_ =='')?true:false">
          <el-option :label="item.itemName" :value="item" v-for="(item,index) in events_" :key="index" v-if="index<15"></el-option>
        </el-select>

        <el-button type="primary" :disabled="form.data == ''||form.categorySid==''? true:false"  @click="submit()">{{$t('m.Ti_Query')}}</el-button>
    
      </el-row>
    </el-form>
    <!-- 时间轴 -->
    <el-main>
      <ul  v-show="check_" name="el-fade-in">
        <li class="stu_info" name="el-fade-in">
          <span>{{form.categorySid.tagName}}</span>
          <span></span>
          <div>
            {{form.data[0]+' - '+form.data[1]}}            
          </div>
        </li>
        <!-- 时间轴 -->
        <el-collapse-transition>
          <div v-show="check_"  class="scroll_0">
            <li v-for="(item) in line" :key="item.id"  class="transition-box">
              <span>{{item.eventDate}} {{item.eventTime}}</span>
              <span></span>
              <div>    
                {{item.className+' '+item.stuNickname+' '+item.stuName}}<br />       
                {{item.eventLocation}}<br />
                {{item.eventNote}}<br />                               
                from：{{item.tchName+' '+item.stuName}}            
              </div>  
            </li>               
          </div>
        </el-collapse-transition>
      </ul>
    </el-main>
    <!-- 底部按钮 -->
    <el-col  class="bottomBtn" >
      <router-link to="/facts">
       <el-button class=" iconfont " icon="el-icon-back"> {{$t('m.Fa_to_Record')}}</el-button>      
      </router-link>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "timeline",
  props:['grade','teacher'],
  data() {
    return {
       check_:false,
       classList:[],
       picker_options:{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
       form: {
          data:'',//时间
          categorySid:'',//标签
          categorySub:'',//子标签
        },     
        line:[],//查询结果
        eventCategory:[],//选择标签列表
        events_:[],//事件子标签
    };
  },
  methods: {
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
        if(ths.form.categorySub.id==''||ths.form.categorySub.id==undefined){
          var url=`/v1/event/search/${ths.teacher.id}/${ths.form.categorySid.id}/${ths.form.data[0]}/${ths.form.data[1]}`
        }else{
          url=`/v1/event/search/${ths.teacher.id}/${ths.form.categorySid.id}/${ths.form.categorySub.id}/${ths.form.data[0]}/${ths.form.data[1]}`
          //console.log("sub:"+ths.form.categorySub.id)
        }
        ths.$axios({
          url:url ,//`/v1/event/search/${ths.teacher.id}/${ths.form.categorySid.id}/${ths.form.data[0]}/${ths.form.data[1]}`,
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
  mounted(){
    var ths= this;
    ths.$axios({
      url:`/v1/tag/2`,// ${ths.teacher.id} /v1/tagItem/{type}/{tchId}/tagType 1-能量站评价项标签  2-事件标签  3-自定义评价标签
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
  } 
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
        background: url(../assets/img/time_line.png) 171px 0 repeat-y;
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
          // background: url(../assets/time_line.png) 161px 0 repeat-y;
          
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
            width:105px;    
            margin-left: 15px; 
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
            top: 10px;         
          }
          span:nth-child(2){
            background: #27b5bd;
            background-image: linear-gradient(#27b5bd,#C9EDEF);
            height: 14px;
            width: 14px;
            display: block;
            border-radius: 50%;
            float: left;
            margin: 0 30px;
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
            height: 13%;
            padding-bottom:10px; 
            
            span:nth-child(1){
              width: 120px;
              margin-left: 0;
            }
            span:nth-child(2){
              height: 20px;
              width: 20px;
              margin-left: 27px;
            }
            div{     
              background: #f5f5f5;
              color: #606266;
              font-size: 20px;
              font-weight: 700;
              margin-left: -25px;  
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
            line-height: 30px;
           
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


