<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      :inline="true"
    >
      <el-row>
        <el-col :span="20" :xs="4">
          <el-row>
            <el-col :span="6">
              <el-form-item label="单号" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据类型编码" prop="docType">
                <el-input v-model="form.docType" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务日期" prop="businessDate">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.businessDate"
                  :disabled="disabled"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调出货位" prop="transOutOrgCode">
                <el-cascader v-model="form.attr2" :options="transOptions">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调出组织编码" prop="transOutOrgCode">
                <el-input v-model="form.transOutOrgCode" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调入货位" prop="transInOrgCode">
                <el-cascader v-model="form.attr1" :options="transOptions">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调入组织编码" prop="transInOrgCode">
                <el-input v-model="form.transInOrgCode" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="status">
                <el-input v-model="form.status" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="创建人" prop="createBy">
                <el-input v-model="form.createBy" :disabled="disabled" />
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-col>
        <el-col :span="4" :xs="4" style="display: flex; justify-content: end">
          <el-form-item>
            <el-button type="primary" size="mini" plain @click="handleSubmit"
              >保存</el-button
            >
            <el-button type="primary" size="mini" @click="handleAdd"
              >新增</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-button
      type="success"
      size="mini"
      plain
      icon="el-icon-plus"
      @click="handleAddBtn"
      >添加</el-button
    >
    <el-form :model="form" ref="tableForm" :rules="tableRules" size="small">
      <el-table v-loading="loading" :data="form.wmTransferInLineList">
        <el-table-column label="料号编码" align="center" prop="itemCode">
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'wmTransferInLineList.' + $index + '.itemCode'"
              :rules="tableRules.itemCode"
            >
              <el-input
                :readonly="true"
                v-model="form.wmTransferInLineList[$index].itemCode"
                placeholder="请选择物料编码"
                @focus="openDialog(row, $index)"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="料号名称"
          align="center"
          prop="itemName"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'wmTransferInLineList.' + $index + '.itemName'"
              :rules="tableRules.itemName"
            >
              <el-input
                v-model="form.wmTransferInLineList[$index].itemName"
                placeholder="请输入物料名称"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="批次号"
          align="center"
          prop="lotinfo"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'wmTransferInLineList.' + $index + '.lotinfo'"
              :rules="tableRules.lotinfo"
            >
              <el-select
                v-model="form.wmTransferInLineList[$index].lotinfo"
                placeholder="请选择"
                @change="changeType($event, $index)"
              >
                <el-option
                  v-for="item in batchList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" prop="qty">
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'wmTransferInLineList.' + $index + '.qty'"
              :rules="tableRules.qty"
            >
              <el-input-number
                size="medium"
                v-model="form.wmTransferInLineList[$index].qty"
                controls-position="right"
                :min="1"
                :max="10"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" prop="unit">
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'wmTransferInLineList.' + $index + '.unit'"
              :rules="tableRules.unit"
            >
              <el-input
                v-model="form.wmTransferInLineList[$index].unit"
                placeholder="请输入单位"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="仓库" align="center" prop="attr1">
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'wmTransferInLineList.' + $index + '.newattr1'"
              :rules="tableRules.newattr1"
            >
              <el-select
                v-model="form.wmTransferInLineList[$index].newattr1"
                placeholder="请选择"
                @change="changeTrans($event, $index)"
              >
                <el-option
                  v-for="item in transOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="{ row, $index }">
            <el-button
              @click="deleteRow($index)"
              style="color: #f56c6c; margin-bottom: 18px"
              type="text"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <pagination
      v-show="ipagination.total > 0"
      :total="ipagination.total"
      :page.sync="ipagination.pageNum"
      :limit.sync="ipagination.pageSize"
      @pagination="getList"
    />
    <select-item ref="selectitem" @selectOK="selectOK"></select-item>
  </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data"
import { getDetail, miscRcvTrans, getBatch, addtInsert, listThread } from '@/api/WarehouseOperation/transferin'
import { deepClone } from '@/utils/index'
import SelectItem from '@/components/SelectItem'

export default {
  name: 'transferindetails',
  components: {
    SelectItem
  },
  data () {
    return {
      disabled: false,
      data: {},
      //form表单数据
      form: {},
      tableForm: {
        tableData: []
      },
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
      tableRules: {
        itemCode: [
          { required: true, message: '请选择物料编码', trigger: 'change' }
        ],
        itemName: [
          { required: true, message: '请输入物料名称', trigger: 'change' }
        ],
        lotinfo: [
          { required: true, message: '请选择批次', trigger: 'change' }
        ],
        qty: [
          { type: 'number', required: true, message: '请输入数量', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        newattr1: [
          { required: false, message: '请选择仓库', trigger: 'change' }
        ]
      },
      //入库单详情表格数据
      productReceptDetailsList: [],
      //遮罩层开启关闭标识
      loading: false,
      //物料编码弹窗开启关闭标识、
      open: undefined,
      //分页参数
      ipagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      showEdit: [], // 控制显示及隐藏
      warehouseOptions: [],
      batchList: [],
      transOptions: []
    }
  },

  created () {
    this.getQuery(this.$route.query.row)
  },

  methods: {
    getQuery (row) {
      let that = this
      Object.keys(row).forEach(function (key) {
        that.form[key] = row[key]
      })
      listThread().then(res => {
        this.transOptions = res
        if (that.form.type == 'add') {
          this.disabled = false
          that.form = {
            type: 'add',
            wmTransferInLineList: []
          }
          getDicts('org').then(res => {
            if (res.code == 200) {
              res.data.forEach(item => {
                this.form.orgId = item.dictValue
                this.form.orgName = item.dictLabel
              })
            }
          })
          this.form.creatName = this.$store.state.user.name
        }
        else {
          this.disabled = true
          this.getList()

        }
      })

    },
    /**表格数据赋值 */
    getList () {
      var params = {
        data: {
          id: this.form.id
        }
      }
      getDetail(params).then(res => {
        if (res.code == 200) {
          this.form = res.data
          this.form.attr1 = JSON.parse(this.form.attr1)
          this.form.attr2 = JSON.parse(this.form.attr2)
          this.form.wmTransferInLineList.forEach((item, index) => {
            this.transOptions.forEach(element => {
              if (item.attr1 == element.value) {
                this.$set(this.form.wmTransferInLineList[index], 'newattr1', '')
                this.form.wmTransferInLineList[index].newattr1 = element.label
              }
            })
          })
        }
      })
    },
    /**保存 */
    handleSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.wmTransferInLineList.length == 0) {
            this.$message.error('请添加数据行')
          }
          else {
            this.$refs.tableForm.validate((valid) => {
              if (valid) {
                var params = {}
                params.data = deepClone(this.form)
                if (this.form.type == 'add') {
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
      let tempData = {}
      this.form.wmTransferInLineList.push(tempData)
    },
    /**表格删除 */
    deleteRow (index) {
      this.form.wmTransferInLineList.splice(index, 1)
    },
    /**查看物料详情 */
    openDialog (row, $index) {
      this.$refs.selectitem.Add(row, $index)
    },
    selectOK (data, index) {
      this.$set(this.form.wmTransferInLineList[index], 'itemCode', '')
      this.$set(this.form.wmTransferInLineList[index], 'itemName', '')
      this.form.wmTransferInLineList[index].itemCode = data.itemCode
      this.form.wmTransferInLineList[index].itemName = data.itemName
      this.form.wmTransferInLineList[index].itemId = data.itemId
      this.getBatch(this.form.wmTransferInLineList[index].itemCode, index)

    },
    getBatch (itemCode, index) {
      var params = {
        data: {
          orgId: "1002106210000278",
          itemCode: itemCode
        }
      }
      getBatch(params).then(res => {
        if (res.code == 200) {
          var _batchList = []
          if (res.rows.length == 0) {
            this.form.wmTransferInLineList[index].lotinfo = ''
          }
          res.rows.forEach(item => {
            _batchList.push({
              value: item.storageArea,
              label: item.batchNumber
            })
          })
          this.batchList = _batchList
        }
      })
    },
    changeType (e, index) {
      var obj = {}
      obj = this.batchList.find(function (i) {
        return i.label === e
      })
      this.$set(this.form.wmTransferInLineList[index], 'storageLocationCode', '')
      this.form.wmTransferInLineList[index].storageLocationCode = obj.value
    },
    changeTrans (e, index) {
      var obj = {}
      obj = this.transOptions.find(function (i) {
        return i.label === e
      })
      this.$set(this.form.wmTransferInLineList[index], 'attr1', '')
      this.form.wmTransferInLineList[index].attr1 = obj.value
    }
  }
}
</script>

<style>
</style>
