import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'users.index': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.crash': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'store.top_products': { paramsTuple?: []; params?: {} }
    'store.restock_alerts': { paramsTuple?: []; params?: {} }
    'store.revenue': { paramsTuple?: []; params?: {} }
    'store.silent_customers': { paramsTuple?: []; params?: {} }
    'store.category_ratings': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'users.index': { paramsTuple?: []; params?: {} }
    'users.crash': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'store.top_products': { paramsTuple?: []; params?: {} }
    'store.restock_alerts': { paramsTuple?: []; params?: {} }
    'store.revenue': { paramsTuple?: []; params?: {} }
    'store.silent_customers': { paramsTuple?: []; params?: {} }
    'store.category_ratings': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'users.index': { paramsTuple?: []; params?: {} }
    'users.crash': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'store.top_products': { paramsTuple?: []; params?: {} }
    'store.restock_alerts': { paramsTuple?: []; params?: {} }
    'store.revenue': { paramsTuple?: []; params?: {} }
    'store.silent_customers': { paramsTuple?: []; params?: {} }
    'store.category_ratings': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'users.store': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}