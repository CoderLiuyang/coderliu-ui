export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  indexWidth: 60,
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  dialogWidth: '50%',
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: true,
  column: [{
    fixed: true, label: 'id', prop: 'id', span: 24, slot: true, hide: true, editDisplay: false,
    addDisplay: false
  }, {
    fixed: true, label: '流程名称', prop: 'name', slot: true, search: true, span: 24,
  }, {
    fixed: true, label: '流程key', prop: 'key', slot: true, search: true, span: 24,
  }, {
    fixed: true, label: '创建时间', prop: 'createTime', slot: true, span: 24
  }]
}
