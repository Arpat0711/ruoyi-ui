<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户编码" prop="clientCode">
            <el-input
              v-model="queryParams.clientCode"
              placeholder="请输入客户编码"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户名称" prop="clientName">
            <el-input
              v-model="queryParams.clientName"
              placeholder="请输入客户名称"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户简称" prop="clientNick">
            <el-input
              v-model="queryParams.clientNick"
              placeholder="请输入客户简称"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: end">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      :data="clientList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="客户编码"
        align="center"
        prop="clientCode"
        width="160px"
        fixed
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="客户名称"
        width="160px"
        align="center"
        prop="clientName"
      />
      <el-table-column
        label="客户简称"
        align="center"
        prop="clientNick"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户英文名称"
        align="center"
        prop="clientEn"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户简介"
        align="center"
        prop="clientDec"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户类型"
        align="center"
        prop="clientType"
        width="160px"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="客户默认送货地点"
        align="center"
        prop="tel"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户官网地址"
        align="center"
        prop="tel"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户邮箱"
        align="center"
        prop="tel"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户电话"
        align="center"
        prop="tel"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="联系人1"
        align="center"
        prop="contact1"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="联系人1-电话"
        align="center"
        prop="contact1Tel"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="联系人2"
        align="center"
        prop="contact1"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="联系人2-电话"
        align="center"
        prop="contact1Tel"
        width="160px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="统一信用社会代码"
        align="center"
        prop="creditCode"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="100px"
      />
      <!-- <el-table-column
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

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户编码" prop="clientCode">
              <el-input
                v-model="form.clientCode"
                placeholder="请输入客户编码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch
                v-model="autoGenFlag"
                active-color="#13ce66"
                active-text="自动生成"
                @change="handleAutoGenChange(autoGenFlag)"
                v-if="optType != 'view'"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="clientName">
              <el-input
                v-model="form.clientName"
                placeholder="请输入客户名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户简称" prop="clientNick">
              <el-input
                v-model="form.clientNick"
                placeholder="请输入客户简称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户英文名称" prop="clientEn">
              <el-input
                v-model="form.clientEn"
                placeholder="请输入客户英文名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户简介" prop="clientDes">
              <el-input
                v-model="form.clientDes"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户地址" prop="address">
              <el-input
                v-model="form.address"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户官网地址" prop="website">
              <el-input
                v-model="form.website"
                placeholder="请输入客户官网地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户邮箱地址" prop="email">
              <el-input v-model="form.email" v-if="optType == 'view'" />
              <el-input
                v-model="form.email"
                placeholder="请输入客户邮箱地址"
                v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户电话" prop="tel">
              <el-input v-model="form.tel" v-if="optType == 'view'" />
              <el-input
                v-model="form.tel"
                placeholder="请输入客户电话"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户LOGO" prop="clientLogo">
              <el-input v-model="form.clientLogo" v-if="optType == 'view'" />
              <el-input
                v-model="form.clientLogo"
                placeholder="请输入客户LOGO"
                v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人1" prop="contact1">
              <el-input v-model="form.contact1" v-if="optType == 'view'" />
              <el-input
                v-model="form.contact1"
                placeholder="请输入联系人1"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人1-电话" prop="contact1Tel">
              <el-input v-model="form.contact1Tel" v-if="optType == 'view'" />
              <el-input
                v-model="form.contact1Tel"
                placeholder="请输入联系人1-电话"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人1-邮箱" prop="contact1Email">
              <el-input v-model="form.contact1Email" v-if="optType == 'view'" />
              <el-input
                v-model="form.contact1Email"
                placeholder="请输入联系人1-邮箱"
                v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人2" prop="contact2">
              <el-input v-model="form.contact2" v-if="optType == 'view'" />
              <el-input
                v-model="form.contact2"
                placeholder="请输入联系人2"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人2-电话" prop="contact2Tel">
              <el-input v-model="form.contact2Tel" v-if="optType == 'view'" />
              <el-input
                v-model="form.contact2Tel"
                placeholder="请输入联系人2-电话"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人2-邮箱" prop="contact2Email">
              <el-input v-model="form.contact2Email" v-if="optType == 'view'" />
              <el-input
                v-model="form.contact2Email"
                placeholder="请输入联系人2-邮箱"
                v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="社会信用代码" prop="creditCode">
              <el-input
                v-model="form.creditCode"
                readonly
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.creditCode"
                placeholder="请输入统一社会信用代码"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有效" prop="enableFlag">
              <el-radio-group
                v-model="form.enableFlag"
                disabled
                v-if="optType == 'view'"
              >
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
              <el-radio-group v-model="form.enableFlag" v-else>
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                readonly
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
                v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button type="primary" @click="submitForm" v-else>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'
export default {
  name: "Client",
  dicts: ['mes_client_type', 'sys_yes_no'],
  data () {
    return {
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
      form: {},
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
  methods: {
    /** 查询客户列表 */
    getList (clientCode, clientName, clientNick) {
      let that = this
      let token = getToken()
      let data = {}
      data.clientCode = clientCode
      data.clientName = clientName
      data.clientNick = clientNick
      Vue.axios({
        method: "POST",
        url: 'http://kewen.fgimaxl2.vipnps.vip/system/client/list',
        // url: 'http://192.168.1.10:8082/system/client/list',
        // url: 'http://192.168.1.26:8082/system/client/list',
        headers: {
          'authorization': token
        },
        data: { data }
      }).then(function (response) {
        console.log(response)
        that.setClientList(response.data.rows)
      }).catch(function (error) {
        console.log(error)
      })
    },


    /**客户信息表格赋值 */
    setClientList (res) {
      console.log(res)
      this.clientList = []
      this.clientList = JSON.parse(JSON.stringify(res))
    },
    // 取消按钮
    cancel () {

    },
    // 表单重置
    reset () {
      this.form = {
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
      this.autoGenFlag = false
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery () {
      //console.log(this.queryParams.clientCode, this.queryParams.clientName, this.queryParams.clientNick)
      this.getList(this.queryParams.clientCode, this.queryParams.clientName, this.queryParams.clientNick)
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
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {

    },
    /** 提交按钮 */
    submitForm () {

    },
    /** 删除按钮操作 */
    handleDelete (row) {

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
