import Vue from 'vue'
import { mergeRecursive } from "@/util";
import DictMeta from './DictMeta'
import DictData from './DictData'

const DEFAULT_DICT_OPTIONS = {
  types: [],
}

/**
 * @classdesc 字典
 * @property {Object} label 标签对象，内部属性名为字典类型名称
 * @property {Object} dict 字段数组，内部属性名为字典类型名称
 * @property {Array.<DictMeta>} _dictMetas 字典元数据数组
 */
export default class Dict {
  constructor() {
    this.owner = null
    this.label = {}
    this.type = {}
  }

  init(options) {
    if (options instanceof Array) {
      options = { types: options }
    }
    const opts = mergeRecursive(DEFAULT_DICT_OPTIONS, options)
    if (opts.types === undefined) {
      throw new Error('字典类型为空')
    }
    const ps = []
    this._dictMetas = opts.types.map(t => DictMeta.parse(t))
    this._dictMetas.forEach(dictMeta => {
      const type = dictMeta.type
      Vue.set(this.label, type, {})
      Vue.set(this.type, type, [])
      if (dictMeta.lazy) {
        return
      }
      ps.push(loadDict(this, dictMeta))
    })
    return Promise.all(ps)
  }

}

/**
 * 加载字典
 * @param {Dict} dict 字典
 * @param {DictMeta} dictMeta 字典元数据
 * @returns {Promise}
 */
function loadDict(dict, dictMeta) {
  return dictMeta.request(dictMeta)
    .then(response => {
      const type = dictMeta.type
      let dicts = dictMeta.responseConverter(response, dictMeta)
      if (!(dicts instanceof Array)) {
        console.error('the return of responseConverter must be Array.<DictResolver>')
        dicts = []
      } else if (dicts.filter(d => d instanceof DictData).length !== dicts.length) {
        console.error('the type of elements in dicts must be DictResolver')
        dicts = []
      }
      dict.type[type].splice(0, Number.MAX_SAFE_INTEGER, ...dicts)
      dicts.forEach(d => {
        Vue.set(dict.label[type], d.value, d.label)
      })
      return dicts
    })
}
