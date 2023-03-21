<template>
  <div class="app-container">
    <div class="box-card">
      <div class="title1">
        基本信息
      </div>
      <div style="position: absolute;top: 40px;right: 80px;">
        <canvas width="120" height="120" id="myCanvas1"></canvas>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" :inline="true">
        <el-row>
          <el-col :span="20" :xs="4">
            <el-row>
              <el-col :span="8">
                <el-form-item label="单号" prop="docNo">
                  <span v-if="disabled" >{{ form.docNo }}</span>
                  <el-input v-model="form.docNo" v-else />
              </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单据类型编码" prop="docType">
                  <span v-if="disabled" >{{ form.docType }}</span>
                  <el-input v-model="form.docType" v-else />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务日期" prop="businessDate">
                  <span v-if="disabled" >{{ form.businessDate }}</span>
                  <el-date-picker v-else type="date" placeholder="选择日期" v-model="form.businessDate" :disabled="disabled" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="受益部门编码" prop="benefitDpt">
                  <span v-if="disabled" >{{ form.benefitDpt }}</span>
                  <el-input v-model="form.benefitDpt" v-else />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注" prop="remark">
                  <span v-if="disabled" >{{ form.remark }}</span>
                  <el-input v-model="form.remark" v-else />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-divider></el-divider>
    <div class="box-card">
      <div class="title1">
        物品明细
      </div>
      <el-button type="primary"  size="mini" @click="handleAdd" v-if="disabled">新增杂发单</el-button>
        
      <div>
        <el-button type="success" size="mini" plain icon="el-icon-plus" @click="handleAddBtn">添加</el-button>
        <el-button type="primary" size="mini" plain @click="handleSubmit">保存</el-button>
      </div>
      <el-table v-loading="loading" :data="form.wmMiscRcvTransLineList">
        <el-table-column label="箱码" align="center" prop="unit" />
        <el-table-column label="物料编码" align="center" prop="itemCode" :show-overflow-tooltip="true" />
        <el-table-column label="物料名称" align="center" prop="itemName" :show-overflow-tooltip="true" />
        <el-table-column label="批次号" align="center" prop="lotinfo" :show-overflow-tooltip="true"/>
        <el-table-column label="规格型号" align="center" prop="lotinfo" :show-overflow-tooltip="true"/>
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="数量" align="center" prop="qty" />
        <el-table-column label="库位信息" align="center" prop="qty" />
        <el-table-column label="操作" width="100" v-if="disabled">
          <template slot-scope="{row,$index}">
            <el-button @click="deleteRow($index)" style="color: #f56c6c;margin-bottom: 18px;" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="ipagination.total > 0"
        :total="ipagination.total"
        :page.sync="ipagination.pageNum"
        :limit.sync="ipagination.pageSize"
        @pagination="getList"
      />
    </div>
    <el-dialog title="请选择您要出库的箱" :visible.sync="dialogVisible" width="70%">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-divider></el-divider>
          <el-tree
            class="filter-tree"
            accordion
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            :highlight-current="true"
            ref="tree">
          </el-tree>
        </el-col>
        <el-col :span="16">
          <el-form
            :model="queryParams"
            ref="queryForm"
            label-width="110px"
          >
            <el-row>
              <el-col :span="8" >
                <el-form-item label="箱码" prop="docNo">
                  <el-input
                    v-model="queryParams.docNo"
                    placeholder="请输入"
                    style="width: 100%"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" >
                <el-form-item label="物料编码" prop="itemCode">
                  <el-input
                    v-model="queryParams.itemCode"
                    placeholder="请输入"
                    style="width: 100%"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" >
                <el-form-item label="物料名称" prop="itemName">
                  <el-input
                    v-model="queryParams.itemName"
                    placeholder="请输入"
                    style="width: 100%"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" >
                <el-form-item label="批次号" prop="lotinfo">
                  <el-input
                    v-model="queryParams.lotinfo"
                    placeholder="请输入"
                    style="width: 100%"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16" style="display: flex; justify-content: end">
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
          </el-form>
          <el-table :data="gridData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" width="50" label="序号" />
            <el-table-column property="date" label="组织编码" />
            <el-table-column property="date" label="箱码" />
            <el-table-column property="name" label="物料编码" />
            <el-table-column property="name" label="物料名称" />
            <el-table-column property="name" label="规格型号" />
            <el-table-column property="address" label="批次号" />
            <el-table-column property="address" label="单位" />
            <el-table-column property="date" label="数量" />
            <el-table-column property="name" label="库位" />
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getItemList"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">选 择</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data"
import { getDetail, miscRcvTrans, getBatch, addtInsert } from '@/api/WarehouseOperation/otherout'
import { deepClone } from '@/utils/index'
import SelectItem from '@/components/SelectItem'
import { listThread } from '@/api/WarehouseOperation/transferin'

export default {
  name: 'otheroutdetails',
  components: {
    SelectItem,
  },
  data () {
    return {
      disabled: false,
      //form表单数据
      form: {},
      //表单验证规则
      rules: {
        docNo: [
          { required: true, message: '请输入单号', trigger: 'blur' }
        ],
        docType: [
          { required: true, message: '请输入单据类型编码', trigger: 'blur' }
        ],
        businessDate: [
          { type: 'string', required: true, message: '请选择业务日期', trigger: 'change' }
        ],
        benefitDpt: [
          { required: true, message: '请输入受益部门编码', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        createBy: [
          { required: false, message: '请输入创建人', trigger: 'blur' }
        ]
      },
      //遮罩层开启关闭标识
      loading: false,
      //分页参数
      ipagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false,
      gridData: [],
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      selection: []
    }
  },

  created () {
    this.getQuery(this.$route.query.row)
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    getQuery (row) {
      let that = this
      Object.keys(row).forEach(function (key) {
        that.form[key] = row[key]
      })
      if (that.form.type == 'add') {
        this.disabled = false
        that.form = {
          type: 'add',
          wmMiscShipLineList: []
        }
        getDicts('org').then(res => {
          if (res.code == 200) {
            res.data.forEach(item => {
              this.form.orgId = item.dictValue
              this.form.orgName = item.dictLabel
            })
          }
        })
        listThread().then(res => {
          this.treeData = res
        })

        this.form.creatName = this.$store.state.user.name
      }
      else {
        this.disabled = true
        this.getList()
      }
    },
    /**表格数据赋值 */
    getList () {
      var params = {
        data: {
          id: this.form.id
        }
      }
      getDetail(params).then(res => {
        if(res.code == 200) {
          this.form = res.data
        }
      })
    },
    /**保存 */
    handleSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.wmMiscShipLineList.length == 0) {
            this.$message.error('请添加数据行')
          }
          else {
            this.$refs.tableForm.validate((valid) => {
              if (valid) {
                var params = {}
                params = deepClone(this.form)
                if(this.form.type == 'add') {
                  addtInsert(params).then(res => {
                    if (res.code == 200) {
                      this.$message.success(res.msg)
                    }
                    else {
                      this.$message.error(res.msg)
                    }
                  })
                }
                else {
                  miscRcvTrans(params).then(res => {
                    if (res.code == 200) {
                      this.$message.success(res.msg)
                      this.getList()
                    }
                    else {
                      this.$message.error(res.msg)
                    }
                  })
                }
              }
            })
          }
          
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**新增 */ 
    handleAdd () {
      var row = {
        type: 'add'
      }      
      this.getQuery(row)
    },
    /**表格新增 */
    handleAddBtn () {
      this.dialogVisible = true
    },
    /**表格删除 */
    deleteRow (index) {
      this.form.wmMiscShipLineList.splice(index,1)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log(data)
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getItemList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10
      }
      this.getItemList()
    },
    getItemList () {
      console.log(this.queryParams)
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selection = selection
    }
  }
}
</script>

<style lang="scss" scoped>
  .title1 {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 16px;
  }
</style>
