<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="4" :xs="24">
        <el-input
          v-model="filterText"
          placeholder="请输入库位名称"
          clearable
          size="mini"
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
        <el-tree
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          default-expand-all:true
          ref="tree"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="mini"
          :inline="true"
          v-show="showSearch"
          label-width="80px"
        >
          <el-form-item label="产品编码" prop="itemCode">
            <el-input
              v-model="queryParams.itemCode"
              placeholder="请输入产品编码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="产品名称" prop="itemName">
            <el-input
              v-model="queryParams.itemName"
              placeholder="请输入产品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="入库批次号" prop="batchNumber">
            <el-input
              v-model="queryParams.batchNumber"
              placeholder="请输入入库批次号"
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
        </el-form>

        <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['wm:wmstock:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row> -->

        <el-table
          v-loading="loading"
          :data="wmstockList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="组织名"
            width="120px"
            align="center"
            prop="orgName"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="产品编码"
            align="center"
            prop="itemCode"
            width="120px"
          />
          <el-table-column
            label="产品名称"
            align="center"
            prop="itemName"
            width="150px"
          />
          <!-- <el-table-column label="单位" align="center" prop="unitOfMeasure" /> -->
          <el-table-column
            label="批次编号"
            width="130px"
            align="center"
            prop="batchNumber"
          />
          <el-table-column
            label="仓库编码"
            align="center"
            prop="warehouseCode"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="库区编码"
            align="center"
            prop="locationCode"
          />
          <el-table-column label="库位编码" align="center" prop="areaCode" />
          <el-table-column
            label="库存数量"
            width="100px"
            align="center"
            prop="qty"
          />
          <!-- <el-table-column
            label="库存保留数量"
            width="120px"
            align="center"
            prop="quantityReserved"
          /> -->

          <!-- <el-table-column label="创建人" width="100px" prop="createBy" />
          <el-table-column label="创建时间" width="100px" prop="createTime" />
          <el-table-column label="更新人" width="100px" prop="updateBy" />
          <el-table-column label="更新时间" width="100px" prop="updateTime" /> -->
          <!-- <el-table-column
            label="入库日期"
            align="center"
            prop="recptDate"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.recptDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="库存有效期"
            align="center"
            prop="expireDate"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.expireDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column> -->
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'
var serverUrl = process.env.VUE_APP_BASE_API //获取.env.配置文件的服务器路径
export default {
  name: "existingstock",
  // components: { Treeselect },
  data () {
    return {
      /**搜索库位filter */
      filterText: '',
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
      //入库产品分类树
      // itemTypeOptions: undefined,
      // 库存记录表格数据
      wmstockList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemTypeId: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        batchCode: null,
        batchNumber: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        vendorNick: null,
        quantityOnhand: null,
        workorderCode: null,
        expireDate: null,
      },
      // 表单参数
      form: {
        itemCode: '',                //产品名称
      },

      //树形控件配置
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //入库产品分类树
      treeData: [],

      //空ID
      nullId: null,
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    /**获取树形控件数据 */
    this.getTreeList()

    /**获取table数据 */
    this.getTableList(this.nullId)
  },
  methods: {
    /** 查询库存记录列表 */
    getList () {

    },
    /**树形控件搜索执行 */
    filterNode (value, data) {
      //  console.log(value, data)
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /**获取树形控件数据 */
    getTreeList () {
      let that = this
      let token = getToken()
      var orgId = '1001712062695280'
      // console.log(token)
      Vue.axios({
        methods: 'GET',
        url: serverUrl + 'system/warehouse/list',
        headers: {
          'authorization': token
        },
        params: { orgId }
      }).then(function (response) {
        console.log(response)
        that.setTreeList(response.data)
      }).catch(function (error) {
        console.log(error)
      })
    },
    /**树形控件赋值 */
    setTreeList (treeList) {
      console.log(treeList)
      let that = this

      if (treeList.length > 0) {
        Object.keys(treeList).forEach((index) => {
          that.treeData[index] = {}
          that.treeData[index].label = treeList[index].warehouseName
          that.treeData[index].level = 1
          that.treeData[index].warehouseId = treeList[index].warehouseId
          that.treeData[index].warehouseCode = treeList[index].warehouseCode
          if (treeList[index].wmStorageLocations.length > 0) {
            that.treeData[index].children = []
            Object.keys(treeList[index].wmStorageLocations).forEach((wmIndex) => {
              let tempLocationData = {}
              tempLocationData.label = treeList[index].wmStorageLocations[wmIndex].locationName
              tempLocationData.children = []
              tempLocationData.level = 2
              tempLocationData.locationId = treeList[index].wmStorageLocations[wmIndex].locationId
              tempLocationData.locationCode = treeList[index].wmStorageLocations[wmIndex].locationCode
              that.treeData[index].children.push(tempLocationData)
              if (treeList[index].wmStorageLocations[wmIndex].wmStorageAreas.length > 0) {
                that.treeData[index].children[wmIndex].children = []
                Object.keys(treeList[index].wmStorageLocations[wmIndex].wmStorageAreas).forEach((wmAreaIndex) => {
                  let tempAreaData = {}
                  tempAreaData.label = treeList[index].wmStorageLocations[wmIndex].wmStorageAreas[wmAreaIndex].areaName
                  tempAreaData.children = []
                  tempAreaData.level = 3
                  tempAreaData.areaId = treeList[index].wmStorageLocations[wmIndex].wmStorageAreas[wmAreaIndex].areaId
                  tempAreaData.areaCode = treeList[index].wmStorageLocations[wmIndex].wmStorageAreas[wmAreaIndex].areaCode
                  that.treeData[index].children[wmIndex].children.push(tempAreaData)
                })
              }
              // console.log(that.itemTypeOptions[index].children[wmIndex].label)
              // console.log(treeList[index].wmStorageLocations[wmIndex].locationName)
            })
          }
          // console.log("----------------------")
        })
        that.treeData = JSON.parse(JSON.stringify(that.treeData))
        console.log(that.treeData)
      }
    },

    /**获取table数据 */
    getTableList (data) {
      let that = this
      let token = getToken()
      console.log(data)

      var orgId = '1001712062695280'
      if (data != null) {
        console.log(data)
        if (data.level == 1) {
          let warehouseCode = data.warehouseCode
          Vue.axios({
            methods: 'GET',
            url: serverUrl + 'system/view/list',
            headers: {
              'authorization': token
            },
            params: {
              warehouseCode,
              orgId
            }
          }).then(function (response) {
            console.log(response)
            that.setTableList(response.data.rows)
          }).catch(function (error) {
            console.log(error)
          })
        } else if (data.level == 2) {
          let locationCode = data.locationCode
          Vue.axios({
            methods: 'GET',
            url: serverUrl + 'system/view/list',
            headers: {
              'authorization': token
            },
            params: {
              locationCode,
              orgId
            }
          }).then(function (response) {
            console.log(response)
            that.setTableList(response.data.rows)
          }).catch(function (error) {
            console.log(error)
          })
        } else if (data.level == 3) {
          let areaCode = data.areaCode
          Vue.axios({
            methods: 'GET',
            url: serverUrl + 'system/view/list',
            headers: {
              'authorization': token
            },
            params: {
              areaCode,
              orgId
            }
          }).then(function (response) {
            console.log(response)
            that.setTableList(response.data.rows)
          }).catch(function (error) {
            console.log(error)
          })
        }
      } else {
        Vue.axios({
          methods: 'GET',
          url: serverUrl + 'system/view/list',
          headers: {
            'authorization': token
          },
          params: {
            orgId
          }
        }).then(function (response) {
          console.log(response)
          that.setTableList(response.data.rows)
        }).catch(function (error) {
          console.log(error)
        })
      }
    },

    /**赋值table表 */
    setTableList (dataList) {
      console.log(dataList)
      let that = this
      that.wmstockList = []
      Object.keys(dataList).forEach((index) => {
        that.wmstockList.push(dataList[index])
      })
      console.log(that.wmstockList)
      that.wmstockList = JSON.parse(JSON.stringify(that.wmstockList))
    },

    /** 查询分类下拉树结构 */
    getTreeselect () {

    },
    // 筛选节点
    // filterNode (value, data) {

    // },
    // 节点单击事件
    handleNodeClick (data, node, item) {
      console.log(data)
      this.getTableList(data)
      // if (data.level == 1) {
      //   this.getTableList(data.warehouseId,data.level)
      // } else if (data.level == 2) {
      //   this.getTableList(data.locationId,data.level)
      // } else if (data.level == 3) {
      //   this.getTableList(data.areaId,data.level)
      // }
      // console.log(node)
      // console.log(item)
    },
    /** 搜索按钮操作 */
    handleQuery () {
      console.log(this.queryParams.itemName, this.queryParams.itemCode, this.queryParams.batchNumber)
      let that = this
      let token = getToken()
      let orgId = '1001712062695280'
      let itemCode = this.queryParams.itemCode
      let itemName = this.queryParams.itemName
      let batchNumber = this.queryParams.batchNumber

      Vue.axios({
        methods: 'GET',
        url: serverUrl + 'system/view/list',
        headers: {
          'authorization': token
        },
        params: {
          itemCode,
          itemName,
          batchNumber,
          orgId
        }
      }).then(function (response) {
        console.log(response)
        that.setTableList(response.data.rows)
      }).catch(function (error) {
        console.log(error)
      })
    },
    /** 重置按钮操作 */
    resetQuery () {

    },
    // 多选框选中数据
    handleSelectionChange (selection) {

    },
    /** 导出按钮操作 */
    handleExport () {

    }
  }
};
</script>


<style>
.el-form-item__label {
  font-size: 10px;
}
.el-input {
  width: 140px;
}
.el-input__inner::-webkit-input-placeholder {
  width: 120px;
}
</style>
