
<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card">
          <div class="card-content">
            <img :src="$store.state.user.avatar" alt="" class="img-circle img-lg">
            <div class="userinfo"> 
              <div class="username">你好，{{ $store.state.user.name }}，祝你开心每一天！</div>
              <div>{{ deptName }} | {{ postGroup }}</div>
            </div>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="title_1">快捷应用入口</span>
          </div>
          <div class="text item">
            <el-row :gutter="20">
              <el-col :span="4" v-for="(item,index) in list" :key="index" style="text-align: center;padding: 24px;">
                <div @click="Goto(item.navigateTo)" style="cursor: pointer;">
                  <img :src="item.imgUrl" alt="" align="center" >
                  <div class="content"> {{item.title}}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
            <el-calendar v-model="value"></el-calendar>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <img src="@/assets/images/warning.png" alt="" align="center" >
              <span class="title_2">预警信息</span>
            </span>
            <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
          </div>
          <div class="text item">
            <el-table :data="exceptionList">
              <el-table-column label="" prop="data" width="80">
                <template slot-scope="scope">
                  <div class="triangle">
                    <div class="triangle-title font-t2">new</div>
                  </div>
                </template>
                
              </el-table-column>
              <el-table-column label="异常类型" align="center" prop="type" />
              <el-table-column label="异常信息" align="center" prop="data" />
              <el-table-column label="风险时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <img src="@/assets/images/todo.png" alt="" align="center" >
              <span class="title_2">待办事项</span>
            </span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="taskcenterMore">更多</el-button>
          </div>
          <div class="text item">
            <el-table :data="taskcenterList">
              <el-table-column label="标题" prop="title">
                <template slot-scope="scope">
                  <el-badge value="new" class="item" :hidden="toDay(scope.row.startTime)">
                    <span>{{ scope.row.title }}</span>
                  </el-badge>
                </template>
              </el-table-column>
              <el-table-column label="开始时间" prop="startTime" width="100">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listTaskcenter } from "@/api/SpacialOperation/taskcenter"
import { getUserProfile } from "@/api/system/user"
import { listException } from "@/api/system/exception"
import { formatDate } from '@/utils/index'
import { parseTime } from '@/utils/ruoyi'

export default {
  name: "Index",
  data () {
    return {
      list: [
        {
          title: '返工出库',
          imgUrl: require('@/assets/images/menu1.png'),
          navigateTo: '/KeWenWMS/ProductionManagement/reworkout'
        }, 
        {
          title: '返工入库',
          imgUrl: require('@/assets/images/menu2.png'),
          navigateTo: '/KeWenWMS/ProductionManagement/reworkin'
        }, 
        {
          title: '调入单',
          imgUrl: require('@/assets/images/menu3.png'),
          navigateTo: '/KeWenWMS/WarehouseOperation/transferin'
        }, 
        {
          title: '调出单',
          imgUrl: require('@/assets/images/menu4.png'),
          navigateTo: '/KeWenWMS/WarehouseOperation/transferout'
        }, 
        {
          title: '盘点计划',
          imgUrl: require('@/assets/images/menu5.png'),
          navigateTo: '/KeWenWMS/WarehouseOperation/countsheet'
        }, 
        {
          title: '库存现有量',
          imgUrl: require('@/assets/images/menu6.png'),
          navigateTo: '/KeWenWMS/WarehouseOperation/transferout'
        }
      ],
      taskcenterList: [],
      exceptionList: [],
      value: new Date(),
      deptName: '',
      postGroup: ''
    }
  },
  methods: {
     getUser() {
      getUserProfile().then(response => {
        this.deptName = response.data.dept.deptName
        this.postGroup = response.postGroup
      })
    },
    getList () {
      var queryParams = {
        pageNum: 1,
        pageSize: 5
      }
      listTaskcenter(queryParams).then(response => {
        this.taskcenterList = response.rows
      })
      listException(queryParams).then(response => {
        this.exceptionList = response.rows
      });
    },
    taskcenterMore () {
      this.$router.push({ path: '/KeWenWMS/SpacialOperation/taskcenter' })
    },
    Goto (navigateTo) {
      if (navigateTo) {
        this.$router.push({ path: navigateTo })
      }
    },
    toDay (value) {
      var timestamp = Date.parse(new Date())
      let time = parseTime(formatDate(timestamp), '{y}-{m}-{d}')
      if (value == time) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    this.getUser()
    this.getList()
  }
};
</script>

<style scoped lang="scss">
.home {
  .box-card {
    margin-bottom: 16px;
    .title_1 {
      font-size: 16px;
    }
    .title_2 {
      vertical-align: middle;
      padding-left: 10px;
      font-size: 16px;
    }
    .content {
      padding-top: 16px;
    }
    ::v-deep .el-calendar-table .el-calendar-day {
      width: 40px;
      height: 40px;
    }
    .userinfo {
      padding-left: 16px;
      .username {
        font-size: 22px;
        height: 80px;
      }
    }
    ::v-deep .el-badge__content.is-fixed {
      top: 7px;
      right: 0px;
    }
    .card-content {
      display: flex;
      padding: 20px;
    }
    .triangle{
      width:0;
      height:0;
      border-top:30px solid #ED6A0C;
      border-left:30px solid #ED6A0C ;
      border-right:30px solid transparent;
      border-bottom:30px solid transparent ;
      .triangle-title{
        position: absolute;
        font-size: 14px;
        top: 15px;
        color: #fff;
        left: 15px;
      }
    }
  }
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }
}
</style>

