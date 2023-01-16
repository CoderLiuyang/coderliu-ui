<template>
  <div class="user">
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="form"
        v-model:page="page"
        :option="option"
        :table-loading="listLoading"
        :data="list"
        @on-load="getList"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-change="handleFilter"
        @refresh-change="handleRefreshChange">
      </avue-crud>
    </basic-container>
  </div>


</template>

<script>
import {fetchList} from '@/api/todo/history'
import {tableOption} from '@/const/crud/todo/history'
import {mapGetters} from 'vuex'

export default {
  name: 'history_model',
  data() {
    return {
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false //是否倒序npom
      },
      query: {},
      list: [],
      listLoading: true,
      post: [],
      role: [],
      form: {},
      postOptions: [],
      rolesOptions: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getList(page, params) {
      this.listLoading = true
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then(response => {
        this.list = response.data.data.records
        console.table(this.list)
        this.page.total = response.data.data.total
        this.listLoading = false
      })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    handleFilter(param, done) {
      this.query = param
      this.page.currentPage = 1
      this.getList(this.page, param)
      done()
    },
    handleRefreshChange() {
      this.getList(this.page)
    }
  }
}
</script>
