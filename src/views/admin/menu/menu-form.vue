<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog v-model="visible" :title="!form.id ? '新增' : '修改'">
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio-button label="0">菜单</el-radio-button>
              <el-radio-button label="1">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单">
            <el-tree-select
              v-model="form.pid"
              :data="menuOptions"
              :props="{ value: 'id', label: 'name', children: 'children' }"
              value-key="id"
              check-strictly
              default-expand-all
              placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item v-if="form.menuType === '0'" label="图标" prop="icon">
            <avue-input-icon
              v-model="form.icon"
              :icon-list="iconList"
            ></avue-input-icon>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="form.menuType !== '1'"
            label="路由缓冲"
            prop="keepAlive"
          >
            <el-radio-group v-model="form.keepAlive">
              <el-radio-button label="0">否</el-radio-button>
              <el-radio-button label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="名称" prop="menuName">
        <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item v-if="form.menuType !== '1'" label="路由地址" prop="url">
        <el-input v-model="form.url" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item v-if="form.menuType === '1'" label="权限标识" prop="perms">
        <el-input
          v-model="form.perms"
          placeholder="请权限标识"
          maxlength="50"
        />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序" prop="orderNum">
            <el-input-number
              v-model="form.orderNum"
              controls-position="right"
              :min="0"
            />
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
import { addObj, fetchMenuTree, getObj, putObj } from '@/api/admin/menu'
import iconList from '@/const/iconList'

export default {
  name: 'Menu',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单树选项
      menuOptions: [],
      // 是否显示弹出层
      visible: false,
      // 图标
      iconList: iconList,
      form: {
        menuName: undefined,
        url: undefined,
        icon: undefined,
        perms: undefined,
        menuType: '0',
        keepAlive: '0',
        orderNum: 999
      },
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ],
        keepAlive: [
          { required: true, message: '路由缓冲不能为空', trigger: 'blur' }
        ],
        perms: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(isEdit, id) {
      if (id != null) {
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.form.pid === undefined) {
            this.form.pid = '-1'
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
      fetchMenuTree().then(response => {
        this.menuOptions = []
        const menu = { id: '-1', name: '根菜单', children: [] }
        menu.children = response.data.data
        this.menuOptions.push(menu)
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
