
<template>
  <div class="app-container">
    <!-- <el-row
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
          type="primary"
          plain
          icon="el-icon-paperclip"
          style="
            width: 80px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="groupPallet"
          v-hasPermi="['md:md:client:add']"
          >组托</el-button
        >
        <el-button
          type="warning"
          plain
          icon="el-icon-scissors"
          style="
            width: 80px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="groupPallet"
          v-hasPermi="['md:md:client:add']"
          >拆托</el-button
        >
      </el-col>

    </el-row> -->

    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      size="mini"
      :inline="true"
      v-show="showSearch"
      label-width="75px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据类型" prop="clientCode">
            <el-select
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
            </el-select>
            <el-input
              v-model="queryParams.clientCode"
              placeholder="请输入单据类型"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="组织ID" prop="orgId">
            <el-input
              v-model="queryParams.orgId"
              placeholder="请输入单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="组托计划号" prop="packageNo">
            <el-input
              v-model="queryParams.packageNo"
              placeholder="请输入客户编码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="销售订单号" prop="soDocno">
            <el-input
              v-model="queryParams.soDocno"
              placeholder="请输入交期"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="客户编码" prop="custCode">
            <el-input
              v-model="queryParams.custCode"
              placeholder="请输入交期"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="4" style="display: flex; justify-content: flex-end">
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
        </el-col>
      </el-row>
    </el-form> -->

    <el-table v-loading="loading" :data="allPanelList">
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
      <el-table-column
        label="销售订单编号"
        align="center"
        prop="soDocno"
        width="130px"
        :show-overflow-tooltip="true"
        fixed
      >
        <!-- <template slot-scope="scope">
          <el-button size="mini" type="text" @click="Goto(scope.row)">{{
            scope.row.soDocno
          }}</el-button>
        </template> -->
      </el-table-column>
      <el-table-column label="产品编码" align="center" prop="itemCode" />
      <el-table-column label="产品名称" align="center" prop="itemName" />
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
        label="数量"
        align="center"
        prop="quantity"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="托盘条码" align="center" prop="panelCode" />
      <el-table-column label="箱型" align="center" prop="boxType" />
      <el-table-column label="装箱数" align="center" prop="quantityPackage" />
      <el-table-column label="托容数" align="center" prop="panelQty" />
      <el-table-column label="托体积" align="center" prop="volume" />
      <el-table-column label="托净重" align="center" prop="packageRough" />
      <el-table-column label="托毛重" align="center" prop="packageNet" />
      <el-table-column
        label="生产订单编号"
        align="center"
        prop="workOrderCode"
        width="110"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
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
  </div>
</template>

<script>

export default {
  name: 'grouppalletResult',
  data () {
    return {
      /**遮罩层标识符 */
      loading: false,

    }
  },

  create () { },
  mounted () {
    this.getTableData(this.$route.query.res)
  },

  methods: {
    /**获取选中品番的数量 */
    getTableData (res) {
      let that = this
      console.log(res)
      Object.keys(res).forEach((index) => {      //遍历品番
        that.groupPallet(res[index])
      })
    },


    /**组托 */
    groupPallet (res) {
      let that = this
      console.log(res)
      // if(res.boxNum%res.panelQty === 0){}
      console.log(res.boxNum % res.panelQty)
      // Object.keys(res).forEach((item) => {})
      if (res.boxNum % res.panelQty != 0) {
        for (let i = 0; i < (res.boxNum - res.boxNum % res.panelQty) / res.panelQty; i++) {
          let tempData = {}
          tempData = JSON.parse(JSON.stringify(res))
          tempData.quantityPackage = res.panelQty             //如果是完整组托则装箱数=托容数
          tempData.panelCode = i                              //托盘条码赋值
          that.completePanelList.push(tempData)               //完整组托的数据加入完整组托数组
        }
        let tempData = {}
        tempData = JSON.parse(JSON.stringify(res))
        tempData.quantityPackage = (res.boxNum % res.panelQty)
        tempData.panelCode = '001' + res.itemName
        that.incompletePanelList.push(tempData)
      } else {
        for (let i = 0; i < res.boxNum / res.panelQty; i++) {
          let tempData = {}
          tempData = JSON.parse(JSON.stringify(res))
          tempData.quantityPackage = res.panelQty             //如果是完整组托则装箱数=托容数
          tempData.panelCode = i                                               //托盘条码赋值
          that.completePanelList.push(tempData)                                //完整组托的数据加入完整组托数组
        }
      }
      that.allPanelList = that.allPanelList.concat(that.completePanelList.concat(that.incompletePanelList))
      that.completePanelList = []
      that.incompletePanelList = []
    }
  }
}
</script>

<style>
</style>
