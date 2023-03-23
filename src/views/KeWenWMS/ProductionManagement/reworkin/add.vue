<template lang="html">
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <span class="panel-title">基本信息</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">单据类型: 返工入库单</el-col>
      <el-col :span="6">调入存储地点: 产成品仓</el-col>
      <el-col :span="12">调出存储地点: 待判定仓</el-col>
    </el-row>
    <hr>
    <el-row>
      <el-col :span="24">
        <span class="panel-title">物品明细</span>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 0.5rem;">
      <el-col :span="24">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleRemove">移除</el-button>
        <el-button type="primary" size="mini" @click="handleSubmit">保存</el-button>
      </el-col>
    </el-row>
    <el-table :data="dataList" ref="dataTable">
      <el-table-column type="selection" width="55" />
      <el-table-column label="箱码" prop="boxCode" />
      <el-table-column label="物料编码" prop="itemCode" />
      <el-table-column label="物品名称" prop="itemName" />
      <el-table-column label="批次号" prop="lotInfo" />
      <el-table-column label="规格型号" prop="specification" />
      <el-table-column label="单位" prop="unit" />
      <el-table-column label="数量" prop="qty" />
      <el-table-column label="库位信息" prop="place" />
    </el-table>
    <el-dialog title="请选择您要入库的箱" :visible.sync="dialogVisible" :close-on-click-modal="false" @closed="handleCloseModal"
      width="80%" class="showAll_dialog">
      <el-row :gutter="20" style="margin-bottom: 5rem;">
        <el-col :span="4">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable />
          <el-divider />
          <el-tree accordion :data="treeData" :props="defaultProps" :filter-node-method="filterNode" node-key="value"
            @node-click="handleNodeClick" :highlight-current="true" ref="tree" :expand-on-click-node="false">
          </el-tree>
        </el-col>
        <el-col :span="20">
          <el-form :model="queryParams" label-width="110px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="箱码" prop="boxCode">
                  <el-input v-model="queryParams.boxCode" placeholder="请输入" style="width: 100%" clearable
                    @keyup.enter.native="handleQuery" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物料编码" prop="itemCode">
                  <el-input v-model="queryParams.itemCode" placeholder="请输入" style="width: 100%" clearable
                    @keyup.enter.native="handleQuery" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物料名称" prop="itemName">
                  <el-input v-model="queryParams.itemName" placeholder="请输入" style="width: 100%" clearable
                    @keyup.enter.native="handleQuery" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="批次号" prop="lotinfo">
                  <el-input v-model="queryParams.lotinfo" placeholder="请输入" style="width: 100%" clearable
                    @keyup.enter.native="handleQuery" />
                </el-form-item>
              </el-col>
              <el-col :span="16" style="display: flex; justify-content: end">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                  <el-button icon="el-icon-plus" size="mini" type="success" @click="handleAdd2Order">添加到单据</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table :data="candidateData" ref="candidateTable">
            <el-table-column type="selection" width="55" />
            <el-table-column property="orgName" label="组织名称" />
            <el-table-column property="boxCode" label="箱码" />
            <el-table-column property="itemCode" label="物料编码" />
            <el-table-column property="itemName" label="物料名称" />
            <el-table-column property="specification" label="规格型号" />
            <el-table-column property="lotInfo" label="批次号" />
            <el-table-column property="unit" label="单位" />
            <el-table-column property="qty" label="数量" />
            <el-table-column property="place" label="库位" />
          </el-table>
          <div style="text-align: right;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pagination.number" :page-sizes="[10, 20, 30, 50, 100]" :page-size="pagination.size"
              layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="js">
import request from '@/utils/request'
import { listThread } from '@/api/WarehouseOperation/transferin'
export default {
  name: 'ReWorkOutAdd',
  data() {
    return {
      filterText: null,
      dialogVisible: false,
      dataList: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryParams: {
        boxCode: null,
        itemCode: null,
        itemName: null,
        lotInfo: null
      },
      candidateData: [],
      pagination: {
        total: 0,
        number: 1,
        size: 10
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    getList() {
      let treeKey = this.$refs.tree ? this.$refs.tree.getCurrentKey() : null;
      let treeNode = treeKey ? this.$refs.tree.getNode(treeKey) : null;
      let treeData = this.$refs.tree ? this.$refs.tree.getCurrentNode() : null;
      let payload = {};
      if (treeNode) {
        switch (treeNode.level) {
          case 1:
            payload['warehouse'] = treeData.value;
            break;
          case 2:
            payload['storageLocation'] = treeData.value;
            break;
          case 3:
            payload['storageArea'] = treeData.value;
            break;
        }
      }
      let { boxCode, itemCode, itemName, lotInfo } = this.queryParams;
      request({
        url: '/system/barcode/find-by-orgid-and-location-and-condition',
        method: 'post',
        data: JSON.stringify({
          ...payload,
          isStocked: 0, boxCode, itemCode, itemName, lotInfo, pageSize: this.pagination.size, pageNum: this.pagination.number,
          orgId: '1002106210000278' // TODO: should be replace
        })
      }).then((resp) => {
        this.pagination = resp.pagination;
        this.candidateData = resp.data.map(item => {
          item.place = `${item.wharehouseName}--${item.locationName}--${item.areaName}`;
          return item;
        });
      });
    },
    handleAdd() {
      this.dialogVisible = true;
      this.getList();
    },
    handleAdd2Order() {
      let arr = this.$refs.candidateTable.selection;
      if (arr.length > 0) {
        let barcodeArr = [];
        if (this.dataList.length > 0) {
          barcodeArr = this.dataList.map(i => i.barcodeId);
        }
        if (barcodeArr.length > 0) {
          arr.forEach(i => {
            if (!barcodeArr.includes(i.barcodeId)) {
              this.dataList.push(i);
            }
          });
        } else {
          this.dataList = arr;
        }
        this.$message.success("数据已经添加到单据!");
        this.$refs.candidateTable.clearSelection();
      }
    },
    handleRemove() {
      let arr = this.$refs.dataTable.selection;
      if (arr.length > 0) {
        let barcodeArr = arr.map(i => i.barcodeId);
        this.dataList = this.dataList.filter(j => !barcodeArr.includes(j.barcodeId));
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      this.pagination.number = 1;
      this.getList(data, node);
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.pagination = { total: 0, number: 1, size: 10 };
      this.queryParams = {
        boxCode: null,
        itemCode: null,
        itemName: null,
        lotInfo: null
      };
      this.getList();
    },
    handleSizeChange(size) {
      this.pagination.number = 1;
      this.pagination.size = size;
      this.getList();
    },
    handleCurrentChange(number) {
      this.pagination.number = number;
      this.getList();
    },
    handleCloseModal() {
      this.$refs.tree.setChecked(false);
    },
    handleSubmit() {
      let barcodeIds = this.dataList.map(i => i.barcodeId);
      if (barcodeIds.length > 0) {
        request({
          url: '/system/TransferIn/add-new-one',
          method: 'post',
          data: JSON.stringify({
            orgId: '1002106210000278', // TODO: should be replace
            barcodeIds
          })
        }).then((resp) => {
          this.$message.success('提交成功!');
          this.dataList = [];
        });
      }
    }
  },
  mounted() {
    listThread().then((resp) => {
      this.treeData = resp;
    });
  },
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }
}

hr {
  border: 1px dashed #ccc;
  margin-bottom: 1rem;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.showAll_dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  ::v-deep .el-dialog {
    margin: 0 auto !important;
    height: 80%;
    overflow: hidden;

    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
      // 下边设置字体，我的需求是黑底白字
      color: #ffffff;
      line-height: 30px;
      padding: 0 15px;
    }
  }
}
</style>
