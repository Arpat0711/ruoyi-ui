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
    <!--任务按钮栏-->
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
          @click="handleAddLocation"
          v-hasPermi="['md:md:client:add']"
          >新建库区</el-button
        >
      </el-col>

      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="warehouseList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="组织ID" align="center" prop="orgId" width="160">
      </el-table-column>
      <el-table-column
        label="库区ID"
        align="center"
        width="170"
        prop="locationId"
      >
      </el-table-column>
      <el-table-column label="库区编码" align="center" prop="locationCode">
      </el-table-column>
      <el-table-column label="库区名称" align="center" prop="locationName" />
      <el-table-column label="仓库ID" align="center" prop="warehouseId" />
      <el-table-column label="库区面积" align="center" prop="area">
        <template slot-scope="scope"> {{ scope.row.area }} ㎡ </template>
      </el-table-column>
      <el-table-column
        label="是否开启库位管理"
        align="center"
        prop="areaFlag"
        width="130"
      />

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
        width="100"
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
            @click="handleLocation(scope.row.locationId)"
            v-hasPermi="['mes:wm:warehouse:edit', 'mes:wm:warehouse:list']"
            >库位</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:wm:warehouse:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:wm:warehouse:remove']"
            >删除</el-button
          >
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
            <el-form-item label="库区编码" prop="locationCode">
              <el-input
                v-model="dialogForm.locationCode"
                placeholder="请输库区编码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库区ID" prop="locationId">
              <el-input
                v-model="dialogForm.locationId"
                placeholder="请输入库区ID"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称" prop="locationName">
              <el-input
                v-model="dialogForm.locationName"
                placeholder="请输入库区名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="位置" prop="location">
              <el-input
                v-model="dialogForm.location"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
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
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="dialogForm.remark"
                type="textarea"
                placeholder="请输入内容"
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
  name: "warehouseLocation",
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
        warehouseId: null,
        location: null,
        area: null,
        charge: null,
      },
      // 表单参数
      dialogForm: {
        area: null,
        areaFlag: 'y',
        charge: null,
        createBy: '',
        createTime: '',
        location: null,
        locationCode: null,
        locationId: null,
        locationName: '',
        orgId: null,
        remark: '',
        updateBy: '',
        updateTime: '',
        warehouseCode: null,
        warehouseId: null,
        warehouseName: '',
      },
      // 表单校验
      rules: {
        warehouseCode: [
          { required: true, message: "库区编码不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "库区名称不能为空", trigger: "blur" }
        ],
        warehouseId: [
          { required: true, message: "库区ID不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created () {
    this.getList(this.$route.query.warehouseId)
  },
  methods: {
    /** 查询仓库设置列表 */
    getList (warehouseId) {
      let that = this
      let token = getToken()
      let orgId = 1002106210000278
      // console.log(token)
      Vue.axios({
        method: 'POST',
        url: serverUrl + 'system/location/list',
        // url: 'http://192.168.20.142:8082/system/location/list',
        // url: 'http://192.168.1.26:8082/system/location/list',
        headers: {
          'authorization': token
        },
        data: {
          warehouseId,
          orgId
        }
      }).then(function (response) {
        console.log(response)
        that.setWarehouseLocationList(response.data.rows)
      }).catch(function (error) {
        console.log(error)
      })
    },
    /**赋值itemList */
    setWarehouseLocationList (res) {
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
        tempList.locationId = res[i].locationId               /**库区ID */
        tempList.locationCode = res[i].locationCode           /**库区编码 */
        tempList.locationName = res[i].locationName           /**库区名称 */
        tempList.areaFlag = res[i].areaFlag                   /**是否开启库位管理 */
        this.warehouseList.push(tempList)
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
        area: null,
        areaFlag: 'y',
        charge: null,
        createBy: '',
        createTime: '',
        location: null,
        locationCode: null,
        locationId: null,
        locationName: '',
        orgId: null,
        remark: '',
        updateBy: '',
        updateTime: '',
        warehouseCode: null,
        warehouseId: null,
        warehouseName: '',
      }
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

    },

    /**新增库区按钮操作 */
    handleAddLocation () {
      this.open = true
      this.reset()
    },
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.open = true
      console.log(row)
      let that = this
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
      data = JSON.parse(JSON.stringify(formData))
      data.orgId = 1002106210000278
      data.orgName = '1001'
      data.warehouseId = that.$route.query.warehouseId
      //console.log(data)
      Vue.axios({
        method: 'POST',
        url: serverUrl + 'system/location',
        // url: 'http://192.168.1.26:8082/system/location',

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
          // that.getList()
          that.setWarehouseLocationList(response.data.rows)
        } else if (response.data.code == 500) {
          that.open = false
          that.$message({
            message: '存在相同库区编码，请修改',
            type: 'error',
            center: true
          })
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
      let locationId = row.locationId
      Vue.axios({
        method: 'POST',
        // url: 'http://kewen.fgimaxl2.vipnps.vip/system/location/locationId',
        url: serverUrl + 'system/location/locationId',

        headers: {
          'authorization': token
        },
        data: { locationId }
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
        } else if (response.data.code != 200) {
          that.open = false
          that.$message({
            message: '库区存在库位无法删除',
            type: 'error',
            center: true
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /** 导出按钮操作 */
    handleExport () {

    },
    handleLocation (locationId) {
      let that = this
      console.log(locationId)
      that.$router.push({ path: '/KeWenWMS/md/warehouseArea', query: { locationId: locationId } })
    },
    //自动生成编码
    handleAutoGenChange (autoGenFlag) {

    }
  }
};
</script>

