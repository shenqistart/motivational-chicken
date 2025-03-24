Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconClass: "icon-home"
      },
      {
        pagePath: "/pages/earnings/earnings",
        text: "收益",
        iconClass: "icon-earnings"
      },
      {
        pagePath: "/pages/logs/logs",
        text: "日志",
        iconClass: "icon-log"
      }
    ]
  },
  methods: {
    switchTab(e: any) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    }
  }
}); 