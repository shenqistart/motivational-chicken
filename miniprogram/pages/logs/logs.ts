// logs.ts
const util = require('../../utils/util')

Component({
  data: {
    logs: [],
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        logs: (wx.getStorageSync('logs') || []).map((log: string) => {
          return {
            date: util.formatTime(new Date(log)),
            timeStamp: log
          }
        }),
      })
    }
  },
})
