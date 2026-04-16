(function () {
  const STORAGE_KEY = "pocket-tools:todos";
  const REMINDER_POLL_MS = 15000;
  const state = {
    todos: [],
    lastReminder: null
  };

  const todoForm = document.getElementById("todoForm");
  const todoTitle = document.getElementById("todoTitle");
  const reminderType = document.getElementById("reminderType");
  const intervalMinutes = document.getElementById("intervalMinutes");
  const fixedTime = document.getElementById("fixedTime");
  const intervalField = document.getElementById("intervalField");
  const fixedField = document.getElementById("fixedField");
  const resetFormButton = document.getElementById("resetFormButton");
  const permissionPanel = document.getElementById("permissionPanel");
  const permissionText = document.getElementById("permissionText");
  const permissionButton = document.getElementById("permissionButton");
  const todoList = document.getElementById("todoList");
  const pendingCount = document.getElementById("pendingCount");
  const completedCount = document.getElementById("completedCount");
  const reminderCount = document.getElementById("reminderCount");
  const nextReminder = document.getElementById("nextReminder");
  const todoCounter = document.getElementById("todoCounter");
  const lastReminderCard = document.getElementById("lastReminderCard");
  const lastReminderTitle = document.getElementById("lastReminderTitle");
  const lastReminderText = document.getElementById("lastReminderText");
  const reminderModal = document.getElementById("reminderModal");
  const reminderModalTitle = document.getElementById("reminderModalTitle");
  const reminderModalText = document.getElementById("reminderModalText");
  const reminderModalButton = document.getElementById("reminderModalButton");

  state.todos = loadTodos();
  updateFixedTimeMin();
  bindEvents();
  render();
  syncPermissionPanel();
  checkReminders();

  // 使用轮询而不是单个 timeout，避免刷新页面后丢失提醒状态。
  window.setInterval(checkReminders, REMINDER_POLL_MS);

  function bindEvents() {
    todoForm.addEventListener("submit", handleCreateTodo);
    resetFormButton.addEventListener("click", resetForm);
    reminderType.addEventListener("change", handleReminderTypeChange);
    permissionButton.addEventListener("click", requestNotificationPermission);
    todoList.addEventListener("click", handleTodoListClick);
    reminderModalButton.addEventListener("click", closeReminderModal);

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        updateFixedTimeMin();
        checkReminders();
        render();
      }
    });
  }

  function loadTodos() {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);
      const parsedTodos = rawValue ? JSON.parse(rawValue) : [];

      // 统一补齐缺失字段，兼容后续结构调整。
      return parsedTodos.map(normalizeTodo);
    } catch (error) {
      console.warn("读取待办数据失败:", error);
      return [];
    }
  }

  function normalizeTodo(rawTodo) {
    const reminder = rawTodo.reminder || {};

    return {
      id: rawTodo.id || String(Date.now()),
      title: rawTodo.title || "",
      // 兼容旧版本已有的说明字段，当前界面不再展示和新增说明。
      description: rawTodo.description || "",
      completed: Boolean(rawTodo.completed),
      createdAt: Number(rawTodo.createdAt) || Date.now(),
      completedAt: rawTodo.completedAt ? Number(rawTodo.completedAt) : null,
      reminder: {
        type: reminder.type || "none",
        intervalMinutes: reminder.intervalMinutes ? Number(reminder.intervalMinutes) : null,
        fixedAt: reminder.fixedAt ? Number(reminder.fixedAt) : null,
        lastTriggeredAt: reminder.lastTriggeredAt ? Number(reminder.lastTriggeredAt) : null,
        fixedTriggered: Boolean(reminder.fixedTriggered)
      }
    };
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
  }

  function handleCreateTodo(event) {
    event.preventDefault();

    const title = todoTitle.value.trim();

    if (!title) {
      todoTitle.focus();
      return;
    }

    const reminderConfig = buildReminderConfig();

    if (!reminderConfig) {
      return;
    }

    state.todos.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      title: title,
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
      reminder: reminderConfig
    });

    saveTodos();
    resetForm();
    render();
    checkReminders();
  }

  function buildReminderConfig() {
    if (reminderType.value === "none") {
      return {
        type: "none",
        intervalMinutes: null,
        fixedAt: null,
        lastTriggeredAt: null,
        fixedTriggered: false
      };
    }

    if (reminderType.value === "interval") {
      const interval = Number(intervalMinutes.value);

      if (!Number.isInteger(interval) || interval < 1) {
        intervalMinutes.focus();
        return null;
      }

      return {
        type: "interval",
        intervalMinutes: interval,
        fixedAt: null,
        lastTriggeredAt: null,
        fixedTriggered: false
      };
    }

    const fixedTimestamp = new Date(fixedTime.value).getTime();

    if (!fixedTime.value || Number.isNaN(fixedTimestamp)) {
      fixedTime.focus();
      return null;
    }

    if (fixedTimestamp < Date.now()) {
      fixedTime.focus();
      return null;
    }

    return {
      type: "fixed",
      intervalMinutes: null,
      fixedAt: fixedTimestamp,
      lastTriggeredAt: null,
      fixedTriggered: false
    };
  }

  function resetForm() {
    todoForm.reset();
    reminderType.value = "none";
    intervalMinutes.value = "";
    fixedTime.value = "";
    updateFixedTimeMin();
    handleReminderTypeChange();
    todoTitle.focus();
  }

  function handleReminderTypeChange() {
    const currentType = reminderType.value;

    intervalField.classList.toggle("is-visible", currentType === "interval");
    fixedField.classList.toggle("is-visible", currentType === "fixed");
  }

  function handleTodoListClick(event) {
    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) {
      return;
    }

    const todoId = actionButton.dataset.id;
    const action = actionButton.dataset.action;

    if (action === "toggle") {
      toggleTodo(todoId);
      return;
    }

    if (action === "delete") {
      deleteTodo(todoId);
    }
  }

  function toggleTodo(todoId) {
    state.todos = state.todos.map(function (todo) {
      if (todo.id !== todoId) {
        return todo;
      }

      return {
        ...todo,
        completed: !todo.completed,
        completedAt: todo.completed ? null : Date.now()
      };
    });

    saveTodos();
    render();
  }

  function deleteTodo(todoId) {
    state.todos = state.todos.filter(function (todo) {
      return todo.id !== todoId;
    });

    saveTodos();
    render();
  }

  function render() {
    renderMetrics();
    renderLastReminder();
    renderTodoList();
    syncPermissionPanel();
  }

  function renderMetrics() {
    const pendingTodos = state.todos.filter(function (todo) {
      return !todo.completed;
    });
    const completedTodos = state.todos.filter(function (todo) {
      return todo.completed;
    });
    const enabledReminders = pendingTodos.filter(function (todo) {
      return todo.reminder.type !== "none";
    });
    const nextReminderTodo = getSoonestReminderTodo(pendingTodos);

    pendingCount.textContent = String(pendingTodos.length);
    completedCount.textContent = String(completedTodos.length);
    reminderCount.textContent = String(enabledReminders.length);
    todoCounter.textContent = `${state.todos.length} 条`;
    nextReminder.textContent = nextReminderTodo
      ? formatReminderMoment(getNextReminderAt(nextReminderTodo))
      : "暂无";
  }

  function renderLastReminder() {
    if (!state.lastReminder) {
      lastReminderCard.hidden = true;
      return;
    }

    lastReminderCard.hidden = false;
    lastReminderTitle.textContent = "最近提醒";
    lastReminderText.textContent = `${state.lastReminder.message} ${formatReminderMoment(
      state.lastReminder.at
    )}`;
  }

  function renderTodoList() {
    if (!state.todos.length) {
      todoList.innerHTML = [
        '<section class="card empty-state">',
        "  <strong>还没有待办</strong>",
        '  <p class="muted">先在左侧写下一条事项，再决定要不要开启提醒。</p>',
        "</section>"
      ].join("");
      return;
    }

    const sortedTodos = state.todos.slice().sort(compareTodos);

    todoList.innerHTML = sortedTodos
      .map(function (todo) {
        const toggleLabel = todo.completed ? "已完成" : "待处理";
        const reminderChip = getReminderChipText(todo);
        const reminderNote = getReminderNote(todo);
        const titleClass = todo.completed ? "todo-title is-completed" : "todo-title";
        const toggleClass = todo.completed ? "todo-toggle is-completed" : "todo-toggle";

        return [
          '<article class="todo-item card">',
          `  <button aria-label="${todo.completed ? "取消完成" : "标记完成"}" class="${toggleClass}" data-action="toggle" data-id="${todo.id}" type="button">`,
          `    ${todo.completed ? "✓" : "○"}`,
          "  </button>",
          '  <div class="todo-main">',
          '    <div class="todo-headline">',
          '      <div class="todo-title-wrap">',
          `        <h2 class="${titleClass}">${escapeHtml(todo.title)}</h2>`,
          "      </div>",
          `      <button class="todo-delete" data-action="delete" data-id="${todo.id}" type="button">删除</button>`,
          "    </div>",
          '    <div class="todo-meta">',
          `      <span class="chip">${toggleLabel}</span>`,
          `      <span class="chip">${reminderChip}</span>`,
          "    </div>",
          `    <p class="todo-note">${reminderNote}</p>`,
          '    <div class="todo-actions">',
          `      <button class="button button-secondary" data-action="toggle" data-id="${todo.id}" type="button">${todo.completed ? "恢复待办" : "完成待办"}</button>`,
          "    </div>",
          "  </div>",
          "</article>"
        ].join("");
      })
      .join("");
  }

  function compareTodos(leftTodo, rightTodo) {
    if (leftTodo.completed !== rightTodo.completed) {
      return leftTodo.completed ? 1 : -1;
    }

    return rightTodo.createdAt - leftTodo.createdAt;
  }

  function getReminderChipText(todo) {
    if (todo.reminder.type === "interval") {
      return `每 ${todo.reminder.intervalMinutes} 分钟提醒`;
    }

    if (todo.reminder.type === "fixed") {
      return "固定时间提醒";
    }

    return "不提醒";
  }

  function getReminderNote(todo) {
    if (todo.completed && todo.completedAt) {
      return `已于 ${formatReminderMoment(todo.completedAt)} 完成`;
    }

    if (todo.reminder.type === "interval") {
      return `创建于 ${formatReminderMoment(todo.createdAt)}，下次提醒 ${formatReminderMoment(
        getNextReminderAt(todo)
      )}`;
    }

    if (todo.reminder.type === "fixed") {
      if (todo.reminder.fixedTriggered) {
        return `固定提醒已于 ${formatReminderMoment(todo.reminder.fixedAt)} 触发`;
      }

      return `固定提醒时间：${formatReminderMoment(todo.reminder.fixedAt)}`;
    }

    return `创建于 ${formatReminderMoment(todo.createdAt)}`;
  }

  function getSoonestReminderTodo(todos) {
    return todos
      .filter(function (todo) {
        return todo.reminder.type !== "none";
      })
      .sort(function (leftTodo, rightTodo) {
        return getNextReminderAt(leftTodo) - getNextReminderAt(rightTodo);
      })[0];
  }

  function getNextReminderAt(todo) {
    if (todo.completed || todo.reminder.type === "none") {
      return Number.POSITIVE_INFINITY;
    }

    if (todo.reminder.type === "fixed") {
      return todo.reminder.fixedTriggered ? Number.POSITIVE_INFINITY : todo.reminder.fixedAt;
    }

    const intervalMs = todo.reminder.intervalMinutes * 60 * 1000;
    const baseTimestamp = todo.reminder.lastTriggeredAt || todo.createdAt;
    return baseTimestamp + intervalMs;
  }

  function syncPermissionPanel() {
    const permission = getNotificationPermission();
    const hasReminderTodo = state.todos.some(function (todo) {
      return !todo.completed && todo.reminder.type !== "none";
    });

    if (!hasReminderTodo && permission !== "denied" && permission !== "unsupported") {
      permissionPanel.classList.remove("is-visible");
      return;
    }

    permissionPanel.classList.add("is-visible");

    if (permission === "unsupported") {
      permissionText.textContent = "当前浏览器不支持系统通知，提醒将只在页面内弹出。";
      permissionButton.style.display = "none";
      return;
    }

    if (permission === "granted") {
      permissionText.textContent = "浏览器通知已开启，提醒到点时会发送系统通知。";
      permissionButton.style.display = "none";
      return;
    }

    if (permission === "denied") {
      permissionText.textContent = "浏览器通知已被拒绝，提醒只能在当前页面内弹出。";
      permissionButton.style.display = "none";
      return;
    }

    permissionText.textContent = "开启浏览器通知后，提醒会在到点时弹出系统通知。";
    permissionButton.style.display = "inline-flex";
  }

  async function requestNotificationPermission() {
    if (!("Notification" in window)) {
      syncPermissionPanel();
      return;
    }

    await Notification.requestPermission();
    syncPermissionPanel();
  }

  function getNotificationPermission() {
    if (!("Notification" in window)) {
      return "unsupported";
    }

    return Notification.permission;
  }

  function checkReminders() {
    const now = Date.now();
    let hasChange = false;

    state.todos = state.todos.map(function (todo) {
      if (todo.completed || todo.reminder.type === "none") {
        return todo;
      }

      if (todo.reminder.type === "fixed") {
        if (!todo.reminder.fixedTriggered && now >= todo.reminder.fixedAt) {
          hasChange = true;
          triggerReminder(todo);

          return {
            ...todo,
            reminder: {
              ...todo.reminder,
              fixedTriggered: true,
              lastTriggeredAt: now
            }
          };
        }

        return todo;
      }

      const nextReminderAt = getNextReminderAt(todo);

      if (now >= nextReminderAt) {
        hasChange = true;
        triggerReminder(todo);

        return {
          ...todo,
          reminder: {
            ...todo.reminder,
            lastTriggeredAt: now
          }
        };
      }

      return todo;
    });

    if (hasChange) {
      saveTodos();
      render();
    }
  }

  function triggerReminder(todo) {
    const message =
      todo.reminder.type === "interval"
        ? `事项“${todo.title}”到了间隔提醒时间。`
        : `事项“${todo.title}”到了固定提醒时间。`;

    state.lastReminder = {
      message: message,
      at: Date.now()
    };

    // 系统通知失败时，退化为页面内弹层提醒，避免提醒完全丢失。
    sendBrowserNotification("待办提醒", message);
    openReminderModal("待办提醒", message);
    playReminderTone();
  }

  function sendBrowserNotification(title, body) {
    if (getNotificationPermission() !== "granted") {
      return;
    }

    const notification = new Notification(title, {
      body: body,
      tag: "pocket-tools-todos",
      requireInteraction: true
    });

    notification.onclick = function () {
      window.focus();
      notification.close();
    };
  }

  function openReminderModal(title, message) {
    reminderModalTitle.textContent = title;
    reminderModalText.textContent = message;
    reminderModal.classList.add("is-open");
    reminderModal.setAttribute("aria-hidden", "false");
  }

  function closeReminderModal() {
    reminderModal.classList.remove("is-open");
    reminderModal.setAttribute("aria-hidden", "true");
  }

  function playReminderTone() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    const audioContext = new AudioContext();
    const frequencies = [660, 880];

    frequencies.forEach(function (frequency, index) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const startAt = audioContext.currentTime + index * 0.18;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.2, startAt);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startAt + 0.28);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.3);
    });
  }

  function updateFixedTimeMin() {
    // 固定提醒不允许选择过去时间，避免创建后立即误触发。
    fixedTime.min = getDatetimeLocalValue(new Date());
  }

  function getDatetimeLocalValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function formatReminderMoment(timestamp) {
    if (!Number.isFinite(timestamp)) {
      return "暂无";
    }

    return new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(timestamp));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
