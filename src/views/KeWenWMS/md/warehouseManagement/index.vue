<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="仓库编码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入仓库编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入仓库名称"
          clearable
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
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form> -->
    <!-- <el-row
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
          @click="handleAdd"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >新增仓库</el-button
        >
      </el-col>
    </el-row> -->
    <el-table
      v-loading="loading"
      :data="warehouseList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="组织ID"
        align="center"
        prop="orgId"
        width="160"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="仓库ID"
        align="center"
        prop="warehouseId"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="仓库编码"
        align="center"
        prop="warehouseCode"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="仓库名称"
        align="center"
        prop="warehouseName"
        width="160"
      />
      <el-table-column
        label="仓库位置"
        align="center"
        prop="location"
        width="160"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="仓库面积" align="center" prop="area">
        <template slot-scope="scope"> {{ scope.row.area }} ㎡ </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="charge" />
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
      />
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="160"
      />
      <el-table-column
        label="操作"
        align="center"
        width="200px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-shop"
            @click="handleLocation(scope.row.warehouseId)"
            v-hasPermi="['mes:wm:warehouse:edit', 'mes:wm:warehouse:list']"
            >库区</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:wm:warehouse:edit']"
            >修改</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:wm:warehouse:remove']"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改仓库设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="dialogForm" :rules="rules" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="组织ID" prop="orgId" v-if="optType != true">
              <el-input
                v-model="dialogForm.orgId"
                placeholder="请输入组织ID"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="仓库ID"
              prop="warehouseId"
              v-if="optType != true"
            >
              <el-input
                v-model="dialogForm.warehouseId"
                placeholder="请输入仓库ID"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="仓库编码" prop="warehouseCode">
              <el-input
                v-model="dialogForm.warehouseCode"
                placeholder="请输入仓库编码"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
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
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="warehouseName">
              <el-input
                v-model="dialogForm.warehouseName"
                placeholder="请输入仓库名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="位置" prop="location">
              <el-input
                v-model="dialogForm.location"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="面积" prop="area">
              <el-input-number
                :min="0"
                :step="1"
                :percision="2"
                v-model="dialogForm.area"
                placeholder="请输入面积"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="dialogForm.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="8">
          <el-form-item label="负责人" prop="charge">
            <el-input v-model="dialogForm.charge" placeholder="请输入负责人" />
          </el-form-item>
        </el-col>
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
  name: "Warehouse",
  data () {
    return {
      //仓库表格数据
      warehouseList: [],
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
      // 仓库设置表格数据
      warehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseCode: null,
        warehouseName: null,
        location: null,
        area: null,
        charge: null,
      },
      // 弹框表单参数
      dialogForm: {
        area: null,
        charge: '',
        createBy: '',
        createTime: '',
        location: '',
        orgId: null,
        params: '',
        remark: '',
        searchValue: null,
        updateBy: '',
        updateTime: '',
        warehouseCode: '',
        warehouseId: '',
        warehouseName: '',
      },
      // 表单校验
      rules: {
        warehouseCode: [
          { required: true, message: "仓库编码不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "仓库名称不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询仓库设置列表 */
    getList () {
      let that = this
      let token = getToken()
      // console.log(token)
      Vue.axios({
        methods: 'GET',
        // url: 'http://kewen.fgimaxl2.vipnps.vip/system/warehouse/list',
        // url: 'http://192.168.20.142:8082/system/warehouse/list',
        // url: 'http://192.168.1.10:8082/system/warehouse/list',
        url: serverUrl + 'system/warehouse/list',
        headers: {
          'authorization': token
        },
        params: {}
      }).then(function (response) {
        console.log(response)
        that.setWarehouseList(response.data)
      }).catch(function (error) {
        console.log(error)
      })
    },
    /**赋值itemList */
    setWarehouseList (res) {
      console.log(res)
      let tempList = {}
      this.warehouseList = []
      for (let i = 0; i < res.length; i++) {
        tempList.orgId = res[i].orgId                         /**组织ID */
        tempList.warehouseId = res[i].warehouseId             /**仓库ID */
        tempList.warehouseCode = res[i].warehouseCode         /**仓库编码 */
        tempList.warehouseName = res[i].warehouseName         /**仓库名称 */
        tempList.location = res[i].location                   /**仓库位置 */
        tempList.area = res[i].area                           /**仓库面积 */
        tempList.charge = res[i].charge                       /**负责人 */
        tempList.remark = res[i].remark                       /**备注 */
        tempList.createBy = res[i].createBy                   /**创建人 */
        tempList.createTime = res[i].createTime               /**创建时间 */
        tempList.updateBy = res[i].updateBy                   /**更新人 */
        tempList.updateTime = res[i].updateTime               /**更新时间 */
        this.warehouseList.push(tempList)
        tempList = {}
      }

    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.dialogForm = {
        area: null,
        charge: '',
        createBy: '',
        createTime: '',
        location: '',
        orgId: null,
        params: '',
        remark: '',
        searchValue: null,
        updateBy: '',
        updateTime: '',
        warehouseCode: '',
        warehouseId: '',
        warehouseName: '',
      }
      // console.log("reset")
      // this.autoGenFlag = false
      // this.resetForm("dialogForm")
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
      this.open = true
      this.optType = true
      this.reset()
    },
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      console.log(row)
      let that = this

      that.open = true
      Object.keys(row).forEach(function (key) {
        that.dialogForm[key] = row[key]
      })

    },
    /** 提交按钮 */
    submitForm (data) {
      let that = this
      console.log(data)
      that.open = false
      let token = getToken()
      // data = JSON.stringify(data)
      data.orgId = 1002106210000278                         //临时默认数值
      data.orgName = '1001'                     //临时默认数值
      Vue.axios({
        method: 'POST',
        // url: 'http://kewen.fgimaxl2.vipnps.vip/system/warehouse',
        // url: 'http://192.168.20.142:8082/system/warehouse',
        url: serverUrl + 'system/warehouse',
        // url: 'http://192.168.1.10:8082/system/warehouse',
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
            message: '仓库修改成功',
            type: 'success',
            center: true
          })
          // that.optType = false                 //是否显示状态返回初始值
          that.getList()
        } else if (response.data.code == 500) {
          that.open = false
          that.$message({
            message: '存在相同仓库编码，请修改',
            type: 'error',
            center: true
          })
        }
      }).catch(function (error) {
        console.log(error)
      })

      that.optType = false
    },
    /** 删除按钮操作 */
    handleDelete (row) {

    },
    /** 导出按钮操作 */
    handleExport () {

    },
    handleLocation (warehouseId) {
      let that = this
      console.log(warehouseId)
      that.$router.push({ path: '/KeWenWMS/md/warehouseLocation', query: { warehouseId: warehouseId } })
    },
    //自动生成编码
    handleAutoGenChange (autoGenFlag) {

    }
  }
};
</script>
