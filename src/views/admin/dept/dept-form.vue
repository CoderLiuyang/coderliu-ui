<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog
    v-model="visible"
    :title="!form.id ? '新增': '修改'">
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="上级部门">
            <el-tree-select
              v-model="form.pid"
              :data="deptOptions"
              :props="{ value: 'id', label: 'name', children: 'children' }"
              value-key="id"
              check-strictly
              default-expand-all
              placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { addObj, fetchTree, getObj, putObj } from '@/api/admin/dept'

export default {
  name: 'DeptForm',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单树选项
      deptOptions: [],
      // 是否显示弹出层
      visible: false,
      form: {
        deptName: undefined,
        orderNum: 999
      },
      // 表单校验
      rules: {
        deptName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(isEdit, id) {
      if (id !== null) {
        this.form.pid = id
      }
      this.visible = true
      this.getTreeselect()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (isEdit) {
          getObj(id).then(response => {
            this.form = response.data.data
          })
        } else {
          this.form.id = undefined
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.form.pid === undefined) {
            this.form.pid = '0'
          }

          if (this.form.id) {
            putObj(this.form).then(data => {
              this.$message.success('修改成功')
              this.visible = false
              this.$emit('refreshDataList')
            })
          } else {
            addObj(this.form).then(data => {
              this.$message.success('添加成功')
              this.visible = false
              this.$emit('refreshDataList')
            })
          }
        }
      })
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      fetchTree().then(response => {
        this.deptOptions = []
        const dept = { id: '-1', name: '根部门', children: response.data.data }
        this.deptOptions.push(dept)
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }

      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>
