/*
 * @Description: 时钟
 * @Author: lxd
 * @Date: 2021-01-28 11:10:27
 * @LastEditors: lxd
 * @LastEditTime: 2021-01-28 11:29:06
 */
// 时钟
day_arr = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
month_arr = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const clockd = {
  indicate: true,
  indicate_color: '#fff',
  dial1_color: '#fff',
  dial2_color: '#fff',
  dial3_color: '#fff',
  time_24h: true,
  bg_color: '#000'
}
const c = document.getElementById('clock')
const cns = c.getContext('2d')
clock_norm(200, cns, clockd)
function clock_norm(size, cns, clockd) {
  var br = [60, 120, 180]
  var r2 = [10, 20, 30]
  var r3 = [40, 80, 120]
  var r4 = [4, 5, 7]

  cns.clearRect(0, 0, size, size)

  cns.beginPath()
  if (clockd.hasOwnProperty('bg_color')) {
    cns.fillStyle = clockd['bg_color']
  } else {
    cns.fillStyle = '#fff'
  }
  cns.rect(0, 0, size, size)
  cns.fill()
  cns.closePath()
  if (clockd.hasOwnProperty('bgLoaded') && clockd.bgLoaded == 1) {
    if (clockd.hasOwnProperty('bg_opacity')) {
      cns.globalAlpha = clockd['bg_opacity']
      cns.drawImage(clockd.bgImage, 0, 0, size, size)
      cns.globalAlpha = 1
    }
  }

  // 绘制钟表
  if (
    (clockd.hasOwnProperty('indicate') && clockd.indicate == true) ||
    !clockd.hasOwnProperty('indicate')
  ) {
    indicator(size, cns, clockd)
  }

  var now = new Date()
  var time_off = clockd.hasOwnProperty('timeoffset') ? clockd['timeoffset'] : 0
  now.setTime(now.getTime() + time_off * 1000)
  var milisec = now.getMilliseconds()
  var sec = now.getSeconds()
  var min = now.getMinutes()
  var hour = now.getHours() % 12

  // 绘制秒针
  cns.fillStyle = clockd.hasOwnProperty('dial1_color')
    ? clockd['dial1_color']
    : '#333333'
  cns.strokeStyle = clockd.hasOwnProperty('dial1_color')
    ? clockd['dial1_color']
    : '#333333'
  cns.lineCap = 'round'

  cns.beginPath()
  cns.lineWidth = 1
  cns.moveTo(size / 2, size / 2)
  cns.arc(
    size / 2,
    size / 2,
    size / 3.5,
    -1.57 + sec * 0.1046,
    -1.569 + sec * 0.1046,
    0
  )
  cns.stroke()
  cns.closePath()

  // 绘制秒针屁股
  cns.beginPath()
  cns.lineWidth = 1
  cns.moveTo(size / 2, size / 2)
  cns.arc(
    size / 2,
    size / 2,
    size / 15,
    1.57 + sec * 0.1046,
    1.569 + sec * 0.1046,
    1
  )
  cns.stroke()
  cns.closePath()

  // 绘制分针
  cns.fillStyle = clockd.hasOwnProperty('dial2_color')
    ? clockd['dial2_color']
    : '#333333'
  cns.strokeStyle = clockd.hasOwnProperty('dial2_color')
    ? clockd['dial2_color']
    : '#333333'
  cns.lineCap = 'round'

  cns.beginPath()
  cns.lineWidth = 2
  cns.moveTo(size / 2, size / 2)
  cns.arc(
    size / 2,
    size / 2,
    size / 4,
    -1.57 + min * 0.1046,
    -1.569 + min * 0.1046,
    0
  )
  cns.stroke()
  cns.closePath()

  // 绘制时针
  cns.fillStyle = clockd.hasOwnProperty('dial3_color')
    ? clockd['dial3_color']
    : '#333333'
  cns.strokeStyle = clockd.hasOwnProperty('dial3_color')
    ? clockd['dial3_color']
    : '#333333'
  cns.lineCap = 'round'

  cns.beginPath()
  cns.lineWidth = 3
  cns.moveTo(size / 2, size / 2)
  cns.arc(
    size / 2,
    size / 2,
    size / 6,
    -1.57 + hour * 0.523 + (min / 60) * 0.523,
    -1.569 + hour * 0.523 + (min / 60) * 0.523,
    0
  )
  cns.stroke()
  cns.closePath()

  // 绘制中心圆点
  cns.fillStyle = clockd.hasOwnProperty('dial1_color')
    ? clockd['dial1_color']
    : '#333333'
  cns.strokeStyle = clockd.hasOwnProperty('dial1_color')
    ? clockd['dial1_color']
    : '#333333'
  cns.lineCap = 'round'

  cns.beginPath()
  cns.lineWidth = 2
  cns.arc(size / 2, size / 2, size / 60, 0, 6.28, 0)
  cns.fill()
  cns.closePath()

  clockd.timer = setTimeout(function () {
    clock_norm(size, cns, clockd)
  }, 50)
}
function indicator(size, cns, clockd) {
  if (clockd.hasOwnProperty('indicate_color')) {
    cns.strokeStyle = clockd['indicate_color']
  } else {
    cns.strokeStyle = '#333'
  }
  cns.lineWidth = 2

  for (var a = 0; a < 12; a++) {
    var r = parseInt(a) * 0.523
    var calc = Math.cos(r - 1.57)
    var y = Math.sin(r - 1.57)

    if (a % 3 == 0) {
      var ekstra = size / 50
    } else {
      var ekstra = 0
    }
    cns.beginPath()
    cns.moveTo(
      calc * (size / 3 + ekstra) + size / 2,
      y * (size / 3 + ekstra) + size / 2
    )
    cns.lineTo((calc * size) / 3.25 + size / 2, (y * size) / 3.25 + size / 2)
    cns.stroke()
    cns.fill()
    cns.closePath()
  }
}
