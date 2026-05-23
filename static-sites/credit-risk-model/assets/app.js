const data = globalThis.PROJECT_DATA;
if (!data) throw new Error("PROJECT_DATA not found. Load data.js before app.js.");
const palette = {
  teal: "#24756a",
  tealDark: "#14564d",
  amber: "#b47a20",
  red: "#b84a42",
  blue: "#366b94",
  green: "#4f7f43",
  ink: "#222527",
  muted: "#65706a",
  line: "#d8ded8",
  fill: "#eef4f1",
};

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const fmt1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const fmtPct = (v) => `${fmt1.format(v)}%`;
const svgNS = "http://www.w3.org/2000/svg";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function clear(node) {
  node.replaceChildren();
}

function extent(values, pad = 0) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return [min - span * pad, max + span * pad];
}

function scale(domain, range) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  return (value) => r0 + ((value - d0) / (d1 - d0 || 1)) * (r1 - r0);
}

function text(attrs, content) {
  const node = svgEl("text", attrs);
  node.textContent = content;
  return node;
}

function makeSvg(container, width = 760, height = 360) {
  clear(container);
  const svg = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-hidden": "true",
  });
  container.append(svg);
  return svg;
}

function showTooltip(html, event) {
  let tip = document.querySelector(".tooltip");
  if (!tip) {
    tip = el("div", "tooltip");
    document.body.append(tip);
  }
  tip.innerHTML = html;
  tip.style.left = `${event.clientX}px`;
  tip.style.top = `${event.clientY}px`;
}

function hideTooltip() {
  document.querySelector(".tooltip")?.remove();
}

// ── SUMMARY ──────────────────────────────────────────────────────────────

function renderSummary() {
  const meta = data.meta;
  const rows = [
    ["Rows", fmt.format(meta.rows)],
    ["Predictors", fmt.format(meta.modelPredictors)],
    ["Test RMSE", fmt.format(meta.bestRmse)],
    ["Leakage-Free CV", meta.leakageFreeRmse ? fmt.format(meta.leakageFreeRmse) : "—"],
    ["Best Model", meta.bestModel],
    ["R²", fmt.format(meta.bestR2)],
    ["Missing Values", fmt.format(meta.missingValues)],
    ["Risk Range", `${meta.targetMin}–${meta.targetMax}`],
  ];
  const grid = document.querySelector("#summary-grid");
  rows.forEach(([label, value]) => {
    const item = el("div", "summary-item");
    item.append(el("span", "summary-value", value));
    item.append(el("span", "summary-label", label));
    grid.append(item);
  });
  document.querySelector("#best-model-heading").textContent = meta.bestModel;
  // Leakage note
  const lfEl = document.querySelector("#leakage-free-rmse");
  if (lfEl && meta.leakageFreeRmse) lfEl.textContent = fmt.format(meta.leakageFreeRmse);
  const liEl = document.querySelector("#leakage-increase");
  if (liEl && meta.leakageRmseIncrease != null) liEl.textContent = fmt.format(meta.leakageRmseIncrease);
}

// ── METRICS TABLE ────────────────────────────────────────────────────────

function renderMetricsTable() {
  const body = document.querySelector("#metrics-body");
  data.metrics.forEach((row, index) => {
    const tr = document.createElement("tr");
    const model = document.createElement("td");
    const rank = el("span", "rank", String(index + 1));
    model.append(rank, document.createTextNode(row.model));
    tr.append(model);
    [row.rmse, row.mae, row.r2, row.bias, fmtPct(row.within3)].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = typeof value === "number" ? fmt.format(value) : value;
      tr.append(td);
    });
    body.append(tr);
  });
}

// ── MODEL BARS ───────────────────────────────────────────────────────────

function renderHorizontalMetricBars(containerId, rows) {
  const svg = makeSvg(document.querySelector(containerId), 640, 380);
  const margin = { top: 16, right: 46, bottom: 36, left: 150 };
  const innerW = 640 - margin.left - margin.right;
  const barH = 42;
  const gap = 24;
  const max = Math.max(...rows.map((d) => d.rmse)) * 1.08;
  const x = scale([0, max], [0, innerW]);

  rows.forEach((row, i) => {
    const y = margin.top + i * (barH + gap);
    svg.append(text({ x: margin.left - 12, y: y + 27, "text-anchor": "end", class: "tick-label" }, row.model));
    svg.append(svgEl("rect", {
      x: margin.left, y, width: Math.max(2, x(row.rmse)), height: barH, rx: 5,
      fill: i === 0 ? palette.teal : i === rows.length - 1 ? palette.red : palette.blue,
    }));
    svg.append(text({ x: margin.left + x(row.rmse) + 10, y: y + 27, class: "bar-label" }, fmt.format(row.rmse)));
  });
  svg.append(text({ x: margin.left, y: 352, class: "chart-label" }, "Lower RMSE is better"));
}

// ── KNN LINE ─────────────────────────────────────────────────────────────

function renderLine(containerId, rows) {
  const svg = makeSvg(document.querySelector(containerId), 640, 330);
  const margin = { top: 18, right: 30, bottom: 48, left: 58 };
  const innerW = 640 - margin.left - margin.right;
  const innerH = 330 - margin.top - margin.bottom;
  const x = scale(extent(rows.map((d) => d.neighbors), 0.03), [margin.left, margin.left + innerW]);
  const y = scale(extent(rows.map((d) => d.rmse), 0.08).reverse(), [margin.top, margin.top + innerH]);

  for (let i = 0; i <= 4; i++) {
    const yy = margin.top + (innerH / 4) * i;
    svg.append(svgEl("line", { x1: margin.left, x2: margin.left + innerW, y1: yy, y2: yy, class: "grid-line" }));
  }
  const d = rows.map((row, i) => `${i === 0 ? "M" : "L"}${x(row.neighbors)},${y(row.rmse)}`).join(" ");
  svg.append(svgEl("path", { d, fill: "none", stroke: palette.teal, "stroke-width": 3 }));

  rows.forEach((row) => {
    const circle = svgEl("circle", { cx: x(row.neighbors), cy: y(row.rmse), r: 5, fill: palette.tealDark });
    circle.addEventListener("mousemove", (event) =>
      showTooltip(`neighbors: ${row.neighbors}<br>CV RMSE: ${fmt.format(row.rmse)}`, event));
    circle.addEventListener("mouseleave", hideTooltip);
    svg.append(circle);
  });

  svg.append(svgEl("line", { x1: margin.left, x2: margin.left + innerW, y1: margin.top + innerH, y2: margin.top + innerH, stroke: palette.line }));
  svg.append(svgEl("line", { x1: margin.left, x2: margin.left, y1: margin.top, y2: margin.top + innerH, stroke: palette.line }));
  svg.append(text({ x: margin.left + innerW / 2, y: 318, "text-anchor": "middle", class: "chart-label" }, "Neighbors"));
  svg.append(text({ x: 15, y: margin.top + innerH / 2, transform: `rotate(-90 15 ${margin.top + innerH / 2})`, "text-anchor": "middle", class: "chart-label" }, "CV RMSE"));
  [3, 7, 11, 15, 19, 21].forEach((tick) => {
    svg.append(text({ x: x(tick), y: 298, "text-anchor": "middle", class: "tick-label" }, String(tick)));
  });
}

// ── RF HEATMAP ───────────────────────────────────────────────────────────

function renderHeatmap(containerId, rows) {
  const svg = makeSvg(document.querySelector(containerId), 640, 330);
  const mtrys = [...new Set(rows.map((d) => d.mtry))].sort((a, b) => a - b);
  const mins = [...new Set(rows.map((d) => d.min_n))].sort((a, b) => a - b);
  const margin = { top: 32, right: 28, bottom: 46, left: 70 };
  const cellW = (640 - margin.left - margin.right) / mtrys.length;
  const cellH = (330 - margin.top - margin.bottom) / mins.length;
  const rmseValues = rows.map((d) => d.rmse);
  const [minRmse, maxRmse] = extent(rmseValues, 0);
  const color = (value) => {
    const t = (value - minRmse) / (maxRmse - minRmse || 1);
    if (t < 0.34) return palette.teal;
    if (t < 0.7) return palette.amber;
    return palette.red;
  };

  mins.forEach((minN, rowIndex) => {
    svg.append(text({ x: 54, y: margin.top + rowIndex * cellH + cellH / 2 + 5, "text-anchor": "end", class: "tick-label" }, String(minN)));
  });
  mtrys.forEach((mtry, colIndex) => {
    svg.append(text({ x: margin.left + colIndex * cellW + cellW / 2, y: 308, "text-anchor": "middle", class: "tick-label" }, String(mtry)));
  });

  rows.forEach((row) => {
    const col = mtrys.indexOf(row.mtry);
    const line = mins.indexOf(row.min_n);
    const x = margin.left + col * cellW;
    const y = margin.top + line * cellH;
    const rect = svgEl("rect", { x, y, width: cellW - 8, height: cellH - 8, rx: 5, fill: color(row.rmse) });
    rect.addEventListener("mousemove", (event) =>
      showTooltip(`mtry: ${row.mtry}<br>min_n: ${row.min_n}<br>CV RMSE: ${fmt.format(row.rmse)}`, event));
    rect.addEventListener("mouseleave", hideTooltip);
    svg.append(rect);
    svg.append(text({ x: x + cellW / 2 - 4, y: y + cellH / 2 + 4, "text-anchor": "middle", fill: "#fff", "font-size": 13, "font-weight": 760 }, fmt.format(row.rmse)));
  });
  svg.append(text({ x: margin.left + (cellW * mtrys.length) / 2, y: 326, "text-anchor": "middle", class: "chart-label" }, "mtry"));
  svg.append(text({ x: 15, y: margin.top + (cellH * mins.length) / 2, transform: `rotate(-90 15 ${margin.top + (cellH * mins.length) / 2})`, "text-anchor": "middle", class: "chart-label" }, "min_n"));
}

// ── BEST PARAMS ──────────────────────────────────────────────────────────

function renderParams() {
  const wrap = document.querySelector("#best-params");
  const labels = { knn: "KNN", rf: "Random Forest", enet: "Elastic Net" };
  data.bestParams.forEach((row) => {
    const item = el("div", "param-item");
    item.append(el("strong", "", labels[row.model] || row.model));
    const values = [];
    if (row.neighbors) values.push(`neighbors = ${row.neighbors}`);
    if (row.mtry) values.push(`mtry = ${row.mtry}`);
    if (row.min_n) values.push(`min_n = ${row.min_n}`);
    if (row.penalty !== null) values.push(`penalty = ${row.penalty}`);
    if (row.mixture !== null) values.push(`mixture = ${row.mixture}`);
    values.forEach((value) => item.append(el("span", "", value)));
    wrap.append(item);
  });
}

// ── HISTOGRAM ────────────────────────────────────────────────────────────

function renderHistogram(containerId, rows, label) {
  const svg = makeSvg(document.querySelector(containerId), 640, 330);
  const margin = { top: 18, right: 24, bottom: 48, left: 54 };
  const innerW = 640 - margin.left - margin.right;
  const innerH = 330 - margin.top - margin.bottom;
  const x = scale([rows[0].x0, rows[rows.length - 1].x1], [margin.left, margin.left + innerW]);
  const y = scale([0, Math.max(...rows.map((d) => d.count))], [margin.top + innerH, margin.top]);

  rows.forEach((row) => {
    const x0 = x(row.x0);
    const x1 = x(row.x1);
    const h = margin.top + innerH - y(row.count);
    svg.append(svgEl("rect", {
      x: x0 + 1, y: y(row.count),
      width: Math.max(1, x1 - x0 - 2), height: h,
      fill: row.x0 < 0 && row.x1 > 0 ? palette.teal : palette.blue,
      opacity: 0.9,
    }));
  });
  svg.append(svgEl("line", { x1: margin.left, x2: margin.left + innerW, y1: margin.top + innerH, y2: margin.top + innerH, stroke: palette.line }));
  if (rows[0].x0 < 0 && rows[rows.length - 1].x1 > 0) {
    const zero = x(0);
    svg.append(svgEl("line", { x1: zero, x2: zero, y1: margin.top, y2: margin.top + innerH, stroke: palette.red, "stroke-dasharray": "4 5" }));
  }
  svg.append(text({ x: margin.left + innerW / 2, y: 318, "text-anchor": "middle", class: "chart-label" }, label));
}

// ── SCATTER ──────────────────────────────────────────────────────────────

function renderScatter() {
  const svg = makeSvg(document.querySelector("#scatter"), 820, 420);
  const margin = { top: 18, right: 30, bottom: 52, left: 58 };
  const innerW = 820 - margin.left - margin.right;
  const innerH = 420 - margin.top - margin.bottom;
  const values = data.scatter.flatMap((d) => [d.actual, d.predicted]);
  const [min, max] = extent(values, 0.08);
  const x = scale([min, max], [margin.left, margin.left + innerW]);
  const y = scale([min, max], [margin.top + innerH, margin.top]);

  for (let i = 0; i <= 4; i++) {
    const pos = margin.left + (innerW / 4) * i;
    svg.append(svgEl("line", { x1: pos, x2: pos, y1: margin.top, y2: margin.top + innerH, class: "grid-line" }));
    const yy = margin.top + (innerH / 4) * i;
    svg.append(svgEl("line", { x1: margin.left, x2: margin.left + innerW, y1: yy, y2: yy, class: "grid-line" }));
  }
  svg.append(svgEl("line", { x1: x(min), y1: y(min), x2: x(max), y2: y(max), stroke: palette.tealDark, "stroke-width": 2 }));

  data.scatter.forEach((row) => {
    const point = svgEl("circle", { cx: x(row.actual), cy: y(row.predicted), r: 4, fill: row.approved ? palette.green : palette.red, opacity: 0.55 });
    point.addEventListener("mousemove", (event) =>
      showTooltip(`Actual: ${row.actual}<br>Predicted: ${row.predicted}<br>Error: ${row.error}<br>Credit score: ${row.creditScore}`, event));
    point.addEventListener("mouseleave", hideTooltip);
    svg.append(point);
  });
  svg.append(text({ x: margin.left + innerW / 2, y: 405, "text-anchor": "middle", class: "chart-label" }, "Actual RiskScore"));
  svg.append(text({ x: 16, y: margin.top + innerH / 2, transform: `rotate(-90 16 ${margin.top + innerH / 2})`, "text-anchor": "middle", class: "chart-label" }, "Predicted RiskScore"));
  svg.append(text({ x: margin.left + innerW - 4, y: margin.top + 18, "text-anchor": "end", class: "chart-label" }, "Diagonal = perfect prediction"));
}

// ── SEGMENT TABS ─────────────────────────────────────────────────────────

function renderSegmentTabs() {
  const tabs = document.querySelector("#segment-tabs");
  const chart = document.querySelector("#segment-bars");
  const names = Object.keys(data.segments);
  function draw(name) {
    tabs.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.name === name));
    });
    renderSegmentBars(chart, data.segments[name]);
  }
  names.forEach((name, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.name = name;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(index === 0));
    button.textContent = name;
    button.addEventListener("click", () => draw(name));
    tabs.append(button);
  });
  draw(names[0]);
}

function renderSegmentBars(container, rows) {
  const svg = makeSvg(container, 640, 330);
  const margin = { top: 8, right: 80, bottom: 28, left: 150 };
  const barH = 28;
  const gap = 13;
  const max = Math.max(...rows.map((d) => d.rmse)) * 1.12;
  const x = scale([0, max], [0, 640 - margin.left - margin.right]);
  rows.slice(0, 7).forEach((row, i) => {
    const y = margin.top + i * (barH + gap);
    svg.append(text({ x: margin.left - 10, y: y + 19, "text-anchor": "end", class: "tick-label" }, row.segment));
    svg.append(svgEl("rect", { x: margin.left, y, width: x(row.rmse), height: barH, rx: 5, fill: i === 0 ? palette.red : palette.teal }));
    svg.append(text({ x: margin.left + x(row.rmse) + 8, y: y + 19, class: "bar-label" }, `${fmt.format(row.rmse)} (${row.n})`));
  });
}

// ── VARIABLE IMPORTANCE ──────────────────────────────────────────────────

function renderImportance() {
  const rows = data.importance.slice(0, 12);
  const svg = makeSvg(document.querySelector("#importance-bars"), 820, 430);
  const margin = { top: 8, right: 80, bottom: 32, left: 190 };
  const barH = 23;
  const gap = 10;
  const x = scale([0, 100], [0, 820 - margin.left - margin.right]);
  rows.forEach((row, i) => {
    const y = margin.top + i * (barH + gap);
    svg.append(text({ x: margin.left - 10, y: y + 17, "text-anchor": "end", class: "tick-label" }, row.feature));
    svg.append(svgEl("rect", { x: margin.left, y, width: x(row.normalized), height: barH, rx: 4, fill: i < 3 ? palette.teal : palette.blue }));
    svg.append(text({ x: margin.left + x(row.normalized) + 8, y: y + 17, class: "bar-label" }, fmtPct(row.normalized)));
  });
}

// ── CORRELATION ──────────────────────────────────────────────────────────

function renderCorrelation() {
  const rows = data.correlations.slice(0, 10);
  const svg = makeSvg(document.querySelector("#correlation-bars"), 640, 330);
  const margin = { top: 8, right: 44, bottom: 28, left: 170 };
  const barH = 20;
  const gap = 9;
  const innerW = 640 - margin.left - margin.right;
  const x = scale([-0.55, 0.55], [margin.left, margin.left + innerW]);
  const zero = x(0);
  svg.append(svgEl("line", { x1: zero, x2: zero, y1: 0, y2: 295, stroke: palette.line }));
  rows.forEach((row, i) => {
    const y = margin.top + i * (barH + gap);
    const xVal = x(row.correlation);
    svg.append(text({ x: margin.left - 10, y: y + 15, "text-anchor": "end", class: "tick-label" }, row.feature));
    svg.append(svgEl("rect", { x: Math.min(zero, xVal), y, width: Math.abs(xVal - zero), height: barH, rx: 4, fill: row.correlation >= 0 ? palette.red : palette.green }));
    svg.append(text({ x: row.correlation >= 0 ? xVal + 7 : xVal - 7, y: y + 15, "text-anchor": row.correlation >= 0 ? "start" : "end", class: "bar-label" }, row.correlation.toFixed(3)));
  });
}

// ── APPROVAL BY RISK ─────────────────────────────────────────────────────

function renderApproval() {
  const svg = makeSvg(document.querySelector("#approval-bars"), 640, 330);
  const margin = { top: 20, right: 28, bottom: 48, left: 54 };
  const innerW = 640 - margin.left - margin.right;
  const innerH = 330 - margin.top - margin.bottom;
  const rows = data.approvalByRisk;
  const slot = innerW / rows.length;
  const y = scale([0, 100], [margin.top + innerH, margin.top]);
  rows.forEach((row, i) => {
    const x = margin.left + i * slot + slot * 0.18;
    const width = slot * 0.64;
    const height = margin.top + innerH - y(row.approvalRate);
    svg.append(svgEl("rect", { x, y: y(row.approvalRate), width, height, rx: 5, fill: row.approvalRate > 50 ? palette.green : palette.amber }));
    svg.append(text({ x: x + width / 2, y: y(row.approvalRate) - 7, "text-anchor": "middle", class: "bar-label" }, fmtPct(row.approvalRate)));
    svg.append(text({ x: x + width / 2, y: 308, "text-anchor": "middle", class: "tick-label" }, row.band));
  });
  svg.append(text({ x: margin.left + innerW / 2, y: 326, "text-anchor": "middle", class: "chart-label" }, "RiskScore band"));
}

// ── CORRELATION PAIRS ────────────────────────────────────────────────────

function renderPairs() {
  const wrap = document.querySelector("#corr-pairs");
  data.highCorrelationPairs.forEach((row) => {
    const item = el("div", "pair-item");
    const left = el("div");
    left.append(el("strong", "", `${row.left} / ${row.right}`));
    left.append(el("span", "", "Consider removal, regularization, or grouped interpretation."));
    item.append(left);
    item.append(el("div", "pair-value", row.correlation.toFixed(3)));
    wrap.append(item);
  });
}

// ── CALIBRATION CURVE ────────────────────────────────────────────────────

function renderCalibration() {
  const cal = data.calibration?.randomForest;
  if (!cal || cal.length === 0) return;
  const svg = makeSvg(document.querySelector("#calibration-chart"), 820, 420);
  const margin = { top: 18, right: 30, bottom: 52, left: 58 };
  const innerW = 820 - margin.left - margin.right;
  const innerH = 420 - margin.top - margin.bottom;

  const maxVal = Math.max(...cal.map((d) => Math.max(d.mean_predicted, d.mean_actual)));
  const minVal = Math.min(...cal.map((d) => Math.min(d.mean_predicted, d.mean_actual)));
  const pad = (maxVal - minVal) * 0.08;
  const domainMin = Math.max(0, minVal - pad);
  const domainMax = Math.min(100, maxVal + pad);
  const x = scale([domainMin, domainMax], [margin.left, margin.left + innerW]);
  const y = scale([domainMin, domainMax], [margin.top + innerH, margin.top]);

  // Grid
  for (let i = 0; i <= 4; i++) {
    const pos = margin.left + (innerW / 4) * i;
    svg.append(svgEl("line", { x1: pos, x2: pos, y1: margin.top, y2: margin.top + innerH, class: "grid-line" }));
    const yy = margin.top + (innerH / 4) * i;
    svg.append(svgEl("line", { x1: margin.left, x2: margin.left + innerW, y1: yy, y2: yy, class: "grid-line" }));
  }

  // Perfect calibration diagonal
  svg.append(svgEl("line", { x1: x(domainMin), y1: y(domainMin), x2: x(domainMax), y2: y(domainMax), stroke: palette.line, "stroke-dasharray": "6 4", "stroke-width": 2 }));

  // Calibration error bars (vertical lines from diagonal to point)
  cal.forEach((d) => {
    svg.append(svgEl("line", {
      x1: x(d.mean_predicted), y1: y(d.mean_predicted),
      x2: x(d.mean_predicted), y2: y(d.mean_actual),
      stroke: palette.red, "stroke-width": 1.5, opacity: 0.5,
    }));
  });

  // Data points
  cal.forEach((d) => {
    const g = svgEl("g");
    const circle = svgEl("circle", { cx: x(d.mean_predicted), cy: y(d.mean_actual), r: 7, fill: palette.teal, stroke: "#fff", "stroke-width": 2 });
    circle.addEventListener("mousemove", (event) =>
      showTooltip(`Pred: ${fmt.format(d.mean_predicted)}<br>Actual: ${fmt.format(d.mean_actual)}<br>Error: ${d.calibration_error}<br>n: ${d.count}`, event));
    circle.addEventListener("mouseleave", hideTooltip);
    g.append(circle);
    // Show calibration error label
    svg.append(text({ x: x(d.mean_predicted) + 9, y: y(d.mean_actual) + 4, class: "bar-label", "font-size": 11 },
      d.calibration_error.toFixed(1)));
    svg.append(g);
  });

  svg.append(text({ x: margin.left + innerW / 2, y: 405, "text-anchor": "middle", class: "chart-label" }, "Mean Predicted RiskScore"));
  svg.append(text({ x: 16, y: margin.top + innerH / 2, transform: `rotate(-90 16 ${margin.top + innerH / 2})`, "text-anchor": "middle", class: "chart-label" }, "Mean Actual RiskScore"));
  svg.append(text({ x: margin.left + innerW - 4, y: margin.top + 18, "text-anchor": "end", class: "chart-label" }, "Dashed = perfect calibration"));
}

// ── COVERAGE STATS ───────────────────────────────────────────────────────

function renderCoverage() {
  const cov = data.calibration?.coverage;
  if (!cov) return;
  const wrap = document.querySelector("#coverage-stats");
  const items = [
    ["Residual SD", fmt.format(cov.residual_std)],
    ["Within 1σ (expected 68.3%)", fmtPct(cov.pct_within_1sigma_68)],
    ["Within 2σ (expected 95.4%)", fmtPct(cov.pct_within_2sigma_95)],
  ];
  items.forEach(([label, value]) => {
    const item = el("div", "param-item");
    item.append(el("strong", "", value));
    item.append(el("span", "", label));
    wrap.append(item);
  });
}

// ── STABILITY STATS ──────────────────────────────────────────────────────

function renderStability() {
  const s = data.stability;
  if (!s) return;
  const wrap = document.querySelector("#stability-stats");
  const items = [
    ["Error Skewness", fmt.format(s.error_skewness)],
    ["Error Kurtosis", fmt.format(s.error_kurtosis)],
    ["Normality p-value", s.error_normality_p_value < 0.001 ? "<0.001" : fmt.format(s.error_normality_p_value)],
    ["Extreme Errors (>±10)", fmtPct(s.extreme_error_rate)],
    ["Error Autocorr (lag-1)", fmt.format(s.error_autocorrelation_lag1)],
    ["Below -5 pts", fmtPct(s.error_summary?.below_neg5_pct ?? 0)],
    ["Above +5 pts", fmtPct(s.error_summary?.above_pos5_pct ?? 0)],
  ];
  items.forEach(([label, value]) => {
    const item = el("div", "param-item");
    item.append(el("strong", "", String(value)));
    item.append(el("span", "", label));
    wrap.append(item);
  });
}

// ── FAIRNESS CHARTS ──────────────────────────────────────────────────────

function renderFairnessBias(containerId, rows, labelKey = "group") {
  if (!rows || rows.length === 0) return;
  const svg = makeSvg(document.querySelector(containerId), 640, 280);
  const margin = { top: 18, right: 50, bottom: 36, left: 130 };
  const innerW = 640 - margin.left - margin.right;
  const barH = 32;
  const gap = 14;
  const maxAbs = Math.max(...rows.map((d) => Math.abs(d.bias)), 0.5) * 1.2;
  const x = scale([-maxAbs, maxAbs], [margin.left, margin.left + innerW]);
  const zero = x(0);

  // Zero line
  svg.append(svgEl("line", { x1: zero, x2: zero, y1: 0, y2: 240, stroke: palette.line, "stroke-dasharray": "4 4" }));

  rows.forEach((row, i) => {
    const y = margin.top + i * (barH + gap);
    const w = x(Math.abs(row.bias)) - zero;
    const isNeg = row.bias < 0;
    const rectX = isNeg ? x(row.bias) : zero;
    svg.append(text({ x: margin.left - 10, y: y + barH / 2 + 5, "text-anchor": "end", class: "tick-label" }, row[labelKey] || String(row.group)));
    svg.append(svgEl("rect", {
      x: rectX, y, width: w, height: barH, rx: 5,
      fill: row.significant_bias ? (isNeg ? palette.amber : palette.red) : palette.teal,
      opacity: 0.8,
    }));
    const sig = row.significant_bias ? "*" : "";
    svg.append(text({ x: rectX + w + 7, y: y + barH / 2 + 5, class: "bar-label", "font-size": 11 },
      `${row.bias.toFixed(2)}${sig}`));
  });

  svg.append(text({ x: margin.left, y: 262, class: "chart-label" }, "Negative = under-predicts  |  Positive = over-predicts  |  * = significant bias (p<0.05)"));
}

function renderFairnessEmployment() {
  const rows = data.fairness?.["Employment Status"];
  renderFairnessBias("fairness-employment", rows);
}

function renderFairnessBankruptcy() {
  const rows = data.fairness?.["Bankruptcy History"];
  renderFairnessBias("fairness-bankruptcy", rows);
}

function renderFairnessVariance() {
  const rows = data.fairness?.error_variance_by_bankruptcy;
  if (!rows || rows.length === 0) return;
  const svg = makeSvg(document.querySelector("#fairness-variance"), 640, 200);
  const margin = { top: 18, right: 50, bottom: 36, left: 130 };
  const innerW = 640 - margin.left - margin.right;
  const barH = 32;
  const gap = 14;
  const maxVal = Math.max(...rows.map((d) => d.error_std)) * 1.2;
  const x = scale([0, maxVal], [margin.left, margin.left + innerW]);

  rows.forEach((row, i) => {
    const y = margin.top + i * (barH + gap);
    svg.append(text({ x: margin.left - 10, y: y + barH / 2 + 5, "text-anchor": "end", class: "tick-label" }, `Bankruptcy=${row.group}`));
    svg.append(svgEl("rect", { x: margin.left, y, width: x(row.error_std), height: barH, rx: 5, fill: palette.blue, opacity: 0.8 }));
    svg.append(text({ x: margin.left + x(row.error_std) + 7, y: y + barH / 2 + 5, class: "bar-label" }, row.error_std.toFixed(2)));
  });
  svg.append(text({ x: margin.left, y: 180, class: "chart-label" }, "Error Std — higher = less reliable predictions"));
}

// ── INIT ─────────────────────────────────────────────────────────────────

function init() {
  renderSummary();
  renderMetricsTable();
  renderHorizontalMetricBars("#model-bars", data.metrics);
  renderLine("#knn-line", data.tuning.knn);
  renderHeatmap("#rf-heatmap", data.tuning.randomForest);
  renderParams();
  renderScatter();
  renderHistogram("#residual-hist", data.rfResidualHistogram, "Prediction error");
  renderSegmentTabs();
  renderImportance();
  renderCorrelation();
  renderApproval();
  renderPairs();
  renderCalibration();
  renderCoverage();
  renderStability();
  renderFairnessEmployment();
  renderFairnessBankruptcy();
  renderFairnessVariance();
}

init();
