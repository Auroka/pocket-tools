(function () {
  const STORAGE_KEY = "pocket-tools:nasdaq-entry-backtest";
  const CHART_WIDTH = 1000;
  const CHART_HEIGHT = 440;
  const PADDING = {
    top: 28,
    right: 32,
    bottom: 48,
    left: 62
  };
  const PYRAMID_RULES = [
    { threshold: 10, parts: 1 },
    { threshold: 15, parts: 2 },
    { threshold: 20, parts: 2 },
    { threshold: 30, parts: 3 },
    { threshold: 40, parts: 2 }
  ];
  const PYRAMID_TOTAL_PARTS = PYRAMID_RULES.reduce(function (total, rule) {
    return total + rule.parts;
  }, 0);
  const DATA_TEXT = [
    "1986-01-31:132.93|1986-02-28:140.43|1986-03-31:148.86|1986-04-30:154.91|1986-05-30:163.16|1986-06-30:162.62|1986-07-31:144.52|1986-08-29:151.70|1986-09-30:137.50|1986-10-31:144.48|1986-11-28:147.94|1986-12-31:141.41|1987-01-30:166.68|1987-02-27:182.75|1987-03-31:186.04|1987-04-30:184.83|1987-05-29:188.77|1987-06-30:189.24|1987-07-31:196.35|1987-08-31:209.57|1987-09-30:205.50|1987-10-30:150.07|1987-11-30:137.13|1987-12-31:156.25|1988-01-29:159.13|1988-02-29:172.64|1988-03-31:173.26|1988-04-29:175.92|1988-05-31:173.34|1988-06-30:189.03|1988-07-29:181.16|1988-08-31:171.00|1988-09-30:179.37|1988-10-31:174.78|1988-11-30:169.19|1988-12-30:177.41|1989-01-31:186.47|1989-02-28:183.79|1989-03-31:185.87|1989-04-28:200.47|1989-05-31:214.54|1989-06-30:204.59|1989-07-31:214.28|1989-08-31:222.00|1989-09-29:226.41|1989-10-31:222.62|1989-11-30:224.44|1989-12-29:223.84|1990-01-31:201.94|1990-02-28:207.91|1990-03-30:213.15|1990-04-30:205.81|1990-05-31:236.15|1990-06-29:238.46|1990-07-31:223.38|1990-08-31:193.62|1990-09-28:177.06|1990-10-31:172.56|1990-11-30:192.66|1990-12-31:200.53|1991-01-31:232.43|1991-02-28:250.12|1991-03-28:264.90|1991-04-30:263.65|1991-05-31:279.00|1991-06-28:254.19|1991-07-31:272.15|1991-08-30:287.40|1991-09-30:287.54|1991-10-31:292.50|1991-11-29:284.79|1991-12-31:330.86|1992-01-31:338.31|1992-02-28:345.88|1992-03-31:323.05|1992-04-30:307.86|1992-05-29:315.30|1992-06-30:301.23|1992-07-31:310.89|1992-08-31:299.26|1992-09-30:313.19|1992-10-30:329.15|1992-11-30:350.96|1992-12-31:360.19|1993-01-29:370.56|1993-02-26:351.14|1993-03-31:359.42|1993-04-30:339.95|1993-05-28:368.11|1993-06-30:366.13|1993-07-30:352.87|1993-08-31:372.65|1993-09-30:382.72|1993-10-29:390.99|1993-11-30:386.76|1993-12-31:398.28|1994-01-31:413.99|1994-02-28:412.17|1994-03-31:382.96|1994-04-29:373.25|1994-05-31:378.85|1994-06-30:360.30|1994-07-29:370.16|1994-08-31:397.90|1994-09-30:393.85|1994-10-31:413.05|1994-11-30:404.82|1994-12-30:404.27|1995-01-31:405.33|1995-02-28:432.50|1995-03-31:447.15|1995-04-28:469.56|1995-05-31:488.10|1995-06-30:538.03|1995-07-31:568.88|1995-08-31:576.77|1995-09-29:585.08|1995-10-31:598.78|1995-11-30:593.72|1995-12-29:576.23|1996-01-31:591.82|1996-02-29:622.83|1996-03-29:609.69|1996-04-30:666.73|1996-05-31:692.39|1996-06-28:677.30|1996-07-31:636.01|1996-08-30:663.57|1996-09-30:737.58|1996-10-31:751.99|1996-11-29:834.01|1996-12-31:821.36|1997-01-31:921.55|1997-02-28:850.46|1997-03-31:797.06|1997-04-30:874.74|1997-05-30:958.85|1997-06-30:957.30|1997-07-31:1107.03|1997-08-29:1074.17|1997-09-30:1097.17|1997-10-31:1019.62|1997-11-28:1050.51|1997-12-31:990.80|1998-01-30:1071.13|1998-02-27:1194.13|1998-03-31:1220.66|1998-04-30:1248.12|1998-05-29:1192.07|1998-06-30:1337.34|1998-07-31:1377.26|1998-08-31:1140.34|1998-09-30:1345.48|1998-10-30:1400.52|1998-11-30:1557.96|1998-12-31:1836.01|1999-01-29:2127.19|1999-02-26:1925.28|1999-03-31:2106.39|1999-04-30:2136.39|1999-05-28:2089.70|1999-06-30:2296.77|1999-07-30:2270.93|1999-08-31:2396.87|1999-09-30:2407.90|1999-10-29:2637.44|1999-11-30:2966.71|1999-12-31:3707.83|2000-01-31:3570.05|2000-02-29:4266.94|2000-03-31:4397.84|2000-04-28:3773.18|2000-05-31:3324.08|2000-06-30:3763.79|2000-07-31:3609.35|2000-08-31:4077.59|2000-09-29:3570.61|2000-10-31:3282.30|2000-11-30:2506.54|2000-12-29:2341.70|2001-01-31:2593.00|2001-02-28:1908.32|2001-03-30:1573.25|2001-04-30:1855.15|2001-05-31:1799.89|2001-06-29:1830.19|2001-07-31:1683.61|2001-08-31:1469.70|2001-09-28:1168.37|2001-10-31:1364.78|2001-11-30:1596.05|2001-12-31:1577.05|2002-01-31:1550.17|2002-02-28:1359.22|2002-03-28:1452.81|2002-04-30:1277.07|2002-05-31:1208.36|2002-06-28:1051.41|2002-07-31:962.11|2002-08-30:942.38|2002-09-30:832.52|2002-10-31:989.54|2002-11-29:1116.10|2002-12-31:984.30|2003-01-31:996.04|2003-02-28:1013.34|2003-03-31:1032.91|2003-04-30:1116.85|2003-05-30:1201.25|2003-06-30:1199.83|2003-07-31:1298.81|2003-08-29:1344.74|2003-09-30:1302.26|2003-10-31:1411.76|2003-11-28:1426.76|2003-12-31:1459.06|2004-01-30:1487.78|2004-02-27:1459.91|2004-03-31:1447.95|2004-04-30:1401.36|2004-05-28:1469.23|2004-06-30:1523.48|2004-07-30:1412.00|2004-08-31:1354.10|2004-09-30:1403.89|2004-10-29:1475.56|2004-11-30:1571.11|2004-12-31:1620.31",
    "2005-01-31:1513.06|2005-02-28:1498.17|2005-03-31:1478.66|2005-04-29:1422.42|2005-05-31:1542.63|2005-06-30:1493.52|2005-07-29:1605.14|2005-08-31:1581.71|2005-09-30:1601.66|2005-10-31:1579.18|2005-11-30:1672.56|2005-12-30:1645.20|2006-01-31:1710.75|2006-02-28:1670.57|2006-03-31:1703.66|2006-04-28:1700.71|2006-05-31:1579.58|2006-06-30:1575.23|2006-07-31:1509.43|2006-08-31:1579.73|2006-09-29:1654.13|2006-10-31:1732.54|2006-11-30:1791.25|2006-12-29:1756.90|2007-01-31:1792.28|2007-02-28:1761.65|2007-03-30:1772.36|2007-04-30:1867.75|2007-05-31:1928.19|2007-06-29:1934.10|2007-07-31:1932.06|2007-08-31:1988.73|2007-09-28:2091.11|2007-10-31:2238.98|2007-11-30:2089.10|2007-12-31:2084.93|2008-01-31:1841.42|2008-02-29:1745.27|2008-03-31:1781.93|2008-04-30:1917.70|2008-05-30:2032.57|2008-06-30:1837.09|2008-07-31:1849.15|2008-08-29:1872.54|2008-09-30:1594.63|2008-10-31:1334.78|2008-11-28:1185.75|2008-12-31:1211.65|2009-01-30:1180.25|2009-02-27:1116.99|2009-03-31:1237.01|2009-04-30:1394.33|2009-05-29:1435.57|2009-06-30:1477.25|2009-07-31:1603.36|2009-08-31:1625.19|2009-09-30:1718.99|2009-10-30:1667.13|2009-11-30:1767.43|2009-12-31:1860.31|2010-01-29:1741.04|2010-02-26:1818.68|2010-03-31:1958.34|2010-04-30:2000.63|2010-05-28:1852.39|2010-06-30:1739.14|2010-07-30:1864.00|2010-08-31:1767.43|2010-09-30:1998.04|2010-10-29:2124.45|2010-11-30:2117.33|2010-12-31:2217.86|2011-01-31:2281.91|2011-02-28:2350.99|2011-03-31:2338.99|2011-04-29:2404.08|2011-05-31:2372.54|2011-06-30:2325.07|2011-07-29:2362.81|2011-08-31:2241.01|2011-09-30:2139.18|2011-10-31:2360.08|2011-11-30:2295.20|2011-12-30:2277.83|2012-01-31:2467.95|2012-02-29:2623.10|2012-03-30:2755.27|2012-04-30:2723.68|2012-05-31:2524.87|2012-06-29:2615.72|2012-07-31:2642.53|2012-08-31:2772.24|2012-09-28:2799.19|2012-10-31:2647.92|2012-11-30:2677.88|2012-12-31:2660.93|2013-01-31:2731.53|2013-02-28:2738.58|2013-03-28:2818.69|2013-04-30:2887.44|2013-05-31:2981.76|2013-06-28:2909.60|2013-07-31:3090.19|2013-08-30:3073.81|2013-09-30:3218.20|2013-10-31:3377.73|2013-11-29:3487.82|2013-12-31:3592.00|2014-01-31:3521.92|2014-02-28:3696.10|2014-03-31:3595.74|2014-04-30:3582.02|2014-05-30:3736.82|2014-06-30:3849.48|2014-07-31:3892.50|2014-08-29:4082.56|2014-09-30:4049.44|2014-10-31:4158.21|2014-11-28:4337.78|2014-12-31:4236.28|2015-01-30:4148.43|2015-02-27:4440.67|2015-03-31:4333.69|2015-04-30:4414.25|2015-05-29:4508.25|2015-06-30:4396.76|2015-07-31:4588.91|2015-08-31:4274.58|2015-09-30:4181.06|2015-10-30:4648.83|2015-11-30:4664.51|2015-12-31:4593.27|2016-01-29:4279.17|2016-02-29:4201.12|2016-03-31:4483.66|2016-04-29:4341.30|2016-05-31:4523.89|2016-06-30:4417.70|2016-07-29:4730.23|2016-08-31:4771.05|2016-09-30:4875.70|2016-10-31:4801.27|2016-11-30:4810.81|2016-12-30:4863.62|2017-01-31:5116.77|2017-02-28:5330.31|2017-03-31:5436.23|2017-04-28:5583.53|2017-05-31:5788.80|2017-06-30:5646.92|2017-07-31:5880.33|2017-08-31:5988.60|2017-09-29:5979.30|2017-10-31:6248.56|2017-11-30:6365.56|2017-12-29:6396.42|2018-01-31:6949.99|2018-02-28:6854.42|2018-03-29:6581.13|2018-04-30:6605.57|2018-05-31:6967.73|2018-06-29:7040.80|2018-07-31:7231.98|2018-08-31:7654.55|2018-09-28:7627.65|2018-10-31:6967.10|2018-11-30:6949.01|2018-12-31:6329.96|2019-01-31:6906.84|2019-02-28:7097.53|2019-03-29:7378.77|2019-04-30:7781.46|2019-05-31:7127.96|2019-06-28:7671.07|2019-07-31:7848.78|2019-08-30:7691.00|2019-09-30:7749.45|2019-10-31:8083.83|2019-11-29:8403.68|2019-12-31:8733.07|2020-01-31:8991.51|2020-02-28:8461.83|2020-03-31:7813.50|2020-04-30:9000.51|2020-05-29:9555.52|2020-06-30:10156.85|2020-07-31:10905.88|2020-08-31:12110.70|2020-09-30:11418.06|2020-10-30:11052.95|2020-11-30:12268.32|2020-12-31:12888.28|2021-01-29:12925.38|2021-02-26:12909.44|2021-03-31:13091.44|2021-04-30:13860.76|2021-05-28:13686.51|2021-06-30:14554.80|2021-07-30:14959.90|2021-08-31:15582.51|2021-09-30:14689.62|2021-10-29:15850.47|2021-11-30:16135.92|2021-12-31:16320.08|2022-01-31:14930.05|2022-02-28:14237.81|2022-03-31:14838.49|2022-04-29:12854.80|2022-05-31:12642.10|2022-06-30:11503.72|2022-07-29:12947.97|2022-08-31:12272.03|2022-09-30:10971.22|2022-10-31:11405.57|2022-11-30:12030.06|2022-12-30:10939.76|2023-01-31:12101.93|2023-02-28:12042.12|2023-03-31:13181.35",
    "2023-04-28:13245.99|2023-05-31:14254.09|2023-06-30:15179.21|2023-07-31:15757.00|2023-08-31:15501.07|2023-09-29:14715.24|2023-10-31:14409.78|2023-11-30:15947.87|2023-12-29:16825.93|2024-01-31:17137.24|2024-02-29:18043.85|2024-03-28:18254.69|2024-04-30:17440.69|2024-05-31:18536.65|2024-06-28:19682.87|2024-07-31:19362.43|2024-08-30:19574.64|2024-09-30:20060.69|2024-10-31:19890.42|2024-11-29:20930.37|2024-12-31:21012.17|2025-01-31:21478.05|2025-02-28:20884.41|2025-03-31:19278.45|2025-04-30:19571.02|2025-05-30:21340.99|2025-06-30:22679.01|2025-07-31:23218.12|2025-08-29:23415.42|2025-09-30:24679.99|2025-10-31:25858.13|2025-11-28:25434.89|2025-12-31:25249.85|2026-01-30:25552.39|2026-02-27:24960.04|2026-03-31:23740.19|2026-04-30:27452.12|2026-05-14:29580.30"
  ].join("|");
  const POINTS = parsePoints(DATA_TEXT);
  const HISTORICAL_HIGHS = buildHistoricalHighs(POINTS);
  const DEFAULT_ENTRY_INDEX = POINTS.findIndex(function (point) {
    return point.date === "2021-12-31";
  });
  const DEFAULT_STATE = {
    activePoint: "entry",
    investmentAmount: 10000,
    pyramidEnabled: false,
    cashPoolAmount: 10000,
    entryIndex: DEFAULT_ENTRY_INDEX,
    exitIndex: POINTS.length - 1
  };
  const state = normalizeState({
    ...DEFAULT_STATE,
    ...loadState()
  });
  const chart = document.getElementById("marketChart");
  const gridLayer = document.getElementById("gridLayer");
  const axisLabels = document.getElementById("axisLabels");
  const priceLine = document.getElementById("priceLine");
  const selectionArea = document.getElementById("selectionArea");
  const selectionLine = document.getElementById("selectionLine");
  const pyramidMarkers = document.getElementById("pyramidMarkers");
  const entryMarkerLine = document.getElementById("entryMarkerLine");
  const exitMarkerLine = document.getElementById("exitMarkerLine");
  const entryMarker = document.getElementById("entryMarker");
  const exitMarker = document.getElementById("exitMarker");
  const chartHitLayer = document.getElementById("chartHitLayer");
  const chartTip = document.getElementById("chartTip");
  const tipDate = document.getElementById("tipDate");
  const tipClose = document.getElementById("tipClose");
  const activePointButtons = Array.from(document.querySelectorAll("[data-active-point]"));
  const investmentAmount = document.getElementById("investmentAmount");
  const pyramidToggle = document.getElementById("pyramidToggle");
  const pyramidFields = document.getElementById("pyramidFields");
  const cashPoolAmount = document.getElementById("cashPoolAmount");
  const entryRange = document.getElementById("entryRange");
  const exitRange = document.getElementById("exitRange");
  const entryDate = document.getElementById("entryDate");
  const entryClose = document.getElementById("entryClose");
  const exitDate = document.getElementById("exitDate");
  const exitClose = document.getElementById("exitClose");
  const resultMain = document.getElementById("resultMain");
  const profitAmount = document.getElementById("profitAmount");
  const resultSummary = document.getElementById("resultSummary");
  const currentValue = document.getElementById("currentValue");
  const returnRate = document.getElementById("returnRate");
  const indexUnits = document.getElementById("indexUnits");
  const deployedAmount = document.getElementById("deployedAmount");
  const remainingCash = document.getElementById("remainingCash");
  const holdingPeriod = document.getElementById("holdingPeriod");
  const lowestPoint = document.getElementById("lowestPoint");
  const maxDrawdown = document.getElementById("maxDrawdown");
  const pyramidLog = document.getElementById("pyramidLog");
  const pyramidStatus = document.getElementById("pyramidStatus");
  const pyramidLogList = document.getElementById("pyramidLogList");
  const chartScale = buildChartScale();
  let draggingHandle = null;

  initializeControls();
  bindEvents();
  renderStaticChart();
  render();

  function initializeControls() {
    investmentAmount.value = trimNumber(state.investmentAmount);
    pyramidToggle.checked = state.pyramidEnabled;
    cashPoolAmount.value = trimNumber(state.cashPoolAmount);
    entryRange.max = String(POINTS.length - 1);
    exitRange.max = String(POINTS.length - 1);
  }

  function bindEvents() {
    investmentAmount.addEventListener("input", function () {
      state.investmentAmount = readPositiveNumber(investmentAmount, DEFAULT_STATE.investmentAmount);
      saveAndRender();
    });

    pyramidToggle.addEventListener("change", function () {
      state.pyramidEnabled = pyramidToggle.checked;
      saveAndRender();
    });

    cashPoolAmount.addEventListener("input", function () {
      state.cashPoolAmount = readPositiveNumber(cashPoolAmount, DEFAULT_STATE.cashPoolAmount);
      saveAndRender();
    });

    activePointButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        state.activePoint = button.dataset.activePoint;
        saveAndRender();
      });
    });

    entryRange.addEventListener("input", function () {
      setPoint("entry", Number(entryRange.value), true);
    });

    exitRange.addEventListener("input", function () {
      setPoint("exit", Number(exitRange.value), true);
    });

    chart.addEventListener("pointerleave", function () {
      chartTip.hidden = true;
    });
    chart.addEventListener("pointermove", handleChartHover);
    chartHitLayer.addEventListener("pointerdown", handleChartPointerDown);
    entryMarker.addEventListener("pointerdown", handleMarkerPointerDown);
    exitMarker.addEventListener("pointerdown", handleMarkerPointerDown);
    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
  }

  function renderStaticChart() {
    priceLine.setAttribute("d", buildLinePath(POINTS));
    gridLayer.innerHTML = buildGridMarkup();
    axisLabels.innerHTML = buildAxisMarkup();
  }

  function render() {
    const entry = POINTS[state.entryIndex];
    const exit = POINTS[state.exitIndex];
    const result = calculateResult();
    const entryPosition = getPosition(state.entryIndex);
    const exitPosition = getPosition(state.exitIndex);

    entryRange.value = String(state.entryIndex);
    exitRange.value = String(state.exitIndex);
    investmentAmount.value = trimNumber(state.investmentAmount);
    cashPoolAmount.value = trimNumber(state.cashPoolAmount);
    entryDate.textContent = formatMonth(entry.date);
    entryClose.textContent = formatIndex(entry.close);
    exitDate.textContent = formatMonth(exit.date);
    exitClose.textContent = formatIndex(exit.close);
    renderActivePointButtons();
    renderPyramidControls();
    renderSelection();
    renderPyramidMarkers(result.transactions);
    setLineAttributes(entryMarkerLine, entryPosition.x);
    setLineAttributes(exitMarkerLine, exitPosition.x);
    setCircleAttributes(entryMarker, entryPosition);
    setCircleAttributes(exitMarker, exitPosition);
    resultMain.classList.toggle("is-positive", result.profit >= 0);
    profitAmount.textContent = formatMoney(result.profit);
    resultSummary.textContent = getResultSummary(entry, exit, result);
    currentValue.textContent = formatMoney(result.currentValue);
    returnRate.textContent = formatPercent(result.returnRate);
    indexUnits.textContent = result.units.toFixed(4);
    deployedAmount.textContent = formatMoney(result.totalDeployed);
    remainingCash.textContent = formatMoney(result.remainingCash);
    holdingPeriod.textContent = formatHoldingMonths(result.holdingMonths);
    lowestPoint.textContent = `${formatMonth(result.lowestPoint.date)} · ${formatIndex(
      result.lowestPoint.close
    )}`;
    maxDrawdown.textContent = formatPercent(result.maxDrawdown);
    renderPyramidLog(result);
  }

  function renderSelection() {
    const selectedPoints = POINTS.slice(state.entryIndex, state.exitIndex + 1);
    const bottom = CHART_HEIGHT - PADDING.bottom;
    const entryPosition = getPosition(state.entryIndex);
    const exitPosition = getPosition(state.exitIndex);

    selectionLine.setAttribute("d", buildLinePath(selectedPoints, state.entryIndex));
    selectionArea.setAttribute(
      "d",
      `M ${entryPosition.x} ${bottom} ${buildLinePath(selectedPoints, state.entryIndex).replace(
        "M",
        "L"
      )} L ${exitPosition.x} ${bottom} Z`
    );
  }

  function renderActivePointButtons() {
    activePointButtons.forEach(function (button) {
      const isActive = button.dataset.activePoint === state.activePoint;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderPyramidControls() {
    pyramidToggle.checked = state.pyramidEnabled;
    cashPoolAmount.disabled = !state.pyramidEnabled;
    pyramidFields.classList.toggle("is-disabled", !state.pyramidEnabled);
  }

  function renderPyramidMarkers(transactions) {
    const groupedTransactions = groupTransactionsByIndex(transactions);

    pyramidMarkers.innerHTML = groupedTransactions
      .map(function (transaction) {
        const position = getPosition(transaction.index);
        const radius = 4 + transaction.parts;

        return `<circle class="pyramid-marker" cx="${position.x}" cy="${position.y}" r="${radius}" />`;
      })
      .join("");
  }

  function renderPyramidLog(result) {
    pyramidLog.hidden = !state.pyramidEnabled;

    if (!state.pyramidEnabled) {
      pyramidStatus.textContent = "未开启";
      pyramidLogList.innerHTML = "";
      return;
    }

    pyramidStatus.textContent = `${result.transactions.length} 档触发`;

    if (!result.transactions.length) {
      pyramidLogList.innerHTML = '<div class="pyramid-log-row"><span>当前区间</span><strong>暂无触发</strong></div>';
      return;
    }

    pyramidLogList.innerHTML = result.transactions
      .map(function (transaction) {
        return [
          '<div class="pyramid-log-row">',
          `  <span>回撤 ${transaction.threshold}% · ${transaction.parts}份</span>`,
          `  <strong>${formatMonth(transaction.point.date)} · ${formatMoney(transaction.amount)}</strong>`,
          "</div>"
        ].join("");
      })
      .join("");
  }

  function getResultSummary(entry, exit, result) {
    if (!state.pyramidEnabled) {
      return `${formatMonth(entry.date)} 买入，${formatMonth(exit.date)} 统计，收益率 ${formatPercent(
        result.returnRate
      )}。`;
    }

    return `${formatMonth(entry.date)} 初始买入，倒金字塔触发 ${result.transactions.length} 档，${formatMonth(
      exit.date
    )} 统计，总收益率 ${formatPercent(result.returnRate)}。`;
  }

  function handleChartHover(event) {
    const index = getNearestIndex(event);
    const point = POINTS[index];
    const rect = chart.getBoundingClientRect();
    const left = Math.min(Math.max(event.clientX - rect.left + 12, 8), rect.width - 144);
    const top = Math.min(Math.max(event.clientY - rect.top + 12, 8), rect.height - 64);

    tipDate.textContent = formatMonth(point.date);
    tipClose.textContent = `收盘 ${formatIndex(point.close)}`;
    chartTip.style.left = `${left}px`;
    chartTip.style.top = `${top}px`;
    chartTip.hidden = false;
  }

  function handleChartPointerDown(event) {
    event.preventDefault();
    draggingHandle = state.activePoint;
    setPoint(draggingHandle, getNearestIndex(event), false);
  }

  function handleMarkerPointerDown(event) {
    event.preventDefault();
    draggingHandle = event.currentTarget.dataset.handle;
    state.activePoint = draggingHandle;
    saveAndRender();
  }

  function handleWindowPointerMove(event) {
    if (!draggingHandle) {
      return;
    }

    setPoint(draggingHandle, getNearestIndex(event), false);
  }

  function handleWindowPointerUp() {
    if (!draggingHandle) {
      return;
    }

    draggingHandle = null;
    saveAndRender();
  }

  function setPoint(handle, index, shouldSave) {
    const nextIndex = clamp(index, 0, POINTS.length - 1);

    if (handle === "entry") {
      state.entryIndex = nextIndex;

      if (state.exitIndex < state.entryIndex) {
        state.exitIndex = state.entryIndex;
      }
    } else {
      state.exitIndex = nextIndex;

      if (state.entryIndex > state.exitIndex) {
        state.entryIndex = state.exitIndex;
      }
    }

    if (shouldSave) {
      saveAndRender();
      return;
    }

    state.investmentAmount = readPositiveNumber(investmentAmount, DEFAULT_STATE.investmentAmount);
    render();
  }

  function calculateResult() {
    const entry = POINTS[state.entryIndex];
    const exit = POINTS[state.exitIndex];
    const amount = Math.max(1, state.investmentAmount);
    const cashPool = state.pyramidEnabled ? Math.max(1, state.cashPoolAmount) : 0;
    const transactions = state.pyramidEnabled
      ? calculatePyramidTransactions(state.entryIndex, state.exitIndex, cashPool)
      : [];
    const pyramidDeployed = transactions.reduce(function (total, transaction) {
      return total + transaction.amount;
    }, 0);
    const units = transactions.reduce(function (totalUnits, transaction) {
      return totalUnits + transaction.amount / transaction.point.close;
    }, amount / entry.close);
    const positionValue = units * exit.close;
    const remainingCashValue = cashPool - pyramidDeployed;
    const current = positionValue + remainingCashValue;
    const totalCapital = amount + cashPool;
    const selectedPoints = POINTS.slice(state.entryIndex, state.exitIndex + 1);
    const lowest = selectedPoints.reduce(function (lowestPointValue, point) {
      return point.close < lowestPointValue.close ? point : lowestPointValue;
    }, selectedPoints[0]);

    return {
      units: units,
      currentValue: current,
      profit: current - totalCapital,
      returnRate: (current / totalCapital - 1) * 100,
      totalDeployed: amount + pyramidDeployed,
      remainingCash: remainingCashValue,
      transactions: transactions,
      holdingMonths: countMonths(entry.date, exit.date),
      lowestPoint: lowest,
      maxDrawdown: Math.min(0, (lowest.close / entry.close - 1) * 100)
    };
  }

  function calculatePyramidTransactions(entryIndex, exitIndex, cashPool) {
    const unitAmount = cashPool / PYRAMID_TOTAL_PARTS;
    const triggeredThresholds = new Set();
    const transactions = [];

    for (let index = entryIndex; index <= exitIndex; index++) {
      const drawdown = getHistoricalDrawdown(index);

      PYRAMID_RULES.forEach(function (rule) {
        if (drawdown < rule.threshold || triggeredThresholds.has(rule.threshold)) {
          return;
        }

        triggeredThresholds.add(rule.threshold);
        transactions.push({
          index: index,
          point: POINTS[index],
          threshold: rule.threshold,
          parts: rule.parts,
          amount: unitAmount * rule.parts,
          drawdown: drawdown
        });
      });
    }

    return transactions;
  }

  function getHistoricalDrawdown(index) {
    const historicalHigh = HISTORICAL_HIGHS[index].close;
    return (historicalHigh - POINTS[index].close) / historicalHigh * 100;
  }

  function groupTransactionsByIndex(transactions) {
    const grouped = new Map();

    transactions.forEach(function (transaction) {
      const existing = grouped.get(transaction.index);

      if (!existing) {
        grouped.set(transaction.index, {
          index: transaction.index,
          parts: transaction.parts
        });
        return;
      }

      existing.parts += transaction.parts;
    });

    return Array.from(grouped.values());
  }

  function buildChartScale() {
    const values = POINTS.map(function (point) {
      return point.close;
    });
    const minLog = Math.log(Math.min(...values) * 0.86);
    const maxLog = Math.log(Math.max(...values) * 1.08);

    return {
      minLog: minLog,
      maxLog: maxLog,
      width: CHART_WIDTH - PADDING.left - PADDING.right,
      height: CHART_HEIGHT - PADDING.top - PADDING.bottom
    };
  }

  function buildLinePath(points, startIndex) {
    return points
      .map(function (point, index) {
        const position = getPosition((startIndex || 0) + index);
        return `${index === 0 ? "M" : "L"} ${position.x.toFixed(2)} ${position.y.toFixed(2)}`;
      })
      .join(" ");
  }

  function buildGridMarkup() {
    const yTicks = [60, 100, 300, 1000, 3000, 10000, 30000];
    const decadeTicks = POINTS
      .map(function (point, index) {
        return {
          point: point,
          index: index
        };
      })
      .filter(function (item) {
        const year = Number(item.point.date.slice(0, 4));
        return item.point.date.slice(5, 7) === "01" && year % 10 === 0;
      });

    return [
      yTicks
        .filter(function (tick) {
          return tick >= Math.exp(chartScale.minLog) && tick <= Math.exp(chartScale.maxLog);
        })
        .map(function (tick) {
          const y = yForClose(tick);
          return `<line class="grid-line" x1="${PADDING.left}" y1="${y}" x2="${
            CHART_WIDTH - PADDING.right
          }" y2="${y}" />`;
        })
        .join(""),
      decadeTicks
        .map(function (item) {
          const x = xForIndex(item.index);
          return `<line class="grid-line" x1="${x}" y1="${PADDING.top}" x2="${x}" y2="${
            CHART_HEIGHT - PADDING.bottom
          }" />`;
        })
        .join("")
    ].join("");
  }

  function buildAxisMarkup() {
    const yTicks = [100, 300, 1000, 3000, 10000, 30000];
    const yearTicks = [1986, 1990, 2000, 2010, 2020, 2026];

    return [
      yTicks
        .filter(function (tick) {
          return tick >= Math.exp(chartScale.minLog) && tick <= Math.exp(chartScale.maxLog);
        })
        .map(function (tick) {
          return `<text x="${PADDING.left - 10}" y="${yForClose(tick) + 4}" text-anchor="end">${formatCompact(
            tick
          )}</text>`;
        })
        .join(""),
      yearTicks
        .map(function (year) {
          const index = POINTS.findIndex(function (point) {
            return Number(point.date.slice(0, 4)) >= year;
          });
          const x = xForIndex(index < 0 ? POINTS.length - 1 : index);
          return `<text x="${x}" y="${CHART_HEIGHT - 16}" text-anchor="middle">${year}</text>`;
        })
        .join("")
    ].join("");
  }

  function getPosition(index) {
    const point = POINTS[index];

    return {
      x: xForIndex(index),
      y: yForClose(point.close)
    };
  }

  function xForIndex(index) {
    return PADDING.left + index / (POINTS.length - 1) * chartScale.width;
  }

  function yForClose(close) {
    return (
      PADDING.top +
      (chartScale.maxLog - Math.log(close)) /
        (chartScale.maxLog - chartScale.minLog) *
        chartScale.height
    );
  }

  function getNearestIndex(event) {
    const rect = chart.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    return Math.round(ratio * (POINTS.length - 1));
  }

  function setLineAttributes(line, x) {
    line.setAttribute("x1", x);
    line.setAttribute("x2", x);
    line.setAttribute("y1", PADDING.top);
    line.setAttribute("y2", CHART_HEIGHT - PADDING.bottom);
  }

  function setCircleAttributes(circle, position) {
    circle.setAttribute("cx", position.x);
    circle.setAttribute("cy", position.y);
  }

  function saveAndRender() {
    Object.assign(state, normalizeState(state));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("保存纳指回测数据失败:", error);
    }

    render();
  }

  function loadState() {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);
      return rawValue ? JSON.parse(rawValue) : {};
    } catch (error) {
      console.warn("读取纳指回测数据失败:", error);
      return {};
    }
  }

  function normalizeState(nextState) {
    const normalized = {
      ...DEFAULT_STATE,
      ...nextState
    };

    normalized.activePoint = normalized.activePoint === "exit" ? "exit" : "entry";
    normalized.investmentAmount = clamp(Number(normalized.investmentAmount), 1, 1000000000);
    normalized.pyramidEnabled = Boolean(normalized.pyramidEnabled);
    normalized.cashPoolAmount = clamp(Number(normalized.cashPoolAmount), 1, 1000000000);
    normalized.entryIndex = clamp(Number(normalized.entryIndex), 0, POINTS.length - 1);
    normalized.exitIndex = clamp(
      Number(normalized.exitIndex),
      normalized.entryIndex,
      POINTS.length - 1
    );

    return normalized;
  }

  function parsePoints(value) {
    return value.split("|").map(function (item) {
      const parts = item.split(":");

      return {
        date: parts[0],
        close: Number(parts[1])
      };
    });
  }

  function buildHistoricalHighs(points) {
    let historicalHigh = points[0];

    return points.map(function (point) {
      if (point.close > historicalHigh.close) {
        historicalHigh = point;
      }

      return historicalHigh;
    });
  }

  function readPositiveNumber(input, fallback) {
    const value = Number(input.value);
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) {
      return min;
    }

    return Math.min(Math.max(value, min), max);
  }

  function countMonths(startDate, endDate) {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  }

  function formatHoldingMonths(months) {
    if (months < 12) {
      return `${months} 个月`;
    }

    const years = Math.floor(months / 12);
    const restMonths = months % 12;

    return restMonths ? `${years} 年 ${restMonths} 个月` : `${years} 年`;
  }

  function formatMonth(date) {
    const parts = date.split("-");
    return `${parts[0]} 年 ${Number(parts[1])} 月`;
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      maximumFractionDigits: 2
    }).format(value);
  }

  function formatIndex(value) {
    return new Intl.NumberFormat("zh-CN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  function formatPercent(value) {
    return `${new Intl.NumberFormat("zh-CN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)}%`;
  }

  function formatCompact(value) {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}k`;
    }

    return String(value);
  }

  function trimNumber(value) {
    return Number(value).toString();
  }
})();
