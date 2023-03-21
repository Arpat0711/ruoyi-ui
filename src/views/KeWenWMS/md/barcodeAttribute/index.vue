<template>
  <div class="app-container">
    <!--功能栏-->
    <el-row
      :gutter="10"
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['md:md:client:add']"
          >保存</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['md:md:client:edit']"
          >新增</el-button
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
          :disabled="multiple"
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
          :disabled="multiple"
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
          :disabled="multiple"
          @click="handleExport"
          v-hasPermi="['md:md:client:export']"
          >禁用</el-button
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
    <el-table
      v-loading="loading"
      :data="itemList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column
        label="组织ID"
        width="100px"
        align="center"
        prop="orgId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="组织名"
        width="130px"
        align="center"
        prop="orgName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="属性ID"
        fixed
        align="center"
        prop="attributeId"
        width="180px"
      />
      <el-table-column
        label="属性编码"
        align="center"
        prop="attributeCode"
        width="130px"
      />
      <el-table-column
        label="属性名称"
        fixed
        align="center"
        prop="attributeName"
        width="150px"
      />
      <el-table-column
        label="属性类型"
        align="center"
        prop="attributeFlag"
        width="130px"
      />
      <el-table-column
        label="对应条码主档字段"
        align="center"
        prop="primaryId"
        width="130px"
      />
      <el-table-column
        label="补位符号"
        align="center"
        prop="changeRate"
        width="130px"
      />
      <el-table-column
        label="空值替代符号"
        align="center"
        prop="enableFlag"
        width="130px"
      />
      <el-table-column
        label="属性描述"
        align="center"
        prop="remark"
        width="130px"
      />
      <el-table-column
        label="数据来源"
        align="center"
        prop="sourceBill"
        width="130px"
      />
      <el-table-column
        label="取数字段"
        align="center"
        prop="sourceField"
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
        label="分隔符"
        align="center"
        prop="separator"
        width="130px"
      />
      <el-table-column
        label="补位符"
        align="center"
        prop="complement"
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
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
        width="120px"
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

    <!--新增属性弹出框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px">
      <el-form
        ref="form"
        :model="dialogForm"
        :rules="rules"
        label-width="130px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="组织ID"
              ref="elInput"
              prop="orgId"
              v-if="optType != true"
            >
              <el-input
                v-model="dialogForm.orgId"
                placeholder="请输入组织ID"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织名" prop="orgName" v-if="optType != true">
              <el-input
                v-model="dialogForm.orgName"
                placeholder="请输入组织名"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="属性ID"
              prop="attributeId"
              v-if="optType != true"
            >
              <el-input
                v-model="dialogForm.attributeId"
                placeholder="请输入属性ID"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="属性编码" prop="attributeCode">
              <el-input
                v-model="dialogForm.attributeCode"
                placeholder="请输入属性编码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="属性名称" prop="attributeName">
              <el-input
                v-model="dialogForm.attributeName"
                placeholder="请输入属性名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="属性类型" prop="attributeFlag">
              <el-input
                v-model="dialogForm.attributeFlag"
                placeholder="请输入属性类型"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="对应条码主档字段" prop="primaryId">
              <el-input
                v-model="dialogForm.primaryId"
                placeholder="请输入对应条码主档字段"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="客户类型" prop="clientType">
              <el-select v-model="form.clientType" placeholder="请选择客户类型">
                <el-option
                  v-for="dict in dict.type.mes_client_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="补位符号" prop="changeRate">
              <el-input
                v-model="dialogForm.changeRate"
                type="input"
                placeholder="请输入补位符号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="空值替代符号" prop="enableFlag">
              <el-input
                v-model="dialogForm.enableFlag"
                type="input"
                placeholder="请输入空值替代符号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对齐方式" prop="attrAlign">
              <el-input
                v-model="dialogForm.attrAlign"
                type="input"
                placeholder="请输入内容取数"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="属性描述" prop="remark">
              <el-input
                v-model="dialogForm.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="取数来源" prop="sourceBill">
              <el-input
                v-model="dialogForm.sourceBill"
                placeholder="请输入取数来源"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="取数字段" prop="sourceField">
              <el-input
                v-model="dialogForm.sourceField"
                placeholder="请输入取数字段"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="格式" prop="attrFormat">
              <el-input
                v-model="dialogForm.attrFormat"
                placeholder="请输入格式"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本段条码位数" prop="barcodeBit">
              <el-input
                v-model="dialogForm.barcodeBit"
                placeholder="请输入本段条码位数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设置值" prop="defaultCode">
              <el-input
                v-model="dialogForm.defaultCode"
                placeholder="请输入设置值"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="分隔符" prop="separator">
              <el-input
                v-model="dialogForm.separator"
                placeholder="请输入分隔符"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="补位符" prop="complement">
              <el-input
                v-model="dialogForm.complement"
                placeholder="请输入补位符"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="参与二维码编码" prop="appendQrcode">
              <el-switch
                v-model="dialogForm.appendQrcode"
                active-text="是"
                active-value="1"
                inactive-text="否"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="参与条码编码" prop="appendBarcode">
              <el-switch
                v-model="dialogForm.appendBarcode"
                active-text="是"
                active-value="1"
                inactive-text="否"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="参与分组" prop="appendGroup">
              <el-switch
                v-model="dialogForm.appendGroup"
                active-text="是"
                active-value="1"
                inactive-text="否"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="参与数量字段" prop="rankGroup">
              <el-input
                v-model="dialogForm.rankGroup"
                placeholder="请输入数量"
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
    <!---->
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'

export default {
  name: 'barcodeAttribute',
  dicts: ['mes_client_type', 'sys_yes_no'],
  data () {
    return {
      /**遮罩层标识 */
      loading: false,
      /**table表格数据来源 */
      itemList: [],
      //表单字段对齐方式
      labelPosition: "left",
      //单据类型单选框
      options: [],
      value: [],
      list: [],

      states: [],
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: false,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户表格数据
      clientList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
        enableFlag: null,
      },
      // 表单参数
      dialogForm: {
        orgId: '',
        orgName: '',
        attributeId: '',
        attributeCode: '',
        attributeName: '',
        attributeFlag: '',
        primaryId: '',
        changeRate: '',
        enableFlag: '',
        attrAlign: '',
        remark: '',
        sourceBill: '',
        sourceField: '',
        attrFormat: '',
        barcodeBit: '',
        defaultCode: '',
        separator: '',
        complement: '',
        appendQrcode: 0,
        appendBarcode: 0,
        appendGroup: 0,
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

  mounted () {
    /**进入页面获取itemList */
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

    /** 查询客户列表 */
    getList () {
      // console.log("调用getList")

      let that = this
      let token = getToken()
      Vue.axios({
        method: 'GET',
        // baseURL: '/dev-api',
        url: 'http://kewen.fgimaxl2.vipnps.vip/system/attribute/list',
        // url: 'http://192.168.20.142:8082/system/attribute/list',
        // url: 'http://192.168.1.204:8080/system/attribute/list',
        // url: 'http://192.168.1.10:8082/system/attribute/list',
        headers: {
          'authorization': token
        },
        data: {}
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.setItemList(response.data.rows)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },

    //初始化itemList
    setItemList (res) {
      let tempData = {}
      this.itemList = []
      console.log(res)
      for (let i = 0; i < res.length; i++) {
        tempData.orgId = res[i].orgId                                 //组织ID
        tempData.orgName = res[i].orgName                             //组织名
        tempData.attributeCode = res[i].attributeCode                 //属性编码
        tempData.attributeId = res[i].attributeId                     //属性ID
        tempData.attributeName = res[i].attributeName                 //属性名称
        tempData.attributeFlag = res[i].attributeFlag                 //属性类型
        tempData.primaryId = res[i].primaryId                         //对应条码主档字段
        tempData.changeRate = res[i].changeRate                       //补位符号
        tempData.enableFlag = res[i].enableFlag                       //空值替代符号
        tempData.remark = res[i].remark                               //属性描述
        tempData.sourceBill = res[i].sourceBill                       //取数来源
        tempData.sourceField = res[i].sourceField                     //取数字段
        tempData.attrAlign = res[i].attrAlign                         //对齐方式
        tempData.attrFormat = res[i].attrFormat                       //格式
        tempData.barcodeBit = res[i].barcodeBit                       //本段条码位数
        tempData.defaultCode = res[i].defaultCode                     //设置值
        tempData.separator = res[i].separator                         //分隔符
        tempData.complement = res[i].complement                       //补位符
        tempData.appendBarcode = res[i].appendBarcode                 //参与条码编码
        tempData.appendQrcode = res[i].appendQrcode                   //参与二维码编码
        tempData.appendGroup = res[i].appendGroup                     //参与分组
        tempData.rankGroup = res[i].rankGroup                         //数量字段

        this.itemList.push(tempData)
        tempData = {}
      }
      console.log(this.itemList)
    },

    // 取消按钮
    cancel () {
      this.open = false
    },
    // 表单重置
    reset () {
      this.dialogForm = {
        orgId: '',
        orgName: '',
        attributeId: '',
        attributeCode: '',
        attributeName: '',
        attributeFlag: '',
        primaryId: '',
        changeRate: '',
        enableFlag: '',
        attrAlign: '',
        remark: '',
        sourceBill: '',
        sourceField: '',
        attrFormat: '',
        barcodeBit: '',
        defaultCode: '',
        separator: '',
        complement: '',
        appendQrcode: 0,
        appendBarcode: 0,
        appendGroup: 0,
      }
      // this.autoGenFlag = false
      this.resetForm("dialogForm")
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
      this.optType = true                   //是否显示此元素状态标志
      this.open = true                       //dialog是否开启状态标志
      this.reset()
      console.log("点击新增")
    },
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      let that = this
      this.optType = false
      this.open = true
      console.log("点击修改")
      console.log(row)
      that.reset()
      Object.keys(row).forEach(function (key) {
        that.dialogForm[key] = row[key]
      })
      console.log(that.dialogForm)

      // console.log(this.optType, typeof (this.optType))
      // this.$nextTick(() => {
      //   console.log(this.$refs.elInput.innerHTML)
      // })

    },
    /** 提交按钮 */
    submitForm (data) {

      let that = this
      let token = getToken()
      console.log(token)
      console.log(data)
      data.orgId = 1                         //临时默认数值
      data.orgName = 'aa'                    //临时默认数值
      // data.attributeId = 2                //临时默认数值
      // console.log(data.orgId)
      // console.log(data.orgName)
      // console.log(data.attributeId)
      data = JSON.stringify(data)
      // let data = {}
      Vue.axios({
        method: "POST",
        // baseURL: '/dev-api',
        // url: "/system/attribute",
        url: "http://kewen.fgimaxl2.vipnps.vip/system/attribute",
        // url: "http://192.168.1.204:8080/system/attribute",
        // url: 'http://192.168.1.10:8082/system/attribute',
        headers: {
          'authorization': token
        },
        data: {
          data
        }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.open = false
          that.$message({
            message: '添加属性成功',
            type: 'success',
            center: true
          })
          that.optType = false                 //是否显示状态返回初始值
          that.getList()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      let that = this
      let token = getToken()
      console.log(row.attributeId)
      Vue.axios({
        method: 'DELETE',
        // baseURL: '/dev-api',
        // url: 'http://192.168.1.204:8080/system/attribute/' + row.attributeId,
        url: 'http://kewen.fgimaxl2.vipnps.vip/system/attribute/' + row.attributeId,
        headers: {
          'authorization': token
        },
        data: {}
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
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
}
</script>

<style>
</style>
