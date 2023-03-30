<template>
  <div class="app-container">
    <!-- <el-row :gutter="18" style="
          margin: 0 0 10px 0;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          height: 50px;
          border-bottom: 1px solid #dcdfe6;
          background-color: #f8f8f9;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        ">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-search" style="
              width: 110px;
              height: 30px;
              display: flex;
              font-size: 10px;
              align-items: center;
              justify-content: center;
            " @click="handleViewDrawer">入库单详情</el-button>
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      size="mini"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="组织名" prop="orgName">
            <el-input v-model="form.orgName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库单ID" prop="recptId">
            <el-input v-model="form.recptId" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库单编号" prop="recptCode">
            <el-input v-model="form.recptCode" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="入库人" prop="createBy">
            <el-input v-model="form.createBy" type="input" disabled autosize />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库仓库">
            <el-input
              v-model="form.warehouseName"
              type="input"
              disabled
              autosize
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库时间" prop="recptDate">
            <el-date-picker
              clearable
              v-model="form.recptDate"
              type="date"
              disabled
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      :data="dataList"
      @selection-change="handleSelectionChange"
      height="750"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="序号"
        width="50px"
        align="center"
        prop="index"
        fixed
      />
      <el-table-column
        label="入库时间"
        align="center"
        prop="createTime"
        width="100"
        fixed
      >
      </el-table-column>
      <el-table-column
        label="物料编号"
        width="90px"
        align="center"
        prop="itemCode"
        fixed
      >
        <template slot-scope="scope">
          <!--带权限的button点击按钮跳转时认证权限,在若依前台（后台管理->菜单管理）给这个按钮绑定权限,跳转至（test1/index.vue）,router里写动态路由跳转-->
          <!-- <el-button
            size="mini"
            type="text"
            @click="Goto(scope.row)"
            v-hasPermi="['KeWenWMS:ProductionManagement:productrecpt:list']"
            >{{ scope.row.recptId }}</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            @click="handleViewDrawer(scope.row)"
            >{{ scope.row.itemCode }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="物料名称"
        align="center"
        prop="itemName"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="批次编号"
        align="center"
        prop="batchCode"
        width="110px"
      >
      </el-table-column>
      <!-- <el-table-column
        label="物料编码"
        width="150px"
        align="center"
        prop="itemCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="物料名称"
        width="150px"
        align="center"
        prop="itemName"
      /> -->
      <el-table-column
        label="规格型号"
        align="center"
        prop="specification"
        width="120"
      />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column
        label="合格入库数"
        align="center"
        prop="quantityReserved"
      />

      <el-table-column
        label="仓库编号"
        align="center"
        prop="warehouseCode"
        width="140"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column
        label="仓库ID"
        align="center"
        prop="warehouseId"
        width="140"
        :show-overflow-tooltip="true"
      /> -->
      <!-- <el-table-column
        label="库位编号"
        align="center"
        prop="areaCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="库位Id"
        align="center"
        prop="areaId"
        :show-overflow-tooltip="true"
      /> -->

      <el-table-column
        label="入库类型"
        align="center"
        width="130"
        prop="receiptNot"
      >
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="100px"
      />
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="100px"
      />
      <el-table-column label="推送状态" align="center" prop="attr1">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.orderstatus"
            :value="scope.row.attr1"
          /> </template
      ></el-table-column>
      <el-table-column
        label="推送结果信息"
        align="center"
        prop="attr2"
        width="160"
      />
      <el-table-column
        label="生产订单号"
        align="center"
        prop="attr4"
        width="200"
      >
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item :error="scope.row.error" prop="attr4">
              <el-input
                size="mini"
                ref="inputRef"
                v-model="scope.row.attr4"
                @input="checkInput(scope.row.attr4)"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.attr4 == ''"
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="handleUpdateRow(scope.row)"
            v-hasPermi="['mes:wm:productrecpt:edit']"
            >上传</el-button
          >
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="scope.row.status == 'PREPARE'"
            @click="handleExecute(scope.row)"
            v-hasPermi="['mes:wm:productrecpt:edit']"
            >详情</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

    <el-drawer
      title="入库单详情"
      :visible.sync="drawer"
      :direction="direction"
      size="50%"
    >
      <el-table
        v-loading="loading"
        :data="mainDataList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <!-- <el-table-column label="组织名" width="130px" align="center" prop="orgName" fixed :show-overflow-tooltip="true">
        </el-table-column> -->
        <el-table-column
          label="序号"
          width="55px"
          align="center"
          prop="index"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="物料名称"
          width="150px"
          align="center"
          prop="itemName"
        >
        </el-table-column>
        <el-table-column
          label="流水编码"
          align="center"
          prop="batchCode"
          width="120px"
        >
        </el-table-column>
        <!-- <el-table-column
        label="物料编码"
        width="150px"
        align="center"
        prop="itemCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="物料名称"
        width="150px"
        align="center"
        prop="itemName"
      /> -->
        <el-table-column
          label="箱码"
          align="center"
          prop="attr10"
          width="120px"
        />
        <el-table-column
          label="合格入库数"
          align="center"
          prop="quantityReserved"
        />
        <el-table-column
          label="单位"
          align="center"
          prop="unitOfMeasure"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          label="入库日期"
          align="center"
          prop="createTime"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库位" align="center" prop="areaCode" />
        <el-table-column label="创建人" align="center" prop="createBy" />
        <el-table-column
          label="入库时间"
          align="center"
          prop="createTime"
          width="100px"
        />
        <el-table-column label="更新人" align="center" prop="updateBy" />
        <el-table-column
          label="上架时间"
          align="center"
          prop="updateTime"
          width="100px"
        />
        <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import router from "@/router"
import Vue from "vue"
import { getToken } from "@/utils/auth"
import request from "@/utils/request"
var serverUrl = process.env.VUE_APP_BASE_API //获取.env.配置文件的服务器路径
export default {
  name: "productrecptdetails",
  dicts: ["orderstatus"],
  data () {
    return {
      /**mainDataList数据 */
      mainDataList: [],
      dataList: [],
      //入库仓库下拉框参数
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: "pId",
        label: "pName",
      },
      warehouseInfo: [],
      //显示状态标识
      optType: undefined,
      //form表单数据
      form: {},
      //表单验证规则
      rules: {},
      //入库单详情表格数据
      productReceptDetailsList: [],
      //遮罩层开启关闭标识
      loading: false,
      //物料编号弹窗标题
      title: "",
      //物料编码弹窗开启关闭标识、
      open: undefined,
      /**抽屉显示标识 */
      drawer: false,
      /**弹出抽屉的方向 */
      direction: "btt",

      /**上传按钮是否可用状态标识 */
      able: true,

      /**判断生产订单号是否为空 */
      showButton: true,
    }
  },

  created () {
    this.getQuery(this.$route.query.row)
    // this.getDicts("orderstatus").then((res) => {
    //   console.log(res)
    //   this.form.options = JSON.parse(JSON.stringify(res.data))
    //   console.log(this.form.options)
    // })

  },

  methods: {
    /**获取入库单选择的入库单ID */
    getQuery (row) {
      let that = this
      console.log(row)
      Object.keys(row).forEach(function (key) {
        that.form[key] = row[key]
      })
      that.setFormData(row)
      that.getTableList(row)
    },

    /**点击行改变 */
    handleSelectionChange () { },

    /**表格数据赋值 */
    setProductReceptDetailsList () {
      let tempData = {}
      this.dataList.push(tempData)
    },

    /**查看物料详情 */
    openDialog () {
      this.open = true
    },

    /**根据receptID获取数据 */
    getTableList (row) {
      console.log(row)
      let that = this
      let token = getToken()
      let data = {}
      data.recptId = row.recptId
      Vue.axios({
        method: "post",
        url: serverUrl + "system/pdtrcline/listQty",
        // url: 'http://192.168.1.10:8082/system/pdtrcline/list',
        // url: 'http://192.168.1.27:8082/system/pdtrcline/list',
        headers: {
          authorization: token,
        },
        data: { data },
      })
        .then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.setTableDate(response.data.rows)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    /**tableDate赋值 */
    setTableDate (res) {
      console.log(res)
      this.dataList = res
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].index = i + 1
      }
    },

    /**form赋值 */
    setFormData (res) {
      console.log(res)
      let that = this
      Object.keys(res).forEach((index) => {
        that.form[index] = res[index]
      })
      console.log(that.form)
    },

    /**详情按钮操作 */
    handleViewDrawer (res) {
      console.log(res)
      this.drawer = true
      this.drawerTableDataList(res)
    },

    /**获取物料详情数据 */
    drawerTableDataList (row) {
      console.log(row)
      let that = this
      let token = getToken()
      let data = {}
      data.batchCode = row.batchCode
      data.recptId = row.recptId
      data.itemCode = row.itemCode
      Vue.axios({
        method: "POST",
        url: serverUrl + "system/pdtrcline/list",
        headers: {
          authorization: token,
        },
        data: { data },
      })
        .then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.setMainTableDate(response.data.rows)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    /**主界面tabledata数据 */
    setMainTableDate (res) {
      console.log(res)
      let that = this
      that.mainDataList = []
      that.mainDataList = res
      for (let i = 0; i < that.mainDataList.length; i++) {
        that.mainDataList[i].index = i + 1
      }
      console.log(that.mainDataList)
    },

    /**点击行中上传按钮操作 */
    handleUpdateRow (row) {
      let that = this
      console.log(row)
      let data = row
      data.attr2 = null
      let token = getToken()
      Vue.axios({
        method: "POST",
        url: serverUrl + "system/pdtrcline/domineAdd",
        headers: {
          authorization: token,
        },
        data: { data },
      })
        .then(function (response) {
          if (response.data.code == 200) {
            that.$message({
              message: "上传成功",
              type: "success",
            })
            that.getQuery(this.$route.query.row)
          } else {
            that.$message({
              message: response.data.msg,
              type: "error",
            })
          }
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    /**生产订单Input框校验*/
    checkInput (row) {
      // console.log(row)
    },
  },
}
</script>

<style>
.el-form-item__label {
  font-size: 10px;
}

.el-input {
  width: 190px !important;
}

.el-input__inner::-webkit-input-placeholder {
  width: 140px;
}
</style>
