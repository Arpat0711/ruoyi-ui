
<template>
  <div class="app-container">
    <el-row
      :gutter="18"
      style="
        margin: 0 0 10px 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid #dcdfe6;
        background-color: #f8f8f9;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      "
    >
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          style="
            width: 90px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="handleAddRule"
          v-hasPermi="['md:md:client:add']"
          >新建规则</el-button
        >
      </el-col>

      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>
    <el-table
      v-loading="loading"
      :data="itemList"
      @selection-change="handleSelectionChange"
      style="
        margin: 0 0 10px 0;
        background-color: #ebeef5;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      "
    >
      <!-- <el-table-column type="selection" width="50" align="center" fixed /> -->
      <el-table-column
        label="规则ID"
        width="140"
        align="center"
        key="bcRuleId"
        prop="bcRuleId"
        v-if="columns[0].visible"
        fixed
      >
        <!-- <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:md:mditem:query']"
            >{{ scope.row.bcRuleId }}</el-button
          >
        </template> -->
      </el-table-column>
      <el-table-column
        label="规则编码"
        width="140"
        align="center"
        key="bcRuleCode"
        prop="bcRuleCode"
        v-if="columns[6].visible"
        :show-overflow-tooltip="true"
      >
        <!-- <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:md:mditem:query']"
            >{{ scope.row.bcRuleCode }}</el-button
          >
        </template> -->
      </el-table-column>
      <el-table-column
        label="条码类型"
        width="120"
        align="center"
        key="barcodeType"
        prop="barcodeType"
        v-if="columns[1].visible"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="规则名称"
        align="center"
        width="120"
        key="bcRuleName"
        prop="bcRuleName"
        v-if="columns[2].visible"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="规则描述"
        width="120"
        align="center"
        key="remark"
        prop="remark"
        v-if="columns[3].visible"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="创建人"
        width="120"
        align="center"
        key="createBy"
        prop="createBy"
        v-if="columns[4].visible"
      />
      <el-table-column
        label="创建时间"
        width="160"
        align="center"
        prop="createTime"
        v-if="columns[5].visible"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:md:item:edit']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:md:item:edit']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
var serverUrl = process.env.VUE_APP_BASE_API //获取.env.配置文件的服务器路径
export default {
  name: 'barcodeRule',
  data () {
    return {
      /**遮罩层 */
      loading: false,
      /**条码规则表格数据 */
      itemList: [],
      /**表格数据设置 */
      columns: [
        { key: 0, label: `规则编码`, visible: true },
        { key: 1, label: `条码类型`, visible: true },
        { key: 2, label: `规则名称`, visible: true },
        { key: 3, label: `规则描述`, visible: true },
        { key: 4, label: `创建人`, visible: true },
        { key: 5, label: `创建时间`, visible: true },
        { key: 6, label: `规则编码`, visible: true },

      ],
    }
  },

  mounted () {
    this.getList()
  },
  methods: {
    /** 单据类型单选框调用函数 */
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    /** 查询列表 */
    getList () {
      let that = this
      let token = getToken()
      // console.log(token)
      Vue.axios({
        method: 'GET',
        // baseURL: '/dev-api',
        // url: 'http://192.168.1.10:8082/system/bcdrule/list',
        url: serverUrl + 'system/bcdrule/list',

        headers: {
          'authorization': token
        },
        data: {}
      }).then(function (response) {
        console.log(response)
        that.setItemList(response.data.rows)
      }).catch(function (error) {
        console.log(error)
      })
    },

    /**赋值itemList */
    setItemList (res) {
      console.log(res)
      let tempList = {}
      this.itemList = []
      for (let i = 0; i < res.length; i++) {
        tempList.bcRuleId = res[i].bcRuleId                       /**规则ID */
        tempList.bcRuleCode = res[i].bcRuleCode                   /**规则ID */
        tempList.bcRuleName = res[i].bcRuleName                   /**规则名称 */
        tempList.barcodeType = res[i].barcodeType                 /**条码类型 */
        tempList.remark = res[i].remark                           /**规则描述 */
        tempList.createTime = res[i].createTime                   /**创建时间 */
        tempList.createBy = res[i].createBy                       /**创建人 */

        this.itemList.push(tempList)
        tempList = {}
      }
    },
    // 取消按钮
    cancel () {

    },
    // 表单重置
    reset () {
      this.form = {

      }
      this.autoGenFlag = false
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery () {

    },
    /** 重置按钮操作 */
    resetQuery () {

    },
    // 多选框选中数据
    handleSelectionChange (selection) {

    },
    /** 新增按钮操作 */
    handleAdd () {

    },

    /**新增条码规则 */
    handleAddRule () {
      this.goTo(null)
    },

    // 查询明细按钮操作
    handleView (row) {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      console.log(row)
      this.goTo(row.bcRuleId)
    },
    /** 提交按钮 */
    submitForm () {

    },
    /** 删除按钮操作 */
    handleDelete (row) {
      console.log(row)
      let that = this
      let token = getToken()
      // console.log(token)
      Vue.axios({
        method: 'delete',
        // baseURL: '/dev-api',
        // url: 'http://192.168.1.10:8082/system/bcdrule/',
        url: serverUrl + 'system/bcdrule/delete/' + row.bcRuleId,
        // url: '/system/bcdrule/list',
        headers: {
          'authorization': token
        },
        data: {}
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.$message({
            message: '成功删除',
            type: 'success'
          })
          that.getList()
        }

      }).catch(function (error) {
        console.log(error)
      })
    },
    /** 导出按钮操作 */
    handleExport () {

    },
    //自动生成编码
    handleAutoGenChange (autoGenFlag) {

    },

    /**跳转页面函数 */
    goTo (bcRuleId) {
      console.log(bcRuleId)
      if (bcRuleId == null) {
        this.$router.push({ path: 'barcodeDetails' })
      } else {
        this.$router.push({ path: 'barcodeDetails', query: { bcRuleId: bcRuleId } })
      }
    }
  }
}
</script>

<style>
</style>
