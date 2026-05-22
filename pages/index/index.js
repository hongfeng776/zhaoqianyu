const app = getApp()

Page({
  data: {
    todos: [],
    inputValue: '',
    filter: 'all',
    showEmpty: false
  },

  onLoad() {
    this.loadTodos()
  },

  onShow() {
    this.loadTodos()
  },

  loadTodos() {
    const todos = app.globalData.todos || []
    this.setData({ todos })
    this.checkEmpty()
  },

  checkEmpty() {
    const filteredTodos = this.getFilteredTodos()
    this.setData({ showEmpty: filteredTodos.length === 0 })
  },

  getFilteredTodos() {
    const { todos, filter } = this.data
    if (filter === 'active') return todos.filter(t => !t.done)
    if (filter === 'completed') return todos.filter(t => t.done)
    return todos
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  addTodo() {
    const { inputValue, todos } = this.data
    if (!inputValue.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      done: false,
      createdAt: new Date().toLocaleString()
    }

    const updatedTodos = [newTodo, ...todos]
    app.saveTodos(updatedTodos)
    this.setData({
      todos: updatedTodos,
      inputValue: ''
    })
    this.checkEmpty()
    wx.showToast({ title: '添加成功', icon: 'success', duration: 800 })
  },

  toggleTodo(e) {
    const { id } = e.currentTarget.dataset
    const { todos } = this.data
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
    app.saveTodos(updatedTodos)
    this.setData({ todos: updatedTodos })
    this.checkEmpty()
  },

  deleteTodo(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定删除这条待办吗？',
      success: (res) => {
        if (res.confirm) {
          const { todos } = this.data
          const updatedTodos = todos.filter(todo => todo.id !== id)
          app.saveTodos(updatedTodos)
          this.setData({ todos: updatedTodos })
          this.checkEmpty()
          wx.showToast({ title: '已删除', icon: 'none', duration: 800 })
        }
      }
    })
  },

  setFilter(e) {
    const { filter } = e.currentTarget.dataset
    this.setData({ filter })
    this.checkEmpty()
  },

  clearCompleted() {
    const { todos } = this.data
    const completedCount = todos.filter(t => t.done).length
    if (completedCount === 0) {
      wx.showToast({ title: '没有已完成的任务', icon: 'none' })
      return
    }

    wx.showModal({
      title: '提示',
      content: `确定清除 ${completedCount} 条已完成的任务吗？`,
      success: (res) => {
        if (res.confirm) {
          const updatedTodos = todos.filter(t => !t.done)
          app.saveTodos(updatedTodos)
          this.setData({ todos: updatedTodos })
          this.checkEmpty()
          wx.showToast({ title: '已清除', icon: 'none', duration: 800 })
        }
      }
    })
  }
})
