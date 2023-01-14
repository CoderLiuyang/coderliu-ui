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
  addBtn: false,
  column: [{
    fixed: true, label: 'id', prop: 'id', span: 24,slot: true
  }, {
    fixed: true, label: '事项标题', prop: 'itemName', slot: true, search: true, span: 24,
  }, {
    fixed: true, label: '事项内容', prop: 'itemContent', slot: true, search: true, span: 24,
  }]
}
