interface IData {
  monthlyIncome: string;
  workHoursPerDay: string;
  workDaysPerMonth: string;
  selectedScale: string;
  currentEarnings: string;
  accumulatedEarnings: string;
  motivationText: string;
  showModal: boolean;
  scaleUnit: string;
  coins: Array<{
    id: number;
    left: number;
    delay: number;
  }>;
}

Page({
  data: {
    monthlyIncome: '',
    workHoursPerDay: '',
    workDaysPerMonth: '',
    selectedScale: 'second',
    currentEarnings: '0.00',
    accumulatedEarnings: '0.00',
    motivationText: '努力工作，创造价值！',
    showModal: false,
    scaleUnit: '秒',
    coins: []
  } as IData,

  timer: null as any,
  baseEarnings: 0,
  startTime: 0,

  onLoad() {
    // 从本地存储加载数据
    const savedData = wx.getStorageSync('earningsData');
    if (savedData) {
      this.setData({
        monthlyIncome: savedData.monthlyIncome,
        workHoursPerDay: savedData.workHoursPerDay,
        workDaysPerMonth: savedData.workDaysPerMonth,
        selectedScale: savedData.selectedScale
      });
      this.calculateEarnings();
      this.startAccumulation();
    }
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  showInputModal() {
    this.setData({ showModal: true });
  },

  hideInputModal() {
    this.setData({ showModal: false });
    // 保存数据到本地存储
    wx.setStorageSync('earningsData', {
      monthlyIncome: this.data.monthlyIncome,
      workHoursPerDay: this.data.workHoursPerDay,
      workDaysPerMonth: this.data.workDaysPerMonth,
      selectedScale: this.data.selectedScale
    });
  },

  onIncomeInput(event: any) {
    this.setData({ monthlyIncome: event.detail });
    this.calculateEarnings();
    this.restartAccumulation();
  },

  onWorkHoursInput(event: any) {
    this.setData({ workHoursPerDay: event.detail });
    this.calculateEarnings();
    this.restartAccumulation();
  },

  onWorkDaysInput(event: any) {
    this.setData({ workDaysPerMonth: event.detail });
    this.calculateEarnings();
    this.restartAccumulation();
  },

  onScaleChange(event: any) {
    const scaleUnitMap = {
      'second': '秒',
      '10second': '10秒',
      'minute': '分钟',
      'hour': '小时'
    };
    this.setData({ 
      selectedScale: event.detail,
      scaleUnit: scaleUnitMap[event.detail]
    });
    this.calculateEarnings();
    this.restartAccumulation();
  },

  calculateEarnings() {
    const { monthlyIncome, workHoursPerDay, workDaysPerMonth, selectedScale } = this.data;
    
    if (!monthlyIncome || !workHoursPerDay || !workDaysPerMonth) {
      return;
    }

    const monthly = parseFloat(monthlyIncome);
    const hoursPerDay = parseFloat(workHoursPerDay);
    const daysPerMonth = parseFloat(workDaysPerMonth);

    if (isNaN(monthly) || isNaN(hoursPerDay) || isNaN(daysPerMonth)) {
      return;
    }

    const hourlyRate = monthly / (hoursPerDay * daysPerMonth);
    let earnings = 0;

    switch (selectedScale) {
      case 'second':
        earnings = hourlyRate / 3600;
        break;
      case '10second':
        earnings = (hourlyRate / 3600) * 10;
        break;
      case 'minute':
        earnings = hourlyRate / 60;
        break;
      case 'hour':
        earnings = hourlyRate;
        break;
    }

    this.baseEarnings = earnings;
    this.setData({
      currentEarnings: earnings.toFixed(2)
    });
  },

  startAccumulation() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.startTime = Date.now();
    const intervalMap = {
      'second': 1000,
      '10second': 10000,
      'minute': 60000,
      'hour': 3600000
    };

    this.timer = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000; // 转换为秒
      const total = this.baseEarnings * elapsed;
      
      this.setData({
        accumulatedEarnings: total.toFixed(2)
      });

      // 添加金币动画
      this.addCoin();
    }, intervalMap[this.data.selectedScale]);
  },

  restartAccumulation() {
    this.startAccumulation();
  },

  addCoin() {
    const coins = this.data.coins;
    const newCoin = {
      id: Date.now(),
      left: Math.random() * 80 + 10, // 10% 到 90% 之间的随机位置
      delay: Math.random() * 0.5 // 0 到 0.5s 的随机延迟
    };

    coins.push(newCoin);
    if (coins.length > 5) {
      coins.shift(); // 保持最多5个金币动画
    }

    this.setData({ coins });

    // 3秒后移除金币
    setTimeout(() => {
      const index = this.data.coins.findIndex(c => c.id === newCoin.id);
      if (index > -1) {
        const coins = this.data.coins;
        coins.splice(index, 1);
        this.setData({ coins });
      }
    }, 3000);
  },

  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        });
      }
    }
  }
}); 