<template lang="html">
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="page-title">
          <span>杂收单号: {{ header.docNo }}</span>
          <el-tag v-if="header.status === 'WIP'" :type="'warning'" effect="dark">开立</el-tag>
          <el-tag v-else :type="'success'" effect="dark">已审核</el-tag>
        </div>
      </el-col>
    </el-row>
    <hr>
    <el-row>
      <el-col :span="24">
        <span style="font-size: 1.25rem;">基本信息</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">创建时间: {{ header.createTime }}</el-col>
      <el-col :span="6">创建人: {{ header.createName }}</el-col>
      <el-col :span="12">杂收组织: {{ header.orgName }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">完成时间: {{ header.executorTime }}</el-col>
      <el-col :span="6">杂收人: {{ header.executorName }}</el-col>
      <!-- <el-col :span="12">杂收存储位置: </el-col> -->
    </el-row>
    <hr>
    <el-row>
      <el-col :span="24">
        <span style="font-size: 1.25rem;">物品明细</span>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 0">
      <el-col :span="24">
        <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
          <el-form-item label="物料编码" prop="itemCode">
            <el-input v-model="queryParams.itemCode" placeholder="请输入搜索内容" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="物料编码" prop="itemCode" />
      <el-table-column label="物品名称" prop="itemName" />
      <el-table-column label="批次号" prop="lotInfo" />
      <el-table-column label="规格型号" prop="specification" />
      <el-table-column label="单位" prop="unit" />
      <el-table-column label="数量" prop="qty" />
      <el-table-column label="箱码信息">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="queryDetails(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.number"
        :page-sizes="[10, 20, 30, 50, 100]" :page-size="pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
      </el-pagination>
    </div>
    <el-dialog title="箱码明细" :visible.sync="dialogVisible">
      <el-table :data="boxCodeDetails">
        <el-table-column property="boxCode" label="箱码" />
        <el-table-column property="itemCode" label="物料编码" />
        <el-table-column property="lotInfo" label="批次号" />
        <el-table-column property="qty" label="数量" />
        <el-table-column property="place" label="库位信息" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      header: {},
      loading: false,
      boxCodeDetails: [],
      dialogVisible: false,
      pagination: {
        number: 1,
        size: 10,
        total: 0
      },
      queryParams: {
        itemCode: null
      },
      dataList: []
    }
  },

  methods: {
    getList() {
      request({
        url: '/system/MiscRcvTrans/find-header',
        method: 'post',
        params: { id: this.$route.query.id }
      }).then((resp) => {
        this.header = resp;
      });
      this.handleQuery();
    },
    handleQuery() {
      let { itemCode } = this.queryParams;
      let { number, size } = this.pagination;
      request({
        url: '/system/MiscRcvTrans/find-line-details',
        method: 'post',
        data: JSON.stringify({
          orgId: '1002106210000278', // TODO: should be replace
          pid: this.$route.query.id,
          itemCode,
          pageNum: number,
          pageSize: size
        })
      }).then((resp) => {
        this.dataList = resp.data;
        this.pagination = resp.pagination;
      });
    },
    queryDetails(row) {
      this.dialogVisible = true;
      request({
        url: '/system/MiscRcvTrans/find-box-details',
        method: 'post',
        params: { id: row.id }
      }).then((resp) => {
        this.boxCodeDetails = resp;
      });
    },
    handleSizeChange(size) {
      this.pagination.number = 1;
      this.pagination.size = size;
      this.handleQuery();
    },
    handleCurrentChange(number) {
      this.pagination.number = number;
      this.handleQuery();
    }
  },
  mounted() {
    this.getList();
  },
}
</script>

<style lang="scss" scoped>
.page-title {
  span {
    &:first-child {
      font-size: 1.5rem;
      margin-right: 1rem;
      vertical-align: middle;
    }

    &:last-child {
      font-size: 1rem;
      vertical-align: middle;
    }
  }
}

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

.search-field {
  width: 130px;
}
</style>
