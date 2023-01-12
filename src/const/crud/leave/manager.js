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
    fixed: true, label: 'id', prop: 'id', span: 24, slot: true, hide: true, editDisplay: false, addDisplay: false
  }, {
    fixed: true, label: '请假标题', prop: 'title', slot: true, search: true
  }, {
    fixed: true, label: '请假原因', prop: 'reason', slot: true, search: true
  }
    // , {
    //   label: '开始时间',
    //   prop: 'realityStartTime',
    //   type: "date",
    //   valueFormat: 'yyyy-MM-dd'
    // }, {
    //   label: '结束时间', prop: 'realityEndTime', slot: true, span: 24, type: "date",
    //   valueFormat: 'yyyy-MM-dd',
    //
    // }
  ]
}

export const option = {
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
    fixed: true, label: 'id', prop: 'id', span: 24, slot: true, hide: true, editDisplay: false, addDisplay: false
  }, {
    fixed: true, label: '请假标题', prop: 'title', slot: true, search: true, span: 24,
  }, {
    fixed: true, label: '请假原因', prop: 'reason', slot: true, search: true, span: 24,
  }, {
    label: '开始时间', prop: 'realityStartTime', type: "date", valueFormat: 'yyyy-MM-dd'
  }, {
    label: '结束时间', prop: 'realityEndTime', slot: true, span: 24, type: "date", valueFormat: 'yyyy-MM-dd',

  }]
}
