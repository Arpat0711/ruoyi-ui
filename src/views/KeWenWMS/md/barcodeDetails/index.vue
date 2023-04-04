
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="70px"
      :label-position="labelPosition"
    >
      <el-row style="margin: 0 0 10px 0">
        <!--功能栏-->
        <el-row
          :gutter="18"
          style="
            margin: 0 0 10px 0;
            display: flex;
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
              icon="el-icon-folder-add"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['md:md:client:add']"
              >保存</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-upload2"
              size="mini"
              @click="handleUpdate"
              v-hasPermi="['md:md:client:edit']"
              >提交</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['md:md:client:remove']"
              >复制</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-download"
              size="mini"
              :disabled="single"
              @click="handleExport"
              v-hasPermi="['md:md:client:export']"
              >提交</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-download"
              size="mini"
              :disabled="single"
              @click="handleExport"
              v-hasPermi="['md:md:client:export']"
              >审核</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-download"
              size="mini"
              :disabled="single"
              @click="handleExport"
              v-hasPermi="['md:md:client:export']"
              >禁用</el-button
            >
          </el-col>
          <el-col :span="3" :offset="8">
            <el-button
              type="primary"
              icon="el-icon-sugar"
              size="mini"
              @click="addMdBarcodeBill"
              v-hasPermi="['md:md:client:export']"
              >新增对照表</el-button
            >
          </el-col>
          <!-- <el-col :span="3" :offset="13">
          <el-form-item style="margin: auto 0px">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-col> -->
        </el-row>
        <!---->

        <!--左侧条码规则-->
        <el-col :span="16">
          <el-row>
            <el-col :span="8">
              <el-form-item label="规则ID" prop="bcRuleId">
                <el-input
                  v-model="queryParams.bcRuleId"
                  placeholder="请输入规则ID"
                  clearable
                  disabled
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规则编码" prop="bcRuleCode">
                <!-- <el-select
              v-model="value"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
                <el-input
                  v-model="queryParams.bcRuleCode"
                  placeholder="请输入规则编码"
                  clearable
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="条码类型" prop="barcodeType">
                <el-input
                  v-model="queryParams.barcodeType"
                  placeholder="请输入条码类型"
                  clearable
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规则名称" prop="bcRuleName">
                <el-input
                  v-model="queryParams.bcRuleName"
                  placeholder="请输入规则名称"
                  clearable
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="创建人" prop="createBy">
                <el-input
                  v-model="queryParams.createBy"
                  placeholder="请输入创建人"
                  clearable
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规则描述" prop="remark">
                <el-input
                  type="textarea"
                  autosize
                  placeholder="请输入规则描述"
                  v-model="queryParams.remark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <!---->
        <!--右侧对照表-->
        <el-col :span="8">
          <el-row>
            <el-col :span="5"><span>适用单据</span></el-col>
            <el-col :span="19"
              ><el-table :data="suitableData">
                <el-table-column
                  type="selection"
                  width="55"
                  align="centser"
                ></el-table-column>
                <el-table-column
                  type="text"
                  label="条码规则ID"
                  prop="bcRuleId"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  type="text"
                  label="单据类型"
                  prop="sourceBill"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  type="text"
                  label="是否默认规则"
                  prop="defaultFlag"
                  align="center"
                  width="100"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
        <!---->
      </el-row>
    </el-form>
    <!--条码配置表-->
    <!-- <el-row
      :gutter="15"
      style="
        margin: 0 0 10px 0;
        display: flex;
        align-items: center;
        height: 50px;
        flex-direction: row-reverse;
        border-bottom: 1px solid #dcdfe6;
        background-color: #f8f8f9;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      "
    >
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-folder-add"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['md:md:client:add']"
          >选择条码规则配置</el-button
        >
      </el-col>
    </el-row> -->
    <el-table
      v-loading="loading"
      :data="attributeList"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      row-key="complement"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        fixed
        :reserve-selection="true"
      />
      <el-table-column
        label="条码规则ID"
        width="130px"
        align="center"
        prop="bcRuleId"
        fixed
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="属性ID"
        width="130px"
        align="center"
        prop="attributeId"
        fixed
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="是否默认规则"
        width="130px"
        align="center"
        prop="isDefault"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="是否自动补零"
        align="center"
        prop="autoGenFlag"
        width="130px"
      />
      <el-table-column
        label="对齐方式"
        align="center"
        prop="attrAlign"
        width="130px"
      />
      <el-table-column
        label="格式"
        align="center"
        prop="attrFormat"
        width="130px"
      />
      <el-table-column
        label="本段条码位数"
        align="center"
        prop="barcodeBit"
        width="130px"
      />
      <el-table-column
        label="设置值"
        align="center"
        prop="defaultCode"
        width="130px"
      />
      <el-table-column
        label="补位符"
        align="center"
        prop="complement"
        width="130px"
      />
      <el-table-column
        label="分隔符"
        align="center"
        prop="separator"
        width="130px"
      />
      <el-table-column
        label="参与条码编码"
        align="center"
        prop="appendBarcode"
        width="130px"
      />
      <el-table-column
        label="参与二维码编码"
        align="center"
        prop="appendQrcode"
        width="130px"
      />
      <el-table-column
        label="参与分组"
        align="center"
        prop="appendGroup"
        width="130px"
      />
      <el-table-column
        label="数量字段"
        align="center"
        prop="rankGroup"
        width="130px"
      />
      <el-table-column
        label="编码顺序"
        align="center"
        prop="orderNum"
        width="130px"
      />

      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="120"
        fixed="right"
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
      </el-table-column> -->
    </el-table>
    <!-- <el-dialog :title="title" :visible.sync="open" width="960px">
      <el-table :data="attributeTable"> </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button type="primary" @click="submitForm(dialogForm)" v-else
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
    <!---->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增对照表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="dialogForm" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="单据类型" prop="sourceBill">
              <el-select
                v-model="dialogForm.sourceBill"
                placeholder="请选择单据类型"
                filterable
                allow-create
                default-first-option
              >
                <el-option
                  ref="selectValue"
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否默认规则" label-width="80">
              <el-switch
                v-model="dialogForm.defaultFlag"
                active-color="#13ce66"
                active-text="是"
                active-value="Y"
                inactive-color="#ff4949"
                inactive-text="否"
                inactive-value="N"
                @change="handleDefaultFlagChange(dialogForm.defaultFlag)"
              >
              </el-switch>
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
  name: "barcodeRule",
  dicts: ['mes_client_type', 'sys_yes_no'],
  data () {
    return {
      //适用单据数据来源
      suitableData: [],
      //描述规则
      describeData: '',
      //表单字段对齐方式
      labelPosition: "left",
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
      // 条码规则属性表格数据
      attributeList: [],
      //条码规则弹窗表格数据
      attributeTable: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //选中状态
      selected: true,
      // 条码属性table存放临时数组
      // tempAttributeList: [],

      // 左侧条码规则
      queryParams: {
        orgId: '',                                //组织ID
        orgName: '',                              //组织名称
        bcRuleId: '',                            //规则ID
        bcRuleCode: '',                          //规则编码
        barcodeType: '',                         //条码类型
        bcRuleName: '',                          //规则名称
        createBy: '',                            //创建人
        describeData: '',                        //规则描述
        remark: '',                              //规则描述
        wmBarcodeConfig: [],                     //条码属性配置表
        mdbarcodebill: {},                       //对照表
      },
      // 表单参数
      dialogForm: {
        sourceBill: '',
        defaultFlag: false,
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
    if (this.$route.query.bcRuleId) {
      // console.log(this.$route.query.bcRuleId)
      let BcRuleId = this.$route.query.bcRuleId
      this.getQueryParams(BcRuleId)
    } else {
      let res = ''
      let wmBarcodeConfig = ''
      this.setattributeList(res, wmBarcodeConfig)
    }
    // this.getList()

  },
  mounted () {

    this.list = this.states.map(item => {
      return { value: `value:${item}`, label: `label:${item}` }
    })

    /**dialog下拉框赋值 */
    this.setOptions()
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
    /**获取条码规则页面传过来的bcRuleId的其他数据 */
    getQueryParams (BcRuleId) {
      console.log(BcRuleId)
      let that = this
      let token = getToken()
      let orgId = 1001712062695280
      Vue.axios({
        method: 'GET',
        url: serverUrl + 'system/bcdrule/' + BcRuleId + "/" + orgId,
        headers: {
          'authorization': token
        },
        data: {}
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.setqueryParams(response.data.data)                        //调用条码详情初始化函数
          that.setattributeList(response.data.data.wmBarcodeConfig)      //调用条码配置初始化函数
          that.setContrastList(response.data.data.mdbarcodebill)         //调用对照表初始化函数
        }
      }).catch(function (error) {
        console.log(error)
      })


    },

    /**获取bcRuleId后对应的规则详情赋值 */
    setqueryParams (res) {
      let that = this
      console.log(res)
      that.resetQueryParams()
      Object.keys(res).forEach(function (key) {
        that.queryParams[key] = res[key]
      })
    },

    /**获取bcRuleId后对应的条码属性赋值 */
    setattributeList (wmBarcodeConfig) {
      let that = this
      console.log(wmBarcodeConfig)
      let tempAttributeList = []


      /**获取所有已生成属性 */
      let token = getToken()
      Vue.axios({
        method: 'GET',
        // baseURL: '/dev-api',
        // url: '/system/attribute/list',
        // url: 'http://192.168.20.142:8082/system/attribute/list',
        url: serverUrl + 'system/attribute/list',
        headers: {
          'authorization': token
        },
        data: {}
      }).then(function (response) {
        // console.log(response.data.rows)
        tempAttributeList = response.data.rows
        console.log(tempAttributeList)
        that.setDetailsAttributeList(tempAttributeList, wmBarcodeConfig)
      }).catch(function (error) {
        console.log(error)
      })


    },

    /**渲染已创建规则中已保存的属性配置 */
    setDetailsAttributeList (res, wmBarcodeConfig) {
      let that = this
      console.log(res)
      console.log(wmBarcodeConfig)

      /**循环遍历获取属性渲染table */
      res.forEach(function (obj, index) {
        console.log(obj)
        let tempData = {}
        Object.keys(obj).forEach(function (key) {
          // console.log(key)
          tempData[key] = obj[key]
        })
        // console.log(tempData)
        // tempData.selected = true
        that.attributeList.push(tempData)
        console.log(that.attributeList)
      })

      /**回选条码规则已添加的属性 */
      if (res != '' && wmBarcodeConfig != '') {
        that.$nextTick(() => {
          wmBarcodeConfig.forEach(row => {
            that.attributeList.forEach(item => {
              console.log(item)
              if (item.attributeId == row.attributeId) {
                that.$refs.multipleTable.toggleRowSelection(item, item.selected)
              }
            })
          })
        })
      }

    },


    /**获取bcRuleId初始化条码对照表 */
    setContrastList (res) {
      let that = this
      console.log(res)

      let tempData = {}
      Object.keys(res).forEach(function (key) {
        // console.log(key)
        tempData[key] = res[key]
      })
      // console.log(tempData)
      that.suitableData.push(tempData)
      console.log(that.suitableData)
    },

    /**挑选checkbox触发函数 */
    selectChange (rows, selected) {
    },
    /**新增条码对照表 */
    addMdBarcodeBill () {
      this.open = true
    },
    /**checkbox绑定 */
    selectable (row, index) {
    },
    /** 查询客户列表 */
    getList () {
    },
    // 取消按钮
    cancel () {
    },
    // 表单重置
    reset () {
      this.dialogForm = {
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        clientEn: null,
        clientDes: null,
        clientLogo: null,
        clientType: null,
        address: null,
        website: null,
        email: null,
        tel: null,
        contact1: null,
        contact1Tel: null,
        contact1Email: null,
        contact2: null,
        contact2Tel: null,
        contact2Email: null,
        creditCode: null,
        enableFlag: 'Y',
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
      // this.autoGenFlag = false
      // this.resetForm("form")
    },
    /**重置条码详情queryParams */
    resetQueryParams () {
      this.queryParams = {
        bcRuleId: '',
        bcRuleCode: '',
        barcodeType: '',
        bcRuleName: '',
        createBy: '',
        describeData: '',
        remark: '',
      }
    },

    /** 搜索按钮操作 */
    handleQuery () {

    },
    /** 重置按钮操作 */
    resetQuery () {

    },
    // 多选框选中数据
    handleSelectionChange (row) {
      console.log(row)
      this.queryParams.wmBarcodeConfig = []
      this.queryParams.wmBarcodeConfig = row
      console.log(this.queryParams.wmBarcodeConfig)
    },

    /**回显时使用的RowKey */
    getRowKey (row) {
    },

    /** 新增按钮操作 */
    handleAdd () {

    },
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 提交按钮操作 */
    handleUpdate (row) {

      let that = this
      if (that.queryParams.orgId == '') {
        that.queryParams.orgId = '1'
        that.queryParams.orgName = 'aa'
      }
      let data = JSON.stringify(that.queryParams)
      // console.log(that.queryParams)
      console.log(data)
      let token = getToken()
      Vue.axios({
        method: 'POST',
        // baseURL: '/dev-api',
        url: serverUrl + 'system/bcdrule',
        // url: 'http://192.168.1.10:8082/system/bcdrule',
        // url: 'http://192.168.1.204:8080/system/bcdrule',
        headers: {
          'authorization': token
        },
        data: {
          data
        }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {

        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /** 提交按钮 */
    submitForm (dialogData) {
      console.log(dialogData)
      let that = this
      that.setContrastList(dialogData)
      that.queryParams.mdbarcodebill = {} //先重置
      Object.keys(dialogData).forEach((index) => {
        // console.log(index)
        that.queryParams.mdbarcodebill[index] = dialogData[index]
      })
      console.log(that.queryParams.mdbarcodebill)
      that.open = false
    },
    /** 删除按钮操作 */
    handleDelete (row) {

    },
    /** 导出按钮操作 */
    handleExport () {

    },
    //自动生成编码
    handleAutoGenChange (autoGenFlag) {

    },

    /**是否默认规则 */
    handleDefaultFlagChange (defaultFlag) {
      console.log(defaultFlag)
    },

    /**dialog单据类型下拉框赋值 */
    setOptions () {
      this.options = [{
        value: 'MDItem',
        label: '物料产品表'
      }, {
        value: 'MDClient',
        label: '客户'
      }, {
        value: 'MDItemBox',
        label: '箱型'
      }, {
        value: 'MDItemPanel',
        label: '托型'
      }, {
        value: 'WmProductRecpt',
        label: '产成品入库单'
      }, {
        value: 'WmStockDetail',
        label: '库存现有量'
      }, {
        value: 'WmsBacklogauthor',
        label: '待办配置'
      }, {
        value: 'WmsBacklog',
        label: '待办'
      }, {
        value: 'MdBarcodeRule',
        label: '条码规则'
      }, {
        value: 'WmBarcode',
        label: '条码主档'
      }, {
        value: 'WmBarcodeConfig',
        label: '条码配置'
      }, {
        value: 'WmPackagePlan',
        label: '组托计划'
      }, {
        value: 'WmTruckLoading',
        label: '装车单'
      },]

    },

    /**dialog下拉框值改变时执行 */
    handleChangeOption (value) {
      console.log(value)
    }
  }
};
</script>

<style>
.el-divider--horizontal {
  margin: 10px 0;
}

.el-form-item__label {
  font-size: 10px;
}
.el-input {
  width: 140px;
}
.el-input__inner::-webkit-input-placeholder {
  width: 120px;
}

.el-textarea__inner {
  width: 130px;
}
</style>

