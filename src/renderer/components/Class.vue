<template>
  <div  id="class">
    <el-row type="flex" justify="space-between" class="scroll_0" id="scroll">
        <!-- 年级 -->
        <div class="grad" v-for="(grade_item,index) in grade" :key="index">
          <!-- 班级 -->
            <el-col :span="11" v-for="(class_item, index) in grade_item.classId.classStudentses" :key="index">    
              <router-link tag="div" :to="{ name: 'stu',params:{gradId:grade_item.grade.gradeId,classNo:class_item.classNo,classId:class_item.classId}}" class="el-card" :body-style="{ padding: '0px' }">
                <img :src="class_item.classIcon==0?require('../assets/img/class.png'):class_item.classIcon" class="image">
                <div class="info">
                  <el-row>
                    <el-col :span="24" class="redfont">{{grade_item.grade.gradeName}}</el-col>
                    <el-col :span="24" class="redfont">{{class_item.className}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">{{$t('m.C_stu')}}: {{class_item.students.length}} </el-col>
                  </el-row>
                  <el-row class="word">
                    <!-- <el-col :span="24">{{class_item.classDeclare}}</el-col> -->
                    <!-- class_item.classIcon -->
                  </el-row>
                </div>          
              </router-link>
            </el-col> 
        </div>
    </el-row>
</div>
</template>

<script>
import  app  from 'electron'
import  BrowserWindow from 'electron'
//import Network from '/assets'
export default {
  name: "class",
  props:['teacher','grade'],
  data() {
    return {
      scroll:0
      // grade:[],
    };
  },
  methods: {
    pingjia(){
      var ths = this;
      ths.$axios({
        method:'GET',
        url:`/v1/assessTag/schSid/${ths.teacher.schId}/moduleSid/103/event-tags`,
      })
      .then(function(res){
        if(res.data.code == 403&&res.data.msg == '未登录'){
            ths.$message.error(ths.$t('m.L_timeout'));
            ths.$emit('out','登陆超时');
            return
        }
        res = res.data.result;
        ths.pingjia = res;
        ths.$emit('pingjia',{pingjia_data:res});
      }).catch(function(){
          console.log("catch");
          ths.$message.error(ths.$t('m.L_servererr'));
          ths.$emit('net',{network:false})
      })
    },
    tostu(){
      this.$router.push('/stu')
    }, 
    //获取滚动条高度
    handelscroll() {
      this.scroll=document.getElementById('scroll').scrollTop;
      //console.log(this.scroll);
      localStorage.scroll = this.scroll;
    },
  },
  mounted(){
    var ths = this;
    window.addEventListener('scroll', ths.handelscroll,true);
    document.getElementById('scroll').scrollTop = localStorage.scroll;
    console.log(localStorage.scroll);
  },
  beforeDestroy() {
    var ths = this;
    window.removeEventListener('scroll',  ths.handelscroll,true);
  },
}
</script>

<style lang="scss" scoped>
#class {
  box-sizing: border-box;
  height: 84%;
  overflow: hidden;
  &>div{
    padding: 0 5% 0;  
    padding-top: 8vh;
    overflow: auto;
    margin: 0 1%;
    flex-wrap:wrap;
    height: 100%;

    // 年级
    .grad{
      border-top: 5px solid rgba(0,0,0,.05);
      padding-top: 8vh;
      width: 100%;
      
      &:nth-child(1){
        border: 0;
        padding: 0;
      }
      // 班级
      .el-col-11{
          cursor:pointer;
          height: 30vh;
        }
      
          >.el-col{ 
          box-sizing: border-box;
          margin-bottom: 8vh;
          // 班级列表
          .el-card{
            padding: 6%;
            height: 200px;
            height: 76%;
            overflow: hidden;
            display: flex;
            img{
              float: left;
              height: 100%;
              min-width: 45%;
              border:1px solid #EEEEEE;
            }
            // 班级信息展示
            .info{
              float: right;
              // width: 50%;
              flex: 1;
              margin-left: 4%;
              height: 100%;
              overflow: hidden;
              .el-row:nth-child(1){
                font-size: 20px;
                font-weight: 700;
                color: #CC5952;
                margin-bottom: 10%;
              }
              .word .el-col-24{
                color:#21888E;
                // height: 65px;
                // 多行省略
                margin-top: 5%;
                overflow:hidden;
                text-overflow:ellipsis; 
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
              }
            }
          }
        }
      
      .el-col:nth-child(even){
        float: right;   
      }


    }
  }
  
}


/* CSS */
</style>


