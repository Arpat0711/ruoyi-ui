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
            width: 110px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="handleAddBox"
          v-hasPermi="['md:md:client:add']"
          >新建箱型</el-button
        >
      </el-col>

      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-form
      :model="queryParams"
      ref="queryForm"
      size="mini"
      :inline="true"
      label-width="80px"
      :label-position="labelPosition"
      @submit.native.prevent
    >
      <el-row>
        <el-col>
          <el-form-item prop="boxName" label="箱型名称">
            <el-input
              v-model="queryParams.boxName"
              placeholder="请输入箱型名称"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item></el-col
        >
      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      :data="panelList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        v-if="show"
        label="箱型ID"
        align="center"
        prop="boxId"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="箱型名称"
        align="center"
        prop="boxName"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <!-- <el-table-column
        label="箱容数"
        width="150px"
        align="center"
        prop="boxQty"
      /> -->
      <el-table-column label="长(mm)" align="center" prop="boxLength" />
      <el-table-column label="宽(mm)" align="center" prop="boxWidth" />
      <el-table-column label="高(mm)" align="center" prop="boxHeight" />
      <el-table-column label="箱体积" align="center" prop="arr3" />
      <el-table-column label="箱净重(kg)" align="center" prop="boxWeight" />
      <!-- <el-table-column label="托板类型ID" align="center" prop="panelId" /> -->
      <el-table-column label="托板名称" align="center" prop="panelName" />
      <el-table-column label="托容数" align="center" prop="panelQty" />
      <el-table-column label="托体积" align="center" prop="panel" />
      <el-table-column label="托净重(kg)" align="center" prop="panelWeight" />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['md:md:client:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['md:md:client:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改箱型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form
        ref="form"
        :model="dialogForm"
        :rules="rules"
        label-width="80px"
        :inline="true"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="箱型名称" prop="boxName">
              <el-input
                v-model="dialogForm.boxName"
                placeholder="请输入箱型名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="箱型ID" prop="boxId">
              <el-input
                v-model="dialogForm.boxId"
                placeholder="请输入箱型ID"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="长(mm)" prop="boxLength">
              <el-input
                v-model="dialogForm.boxLength"
                placeholder="请输入长度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="宽(mm)" prop="boxWidth">
              <el-input
                v-model="dialogForm.boxWidth"
                placeholder="请输入宽度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="高(mm)" prop="boxHeight">
              <el-input
                v-model="dialogForm.boxHeight"
                placeholder="请输入高度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="箱净重(kg)" prop="boxWeight">
              <el-input
                v-model="dialogForm.boxWeight"
                placeholder="请输入箱净重"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="托板类型ID" prop="boxType">
              <el-input
                v-model="dialogForm.boxType"
                placeholder="请输入托板类型ID"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="托板名称" prop="panelName">
              <el-input
                v-model="dialogForm.panelName"
                placeholder="请输入托板名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="托容数" prop="panelQty">
              <el-input
                v-model="dialogForm.panelQty"
                placeholder="请输入托容数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="托体积" prop="panel">
              <el-input v-model="dialogForm.panel" placeholder="请输入托体积" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="托净重(kg)" prop="panel">
              <el-input
                v-model="dialogForm.panelWeight"
                placeholder="请输入托净重"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button type="primary" @click="submitForm(dialogForm)" v-else
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'
var serverUrl = process.env.VUE_APP_BASE_API //获取.env.配置文件的服务器路径
export default {
  name: "Client",
  dicts: ['mes_client_type', 'sys_yes_no'],
  data () {
    return {

      /**是否显示标识 */
      show: false,
      //表单对其方式
      labelPosition: 'left',

      //单据类型单选框
      options: [],
      value: [],
      list: [],
      loading: false,
      states: [],
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户表格数据
      panelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        boxName: '',
      },
      // 表单参数
      dialogForm: {
        boxHeight: null,
        boxId: null,
        boxLength: null,
        boxName: '',
        boxQty: null,
        boxWidth: null,
        panel: null,
        panelId: null,
        panelName: '',
        panelQty: null,
        remark: '',
        panelWeight: null
      },
      // 表单校验
      rules: {
        clientCode: [
          { required: true, message: "客户编码不能为空", trigger: "blur" }
        ],
        clientName: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        contact1Email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        contact2Email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        enableFlag: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    this.list = this.states.map(item => {
      return { value: `value:${item}`, label: `label:${item}` }
    })
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
    /** 查询箱型表 */
    getList (boxName) {
      let that = this
      let token = getToken()
      let data = {}
      data.boxName = boxName
      Vue.axios({
        method: 'POST',
        // url: "http://kewen.fgimaxl2.vipnps.vip/system/box/list",
        url: serverUrl + "system/box/list",
        // url: "http://192.168.1.10:8082/system/box/list",
        headers: {
          'authorization': token
        },
        data: { data }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.setPanelList(response.data.rows)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /**箱型档案表格赋值 */
    setPanelList (res) {
      console.log(res)
      let tempList = {}
      this.panelList = []
      for (let i = 0; i < res.length; i++) {
        tempList.boxName = res[i].boxName               /**箱型名称 */
        tempList.boxId = res[i].boxId                   /**箱型ID */
        tempList.boxQty = res[i].boxQty                 /**箱容数 */
        tempList.boxWeight = res[i].boxWeight           /**箱净重 */
        tempList.boxLength = res[i].boxLength           /**长 */
        tempList.boxWidth = res[i].boxWidth             /**宽 */
        tempList.boxHeight = res[i].boxHeight           /**高 */
        tempList.panelId = res[i].panelId               /**托板类型ID */
        tempList.panelName = res[i].panelName           /**托板名称 */
        tempList.panelQty = res[i].panelQty             /**托容数 */
        tempList.panel = res[i].panel                   /**托体积 */
        tempList.panelWeight = res[i].panelWeight       /**托净重 */
        tempList.remark = res[i].remark                 /**备注 */
        tempList.arr3 = res[i].arr3                     /**根据长宽高计算得箱体积 */
        this.panelList.push(tempList)
        tempList = {}
      }
    },
    // 取消按钮
    cancel () {
      this.open = false
    },
    // 表单重置
    reset () {
      this.dialogForm = {
        boxHeight: null,
        boxId: null,
        boxLength: null,
        boxName: '',
        boxQty: null,
        boxWidth: null,
        panel: null,
        panelId: null,
        panelName: '',
        panelQty: null,
        remark: '',
      }
      // this.autoGenFlag = false
      // this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery () {
      console.log(this.queryParams.boxName)
      this.getList(this.queryParams.boxName)
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

    /**新增箱型按钮操作 */
    handleAddBox () {
      this.open = true
      this.reset()
    },
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      console.log(row)
      let that = this
      this.open = true
      Object.keys(row).forEach((index) => {
        that.dialogForm[index] = row[index]
      })

    },
    /** 提交按钮 */
    submitForm (formData) {
      console.log(formData)
      let that = this
      let token = getToken()
      let data = {}
      data = formData
      data.orgId = 1001
      data.orgName = '1001'
      Vue.axios({
        method: "POST",
        // url: 'http://kewen.fgimaxl2.vipnps.vip/system/box',
        url: serverUrl + 'system/box',
        // url: 'http://192.168.1.10:8082/system/box',
        headers: {
          'authorization': token
        },
        data: { data }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.open = false
          that.$message({
            message: '操作成功',
            type: 'success',
            center: true
          })
          // that.optType = false                 //是否显示状态返回初始值
          that.getList()
        }
      }).catch(function (error) {
        console.log(error)
      })
      that.open = false
    },

    /** 删除按钮操作 */
    handleDelete (row) {
      let that = this
      let token = getToken()
      // console.log(row)
      let boxId = row.boxId
      Vue.axios({
        method: 'POST',
        url: 'http://kewen.fgimaxl2.vipnps.vip/system/box/boxId',
        // url: 'http://192.168.1.10:8082/system/box/boxId',
        // url: 'http://192.168.1.27:8082/system/box/boxId',
        headers: {
          'authorization': token
        },
        data: { boxId }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.open = false
          that.$message({
            message: '删除成功',
            type: 'success',
            center: true
          })
          // that.optType = false                 //是否显示状态返回初始值
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

    }
  }
};
</script>

