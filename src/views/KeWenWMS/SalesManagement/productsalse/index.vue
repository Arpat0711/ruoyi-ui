<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="mini"
      label-width="100px"
    >
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item label="出库单编号" prop="salseCode">
            <el-input
              v-model="queryParams.salseCode"
              placeholder="请输入出库单编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售订单编号" prop="soCode">
            <el-input
              v-model="queryParams.soCode"
              placeholder="请输入销售订单编号"
              clearable
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
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: flex-end">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button
              icon="el-icon-check"
              type="primary"
              size="mini"
              @click="examine"
              >审核</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      :data="productsalesList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="出库单编号"
        width="150px"
        align="center"
        prop="salseCode"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleViewDetails(scope.row)"
            v-hasPermi="['mes:wm:productsalse:query']"
            >{{ scope.row.salseCode }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="出库单名称"
        width="150px"
        align="center"
        prop="salseName"
      />
      <el-table-column
        label="出货检验单"
        width="150px"
        align="center"
        prop="oqcCode"
      />
      <el-table-column
        label="销售订单编号"
        width="120px"
        align="center"
        prop="soCode"
      />
      <el-table-column label="客户编码" align="center" prop="clientCode" />
      <el-table-column label="客户名称" align="center" prop="clientName" />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="库区名称" align="center" prop="locationName" />
      <el-table-column label="库位名称" align="center" prop="areaName" />
      <el-table-column
        label="出库日期"
        align="center"
        prop="salseDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.salseDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status">
        <!-- <template slot-scope="scope">
          <dict-tag
            :options="dict.type.mes_order_status"
            :value="scope.row.status"
          />
        </template> -->
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        width="120px"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:wm:productsalse:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:wm:productsalse:remove']"
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

    <!-- 添加或修改销售出库单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="出库单编号" prop="salseCode">
              <el-input
                v-model="form.salseCode"
                placeholder="请输入出库单编号"
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
                v-if="optType != 'view' && form.status == 'PREPARE'"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库单名称" prop="salseName">
              <el-input
                v-model="form.salseName"
                placeholder="请输入出库单名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出货检验单" prop="oqcCode">
              <el-input v-model="form.oqcCode" placeholder="请输入出货检验单">
                <el-button
                  slot="append"
                  @click="handleSelectOqc"
                  icon="el-icon-search"
                ></el-button>
              </el-input>
            </el-form-item>
            <OqcSelectSingle
              ref="oqcSelect"
              @onSelected="onOqcSelected"
            ></OqcSelectSingle>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售订单编号" prop="soCode">
              <el-input
                v-model="form.soCode"
                placeholder="请输入销售订单编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
            <el-form-item label="出库仓库">
              <el-cascader
                v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                @change="handleWarehouseChanged"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库日期" prop="salseDate">
              <el-date-picker
                clearable
                v-model="form.salseDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择出库日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select
                v-model="form.status"
                disabled
                placeholder="请选择单据状态"
              >
                <el-option
                  v-for="dict in dict.type.mes_order_status"
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
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider v-if="form.salseId != null" content-position="center"
        >物料信息</el-divider
      >
      <el-card shadow="always" v-if="form.salseId != null" class="box-card">
        <Productsalseline
          ref="line"
          :salseId="form.salseId"
          :warehouseId="form.warehouseId"
          :locationId="form.locationId"
          :areaId="form.areaId"
          :optType="optType"
        ></Productsalseline>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="cancel"
          v-if="optType == 'view' || form.status != 'PREPARE'"
          >返回</el-button
        >
        <el-button
          type="primary"
          @click="submitForm"
          v-if="form.status == 'PREPARE' && optType != 'view'"
          >保 存</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

var serverUrl = process.env.VUE_APP_BASE_API  //获取.env.配置文件的服务器路径
export default {
  name: "Productsales",
  dicts: ['mes_order_status'],
  // components: {OqcSelectSingle,Productsalseline},
  data () {
    return {

      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
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
      // 销售出库单表格数据
      productsalesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        salseCode: null,
        salseName: null,
        oqcId: null,
        oqcCode: null,
        soCode: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        salseDate: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        salseCode: [
          { required: true, message: "出库单编号不能为空", trigger: "blur" }
        ],
        salseName: [
          { required: true, message: "出库单名称不能为空", trigger: "blur" }
        ],
      },
      /**选中行数据 */
      selectionData: [],
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询销售出库单列表 */
    getList () {
      let that = this
      let token = getToken()
      let data = {}
      data.orgId = 1002106210000278
      Vue.axios({
        method: 'post',
        url: serverUrl + 'system/loading/lists',
        headers: {
          'authorization': token
        },
        data: { data }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.setProductSalesList(response.data.rows)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },

    /**获取信息后table赋值 */
    setProductSalesList (res) {
      console.log(res)
      this.productsalesList = JSON.parse(JSON.stringify(res))
      console.log(this.productsalesList)
    },

    /**跳转页面函数 */
    Goto (salseId, orgId) {
      console.log(salseId, orgId)
      this.$router.push({ path: '/KeWenWMS/SalesManagement/productsalsedetails', query: { salseId: salseId, orgId: orgId } })
    },

    /**审核按钮执行操作 */
    examine () {
      let that = this
      let token = getToken()
      let data = []
      let tempObj = {}
      Object.keys(this.selectionData).forEach((index) => {
        tempObj.orgId = this.selectionData[index].orgId
        tempObj.salseId = this.selectionData[index].salseId
        tempObj.status = this.selectionData[index].status
        data.push(tempObj)
      })

      Vue.axios({
        method: 'post',
        url: serverUrl + 'system/loading/status',
        // url: 'http://192.168.20.142:8082/system/loading/status',
        // url: 'http://192.168.1.204:8080/system/loading/status',
        // url: 'http://192.168.1.10:8080/system/loading/status',
        headers: {
          'authorization': token
        },
        data: { data }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.getList()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    //获取仓库信息
    getWarehouseList () {

    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged (obj) {

    },
    // 取消按钮
    cancel () {

    },
    // 表单重置
    reset () {

    },
    /** 搜索按钮操作 */
    handleQuery () {

    },
    /** 重置按钮操作 */
    resetQuery () {

    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionData = selection
      console.log(selection)
    },
    // 查询明细按钮操作
    handleViewDetails (row) {
      console.log(row)
      this.Goto(row.salseId, row.orgId)
    },
    /** 新增按钮操作 */
    handleAdd () {

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
    //OQC检验单选择
    handleSelectOqc () {

    },
    //OQC检验单选择弹出框
    onOqcSelected (obj) {

    },

    //自动生成编码
    handleAutoGenChange (autoGenFlag) {

    }
  }
};
</script>
