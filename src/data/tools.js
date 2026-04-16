(function () {
  window.PocketTools = window.PocketTools || {};
  window.PocketTools.tools = [
    {
      id: "pomodoro",
      name: "番茄时钟",
      description: "专注、短休息、长休息，一键进入节奏。",
      path: "tools/pomodoro/index.html",
      icon: "assets/icons/focus.svg",
      status: "ready",
      statusLabel: "可使用"
    },
    {
      id: "clock",
      name: "时间显示",
      description: "大字号数字时间，适合电脑桌面或副屏查看。",
      path: "tools/clock/index.html",
      icon: "assets/icons/clock.svg",
      status: "ready",
      statusLabel: "可使用"
    },
    {
      id: "todos",
      name: "待办记录",
      description: "快速记录事项，并按固定时间或分钟间隔提醒。",
      path: "tools/todos/index.html",
      icon: "assets/icons/todo.svg",
      status: "ready",
      statusLabel: "可使用"
    }
  ];
})();
