<template>
  <div class="app-container">
    <!--详细信息抽屉-->
    <el-drawer
      title="条码详情"
      :visible.sync="drawer"
      :direction="direction"
      size="65%"
    >
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="mini"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
        :label-position="labelPosition"
        style="
          border: 1px solid #dcdfe6;
          margin: 0 0 15px 0;
          border-radius: 5px;
        "
      >
        <!--功能栏-->
        <el-row
          :gutter="10"
          class="mb8"
          style="
            display: flex;
            align-items: center;
            margin: 0 0 15px 0;
            flex-direction: row-reverse;
            border: 1px solid #dcdfe6;
            background-color: #ebeef5;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
          "
        >
        </el-row>
        <!---->

        <!--左侧条码规则-->
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="6">
                <el-form-item label="条码格式" prop="barcodeFormart">
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
                    v-model="queryParams.barcodeFormart"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="条码配置ID" prop="barcodeConfigId">
                  <el-input
                    v-model="queryParams.barcodeConfigId"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="条码码文" prop="barcodeContent">
                  <el-input
                    v-model="queryParams.barcodeContent"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="二维码码文" prop="qrcodeContent">
                  <el-input
                    v-model="queryParams.qrcodeContent"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="在库状态" prop="isStocked">
                  <el-input
                    v-model="queryParams.isStocked"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="来源单据" prop="sourceBill">
                  <el-input
                    v-model="queryParams.sourceBill"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="来源单号" prop="sourceId">
                  <el-input
                    v-model="queryParams.sourceId"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="来源单行号" prop="sourceLineNo">
                  <el-input
                    v-model="queryParams.sourceLineNo"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物料编码" prop="itemCode">
                  <el-input
                    v-model="queryParams.itemCode"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物料名称" prop="itemName">
                  <el-input
                    v-model="queryParams.itemName"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="批次号" prop="batchNumber">
                  <el-input
                    v-model="queryParams.batchNumber"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="基本单位" prop="baseUnit">
                  <el-input
                    v-model="queryParams.baseUnit"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="条码代表数量" prop="codeEqualQty">
                  <el-input
                    v-model="queryParams.codeEqualQty"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="套件数" prop="suiteQty">
                  <el-input
                    v-model="queryParams.suiteQty"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="套件序号" prop="suiteNo">
                  <el-input
                    v-model="queryParams.suiteNo"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="包件数" prop="bagQty">
                  <el-input
                    v-model="queryParams.bagQty"
                    placeholder="请输入包件数"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="包件序号" prop="bagNo">
                  <el-input
                    v-model="queryParams.bagNo"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="箱件数" prop="boxQty">
                  <el-input
                    v-model="queryParams.boxQty"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="箱序号" prop="boxNo">
                  <el-input
                    v-model="queryParams.boxNo"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单位" prop="unitOfMeasure">
                  <el-input
                    v-model="queryParams.unitOfMeasure"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数量" prop="qty">
                  <el-input
                    v-model="queryParams.qty"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前仓库" prop="warehouse">
                  <el-input
                    v-model="queryParams.warehouse"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前库区" prop="storageLocation">
                  <el-input
                    v-model="queryParams.storageLocation"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前货位" prop="storageArea">
                  <el-input
                    v-model="queryParams.storageArea"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商编码" prop="vendorCode">
                  <el-input
                    v-model="queryParams.vendorCode"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商名称" prop="vendorName">
                  <el-input
                    v-model="queryParams.vendorName"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="子件名" prop="componentName">
                  <el-input
                    v-model="queryParams.componentName"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="子件编码" prop="componentCode">
                  <el-input
                    v-model="queryParams.componentCode"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="子件单位" prop="componentUnit">
                  <el-input
                    v-model="queryParams.componentUnit"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="是否尾箱" prop="isLastCase">
                  <el-input
                    v-model="queryParams.isLastCase"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="已打印次数" prop="printNum">
                  <el-input
                    v-model="queryParams.printNum"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="备注" prop="remark">
                  <el-input
                    v-model="queryParams.remark"
                    type="textarea"
                    autosize
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>

    <el-form
      :model="queryParams"
      ref="queryForm"
      size="mini"
      :inline="true"
      label-width="70px"
      :label-position="labelPosition"
      @submit.native.prevent
    >
      <el-row>
        <el-col :span="20">
          <el-form-item prop="batchNumber" label="批次">
            <el-input
              v-model="queryParams.batchNumber"
              placeholder="请输入批次号"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="boxCode" label="箱号">
            <el-input
              v-model="queryParams.boxCode"
              placeholder="请输入批次号"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="attr6" label="条码类型">
            <!--条码类型字段attr6-->
            <el-select
              v-model="queryParams.attr6"
              filterable
              placeholder="请选择"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="item in queryParams.BarcodeTypeOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isStocked" label="在库状态">
            <el-select
              v-model="queryParams.isStocked"
              filterable
              placeholder="请选择"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="item in queryParams.isStockedOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isFreeze" label="占用状态">
            <el-select
              v-model="queryParams.isFreeze"
              filterable
              placeholder="请选择"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="item in queryParams.isFreezeOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="display: flex; justify-content: end">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item></el-col
        >
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="barcodeData">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="条码ID"
        align="center"
        prop="barcodeId"
        :show-overflow-tooltip="true"
        width="150"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="openDrawer(scope.row)">{{
            scope.row.barcodeId
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="条码类型" align="center" prop="attr6" width="100">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.barcode_type"
            :value="scope.row.attr6"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="在库状态"
        align="center"
        prop="isStocked"
        width="100"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.is_stocked"
            :value="scope.row.isStocked"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="是否占用"
        align="center"
        prop="isFreeze"
        width="100"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.is_freeze"
            :value="scope.row.isFreeze"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="来源单据"
        align="center"
        prop="sourceBill"
        :show-overflow-tooltip="true"
        width="170"
      >
      </el-table-column> -->
      <el-table-column
        label="来源单号"
        align="center"
        prop="sourceId"
        :show-overflow-tooltip="true"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="批次"
        align="center"
        prop="batchNumber"
        width="200"
      >
      </el-table-column>
      <el-table-column label="箱号" align="center" prop="boxCode" width="200">
      </el-table-column>
      <el-table-column label="已打印次数" align="center" prop="printNum">
      </el-table-column>
      <!-- <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="创建人"
        align="center"
        prop="createBy"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="create_time"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="更新人"
        align="center"
        prop="update_by"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="update_time"
        :show-overflow-tooltip="true"
      >
      </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="handleMainSizeChange"
      @current-change="handleMainCurrentChange"
      background
      :page.sync="mainPageData.pageNum"
      :limit.sync="mainPageData.pageSize"
      layout="prev, pager, next,total"
      :total="mainPageData.total"
      :page-size="mainPageData.pageSize"
    >
    </el-pagination>

    <!-- 对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
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

              chcc
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
    </el-dialog> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'

var serverUrl = process.env.VUE_APP_BASE_API //获取.env.配置文件的服务器路径
export default {
  name: "barcodeRule",
  dicts: ['barcode_type', 'is_stocked', 'is_freeze'],
  data () {
    return {
      /**table数据 */
      barcodeData: [],
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
      /**label方向 */
      labelPosition: 'mid',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      /**条码详情drawer显示标识 */
      drawer: false,
      /**drawer弹出方向 */
      direction: 'btt',
      // 查询参数
      queryParams: {

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
      },
      // 查询数据
      QueryParams: {},

      /**主页面分页器数据 */
      mainPageData: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      }
    }
  },
  created () {
    /**从字典获取条码类型下拉框options */
    this.getDicts("barcode_type").then((res) => {
      console.log(res)
      this.queryParams.BarcodeTypeOptions = JSON.parse(JSON.stringify(res.data))
      console.log(this.queryParams.BarcodeTypeOptions)
    })
    /**从字典获取在库状态下拉框options */
    this.getDicts("is_stocked").then((res) => {
      console.log(res)
      this.queryParams.isStockedOptions = JSON.parse(JSON.stringify(res.data))
      console.log(this.queryParams.isStockedOptions)
    })
    /**从字典获取占用状态下拉框options */
    this.getDicts("is_freeze").then((res) => {
      console.log(res)
      this.queryParams.isFreezeOptions = JSON.parse(JSON.stringify(res.data))
      console.log(this.queryParams.isFreezeOptions)
    })
  },
  mounted () {
    this.getList()
  },
  methods: {

    /** 查询客户列表 */
    getList () {
      let that = this
      let token = getToken()
      // console.log(token)

      let batchNumber = that.queryParams.batchNumber
      let attr6 = that.queryParams.attr6                   //条码类型
      let boxCode = that.queryParams.boxCode
      let isStocked = that.queryParams.isStocked
      let isFreeze = that.queryParams.isFreeze
      let pageSize = that.mainPageData.pageSize
      let pageNum = that.mainPageData.pageNum
      Vue.axios({
        method: 'POST',
        url: serverUrl + 'system/barcode/list',
        headers: {
          'authorization': token
        },
        data: {
          batchNumber,
          attr6,
          boxCode,
          pageSize,
          pageNum,
          isStocked,
          isFreeze
        }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.setWarehouseList(response.data.rows)
          that.mainPageData.total = response.data.total
        }
      }).catch(function (error) {
        console.log(error)
      })
      that.mainPageData.pageNum = 1
    },
    /**table赋值 */
    setWarehouseList (res) {
      console.log(res)
      this.barcodeData = JSON.parse(JSON.stringify(res))

    },

    /**点击条码ID查看详情 */
    openDrawer (res) {
      console.log(res)
      this.drawer = true
      this.queryParams = JSON.parse(JSON.stringify(res))
      console.log(this.queryParams)
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
      this.getList()
    },

    /**主页面分页器选择操作 */
    handleMainCurrentChange (val) {
      // console.log(val);
      this.mainPageData.pageNum = val
      this.getList()

    },

    /**主页面分页器数据列数选择执行 */
    handleMainSizeChange () { },

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
.el-textarea {
  width: 140px;
}
</style>

