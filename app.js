App({
  onLaunch() {
    const todos = wx.getStorageSync('todos') || []
    this.globalData.todos = todos
  },
  globalData: {
    todos: []
  },
  saveTodos(todos) {
    this.globalData.todos = todos
    wx.setStorageSync('todos', todos)
  }
})
