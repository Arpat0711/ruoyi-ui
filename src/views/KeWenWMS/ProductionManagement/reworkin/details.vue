<template lang="html">
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="page-title">
          <span>调入单号: {{ header.docNo }}</span>
          <el-tag v-if="header.status === 'TODO'" :type="'warning'" effect="dark">开立</el-tag>
          <el-tag v-else-if="header.status === 'WIP'" :type="'warning'" effect="dark">未审核</el-tag>
          <el-tag v-else :type="'success'" effect="dark">已审核</el-tag>
        </div>
      </el-col>
    </el-row>
    <hr>
    <el-row>
      <el-col :span="24">
        <span style="font-size: 1.25rem;font-weight: bold;">基本信息</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">创建时间: {{ header.createTime }}</el-col>
      <el-col :span="6">创建人: {{ header.createName }}</el-col>
      <el-col :span="12">调入组织: {{ header.transInOrgName }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">完成时间: {{ header.finishTime }}</el-col>
      <el-col :span="6">调入人: {{ header.executorName }}</el-col>
      <el-col :span="12">调入存储位置: {{ header.transInWarehouseName }}</el-col>
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
          <el-form-item label="箱码" prop="boxCode">
            <el-input v-model="queryParams.boxCode" placeholder="请输入搜索内容" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="箱码" prop="boxCode" />
      <el-table-column label="物料编码" prop="itemCode" />
      <el-table-column label="物品名称" prop="itemName" />
      <el-table-column label="批次号" prop="lotInfo" />
      <el-table-column label="规格型号" prop="specification" />
      <el-table-column label="单位" prop="unit" />
      <el-table-column label="数量" prop="qty" />
      <el-table-column label="库位信息" prop="place" />
    </el-table>
    <div style="text-align: right;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.number"
        :page-sizes="[10, 20, 30, 50, 100]" :page-size="pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data () {
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
        boxCode: null
      },
      dataList: []
    }
  },

  methods: {
    getList () {
      request({
        url: '/system/TransferIn/find-header',
        method: 'post',
        params: { id: this.$route.query.id }
      }).then((resp) => {
        this.header = resp
        this.handleQuery()
      })
    },
    handleQuery () {
      let { boxCode } = this.queryParams
      let { number, size } = this.pagination
      request({
        url: '/system/TransferIn/find-details',
        method: 'post',
        data: JSON.stringify({
          orgId: '1002106210000278', // TODO: should be replace
          orderId: this.$route.query.id,
          boxCode,
          pageNum: number,
          pageSize: size
        })
      }).then((resp) => {
        this.dataList = resp.data
        this.pagination = resp.pagination
      })
    },
    handleSizeChange (size) {
      this.pagination.number = 1
      this.pagination.size = size
      this.handleQuery()
    },
    handleCurrentChange (number) {
      this.pagination.number = number
      this.handleQuery()
    }
  },

  mounted () {
    this.getList()
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
