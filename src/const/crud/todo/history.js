export const tableOption = {
  border: true,
  index: true,
  menu: false,
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
    fixed: true, label: 'id', prop: 'id', hide: true, span: 24, slot: true
  },
    {
      fixed: true, label: '节点名称', prop: 'nodeName', slot: true, span: 24,
    },

    {
      fixed: true, label: '事项标题', prop: 'itemName', slot: true, search: true, span: 24,
    },

    {
      fixed: true, label: '事项内容', prop: 'itemContent', slot: true, search: true, span: 24,
    },
    {
      fixed: true, label: '审批意见', prop: 'handleRemark', slot: true, span: 24,
    }
  ]
}
