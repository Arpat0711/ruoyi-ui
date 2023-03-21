<template>
  <div class="app-container">
    <div class="box-card">
      <div class="title1">
        基本信息
      </div>
      <div style="position: absolute;top: 40px;right: 80px;">
        <canvas width="120" height="120" id="myCanvas1"></canvas>
      </div>
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
              <el-col :span="8">
                <el-form-item label="杂收单号" prop="docNo">
                  <span v-if="disabled" >{{ form.docNo }}</span>
                  <el-input v-model="form.docNo" v-else />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单据类型" prop="docType">
                  <span v-if="disabled" >{{ form.docType }}</span>
                  <el-input v-model="form.docType" v-else />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="杂收日期" prop="createTime">
                  <span v-if="disabled" >{{ form.createTime }}</span>
                  <el-date-picker
                    v-else
                    type="date"
                    placeholder="选择日期"
                    v-model="form.createTime"
                    :disabled="true"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="受益部门编码" prop="benefitDpt">
                  <span v-if="disabled" >{{ form.benefitDpt }}</span>
                  <el-input v-model="form.benefitDpt" v-else />
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="备注" prop="remark">
                  <span v-if="disabled" >{{ form.remark }}</span>
                  <el-input v-model="form.remark" v-else />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="状态" prop="status">
                  <el-input v-model="form.status" :disabled="disabled" />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="创建人" prop="createBy">
                  <el-input v-model="form.createBy" :disabled="disabled" />
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-col>
          <!-- <el-col :span="4" :xs="4" style="display: flex; justify-content: end">
            <el-form-item>
              
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <el-divider></el-divider>
    <div class="box-card">
      <div class="title1">
        物品明细
      </div>
      <div v-if="disabled">
        <el-button type="primary" size="mini" @click="handleAdd" v-if="!showButton">新增杂收单</el-button>
        <el-table v-loading="loading" :data="form.wmMiscRcvTransLineList">
          <el-table-column label="物料编码" align="center" prop="itemCode" :show-overflow-tooltip="true" />
          <el-table-column label="物料名称" align="center" prop="itemName" :show-overflow-tooltip="true" />
          <el-table-column label="批次号" align="center" prop="lotinfo" :show-overflow-tooltip="true"/>
          <el-table-column label="数量" align="center" prop="qty" />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column label="箱码信息" width="100">
            <template slot-scope="{ row, $index }">
              <el-button
                @click="detail(row,$index)"
                type="text"
                >明细</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div v-else>
        <el-button type="success" size="mini" plain icon="el-icon-plus" @click="handleAddBtn" v-if="showButton">添加</el-button>
        <el-button type="primary" size="mini" plain @click="handleSubmit" v-if="showButton">保存</el-button>
        <el-form :model="form" ref="tableForm" :rules="tableRules" size="small">
          <el-table v-loading="loading" :data="form.wmMiscRcvTransLineList">
            <el-table-column label="物料编码" align="center" prop="itemCode">
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :prop="'wmMiscRcvTransLineList.' + $index + '.itemCode'"
                  :rules="tableRules.itemCode"
                >
                  <el-input
                    :readonly="true"
                    v-model="form.wmMiscRcvTransLineList[$index].itemCode"
                    placeholder="请选择物料编码"
                    @focus="openDialog(row, $index)"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="物料名称"
              align="center"
              prop="itemName"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :prop="'wmMiscRcvTransLineList.' + $index + '.itemName'"
                  :rules="tableRules.itemName"
                >
                  <el-input
                    v-model="form.wmMiscRcvTransLineList[$index].itemName"
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
                  :prop="'wmMiscRcvTransLineList.' + $index + '.lotinfo'"
                  :rules="tableRules.lotinfo"
                >
                  <el-input
                    v-model="form.wmMiscRcvTransLineList[$index].lotinfo"
                    placeholder="请选择"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="数量" align="center" prop="qty">
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :prop="'wmMiscRcvTransLineList.' + $index + '.qty'"
                  :rules="tableRules.qty"
                >
                  <el-input-number
                    size="medium"
                    v-model="form.wmMiscRcvTransLineList[$index].qty"
                    controls-position="right"
                    :min="1"
                  ></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单位" align="center" prop="unit">
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :prop="'wmMiscRcvTransLineList.' + $index + '.unit'"
                  :rules="tableRules.unit"
                >
                  <el-input
                    v-model="form.wmMiscRcvTransLineList[$index].unit"
                    placeholder="请输入单位"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="{ row, $index }">
                <el-button
                  @click="deleteRow($index)"
                  style="color: #f56c6c;margin-bottom: 18px;"
                  type="text"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <pagination
        v-show="ipagination.total > 0"
        :total="ipagination.total"
        :page.sync="ipagination.pageNum"
        :limit.sync="ipagination.pageSize"
        @pagination="getList"
      />
    </div>
    <select-item ref="selectitem" @selectOK="selectOK"></select-item>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-table :data="gridData">
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column property="boxCode" label="箱码" />
        <el-table-column property="itemCode" label="物料编码" />
        <el-table-column property="lotinfo" label="批次号" />
        <el-table-column property="qty" label="数量" />
        <el-table-column property="place" label="库位信息" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data"
import { getDetail, miscRcvTrans, addtInsert, getWmMiscRcvTransBoxList } from '@/api/WarehouseOperation/otherin'
import { deepClone } from '@/utils/index'
import SelectItem from '@/components/SelectItem'
import { formatDate } from '@/utils/index'
import { parseTime } from '@/utils/ruoyi'

export default {
  name: 'otherindetails',
  components: {
    SelectItem
  },
  data () {
    return {
      disabled: false,
      data: {},
      //form表单数据
      form: {
        createTime: new Date(),
        wmMiscRcvTransLineList: []
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
          { required: true, message: '请选择批次', trigger: 'blur' }
        ],
        qty: [
          { type: 'number', required: true, message: '请输入数量', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        isMfg: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        isZerocost: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
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
      batchList: [],
      dialogTitle: '',
      dialogVisible: false,
      gridData: [],
      showButton: true
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
      if (that.form.type == 'add') {
        this.disabled = false
        that.form = {
          type: 'add',
          status: 0,
          createTime: new Date(),
          wmMiscRcvTransLineList: []
        }
        getDicts('org').then(res => {
          if (res.code == 200) {
            this.form.orgId = res.data[1].dictValue
            this.form.orgName = res.data[1].dictLabel
          }
        })
        this.form.createCode = this.$store.state.user.name
        this.form.createName = this.$store.state.user.nickname
      }
      else {
        this.disabled = true
        this.getList()
      }
    },
    /**表格数据赋值 */
    getList () {
      getDetail(this.form.id).then(res => {
        if (res.code == 200) {
          this.form = res.data
          if (this.form.status == 0) {
            this.showSignature('开立', 'black')
          }
          else {
            this.showSignature('已审核', 'black')
          }
        }
      })
    },
    /**保存 */
    handleSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.wmMiscRcvTransLineList.length == 0) {
            this.$message.error('请添加数据行')
          }
          else {
            this.$refs.tableForm.validate((valid) => {
              if (valid) {
                this.form.createTime = parseTime(formatDate(Date.parse(new Date())), '{y}-{m}-{d}')
                var params = {}
                params = deepClone(this.form)
                if (this.form.type == 'add') {
                  addtInsert(params).then(res => {
                    if (res.code == 200) {
                      this.$message.success(res.msg)
                      this.showButton = false
                      this.disabled = true
                      this.form = res.data
                      this.form.type = 'detail'
                      this.getList()
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
      this.form.wmMiscRcvTransLineList.push(tempData)
    },
    /**表格删除 */
    deleteRow (index) {
      this.form.wmMiscRcvTransLineList.splice(index, 1)
    },
    
    /**查看物料详情 */
    openDialog (row, $index) {
      this.$refs.selectitem.Add(row, $index)
    },
    selectOK (data, index) {
      this.$set(this.form.wmMiscRcvTransLineList[index], 'itemCode', '')
      this.$set(this.form.wmMiscRcvTransLineList[index], 'itemName', '')
      this.form.wmMiscRcvTransLineList[index].itemCode = data.itemCode
      this.form.wmMiscRcvTransLineList[index].itemName = data.itemName
      this.form.wmMiscRcvTransLineList[index].itemId = data.itemId
      this.form.wmMiscRcvTransLineList[index].unit = data.unitOfMeasure

    },
    detail (row) {
      this.dialogTitle = '箱码明细'
      this.dialogVisible = true
      getWmMiscRcvTransBoxList({pid: row.pid}).then(res => {
        if (res.code == 200) {
          this.gridData = res.rows
        }
        else {
          this.$message.error(res.msg)
        }
      })
    },
    showSignature (text,color) {
      var canvas = document.getElementById('myCanvas1')
      var ctx = canvas.getContext('2d')
      ctx.globalAlpha = 0.8
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.arc(canvas.clientWidth / 2, canvas.clientWidth / 2, canvas.clientWidth / 2 - 10, 0, 2 * Math.PI, false)
      ctx.stroke()
      ctx.font = '20px 宋体'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.lineWidth = 1
      ctx.translate(canvas.clientWidth / 2, canvas.clientWidth / 2)
      ctx.rotate(Math.PI / 6)
      ctx.strokeText(text, 0, 0)
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
