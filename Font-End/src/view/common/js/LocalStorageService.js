const localstorage = window.localStorage

export const LocalStorageService = {
  set: (key, value) => {
    localstorage.setItem(key, JSON.stringify(value))
  },

  get: (key) => {
    return JSON.parse(localstorage.getItem(key))
  },

  remove: (key) => {
    localstorage.removeItem(key)
  }
}
