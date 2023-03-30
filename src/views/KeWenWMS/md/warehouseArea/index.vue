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
          @click="handleAddArea"
          v-hasPermi="['md:md:client:add']"
          >新建库位</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="warehouseList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="组织ID" align="center" prop="orgId" width="160" />
      <el-table-column
        label="组织名称"
        align="center"
        prop="orgName"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:wm:warehouse:query']"
            >{{ scope.row.orgName }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="库区ID"
        align="center"
        prop="locationId"
        width="170"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="库位名称" align="center" prop="areaName">
      </el-table-column>
      <el-table-column label="库位编码" align="center" prop="areaCode">
      </el-table-column>

      <el-table-column label="库区面积" align="center" prop="area">
        <template slot-scope="scope"> {{ scope.row.area }} ㎡ </template>
      </el-table-column>
      <el-table-column
        label="最大载重量"
        align="center"
        prop="maxLoa"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="库位位置X" align="center" prop="positionX" />
      <el-table-column label="库位位置Y" align="center" prop="positionY" />
      <el-table-column label="库位位置Z" align="center" prop="positionZ" />
      <el-table-column label="是否可用" align="center" prop="enableFlagShow" />
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
        width="100"
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
        width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
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

    <!-- 添加或修改库位设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="dialogForm" :rules="rules" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="库位编码" prop="areaCode">
              <el-input
                v-model="dialogForm.areaCode"
                placeholder="请输入库位编码"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="库位名称" prop="areaName">
              <el-input
                v-model="dialogForm.areaName"
                placeholder="请输入库位名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库位ID" prop="areaId">
              <el-input
                v-model="dialogForm.areaId"
                placeholder="请输入库位ID"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="位置" prop="location">
              <el-input
                v-model="dialogForm.location"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row>
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
          <el-col :span="12">
            <el-form-item label="负责人" prop="charge">
              <el-input
                v-model="dialogForm.charge"
                placeholder="请输入负责人"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="16">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="dialogForm.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库位状态" prop="enableFlagShow">
              <el-switch
                v-model="dialogForm.enableFlag"
                active-color="#13ce66"
                inactive-color="#C0C4CC"
                active-text="可用"
                inactive-text="不可用"
                active-value="Y"
                inactive-value="N"
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
        location: null,
        area: null,
        charge: null,
      },
      // 表单参数
      dialogForm: {
        area: '',
        areaCode: null,
        areaId: null,
        areaName: '',
        createBy: '',
        createTime: '',
        enableFlag: '',
        locationCode: null,
        locationId: '',
        locationName: '',
        maxLoa: '',
        orgId: null,
        positionX: '',
        positionY: '',
        positionZ: '',
        remark: '',
        updateBy: '',
        updateTime: '',
      },

      /**是否可填标识 */
      disabled: true,
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
    this.getList(this.$route.query.locationId)

  },
  methods: {
    /** 查询仓库设置列表 */
    getList (locationId) {
      let that = this
      let token = getToken()
      // console.log(token)
      Vue.axios({
        methods: 'GET',
        url: serverUrl + 'system/area/list',
        // url: 'http://192.168.1.26:8082/system/area/list',
        headers: {
          'authorization': token
        },
        params: {
          locationId
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
        tempList.orgId = res[i].orgId                          /**组织ID */
        tempList.areaId = res[i].areaId                        /**库位ID */
        tempList.areaCode = res[i].areaCode                    /**库位编码 */
        tempList.areaName = res[i].areaName                    /**库位名称 */
        tempList.area = res[i].area                            /**库位面积 */
        tempList.maxLoa = res[i].maxLoa                        /**最大载重量 */
        tempList.positionX = res[i].positionX                  /**库位位置X */
        tempList.positionY = res[i].positionY                  /**库位位置Y */
        tempList.positionZ = res[i].positionZ                  /**库位位置Z */
        tempList.remark = res[i].remark                        /**备注 */
        tempList.createBy = res[i].createBy                    /**创建人 */
        tempList.createTime = res[i].createTime                /**创建时间 */
        tempList.updateBy = res[i].updateBy                    /**更新人 */
        tempList.updateTime = res[i].updateTime                /**更新时间 */
        tempList.locationId = res[i].locationId                /**库区ID */

        if (res[i].enableFlag == "Y") {                        /**是否可用 */
          tempList.enableFlagShow = "可用"
        } else if (res[i].enableFlag == "N") {
          tempList.enableFlagShow = "不可用"
        }
        // tempList.enableFlag = res[i].enableFlag
        tempList.locationCode = res[i].locationCode           /**库区编码 */
        tempList.locationName = res[i].locationName           /**库区名称 */

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
        area: '',
        areaCode: null,
        areaId: null,
        areaName: '',
        createBy: '',
        createTime: '',
        enableFlag: false,
        locationCode: null,
        locationId: null,
        locationName: '',
        maxLoa: '',
        orgId: null,
        positionX: '',
        positionY: '',
        positionZ: '',
        remark: '',
        updateBy: '',
        updateTime: '',
      }
      // this.autoGenFlag = false
      // this.resetForm("form")
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

    /**新增库位按钮操作 */
    handleAddArea () {
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
      that.open = false
      let token = getToken()
      let data = {}
      data = JSON.parse(JSON.stringify(formData))
      data.orgId = 1002106210000278
      data.orgName = '1001'
      data.locationId = this.$route.query.locationId
      console.log(data)

      Vue.axios({
        method: 'POST',
        url: serverUrl + 'system/area',
        // url: 'http://192.168.20.142:8082/system/area',
        // url: 'http://192.168.1.26:8082/system/area',
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
          that.getList(formData.locationId)
        } else if (response.data.code == 500) {
          that.open = false
          that.$message({
            message: '存在相同库位编码，请修改',
            type: 'error',
            center: true
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },

    /** 删除按钮操作 */
    handleDelete (row) {
      let that = this
      let token = getToken()
      // console.log(row)
      let areaId = row.areaId
      Vue.axios({
        method: 'POST',
        url: serverUrl + 'system/area/areaId',
        // url: 'http://192.168.1.26:8082/system/area/areaId',

        headers: {
          'authorization': token
        },
        data: { areaId }
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

      that.optType = false
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

