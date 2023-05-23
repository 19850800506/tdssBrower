<template>
  <div id="whiteListBox">
    <el-button type="primary" size="small" @click="editWx('add')">
      新增</el-button
    >
    <div class="alarm-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="700"
        :header-cell-style="{
          background: '#0A3639',
          color: '#b0e5eb',
          fontWeight: '100',
        }"
      >
        <el-table-column
          type="index"
          label="序号"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="start" label="开始频点(Hz)" align="center">
        </el-table-column>
        <el-table-column prop="stop" align="center" label="结束频点(Hz)">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              style="
                color: #e7e14f;
                border-color: transparent;
                background-color: transparent;
              "
              size="mini"
              type="text"
              @click="editWx('revise', scope.row)"
              >修改</el-button
            >
            <el-button
              style="
                color: #e74f4f;
                border-color: transparent;
                background-color: transparent;
              "
              @click="removeWx(scope.row)"
              size="mini"
              type="text"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="20%"
        append-to-body
        @close="cancel"
        center
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <el-form
          :model="form"
          ref="form"
          :rules="rules"
          label-width="120px"
          class="demo-dynamic"
        >
          <el-form-item prop="start" label="开始频点(Hz)">
            <el-input v-model="form.start"></el-input>
          </el-form-item>
          <el-form-item prop="stop" label="结束频点(Hz)">
            <el-input v-model="form.stop"></el-input>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" @click="cancel">取消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getWihteList,
  addWhiteList,
  updateWhiteList,
  removeWhiteList,
} from '../../api/radioDetection'

export default {
  data() {
    const frequencyPoint = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('频点不能为空'))
      }
      const title = /^\d+(\.\d+)?$/
      if (!title.test(value)) {
        callback(new Error('只能输入数字或小数'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      form: {
        id: '',
        start: '',
        stop: '',
      },
      tableData: [],
      title: '',
      openType: '',
      rules: {
        start: [{ validator: frequencyPoint, trigger: 'blur', require: true }],
        stop: [{ validator: frequencyPoint, trigger: 'blur', require: true }],
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getWihteList().then((res) => {
        if (res.code === 0) {
          this.tableData = res.data
        }
      })
    },
    // 取消
    cancel() {
      this.dialogVisible = false
    },
    editWx(handle, row) {
      this.openType = handle
      if (handle === 'add') {
        this.title = '添加'
        this.form = {}
      } else {
        this.title = '修改'
        this.form = JSON.parse(JSON.stringify(row))
        this.form.id = row.rowid
      }
      this.dialogVisible = true
    },
    removeWx(row) {
      console.log(row, 'row22')
      this.$modal
        .confirm(
          `是否确认删除序号为"${
            this.tableData.findIndex((el) => el.rowid === row.rowid) + 1
          }"的数据项？`
        )
        .then(function () {
          return removeWhiteList({ id: row.rowid })
        })
        .then((res) => {
          if (res.code === 0) {
            if (res.data) {
              this.$message({
                message: res.data,
                type: 'error',
              })
            } else {
              this.$modal.msgSuccess('删除成功')
              this.getList()
            }
          } else {
            this.$message({
              message: res.data,
              type: 'error',
            })
          }
        })
        .catch(() => {})
    },
    submitForm() {
      if (this.form.start > this.form.stop) {
        this.$message({
          message: '结束频点不能小于开始频点!',
          type: 'warning',
        })
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.openType === 'add') {
            addWhiteList(this.form).then((res) => {
              if (res.code === 0) {
                if (res.data) {
                  this.$message({
                    message: res.data,
                    type: 'error',
                  })
                } else {
                  this.$message({
                    message: '新增成功',
                    type: 'success',
                  })
                  this.getList()
                  this.dialogVisible = false
                }
              } else {
                this.$message({
                  message: res.data,
                  type: 'error',
                })
              }
            })
          } else {
            updateWhiteList(this.form).then((res) => {
              if (res.code === 0) {
                if (res.data) {
                  this.$message({
                    message: res.data,
                    type: 'error',
                  })
                } else {
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                  })
                  this.getList()
                  this.dialogVisible = false
                }
              } else {
                this.$message({
                  message: res.data,
                  type: 'error',
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
#whiteListBox {
  height: 100%;
  padding: 20px;
  .title {
    color: #fff;
    width: 200px;
    margin: 10px auto;
    font-size: 18px;
  }
  .alarm-table {
    width: 100%;
    position: relative;
    top: 14px;
    overflow-x: hidden;
    .line {
      width: 375px;
      height: 10px;
      border-top: 2px solid white;
    }
    ::v-deep .el-table,
    .el-table__expanded-cell {
      background-color: transparent;
      color: #b0e5eb;
    }
    ::v-deep .el-table thead tr th.is-leaf {
      border: 0px solid #ebeef5;
      border-right: none;
    }
    ::v-deep .el-table {
      border: 0;
      th,
      tr,
      td {
        border: 0;
      }
      &::before {
        height: 0px;
      }
      &::after {
        width: 0;
      }
      .el-table__fixed:before {
        height: 0;
      }
    }
    //整个table的背景颜色
    ::v-deep .el-table,
    .el-table__expanded-cell {
      background-color: transparent;
      color: #b0e5eb;
    }
    ::v-deep .el-table tr {
      background-color: transparent !important;
      height: 55px;
    }
    ::v-deep .el-table tbody tr:hover > td {
      background-color: rgba($color: #0a3639, $alpha: 0.5) !important;
    }
    ::v-deep .el-table-enable-row-transition .el-table__body td,
    .el-table .cell {
      background-color: transparent;
    }
  }
  .alarm-table::-webkit-scrollbar {
    width: 0 !important;
  }
  .alarm-table {
    -ms-overflow-style: none;
  }
  .alarm-table {
    overflow: -moz-scrollbars-none;
  }
}
</style>
