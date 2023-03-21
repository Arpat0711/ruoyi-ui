<template>
  <el-dialog
      title="选择物料"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <div>
        <el-form ref="form" :model="queryParams" label-width="100px" :inline="true">
          <el-row>
            <el-col :span="18" :xs="4">
              <el-form-item label="物料编号" prop="itemCode">
                <el-input v-model="queryParams.itemCode" />
            </el-form-item>
              <el-form-item label="物料名称" prop="itemName">
                <el-input v-model="queryParams.itemName" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :xs="4" style="display: flex; justify-content: end">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          ref="multipleTable"
          :data="itemList"
          @row-click="singleElection"
        >
          <el-table-column label="" align="center" width="65">
            <template slot-scope="scope">
              <el-radio :label="scope.$index" v-model="templateSelection">{{ '' }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="itemCode" label="物料编号" width="120"></el-table-column>
          <el-table-column align="center" prop="itemName" label="物料名称"></el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="sumbit">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { getItem } from '@/api/WarehouseOperation/otherin'
import { getDicts } from "@/api/system/dict/data"

export default {
    data () {
      return {
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        templateSelection: '',
        selectRow: {},
        itemList: [],
        open: false,
        index: '' ,
        orgId: ''
      }
    },
    methods: {
      Add (row, index) {
        
        if (index != this.index) {
          this.templateSelection = ''
          this.selectRow = {}
        }
        this.index = index
        this.open = true
        getDicts('org').then(res => {
          if (res.code == 200) {
            this.queryParams.orgId = res.data[1].dictValue
            this.getList()
          }
        })
      },
      getList () {
        var params = {
          data: this.queryParams
        }
        getItem(params).then(res => {
          if (res.code == 200) {
            this.itemList = res.rows
            this.total = res.total
          }
        })
      },
      handleQuery () {
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery () {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          orgId: this.queryParams.orgId
        }
        this.getList()
      },
      singleElection(row){
        this.templateSelection = row
        this.selectRow = row
    },
      sumbit() {
        this.open = false
        this.$emit('selectOK', this.selectRow, this.index)
      }
    }
}
</script>

<style>

</style>