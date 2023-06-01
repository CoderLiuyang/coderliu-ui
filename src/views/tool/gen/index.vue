<template>
  <div class="execution">
    <basic-container>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-select
              v-model="q.dsName"
              placeholder="请选择数据源"
              @change="search"
            >
              <el-option
                v-for="item in dataSourceList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-select
              v-model="q.serverName"
              placeholder="请选择生成的项目"
            >
              <el-option
                v-for="item in serverList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-input v-model="q.tableName" placeholder="表名称"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search"
            >搜索
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-check"
              @click="openBatch"
            >批量生成
            </el-button>
          </div>
        </el-col>
      </el-row>
      <avue-crud
        ref="crud"
        v-model:page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @size-change="sizeChange"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @selection-change="selectionChange"
      >
        <template #menu="scope">
          <el-button
            text
            type="primary"
            icon="el-icon-check"
            @click="genCode(scope.row, scope.index)"
          >生成
          </el-button>
          <!--          <el-button-->
          <!--            text-->
          <!--            type="primary"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleDesign(scope.row, scope.index)"-->
          <!--          >设计-->
          <!--          </el-button>-->
        </template>
      </avue-crud>
    </basic-container>
    <!-- 预览界面 -->
    <el-dialog
      v-model="preview.open"
      :title="preview.title"
      width="80%"
      top="5vh"
      append-to-body
    >
      <Preview v-if="preview.open" :query-data="formData"/>
    </el-dialog>
  </div>
</template>

<script>
import {fetchList, fetchSelectDsList, fetchServerNameList, handleDown, gen} from '@/api/tool/gen'
import {formBatchOption, formOption, tableOption} from '@/const/crud/tool/gen'
import Preview from './preview.vue'

export default {
  name: 'CodeGenerator',
  components: {Preview},
  data() {
    return {
      q: {},
      dataSourceList: [],
      serverList: [],
      tableData: [],
      formData: {},
      formBatchData: {},
      box: false,
      boxBatch: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 预览参数
      preview: {
        open: false,
        title: '代码预览'
      },
      tableLoading: false,
      tableOption: tableOption,
      formOption: formOption,
      formBatchOption: formBatchOption,
      tableNames: []
    }
  },
  created() {
    this.getdataSourceList()
    this.getServerNameList()
  },
  methods: {
    getList(page) {
      this.tableLoading = true
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          this.q
        )
      ).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    //生成代码
    genCode: function (row) {
      this.$confirm(
        '生成“' + row.tableName + '“, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let tableNames = []
        tableNames.push(row.tableName)
        const obj = {"tableName": tableNames, "dsName": this.q.dsName, "serverName": this.q.serverName}
        gen(obj)
          .then(() => {
            this.$notify.success('生成成功')
          })
          .catch(() => {
            this.$notify.error('生成失败')
          })
      })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.refreshChange();
    },
    currentChange(current) {
      this.page.currentPage = current
      this.refreshChange();
    },
    refreshChange() {
      this.getList(this.page)
    },
    selectionChange(item) {
      this.tableNames = []    //每次清空
      item.forEach((items) => {
        this.tableNames.push(items.tableName)
      })

    },
    handleView: function () {
      this.formData.dsName = this.q.dsName
      this.preview.open = true
    },
    gen(form, done) {
      this.formData.dsName = this.q.dsName
      handleDown(this.formData)
        .then(() => {
          done()
          this.box = false
        })
        .catch(() => {
          done()
        })
    },
    getdataSourceList() {
      fetchSelectDsList().then(response => {
        this.dataSourceList = response.data.data
      })
    },
    getServerNameList() {
      fetchServerNameList().then(response => {
        this.serverList = response.data.data
      })
    },
    search() {
      this.getList(this.page)
    },
    openBatch() {
      if (this.tableNames.length < 1) {
        this.$message.error('选中表数量不合法，数量最少1个')
        return false
      }
      const obj = {"tableName": this.tableNames, "dsName": this.q.dsName, "serverName": this.q.serverName}
      gen(obj)
        .then(() => {
          this.$notify.success('生成成功')
        })
        .catch(() => {
          this.$notify.error('生成失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
