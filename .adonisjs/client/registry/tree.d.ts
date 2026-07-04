/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
    crash: typeof routes['users.crash']
  }
  products: {
    index: typeof routes['products.index']
    show: typeof routes['products.show']
    store: typeof routes['products.store']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  store: {
    topProducts: typeof routes['store.top_products']
    restockAlerts: typeof routes['store.restock_alerts']
    revenue: typeof routes['store.revenue']
    silentCustomers: typeof routes['store.silent_customers']
    categoryRatings: typeof routes['store.category_ratings']
  }
}
