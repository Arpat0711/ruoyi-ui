<template>
  <div class="app-container">
    <el-drawer
      title="已选销售订单详情"
      :visible.sync="drawer"
      :direction="direction"
      size="60%"
      :append-to-body="true"
    >
      <el-row
        :gutter="18"
        style="
          margin: 0 0 5px 0;
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
        <el-col :span="1.5" style="display: flex; justify-content: flex-end">
          <el-button
            type="warning"
            icon="el-icon-edit-outline"
            style="
              width: 100px;
              height: 30px;
              display: flex;
              font-size: 10px;
              align-items: center;
              justify-content: center;
            "
            @click="updateSoline(boxList)"
            >修改销售订单</el-button
          ></el-col
        ></el-row
      >

      <el-table v-loading="loading" :data="boxList">
        <el-table-column
          label="销售订单编号"
          align="center"
          prop="soDocno"
          width="150px"
        >
        </el-table-column>
        <el-table-column
          label="产品编码"
          align="center"
          prop="itemCode"
          width="90px"
        />
        <el-table-column
          label="产品名称"
          align="center"
          prop="itemName"
          width="140px"
        />
        <!-- <el-table-column
        label="规格型号"
        align="center"
        prop="specification"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.mes_client_type"
            :value="scope.row.soDocno"
          />
        </template>
      </el-table-column> -->
        <el-table-column
          label="物料总数量"
          width="90px"
          align="center"
          prop="quantity"
        />
        <el-table-column
          label="可组托数量"
          width="90px"
          align="center"
          prop="viableNum"
        />
        <el-table-column
          label="本次组托数量"
          width="170px"
          align="center"
          prop="postnum"
        >
          <!-- <el-input size="mini"></el-input> -->
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-form-item :error="scope.row.error" prop="postnum">
                <el-input
                  size="mini"
                  ref="inputRef"
                  v-model="scope.row.postnum"
                  @input="drawerInputChange(scope.row)"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="箱容数" align="center" prop="boxQty" />
        <el-table-column label="托容数" align="center" prop="panelQty" />
        <el-table-column
          label="客户标识"
          align="center"
          prop="identification"
        />

        <!-- <el-table-column
          label="生产订单编号"
          align="center"
          prop="workOrderCode"
          width="110"
        /> -->
        <!-- <el-table-column label="创建人" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="更新人" align="center" prop="updateBy" />
        <el-table-column label="更新时间" align="center" prop="updateTime" /> -->
        <!-- <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="100"
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

      <el-row
        :gutter="18"
        style="
          margin: 0 0 5px 0;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          height: 50px;
          /* border-bottom: 1px solid #dcdfe6; */
          /* background-color: #f8f8f9; */
          /* border-top-left-radius: 5px;
          border-top-right-radius: 5px; */
        "
      >
        <el-col :span="1.5" style="display: flex; justify-content: flex-end">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            style="
              width: 100px;
              height: 30px;
              display: flex;
              font-size: 10px;
              align-items: center;
              justify-content: center;
            "
            @click="updateGroupPallet"
            >更新组托</el-button
          ></el-col
        ></el-row
      >
    </el-drawer>

    <!-- 更新组托计划对话框 -->
    <el-dialog
      title="选择销售订单"
      :visible.sync="openUpdateSolineDialog"
      width="1200px"
      append-to-body
    >
      <el-form
        ref="UpdateDialogFormData"
        :model="UpdateDialogFormData"
        :rules="rules"
        label-width="85px"
        :inline="true"
      >
        <el-row>
          <el-col :span="16">
            <el-form-item label="客户" prop="custCode">
              <el-input
                v-model="UpdateDialogFormData.custCode"
                placeholder="请输入关键字"
                @keyup.enter.native="handleDialogSearch"
              />
            </el-form-item>
            <el-form-item label="销售订单号" prop="soDocno">
              <el-input
                v-model="UpdateDialogFormData.soDocno"
                placeholder="请输入关键字"
                @keyup.enter.native="handleDialogSearch"
              />
            </el-form-item>
            <el-form-item label="交期" prop="deadline">
              <el-input
                v-model="UpdateDialogFormData.deadline"
                placeholder="请输入关键字"
                @keyup.enter.native="handleDialogSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5" style="display: flex; justify-content: flex-end">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleDialogSearch"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
          <el-col
            :span="3"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 7px;
            "
          >
            <el-switch
              v-model="fullBox"
              active-text="整数装箱"
              :active-value="false"
              :inactive-value="true"
              @change="handleChangePlan"
            >
            </el-switch>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="客户类型" prop="attr4">
              <el-input
                v-model="UpdateDialogFormData.attr4"
                placeholder="请输入客户类型"
                @keyup.enter.native="handleDialogSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        :data="UpdateDialogData"
        @selection-change="UpdateDialogSelectionChange"
        height="400"
        ref="UpdateDialogTable"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column
          label="交期"
          width="100px"
          align="center"
          prop="shippingDeadline"
          fixed
        />
        <el-table-column
          label="销售订单号"
          align="center"
          prop="soDocno"
          width="150px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="销售子订单号"
          width="150px"
          align="center"
          prop="custPoNo"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="客户标识"
          align="center"
          prop="identification"
        />
        <!-- <el-table-column
          label="销售订单行ID"
          width="150px"
          align="center"
          prop="solineId"
          :show-overflow-tooltip="true"
        /> -->

        <el-table-column
          label="物料编码"
          width="150px"
          align="center"
          prop="itemCode"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="料号名称"
          width="150px"
          align="center"
          prop="itemName"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column
          label="客户料号ID"
          width="150px"
          align="center"
          prop="custItemId"
          :show-overflow-tooltip="true"
        /> -->

        <el-table-column
          label="物料总数"
          width="120px"
          align="center"
          prop="quantity"
          :show-overflow-tooltip="true"
        />

        <el-table-column label="可组托数量" align="center" prop="viableNum" />
        <el-table-column
          label="本次组托数量"
          width="170px"
          align="center"
          prop="postnum"
        >
          <!-- <el-input size="mini"></el-input> -->
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-form-item :error="scope.row.error" prop="postnum">
                <el-input
                  size="mini"
                  ref="inputRef"
                  v-model="scope.row.postnum"
                  @input="drawerInputChange(scope.row)"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="箱容数"
          width="150px"
          align="center"
          prop="boxQty"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="托容数"
          width="150px"
          align="center"
          prop="panelQty"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="客户类型" align="center" prop="category" />
        <el-table-column
          label="单位"
          align="center"
          prop="measure"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="行号"
          align="center"
          prop="docLineno"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="客户编码"
          width="120px"
          align="center"
          prop="custCode"
        />
        <el-table-column
          label="客户名称"
          width="120px"
          align="center"
          prop="custName"
        />
        <el-table-column
          label="客户料号"
          width="120px"
          align="center"
          prop="custItemCode"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="客户品名"
          width="150px"
          align="center"
          prop="custItemName"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column
          label="创建人"
          align="center"
          prop="createBy"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="创建时间"
          width="250px"
          align="center"
          prop="createTime"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="更新人"
          align="center"
          prop="updateBy"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="更新时间"
          width="150px"
          align="center"
          prop="updateTime"
          :show-overflow-tooltip="true"
        /> -->
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button
          type="primary"
          @click="UpdateDialogSubmit"
          v-else
          :disabled="able"
          >添加</el-button
        >
        <el-button @click="UpdateDialogCancel">取 消</el-button>
      </div>
      <el-pagination
        @size-change="handleUpdateDialogSizeChange"
        @current-change="handleUpdateDialogCurrentChange"
        background
        :page.sync="UpdateDialogPageData.pageNum"
        :limit.sync="UpdateDialogPageData.pageSize"
        layout="prev, pager, next,total"
        :total="UpdateDialogPageData.total"
        :page-size="UpdateDialogPageData.pageSize"
      >
      </el-pagination>
    </el-dialog>

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
      <el-col :span="1.5" style="display: flex; justify-content: flex-end">
        <el-button
          type="success"
          icon="el-icon-download"
          v-show="showDownload"
          style="
            width: 80px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="download(dict.type.fine_report)"
          :loading="loading"
          v-hasPermi="['md:md:client:add']"
          >导出</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-folder"
          style="
            width: 80px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="saveData"
          v-if="viewButtons"
          :loading="loading"
          v-hasPermi="['md:md:client:add']"
          >保存</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-takeaway-box"
          style="
            width: 80px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="addGroupPallet"
          v-if="viewButtons"
          :loading="loading"
          v-hasPermi="['md:md:client:add']"
          >组托</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-scissors"
          style="
            width: 80px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="splitGroupPallet"
          v-if="viewButtons"
          :loading="loading"
          v-hasPermi="['md:md:client:add']"
          >拆托</el-button
        >
        <!-- <el-button
          type="warning"
          icon="el-icon-folder-opened"
          style="
            width: 100px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="groupPallet"
          v-hasPermi="['md:md:client:add']"
          >修改组托计划</el-button
        > -->
        <el-button
          type="info"
          icon="el-icon-shopping-cart-2"
          style="
            width: 120px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="openDrawer"
          v-if="viewButtons"
          :loading="loading"
          v-hasPermi="['md:md:client:add']"
          >查看销售订单信息</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="allPanelList"
      :row-class-name="tableRowClassName"
      :setCurrentRow="setCurrentRow"
      @selection-change="handleSelectionChange"
      ref="allPanel"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="客户编码" align="center" prop="clientCode">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:md:client:query']"
            >{{ scope.row.clientCode }}</el-button
          >
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="组织名"
        align="center"
        prop="orgId"
        :show-overflow-tooltip="true"
      /> -->
      <el-table-column label="" align="center" prop="panelCode" fixed />
      <el-table-column
        label="销售订单编号"
        align="center"
        prop="soDocno"
        width="150px"
        fixed
      >
        <!-- <template slot-scope="scope">
          <el-button size="mini" type="text" @click="Goto(scope.row)">{{
            scope.row.soDocno
          }}</el-button>
        </template> -->
      </el-table-column>
      <!-- <el-table-column label="客户编号" align="center" prop="custCode" /> -->
      <el-table-column label="托序号" align="center" prop="panelIndexCode" />
      <el-table-column
        label="产品编码"
        align="center"
        prop="itemCode"
        width="90"
      />
      <el-table-column
        label="产品名称"
        align="center"
        prop="itemName"
        width="110"
      />
      <!-- <el-table-column
        label="规格型号"
        align="center"
        prop="specification"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.mes_client_type"
            :value="scope.row.soDocno"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        label="本托物料数量"
        align="center"
        prop="panelitemNum"
        width="100px"
        :show-overflow-tooltip="true"
      />

      <el-table-column label="箱型名称" align="center" prop="boxName" />
      <el-table-column label="装箱数" align="center" prop="quantityPackage" />
      <el-table-column
        label="剩余未组托箱数"
        align="center"
        prop="notPanelBox"
        width="110px"
      />
      <el-table-column label="托容数" align="center" prop="panelQty" />
      <el-table-column label="托体积(m³)" align="center" prop="volume" />
      <el-table-column label="净重(kg)" align="center" prop="packageRough" />
      <el-table-column label="托毛重(kg)" align="center" prop="packageNet" />
      <!-- <el-table-column
        label="生产订单编号"
        align="center"
        prop="workOrderCode"
        width="110"
        :show-overflow-tooltip="true"
      /> -->
      <!-- <el-table-column label="创建人" align="center" prop="createBy" /> -->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      /> -->
      <!-- <el-table-column label="更新人" align="center" prop="updateBy" /> -->
      <!-- <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        :show-overflow-tooltip="true"
      /> -->
      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="100"
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

    <el-dialog
      title="进行组托"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <el-form :model="dialogForm" ref="dialogFormRef">
        <el-table :data="dialogTableData">
          <el-table-column label="产品名称" align="center" prop="itemName" />
          <el-table-column
            label="剩余未装箱数"
            align="center"
            prop="notPanelBox"
          />
          <el-table-column label="托容数" align="center" prop="panelQty" />
          <el-table-column label="组托箱数" align="center" prop="inputBoxNum">
            <template slot-scope="scope">
              <el-form-item :error="scope.row.error" prop="inputBoxNum">
                <el-input
                  size="mini"
                  v-model="scope.row.inputBoxNum"
                  @input="dialogInputChange(scope.row)"
                  clearable
                  ref="inputRef"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addGroupRow" :disabled="able"
          >组托</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue"
import { getToken } from "@/utils/auth"
import request from "@/utils/request"
import { getDicts } from "@/api/system/dict/data"


var serverUrl = process.env.VUE_APP_BASE_API //获取.env.配置文件的服务器路径
export default {
  name: "grouppalletDetails",
  dicts: ["cust_tag", "fine_report"],
  data () {
    const validateInput = (rule, value, callback) => { }
    return {
      /**加载Loading标识 */
      dialogLoading: false,
      /**显示 */
      showSearch: true,
      /**表单数据 */
      queryParams: {},
      /**遮罩层开启标识 */
      loading: false,
      /**table数据来源 */
      boxList: [],
      /**组托数量 */
      packageNo: null,

      /**抽屉弹出标识 */
      drawer: false,
      /**抽屉打开方向(右到左) */
      direction: "rtl",
      /**table数据 */
      allPanelList: [],

      /**完整组托托盘 */
      completePanelList: [],

      /**不完整组托托盘 */
      incompletePanelList: [],

      /**未组托完整托序号 */
      incompletePanelListCode: [],

      /**选中行数据 */
      selectRow: [],

      /**弹窗开关标识 */
      open: false,

      /**弹窗中table的数据 */
      dialogTableData: [],

      /**dialog弹窗表单数据 */
      dialogForm: {
        /**dialog表单输入规则 */
        rules: {
          inputBoxNum: {
            type: "number",
            required: true,
            message: "请输入托容数范围内的数",
            trigger: "blur",
            validator: validateInput,
          },
        },

        /**临时空数组 */
        tempArr: [1, 2, 3],

        /**客户标识(从dicts来) */
        custTag: [],

      },

      /**导出按钮禁止标识 */
      showDownload: false,

      /**更新组托计划弹窗显示标识 */
      openUpdateSolineDialog: false,

      /**更新组托计划弹窗form表单数据 */
      UpdateDialogFormData: {},

      /**更新组托计划弹窗table数据 */
      UpdateDialogData: [],

      /**更新组托计划弹窗表单校验rules */
      rules: {},

      /**更新组托计划弹窗选择销售订单组托按钮是否可用 */
      able: false,

      /**销售订单dialog整数装箱开关 */
      fullBox: true,

      /** */
      optType: undefined,

      /**更新组托计划弹窗分页数据 */
      UpdateDialogPageData: {
        total: 0,
        pageSize: 15,
        pageNum: 1,
      },

      /**审核状态未已审核时不显示操作按钮标识 */
      viewButtons: true,

      /**u9选取销售订单行 */
      u9solines: [],

      /**drawer的修改销售订单dialog选择行 */
      UpdateDialogSelectRow: [],

      /**校验规则 */
      rules: {},

      /**dialog组托按钮开关标识 */
      able: false,

      /**全局保存packageID */
      packageId: null,
    }
  },

  create () {
    // this.getDicts("cust_tag").then(response => {
    //   this.custTag = response.data
    // })
  },
  mounted () {
    console.log(this.$route.query) //判断是从哪个按钮跳过来的

    if (this.$route.query.from == "grouppallet") {
      //选择销售订单dialog跳过来的正常组托
      this.getTableData(this.$route.query.res)
      this.showDownload = false
    } else if (this.$route.query.from == "checkPallet") {
      if (this.$route.query.res.status == "1") {
        this.viewButtons = false
      } else {
        this.viewButtons = true
      }
      this.checkPalletGroup(this.$route.query.res) //点击组托计划号跳过来的进行查询
      this.showDownload = true
    }
  },

  methods: {

    /**表单点击回车执行 */
    handleQuery () { },

    /**重置 */
    resetQuery () { },

    /**如果是从组托页面跳转过来执行 */
    checkPalletGroup (res) {
      console.log(res)
      let that = this
      console.log(that.showDownload)
      let token = getToken()
      let data = {}
      data.orgId = 1001712062695280
      data.packageId = res.packageId
      Vue.axios({
        method: "post",
        url: serverUrl + "system/pkgplan/package/packageson",
        headers: {
          authorization: token,
        },
        data: { data },
      })
        .then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.$message({
              message: "查询成功",
              type: "success",
            })
            that.allPanelList = JSON.parse(JSON.stringify(response.data.data.saledetails),
              that.boxList = JSON.parse(JSON.stringify(response.data.data.u9solines)),
              that.u9solines = JSON.parse(JSON.stringify(response.data.data.u9solines)),
              that.packageId = JSON.parse(JSON.stringify(response.data.data.packageId)),
            )
          } else {
            console.log("报错")
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    /**从组托页面跳转过来后赋值托序号 */
    setCheckPanelList () {
      thant.allPanelList.forEach((index) => {
        console.log(index)
      })
    },


    /**勾选selectbox时执行 */
    handleSelectionChange (row) {
      this.selectRow = row
      // console.log(this.selectRow)
    },

    /**获取选择的销售订单 */
    getTableData (res) {
      console.log(res)
      // console.log(res)
      let that = this
      that.u9solines = JSON.parse(JSON.stringify(res))
      that.showDownload = true
      that.boxList = []
      Object.keys(res).forEach((key) => {
        console.log(res[key])
        // console.log(res[key].panelQty)
        let tempData = {}
        tempData = JSON.parse(JSON.stringify(res[key]))
        tempData.panelQty = res[key].panelQty
        tempData.boxNum = that.getBoxNum(res[key].boxQty, res[key].postnum)
        tempData.seller = this.$store.state.user.name
        tempData.boxType = that.getBoxType(res[key].itemCode)
        that.boxList.push(tempData)
      })
      console.log(that.boxList)
      that.groupPallet(that.boxList)
    },

    /**table赋值 */
    // setTableData (res) {
    //   console.log(res)
    //   let that = this

    //   Object.keys(res).forEach((key) => {
    //     // console.log(key)
    //     let tempData = {}
    //     Object.keys(res[key]).forEach((index) => {
    //       console.log(res[key][index])
    //       tempData[index] = res[key][index]
    //       tempData.boxType = that.getBoxType(res[key].itemCode)
    //       tempData.panelQty = that.getPanelQty()
    //       tempData.boxNum = that.getBoxNum()
    //     })

    //     that.boxList.push(tempData)
    //     console.log(that.boxList)
    //   })

    // },

    /**获取 本托装箱数+托体积 = 本托总体积 */
    getPanelVolume (quantityPackage, boxVolume, panelVolume) {
      // console.log(quantityPackage, panelWeight)
      console.log(Number(quantityPackage), Number(boxVolume), Number(panelVolume))
      return ((Number(quantityPackage) * Number(boxVolume)) / 1000000000) + Number(panelVolume)
    },

    /**获取 本托托净重=(物料单个净重*箱子数*箱容数) */
    getPackageRough (itemWeight, quantityPackage, boxQty) {
      console.log(itemWeight, quantityPackage)
      return (Number(itemWeight) * Number(quantityPackage) * Number(boxQty))
    },

    /**获取 本托毛重=(净重+(箱子数*箱重)+托重) */
    getPackageNet (packageRough, quantityPackage, boxWeight, panelWeight) {
      console.log(packageRough, quantityPackage, boxWeight, panelWeight)
      return (Number(packageRough) + (Number(quantityPackage) * Number(boxWeight)) + Number(panelWeight))
    },

    /**获取 本托物料数量 */
    getPanelItemNum (quantityPackage, boxQty) {
      console.log(quantityPackage, boxQty)
      return (Number(quantityPackage) * Number(boxQty))
    },

    /**获取箱型 */
    getBoxType (itemCode) {
      console.log(itemCode)
      return "1*1.5*3"
    },

    /**获取装箱数 */
    getPanelQty () {
      return 25
    },

    /**获取本次组托数量 */
    getBoxNum (boxqty, postnum) {
      if (postnum / boxqty != 0) {
        //计算合计箱数前判断是否能完整装箱，如果物料有余数则多加一箱
        //console.log(Math.ceil(postnum / boxqty))
        return Math.ceil(postnum / boxqty) //向上取整
      } else {
        return postnum / boxqty //完整装箱不需要多加一箱
      }
    },


    /**组托 */
    groupPallet (res) {
      let that = this
      console.log(res)
      that.allPanelList = []
      Object.keys(res).forEach((index) => {
        //遍历品番
        console.log(res[index])
        if (res[index].boxNum % res[index].panelQty != 0) {
          for (let i = 0; i < (res[index].boxNum - (res[index].boxNum % res[index].panelQty)) / res[index].panelQty; i++) {
            let tempData = {}
            tempData = JSON.parse(JSON.stringify(res[index]))
            tempData.quantityPackage = res[index].panelQty //不能完整组托的情况下，完整组托部分的装箱数=托容数
            tempData.notPanelBox = null //完整组托的托盘剩余未组托箱数未空
            tempData.volume = that.getPanelVolume(tempData.quantityPackage, res[index].boxVolume, res[index].panelVolume)     //计算托体积
            tempData.packageRough = that.getPackageRough(res[index].itemWeight, tempData.quantityPackage, res[index].boxQty)  //计算托净重
            tempData.packageNet = that.getPackageNet(tempData.packageRough, tempData.quantityPackage, res[index].boxWeight, res[index].panelWeight)  //计算托毛重
            tempData.panelitemNum = that.getPanelItemNum(tempData.quantityPackage, res[index].boxQty)
            that.completePanelList.push(tempData) //完整组托的数据加入完整组托数组
          }
          let tempData = {}
          tempData = JSON.parse(JSON.stringify(res[index]))
          // tempData.quantityPackage = (res[index].boxNum % res[index].panelQty)
          tempData.quantityPackage = 0 //未完整组托部分在手动组托前装箱数为空
          tempData.notPanelBox = res[index].boxNum % res[index].panelQty //剩余箱数未合计箱数%托容数
          that.incompletePanelList.push(tempData)
        } else {
          for (let i = 0; i < res[index].boxNum / res[index].panelQty; i++) {
            let tempData = {}
            tempData = JSON.parse(JSON.stringify(res[index]))
            tempData.quantityPackage = res[index].panelQty //如果是完整组托则装箱数=托容数
            tempData.volume = that.getPanelVolume(tempData.quantityPackage, res[index].boxVolume, res[index].panelVolume)     //计算托体积
            tempData.packageRough = that.getPackageRough(res[index].itemWeight, tempData.quantityPackage, res[index].boxQty)  //计算托净重
            tempData.packageNet = that.getPackageNet(tempData.packageRough, tempData.quantityPackage, res[index].boxWeight, res[index].panelWeight)  //计算托毛重
            tempData.panelitemNum = that.getPanelItemNum(tempData.quantityPackage, res[index].boxQty)
            that.completePanelList.push(tempData) //完整组托的数据加入完整组托数组
          }
        }
        // Object.keys(res[index]).forEach((item) => {         //遍历每个品番对象的属性查找总数跟装箱数计算托数
        //   console.log(res[index][item])
        //
        //   }
        // })
        console.log("=======*************============")
      })
      // if(res.boxNum%res.panelQty === 0){}
      // console.log(res.boxNum % res.panelQty)
      // // Object.keys(res).forEach((item) => {})
      console.log(that.completePanelList)
      console.log(that.incompletePanelList)
      that.allPanelList = that.allPanelList.concat(
        that.completePanelList.concat(that.incompletePanelList)
      )
      that.completePanelList = []
      that.incompletePanelList = []
      that.setPanelCode(that.allPanelList)
    },

    /**drawer开关标识符 */
    openDrawer () {
      this.drawer = true
    },

    /**抽屉关闭前执行 */
    handleClose (done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done()
        })
        .catch((_) => { })
    },


    /**赋值托序号 */
    setPanelCode (res) {
      console.log(res)
      let that = this
      Object.keys(res).forEach((index) => {
        // console.log(res[index])
        let indexCode = JSON.parse(index) + 1
        res[index].panelCode = indexCode

        if (indexCode < 10) {
          res[index].panelIndexCode = "YW" + "00" + indexCode //allPanelList遍历赋值托序号
        } else if (10 < indexCode < 100) {
          res[index].panelIndexCode = "YW" + "0" + indexCode //allPanelList遍历赋值托序号
        } else {
          res[index].panelIndexCode = "YW" + indexCode //allPanelList遍历赋值托序号
        }

        if (res[index].quantityPackage != res[index].panelQty) {
          //循环遍历找出未组托完成的托
          // console.log(res)
          // console.log(res[index])
          that.allPanelList.push(res[index])
          that.allPanelList.splice(index, 1) //在allPanelList数组中删除未组托完整的托
          console.log(that.allPanelList)
          res[index].panelCode = null  //未组托完整的托盘不赋编号
          res[index].panelIndexCode = null //为组托完整行序号为null
        }

      })


      that.tableRowClassName() //改变未组托托盘行颜色
      // console.log(JSON.stringify(that.allPanelList))
    },

    /**查找未组托 */

    /**未组托完整的行改变样式 */
    tableRowClassName (row) {
      // console.log(row)
      if (row === undefined) {
        console.log("又是undefined")
      } else {
        // console.log(this.incompletePanelListCode.length)
        let changePanelCode = []
        for (let i = 0; i < this.allPanelList.length; i++) {
          if (this.allPanelList[i].notPanelBox != null) {
            changePanelCode.push(i)
          }
        }
        for (let i = 0; i < changePanelCode.length; i++) {
          if (row.rowIndex == changePanelCode[i]) {
            return "incompleteColor"
          }
        }
        changePanelCode = []
      }
    },

    /**保存按钮执行函数 */
    saveData () {
      let that = this
      that.loading = true
      let token = getToken()
      console.log(that.allPanelList)
      let data = {}

      data.dataArray = that.allPanelList
      data.packageId = that.packageId
      data.orgId = that.allPanelList[0].ownerOrgId
      data.u9solines = that.u9solines
      console.log(data)
      Vue.axios({
        method: "POST",
        url: serverUrl + "system/pkgplan",
        headers: {
          authorization: token,
        },
        data: {
          data,
        },
      })
        .then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.$message({
              message: "保存成功",
              type: "success",
            })

            that.$router.push({
              path: "/KeWenWMS/SalesManagement/grouppallet",
            })
            that.loading = false
          } else {
            that.$message({
              message: "保存失败",
              type: "error",
            })
            console.log("报错")
          }
          that.loading = false
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    /**取消高亮 */
    setCurrentRow () { },

    /**拆托按钮操作 */
    splitGroupPallet () {
      let that = this
      that.loading = true
      var unPanelList = []
      var selectList = []
      var newList = []
      console.log(that.selectRow)

      if (that.selectRow.length == 0) {
        that.$message({
          message: "选择未组托行拆托，请选择已组托行",
          type: "warning",
        })
        that.loading = false
        return
      }
      Object.keys(that.selectRow).forEach((index) => {
        //判断选择行中是否有未组托行
        if (that.selectRow[index].panelCode == null) {
          that.$message({
            message: "选择未组托行拆托，请选择已组托行",
            type: "error",
          })
          console.log(that.selectRow[index])
          that.$refs.allPanel.clearSelection()                          //清空selectRow
          that.loading = false
          return
        }
      })

      for (let i = 0; i < that.allPanelList.length; i++) {              //组托计划中如果有未组托行，保存到unPanelList中
        if (that.allPanelList[i].panelCode == null) {
          unPanelList.push(that.allPanelList[i])
        }
      }
      console.log(unPanelList)

      for (let i = 0; i < unPanelList.length; i++) {
        let index = that.allPanelList.indexOf(unPanelList[i])
        that.allPanelList.splice(index, 1)
      }
      console.log(that.allPanelList)

      for (let i = 0; i < that.selectRow.length; i++) {                 //选中行筛选有几种物料
        that.selectRow[i].notPanelBox = 0
        selectList.push(that.selectRow[i])
        let index = that.allPanelList.indexOf(that.selectRow[i])
        that.allPanelList.splice(index, 1)
      }
      console.log(selectList)
      console.log(that.allPanelList)

      let tempSelectList = []                                           //选中行去重
      let obj = {}
      for (let i = 0; i < selectList.length; i++) {
        if (!(obj[selectList[i].itemCode] && obj[selectList[i].soDocno])) {
          tempSelectList.push(selectList[i])
          obj[selectList[i].itemCode] = true
        }
      }
      //console.log("/////////tempSelectList//////////")
      console.log(tempSelectList)

      while (selectList.length != tempSelectList.length) {
        for (let i = 0; i < selectList.length; i++) {                 //选中行累加装箱数
          for (let j = i + 1; j < selectList.length; j++) {
            if (selectList[i].itemCode == selectList[j].itemCode) {
              // console.log(tempSelectList[i].quantityPackage, selectList[j].quantityPackage)
              selectList[i].quantityPackage = Number(selectList[i].quantityPackage) + Number(selectList[j].quantityPackage)
              selectList.splice(j, 1)
            }
          }
        }
      }
      //console.log("/////////selectList//////////")
      console.log(selectList)

      if (unPanelList.length == 0) {
        newList = JSON.parse(JSON.stringify(selectList))
      } else {
        // selectList = JSON.parse(JSON.stringify(selectList.concat(unPanelList)))
        //console.log(selectList)

        for (let i = 0; i < unPanelList.length; i++) {
          for (let j = 0; j < selectList.length; j++) {
            if (unPanelList[i].itemCode == selectList[j].itemCode) {
              unPanelList[i].quantityPackage = Number(unPanelList[i].quantityPackage) + Number(selectList[j].quantityPackage)
              selectList.splice(j, 1)
            }
          }
        }
        //console.log("/////////selectList//////////spliice//////////////")
        console.log(selectList)
        newList = JSON.parse(JSON.stringify(selectList.concat(unPanelList)))
        //console.log("/////////new//////////////")
        console.log(newList)
      }

      for (let i = 0; i < newList.length; i++) {                 /**tempArr 是最后拆托的行 */
        newList[i].panelCode = null
        newList[i].panelIndexCode = null
        //console.log("/////////quantityPackage//////////////")
        console.log(newList[i].quantityPackage)
        newList[i].notPanelBox = Number(newList[i].quantityPackage) + Number(newList[i].notPanelBox)
        //console.log("/////////notPanelBox//////////////")
        console.log(newList[i].notPanelBox)
        newList[i].quantityPackage = 0
        newList[i].volume = null
        newList[i].packageRough = null
        newList[i].packageNet = null
        newList[i].panelitemNum = null
        //console.log("/////////new//////////////")
        that.allPanelList.push(newList[i])
      }
      console.log(that.allPanelList)

      that.loading = false
    },

    /**拆托合并函数 */
    // splitPallet (tempArr) {

    //   for (let i = 0; i < tempArr.length; i++) {
    //     for (let j = i + 1; j < tempArr.length; j++) {
    //       if (tempArr[i].itemCode == tempArr[j].itemCode) {
    //         tempArr[i].quantityPackage = Number(tempArr[i].quantityPackage) + Number(tempArr[j].quantityPackage)
    //         tempArr[i].notPanelBox = Number(tempArr[i].notPanelBox) + Number(tempArr[j].notPanelBox)
    //         tempArr.splice(j, 1)
    //       }
    //     }
    //   }
    //   console.log(tempArr)
    //   return tempArr

    // },

    /**组托按钮操作 */
    addGroupPallet () {
      // console.log(this.selectRow)
      if (this.selectRow == "") {
        //判断是否选中组托行
        this.$message({
          //未选择时直接退出
          message: "未选择组托行，请先选择",
          type: "warning",
        })
        this.selectRow = []
        return
      } else {
        //选择行是完整行时取消选中并退出
        for (let i = 0; i < this.selectRow.length; i++) {
          // console.log(this.selectRow[i])
          if (this.selectRow[i].panelCode != null) {
            this.$message({
              message: "选择行中有完整托，请选择未组托行",
              type: "error",
            })
            this.$refs.allPanel.clearSelection()
            this.selectRow = []
            return
          }
        }
      }
      console.log(this.selectRow)
      /**选择未完整组托行进行组托并赋值托盘号 */
      this.setAddPanelCode(this.selectRow)
    },

    /**未完整组托行进行组托并赋值托盘号*/
    setAddPanelCode (res) {
      console.log(res)
      this.open = true
      this.dialogTableData = res
    },

    /**dialog弹窗关闭操作 */
    cancel () {
      this.open = false
    },

    /**dialog弹窗组托按钮操作判断是否满足组托要求 */
    addGroupRow () {
      //console.log(this.dialogTableData);
      this.dialogLoading = true
      console.log(this.dialogTableData)
      for (let i = 0; i < this.dialogTableData.length; i++) {
        if (
          JSON.parse(this.dialogTableData[i].inputBoxNum) >
          JSON.parse(this.dialogTableData[i].notPanelBox)
        ) {
          this.$message({
            message: "输入有误,请重新输入！",
            type: "error",
          })
          Object.keys(this.dialogTableData).forEach((index) => {
            //输入组托箱数大于剩余未装箱数报错清空input
            console.log(this.dialogTableData[index])
            this.dialogTableData[index].inputBoxNum = ""
            this.dialogTableData[index].error = ""
          })
          return
        }
      }
      this.setSinglePanel(this.dialogTableData) //校验完成进行对allPanelList的插入替换
    },

    /**dialog中的input框校验 */
    dialogInputChange (row) {
      console.log(row.inputBoxNum)
      let num = Number(row.inputBoxNum)
      if (num <= 0 || num === '' || num === null || num === undefined || num.length < 0) {
        this.able = true
        row.error = "请正确输入组托箱数"
      } else if (isNaN(row.inputBoxNum)) {
        this.able = true
        row.error = "请输入数字"
      } else if (row.inputBoxNum > row.notPanelBox) {
        this.able = true
        row.error = "输入不能大于剩余未装箱数"
      } else {
        this.able = false
        row.error = ""
      }
    },

    /**抽屉input校验函数 */
    drawerInputChange (row) {
      console.log(row)
      if (row.postnum === '' || row.postnum === null || row.postnum === undefined) {               //校验输入的本次组托数量
        this.able = true
        row.error = '请输入需装箱物料数'
      } else if (row.postnum < 0 || row.postnum == 0) {
        this.able = true
        row.error = '装箱物料数不能小于等于0'
      } else if (JSON.parse(row.postnum) > JSON.parse(row.attr3)) {
        this.able = true
        row.error = '输入数量不能大于物料总数'
        return
      } else {
        this.able = false
        row.error = ''
      }
    },

    /**dialog组托按钮执行组托 */
    setSinglePanel (res) {
      console.log(res)

      let maxPanelCodeList = [] //申明数组找出最大托序号
      Object.keys(this.allPanelList).forEach((index) => {
        //遍历保存把所有托序号
        // console.log(this.allPanelList[index].panelCode)
        maxPanelCodeList.push(this.allPanelList[index].panelCode)
        // console.log(maxPanelCodeList)
      })
      maxPanelCodeList.forEach((index) => {
        //console.log(index)
      })

      let maxPanelCode = Math.max.apply(null, maxPanelCodeList) //找出最大的托序号

      for (let i = 0; i < res.length; i++) {
        if (res[i].notPanelBox - res[i].inputBoxNum == 0) {
          //输入箱数等于剩余箱数时
          console.log(this.allPanelList, this.dialogTableData)
          let index = this.allPanelList.indexOf(res[i]) //保存数组中勾选的托的索引
          let tempBox = res[i] //手动组托后剩下的品番没有托盘号
          tempBox.panelCode = maxPanelCode + 1 //托序号为数组中最大托序号+1
          if (tempBox.panelCode < 10) {
            tempBox.panelIndexCode = "YW" + "00" + tempBox.panelCode //allPanelList遍历赋值托序号
          } else if (10 < tempBox.panelCode < 100) {
            tempBox.panelIndexCode = "YW" + "0" + tempBox.panelCode //allPanelList遍历赋值托序号
          } else {
            tempBox.panelIndexCode = "YW" + tempBox.panelCode //allPanelList遍历赋值托序号
          }
          tempBox.notPanelBox = null //手动组托行剩余未组托数为0
          tempBox.quantityPackage = res[i].inputBoxNum //装箱数=输入箱数
          tempBox.volume = this.getPanelVolume(tempBox.quantityPackage, res[i].boxVolume, res[i].panelVolume)
          tempBox.packageRough = this.getPackageRough(res[i].itemWeight, tempBox.quantityPackage, res[i].boxQty)
          tempBox.packageNet = this.getPackageNet(tempBox.packageRough, tempBox.quantityPackage, res[i].boxWeight, res[i].panelWeight)
          tempBox.panelitemNum = this.getPanelItemNum(tempBox.quantityPackage, res[i].boxQty)
          this.allPanelList.splice(index, 1, tempBox)
        } else {
          //输入箱数小于剩余箱数时
          // console.log(this.dialogTableData)
          let index = this.allPanelList.indexOf(res[i])
          let unPanelBox = JSON.parse(JSON.stringify(res[i])) //* 此处res[i]为数组中的对象，所以需要深拷贝不然会直接操作res[i]导致报错
          let tempBox = JSON.parse(JSON.stringify(res[i]))
          tempBox.notPanelBox = null
          tempBox.panelCode = maxPanelCode + 1 //托序号为数组中最大托序号+1
          if (tempBox.panelCode < 10) {
            tempBox.panelIndexCode = "YW" + "00" + tempBox.panelCode //allPanelList遍历赋值托序号
          } else if (10 < tempBox.panelCode < 100) {
            tempBox.panelIndexCode = "YW" + "0" + tempBox.panelCode //allPanelList遍历赋值托序号
          } else {
            tempBox.panelIndexCode = "YW" + tempBox.panelCode //allPanelList遍历赋值托序号
          }
          tempBox.quantityPackage = res[i].inputBoxNum //未组完托装箱数为输入装箱数
          tempBox.volume = this.getPanelVolume(tempBox.quantityPackage, res[i].boxVolume, res[i].panelVolume)
          tempBox.packageRough = this.getPackageRough(res[i].itemWeight, tempBox.quantityPackage, res[i].boxQty)
          tempBox.packageNet = this.getPackageNet(tempBox.packageRough, tempBox.quantityPackage, res[i].boxWeight, res[i].panelWeight)
          tempBox.panelitemNum = this.getPanelItemNum(tempBox.quantityPackage, res[i].boxQty)
          this.allPanelList.splice(index, 1, tempBox)
          //  console.log(this.dialogTableData,this.allPanelList,tempBox)
          //  console.log(res)
          unPanelBox.notPanelBox = res[i].notPanelBox - res[i].inputBoxNum //未组完箱数继续被甩出去
          unPanelBox.panelCode = null
          unPanelBox.quantityPackage = 0
          //  console.log(unPanelBox)
          this.allPanelList.push(unPanelBox)
        }
      }
      this.$refs.allPanel.clearSelection()
      this.open = false
      this.dialogLoading = false
    },

    /**导出按钮执行 */
    download (tag) {
      console.log(this.allPanelList)
      const w = window.open("about:blank")                         //可以替代window打开新页面
      tag.forEach((item) => {
        console.log(item.label)
        let path = ''
        let query = ''
        if (item.label == this.allPanelList[0].identification) {
          console.log(item)
          path = item.value
          query = "&" + "pid=" + this.allPanelList[0].packageId
          // console.log(path + query)
          w.location.href = path + query
        }
      })
    },

    /**drawer修改销售订单按钮执行 */
    updateSoline () {
      this.openUpdateSolineDialog = true
      this.getUpdateDialogData()
    },

    /**drawer更新组托按钮执行 */
    updateGroupPallet () {
      //console.log("updateGroupPallet")
      this.getTableData(this.boxList)
      this.drawer = false
    },

    /**drawer的dialog搜索按钮执行 */
    handleDialogSearch () {
      //console.log("handleDialogSearch")
      this.getUpdateDialogData(this.dialogFormData.custCode, this.dialogFormData.soDocno, this.dialogFormData.deadline, this.dialogFormData.attr4)
    },

    /**drawer的dialog整数装箱开关 */
    handleChangePlan () { },

    /**drawer的dialog选择行执行 */
    UpdateDialogSelectionChange (res) {
      //console.log(res)
      this.UpdateDialogSelectData = res
      //console.log(this.UpdateDialogSelectData)
    },

    /**drawer的dialog添加按钮执行 */
    UpdateDialogSubmit () {
      let that = this
      //that.UpdateDialogSelectData = JSON.parse(JSON.stringify())
      //console.log(that.UpdateDialogSelectData)
      for (let i = 0; i < that.UpdateDialogSelectData.length; i++) {                        //判断组托时选择行的销售子订单是否相同，不相同报错
        // console.log(that.dialogSelectData[0].custPoNo);
        if (that.UpdateDialogSelectData[0].identification != that.UpdateDialogSelectData[i].identification) {  //判断是否是统一客户标识 (attr1:客户标识)
          that.$message({
            type: 'error',
            message: '选择销售订单客户标识不同，请重新选择'
          })
          that.$refs.UpdateDialogTable.clearSelection()
          return
        }

        for (let j = 0; j < that.boxList.length; j++) {          //判端修改销售订单新增的物料是否是已经组过托的物料
          if (that.UpdateDialogSelectData[i].itemCode == that.boxList[j].itemCode) {
            that.$message({
              type: 'error',
              message: '选择销售订单已存在，请勿重复选择'
            })
            that.$refs.UpdateDialogTable.clearSelection()
            return
          }
        }
      }

      if (that.fullBox == false) {
        console.log(that.fullBox)                                             //判断是否开启整数装箱按钮
        for (let i = 0; i < that.UpdateDialogSelectData.length; i++) {
          console.log(JSON.parse(that.UpdateDialogSelectData[i].postnum) % JSON.parse(that.UpdateDialogSelectData[i].boxQty))                   //如果开启，校验是否能整数装箱
          if (JSON.parse(that.UpdateDialogSelectData[i].postnum) % JSON.parse(that.UpdateDialogSelectData[i].boxQty) != 0) {
            that.$message({
              type: 'error',
              message: '物料无法被整数装箱，请重新填写本次组托数量'
            })
            that.$refs.UpdateDialogTable.clearSelection()
            return
          }
        }
        that.$message({
          type: 'success',
          message: '整数装箱成功'
        })
        that.openUpdateSolineDialog = false
        that.boxList = that.boxList.concat(that.UpdateDialogSelectData)
      }
      else {                                                                         //没有开启整数装箱则多余的物料存入新的箱子
        that.openUpdateSolineDialog = false
        that.boxList = that.boxList.concat(that.UpdateDialogSelectData)
      }
    },

    /**drawer的dialog取消按钮执行 */
    UpdateDialogCancel () {
      this.openUpdateSolineDialog = false
    },

    /**drawer的dialog分页器显示数据数量执行 */
    handleUpdateDialogSizeChange () { },

    /**drawer的dialog分页器选择页签执行 */
    handleUpdateDialogCurrentChange (val) {
      console.log(val)
      this.UpdateDialogPageData.pageNum = val
      this.getUpdateDialogData()
    },

    /**drawer的修改销售订单dialog获取销售订单 */
    getUpdateDialogData (custCode, soDocno, deadline, attr4) {
      let that = this
      let token = getToken()
      let u9SoLine = {}
      let deadLine = deadline
      u9SoLine.orgId = "1001612260000018"
      u9SoLine.pageNum1 = that.UpdateDialogPageData.pageNum
      u9SoLine.pageSize1 = that.UpdateDialogPageData.pageSize

      u9SoLine.soDocno = soDocno
      u9SoLine.custCode = custCode
      u9SoLine.attr4 = attr4
      console.log(u9SoLine)
      // let data = {}
      // data.u9SoHead = JSON.stringify(u9SoHead)
      Vue.axios({
        method: 'POST',
        url: serverUrl + 'u9/u9so/pagelist',
        data: { u9SoLine, deadLine }
      }).then(function (response) {
        console.log(response)
        if (response.data.subList != null || response.data.subList != undefined || response.data.subList != '') {
          that.setUpdateDialogTableData(response.data.subList)
          that.UpdateDialogPageData.total = response.data.total
        } else {
          console.log("报错")
        }
      })
      that.UpdateDialogPageData.pageNum = 1
    },

    /**drawer的修改销售订单dialog获取销售订单赋值table */
    setUpdateDialogTableData (res) {
      let that = this
      console.log(res)
      console.log(that.boxList)
      that.UpdateDialogData = JSON.parse(JSON.stringify(res))
      // that.$nextTick(() => {                                     //再drawer的dialog中回显boxList中的行
      //   that.UpdateDialogData.forEach((index) => {
      //     that.boxList.forEach((item) => {
      //       if (item.itemCode == index.itemCode) {
      //         that.$refs.UpdateDialogTable.toggleRowSelection(index, index.selected)
      //         let i = that.UpdateDialogData.indexOf()

      //       }
      //     })
      //   })
      // })

    },
  },
};
</script>

<style>
.el-form-item__label {
  font-size: 10px;
}
.el-input {
  width: 130px;
}
.el-input__inner::-webkit-input-placeholder {
  width: 120px;
}
.el-table .incompleteColor {
  background-color: rgb(195, 195, 195);
}
.table-tranparent.el-table tbody tr:hover > td {
  background-color: #ffffff !important;
}

.table-tranparent.el-table tbody tr:hover {
  background-color: #ffffff !important;
}
</style>
