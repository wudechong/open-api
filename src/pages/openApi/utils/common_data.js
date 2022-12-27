import {http} from "calf-vue"

const api = {
  // 供应商
  getSupplier (options = {}) {
    return http.post('/calf/basic/widget/supplier/query', {
      statuses: [0, 1],
      ...options
    })
  },
  // 供应商分组
  getSupplierGroup () {
	return http.post('/calf/basic/widget/supplier/dropdown/group')
  },
  // 业务员
  getSalesman () {
    return http.post('/calf/basic/widget/user/salesman/dropdown', {})
  },
  // 仓库
  getWarehouse () {
    return http.get('/calf/basic/widget/warehouse/dropdown/group')
  },
  // 判断是否管理员
  isAdmin () {
    return http.get('/calf/basic/widget/permission/check/admin')
  },
  // 是否开启审核
  isApprove () {
    return http.get('/service/erp/purchase/open/approve')
  },
  // 币种
  getCurrency () {
    return http.get('/calf/basic/widget/currency/query')
  },
   // 查询金额保留小数精度
   getPricePrecision () {
    return http.get('/service/erp/purchase/get/decimal')
  },
  // 查询数量保留小数精度
  getNumPrecision () {
    return http.get('/calf/basic/widget/switch/numdigit/query', {switchID: 510})
  },
  /** 收支账户 */
  accountList () {
    return http.get('/calf/basic/widget/finance/account/activate')
  },

  // 查询区别供应商组件开关
  getSupplierByGroup () {
	return http.get('/calf/basic/widget/switch/query', { switchID: 512})
  },

  /**供应商管理是否开启审核 */
  isApproveSupplierManage(){
	return http.get('/service/erp/purchase/supplier/open/approve')
  }

 
}

export default api
