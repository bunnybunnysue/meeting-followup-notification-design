const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Fi = require("react-icons/fi");
const fs = require("fs");

const COLOR = {
  navy: "1B2A4A",
  navyDark: "13203A",
  ice: "E7EEF7",
  iceLine: "C9D9EC",
  amber: "F2994A",
  amberDark: "C97A34",
  white: "FFFFFF",
  text: "1B2A4A",
  muted: "5C6B7A",
  green: "2E9E6D",
  red: "D1483F",
};

async function iconPng(IconComp, fillHex, sizePx = 128) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComp, { color: `#${fillHex}`, size: sizePx })
  );
  const full = `<svg xmlns="http://www.w3.org/2000/svg" width="${sizePx}" height="${sizePx}" viewBox="0 0 ${sizePx} ${sizePx}">${svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</svg>`;
  const buf = await sharp(Buffer.from(full)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function main() {
  const icons = {};
  const need = [
    ["mail", Fi.FiMail, "white"],
    ["mailNavy", Fi.FiMail, "navy"],
    ["inbox", Fi.FiInbox, "white"],
    ["clock", Fi.FiClock, "white"],
    ["send", Fi.FiSend, "white"],
    ["gitBranch", Fi.FiGitBranch, "white"],
    ["gitBranchNavy", Fi.FiGitBranch, "navy"],
    ["settings", Fi.FiSettings, "white"],
    ["shield", Fi.FiShield, "white"],
    ["cpu", Fi.FiCpu, "white"],
    ["eye", Fi.FiEye, "white"],
    ["fileText", Fi.FiFileText, "white"],
    ["fileTextNavy", Fi.FiFileText, "navy"],
    ["alertTriangle", Fi.FiAlertTriangle, "white"],
    ["alertTriangleNavy", Fi.FiAlertTriangle, "navy"],
    ["checkCircle", Fi.FiCheckCircle, "white"],
    ["helpCircle", Fi.FiHelpCircle, "white"],
    ["helpCircleAmber", Fi.FiHelpCircle, "amber"],
    ["messageSquare", Fi.FiMessageSquare, "white"],
    ["link", Fi.FiLink, "white"],
    ["gift", Fi.FiGift, "white"],
    ["layers", Fi.FiLayers, "white"],
    ["arrowRight", Fi.FiArrowRight, "white"],
    ["toggleRight", Fi.FiToggleRight, "navy"],
    ["checkSquare", Fi.FiCheckSquare, "navy"],
    ["xCircle", Fi.FiXCircle, "navy"],
    ["messageCircle", Fi.FiMessageCircle, "navy"],
    ["edit", Fi.FiEdit3, "white"],
    ["flag", Fi.FiFlag, "white"],
    ["x", Fi.FiX, "white"],
    ["checkWhite", Fi.FiCheck, "white"],
  ];
  for (const [key, comp, color] of need) {
    icons[key] = await iconPng(comp, COLOR[color] || color, 200);
  }

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  const PAGE_W = 13.33;
  const PAGE_H = 7.5;

  const FONT_HEAD = "Cambria";
  const FONT_BODY = "Calibri";

  function iconBadge(slide, cx, cy, d, iconKey, bg) {
    slide.addShape("ellipse", {
      x: cx - d / 2,
      y: cy - d / 2,
      w: d,
      h: d,
      fill: { color: bg },
      line: { type: "none" },
    });
    const isz = d * 0.52;
    slide.addImage({
      data: icons[iconKey],
      x: cx - isz / 2,
      y: cy - isz / 2,
      w: isz,
      h: isz,
    });
  }

  function footer(slide, pageNum, label) {
    slide.addText(label, {
      x: 0.5,
      y: PAGE_H - 0.42,
      w: 8,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 10,
      color: COLOR.muted,
      align: "left",
    });
    slide.addText(String(pageNum), {
      x: PAGE_W - 1.0,
      y: PAGE_H - 0.42,
      w: 0.5,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 10,
      color: COLOR.muted,
      align: "right",
    });
  }

  function sectionTitle(slide, kicker, title) {
    slide.addText(kicker.toUpperCase(), {
      x: 0.6,
      y: 0.42,
      w: 10,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 12,
      color: COLOR.amberDark,
      bold: true,
      charSpacing: 1,
    });
    slide.addText(title, {
      x: 0.6,
      y: 0.68,
      w: 12,
      h: 0.65,
      fontFace: FONT_HEAD,
      fontSize: 30,
      color: COLOR.navy,
      bold: true,
    });
  }

  // ---------- Slide 1: Title ----------
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.navy };
    s.addShape("ellipse", {
      x: 9.6,
      y: -2.3,
      w: 6.5,
      h: 6.5,
      fill: { color: COLOR.navyDark },
      line: { type: "none" },
    });
    s.addShape("ellipse", {
      x: -2.4,
      y: 4.6,
      w: 5.2,
      h: 5.2,
      fill: { color: COLOR.navyDark },
      line: { type: "none" },
    });
    iconBadge(s, 1.35, 1.55, 0.9, "mail", COLOR.amber);
    s.addText("MEETING FOLLOW-UP NOTIFICATIONS", {
      x: 0.85,
      y: 2.55,
      w: 11.6,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: COLOR.ice,
      bold: true,
      charSpacing: 2,
    });
    s.addText("通知框架", {
      x: 0.8,
      y: 2.95,
      w: 11.6,
      h: 1.3,
      fontFace: FONT_HEAD,
      fontSize: 54,
      color: COLOR.white,
      bold: true,
    });
    s.addText(
      "面向设计师的框架参考 —— 明确职责边界、推送机制与页面结构，作为二次 prototype 的起点",
      {
        x: 0.85,
        y: 4.25,
        w: 10.8,
        h: 0.6,
        fontFace: FONT_BODY,
        fontSize: 16,
        color: COLOR.iceLine,
      }
    );
    s.addShape("line", {
      x: 0.85,
      y: 5.05,
      w: 3.2,
      h: 0,
      line: { color: COLOR.amber, width: 2 },
    });
    s.addText("PRODUCT FRAMEWORK · V1", {
      x: 0.85,
      y: 6.75,
      w: 6,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 11,
      color: "8FA3BC",
      charSpacing: 1,
    });
  }

  // ---------- Slide 2: Background & Goal ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "背景", "为什么需要这套通知");
    s.addText(
      "会议结束后，ZoomMate 会产出 follow-up items（提取的任务、推断的任务、建议的 workflow）。生成结果要消耗算力，所以本期生成动作是手动的 —— 通知系统承担三件事：",
      {
        x: 0.6,
        y: 1.5,
        w: 11.9,
        h: 0.85,
        fontFace: FONT_BODY,
        fontSize: 15,
        color: COLOR.text,
        lineSpacingMultiple: 1.25,
      }
    );

    const items = [
      ["inbox", "告诉他有什么在等", "会后没看的话，让他知道这场会议产出了哪些 follow-up"],
      ["clock", "没开始时提醒他", "如果他一直没点生成，主动推一次，鼓励他开始"],
      ["send", "完成后直接送达", "一旦生成，把产物直接带到邮件里，减少一次跳转"],
    ];
    const cw = 3.85;
    const gap = 0.25;
    const startX = 0.6;
    const y0 = 2.75;
    items.forEach((it, i) => {
      const x = startX + i * (cw + gap);
      s.addShape("roundRect", {
        x,
        y: y0,
        w: cw,
        h: 3.35,
        rectRadius: 0.12,
        fill: { color: COLOR.ice },
        line: { type: "none" },
      });
      iconBadge(s, x + cw / 2, y0 + 0.85, 0.95, it[0], COLOR.navy);
      s.addText(it[1], {
        x: x + 0.25,
        y: y0 + 1.55,
        w: cw - 0.5,
        h: 0.6,
        fontFace: FONT_HEAD,
        fontSize: 18,
        bold: true,
        color: COLOR.navy,
        align: "center",
      });
      s.addText(it[2], {
        x: x + 0.35,
        y: y0 + 2.2,
        w: cw - 0.7,
        h: 1.0,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: COLOR.muted,
        align: "center",
        lineSpacingMultiple: 1.2,
      });
    });
    footer(s, 2, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 3: Two categories & ownership ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "核心决定", "两类邮件与责任边界");
    s.addText("我们不做深耦合，只做浅耦合", {
      x: 0.6,
      y: 1.42,
      w: 11.9,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 15,
      italic: true,
      color: COLOR.amberDark,
      bold: true,
    });

    const colW = 5.75;
    const colY = 2.05;
    const colH = 4.55;
    const leftX = 0.6;
    const rightX = leftX + colW + 0.45;

    // Left: ZoomMate
    s.addShape("roundRect", {
      x: leftX,
      y: colY,
      w: colW,
      h: colH,
      rectRadius: 0.12,
      fill: { color: COLOR.navy },
      line: { type: "none" },
    });
    iconBadge(s, leftX + 0.65, colY + 0.6, 0.7, "mail", COLOR.amber);
    s.addText("ZoomMate task emails", {
      x: leftX + 1.1,
      y: colY + 0.3,
      w: colW - 1.4,
      h: 0.6,
      fontFace: FONT_HEAD,
      fontSize: 19,
      bold: true,
      color: COLOR.white,
    });
    const leftLines = [
      "覆盖 New / Not-started reminder / Action required / Completed / Failed 全部 5 种状态",
      "谁来发：我们",
      "谁定样式：我们",
      "端到端由我们负责，触发、内容、样式全部在本系统内",
    ];
    let ly = colY + 1.25;
    leftLines.forEach((t) => {
      s.addText(t, {
        x: leftX + 0.4,
        y: ly,
        w: colW - 0.8,
        h: 0.65,
        fontFace: FONT_BODY,
        fontSize: 13.5,
        color: COLOR.iceLine,
        lineSpacingMultiple: 1.2,
        bullet: { code: "2022" },
      });
      ly += 0.72;
    });

    // Right: Workflow
    s.addShape("roundRect", {
      x: rightX,
      y: colY,
      w: colW,
      h: colH,
      rectRadius: 0.12,
      fill: { color: COLOR.ice },
      line: { color: COLOR.iceLine, width: 1 },
    });
    iconBadge(s, rightX + 0.65, colY + 0.6, 0.7, "gitBranch", COLOR.navy);
    s.addText("Workflow task emails", {
      x: rightX + 1.1,
      y: colY + 0.3,
      w: colW - 1.4,
      h: 0.6,
      fontFace: FONT_HEAD,
      fontSize: 19,
      bold: true,
      color: COLOR.navy,
    });
    const rightLines = [
      "覆盖状态：仅 New/suggested（作为我们 New 邮件里的一个 item 类型出现）",
      "谁来发：New/suggested 由我们发；一旦进入 review / completed / failed，由 Workflow 自己发",
      "谁定样式：我们给参考样式，Workflow 按同一视觉语言自行实现",
      "我们的 Workflow tab 只是样式参考，不是我们要发的邮件清单",
    ];
    ly = colY + 1.25;
    rightLines.forEach((t) => {
      s.addText(t, {
        x: rightX + 0.4,
        y: ly,
        w: colW - 0.8,
        h: 0.72,
        fontFace: FONT_BODY,
        fontSize: 13.5,
        color: COLOR.text,
        lineSpacingMultiple: 1.2,
        bullet: { code: "2022" },
      });
      ly += 0.78;
    });

    s.addText(
      "为什么这样切分：我们是「会后 N 分钟没读」的时间触发；Workflow 内部状态变化是事件触发。硬要在时间触发里等事件状态，会导致过时或冲突。",
      {
        x: 0.6,
        y: colY + colH + 0.08,
        w: 11.9,
        h: 0.35,
        fontFace: FONT_BODY,
        fontSize: 12,
        italic: true,
        color: COLOR.muted,
      }
    );
    footer(s, 3, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 4: Send mechanism ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "推送机制", "统一发送规则");
    s.addText(
      "不再用固定等待时长（例如「等 10 分钟」）。只要有新内容产出，在产出的那一刻立刻检查用户是否正在看：",
      {
        x: 0.6,
        y: 1.45,
        w: 11.9,
        h: 0.55,
        fontFace: FONT_BODY,
        fontSize: 14.5,
        color: COLOR.text,
      }
    );

    // Flow: 3 steps
    const steps = [
      ["fileText", "内容产出", "会后自动产出的 follow-up 列表，或用户手动 Generate 后的结果"],
      ["eye", "当下检查", "在产出的那一刻，立刻检查用户此刻是否正在看这个界面"],
      ["send", "未读才发", "在看 → 不发；已切走 / 没在看 → 立即发送，不等"],
    ];
    const stepW = 3.55;
    const stepGap = 0.55;
    const stepY = 2.35;
    const stepStartX = 0.9;
    steps.forEach((st, i) => {
      const x = stepStartX + i * (stepW + stepGap);
      s.addShape("roundRect", {
        x,
        y: stepY,
        w: stepW,
        h: 2.05,
        rectRadius: 0.1,
        fill: { color: i === 2 ? COLOR.navy : COLOR.ice },
        line: { type: "none" },
      });
      iconBadge(s, x + 0.62, stepY + 0.5, 0.62, st[0], i === 2 ? COLOR.amber : COLOR.navy);
      s.addText(st[1], {
        x: x + 0.24,
        y: stepY + 0.85,
        w: stepW - 0.5,
        h: 0.4,
        fontFace: FONT_HEAD,
        fontSize: 16,
        bold: true,
        color: i === 2 ? COLOR.white : COLOR.navy,
      });
      s.addText(st[2], {
        x: x + 0.24,
        y: stepY + 1.25,
        w: stepW - 0.5,
        h: 0.72,
        fontFace: FONT_BODY,
        fontSize: 11.5,
        color: i === 2 ? COLOR.iceLine : COLOR.muted,
        lineSpacingMultiple: 1.15,
      });
    });
    s.addShape("ellipse", { x: stepStartX + stepW + 0.02, y: stepY + 0.78, w: 0.48, h: 0.48, fill: { color: COLOR.amber }, line: { type: "none" } });
    s.addImage({ data: icons.arrowRight, x: stepStartX + stepW + 0.14, y: stepY + 0.9, w: 0.24, h: 0.24 });
    s.addShape("ellipse", { x: stepStartX + stepW * 2 + stepGap + 0.02, y: stepY + 0.78, w: 0.48, h: 0.48, fill: { color: COLOR.amber }, line: { type: "none" } });
    s.addImage({ data: icons.arrowRight, x: stepStartX + stepW * 2 + stepGap + 0.14, y: stepY + 0.9, w: 0.24, h: 0.24 });

    s.addText(
      "好处：同一套逻辑覆盖「会后自动产出」和「用户手动触发」两种场景，不需要为每种场景单独定义等待时长。",
      {
        x: 0.6,
        y: 4.65,
        w: 11.9,
        h: 0.45,
        fontFace: FONT_BODY,
        fontSize: 13,
        italic: true,
        color: COLOR.amberDark,
      }
    );

    // Separate reminder timeline
    s.addShape("roundRect", {
      x: 0.6,
      y: 5.25,
      w: 11.9,
      h: 1.4,
      rectRadius: 0.1,
      fill: { color: COLOR.ice },
      line: { type: "none" },
    });
    iconBadge(s, 1.2, 6.0, 0.62, "clock", COLOR.navy);
    s.addText("单独的「未开始」提醒时间线（只针对完全没生成任何内容的用户）", {
      x: 1.65,
      y: 5.42,
      w: 10.6,
      h: 0.35,
      fontFace: FONT_HEAD,
      fontSize: 14,
      bold: true,
      color: COLOR.navy,
    });
    s.addText(
      "会议结束 3 小时后仍未生成且未打开列表 → 发提醒  ·  最晚到用户时区 9:00 AM 发最后一次  ·  背靠背会议合并成一封",
      {
        x: 1.65,
        y: 5.85,
        w: 10.4,
        h: 0.8,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: COLOR.text,
        lineSpacingMultiple: 1.2,
      }
    );
    footer(s, 4, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 5: Tab mapping ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "页面结构", "Tab 与职责映射");
    const rows = [
      ["mail", "ZoomMate task emails", "5 种状态邮件（New / Reminder / Action required / Completed / Failed）", "交付物", COLOR.green],
      ["gitBranch", "Workflow task emails", "Workflow 状态邮件的样式参考", "仅供参考", COLOR.muted],
      ["settings", "Client settings", "My Notes › Settings › Notifications，用户自己的开关", "交付物", COLOR.green],
      ["shield", "Admin settings", "Web Portal › Account Settings，账号级开关", "交付物", COLOR.green],
      ["cpu", "HITL mapping", "ZoomMate human-in-the-loop 状态 → Action required 邮件的映射参考", "工程参考", COLOR.muted],
    ];
    let ry = 1.65;
    const rh = 1.0;
    rows.forEach((r) => {
      s.addShape("roundRect", {
        x: 0.6,
        y: ry,
        w: 11.9,
        h: rh - 0.15,
        rectRadius: 0.08,
        fill: { color: COLOR.ice },
        line: { type: "none" },
      });
      iconBadge(s, 1.2, ry + (rh - 0.15) / 2, 0.6, r[0], COLOR.navy);
      s.addText(r[1], {
        x: 1.65,
        y: ry + 0.08,
        w: 4.6,
        h: 0.6,
        fontFace: FONT_HEAD,
        fontSize: 15.5,
        bold: true,
        color: COLOR.navy,
        valign: "middle",
      });
      s.addText(r[2], {
        x: 6.3,
        y: ry + 0.06,
        w: 4.9,
        h: (rh - 0.15) - 0.1,
        fontFace: FONT_BODY,
        fontSize: 12,
        color: COLOR.muted,
        valign: "middle",
        lineSpacingMultiple: 1.15,
      });
      s.addShape("roundRect", {
        x: 11.35,
        y: ry + 0.22,
        w: 1.05,
        h: 0.42,
        rectRadius: 0.21,
        fill: { color: r[4] },
        line: { type: "none" },
      });
      s.addText(r[3], {
        x: 11.35,
        y: ry + 0.22,
        w: 1.05,
        h: 0.42,
        fontFace: FONT_BODY,
        fontSize: 10,
        bold: true,
        color: COLOR.white,
        align: "center",
        valign: "middle",
      });
      ry += rh;
    });
    footer(s, 5, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 6: ZoomMate state inventory ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "ZoomMate task emails", "状态清单");
    const states = [
      ["inbox", "New", "会后 follow-up 列表就绪、用户没在看", "只列未触发项，不展示进行中/已完成"],
      ["clock", "Not-started reminder", "会后 3 小时仍未生成 且 未打开列表", "同上内容，姿态更像提醒，最晚次日 9AM"],
      ["helpCircle", "Action required", "任务需要用户回答问题才能继续", "问题就绪即发，唯一 CTA 跳转 Zoom 完成"],
      ["checkCircle", "Completed", "单个任务产出结果、用户没在看", "一个任务一封，不聚合多个任务"],
      ["alertTriangle", "Failed", "出错的那一刻", "说明失败原因，CTA 为 View details"],
    ];
    let sy = 1.65;
    const sh = 0.98;
    states.forEach((st) => {
      s.addShape("roundRect", {
        x: 0.6,
        y: sy,
        w: 11.9,
        h: sh - 0.14,
        rectRadius: 0.08,
        fill: { color: COLOR.white },
        line: { color: COLOR.iceLine, width: 1 },
      });
      iconBadge(s, 1.2, sy + (sh - 0.14) / 2, 0.58, st[0], COLOR.navy);
      s.addText(st[1], {
        x: 1.65,
        y: sy + 0.06,
        w: 2.55,
        h: sh - 0.24,
        fontFace: FONT_HEAD,
        fontSize: 15,
        bold: true,
        color: COLOR.navy,
        valign: "middle",
      });
      s.addText(st[2], {
        x: 4.35,
        y: sy + 0.05,
        w: 4.1,
        h: sh - 0.22,
        fontFace: FONT_BODY,
        fontSize: 11.5,
        color: COLOR.muted,
        valign: "middle",
        lineSpacingMultiple: 1.1,
      });
      s.addText(st[3], {
        x: 8.6,
        y: sy + 0.05,
        w: 3.65,
        h: sh - 0.22,
        fontFace: FONT_BODY,
        fontSize: 11.5,
        color: COLOR.text,
        valign: "middle",
        lineSpacingMultiple: 1.1,
      });
      sy += sh;
    });
    footer(s, 6, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 7: Completed deep dive ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "Completed 深入", "任务卡片 + 产物");
    s.addShape("roundRect", {
      x: 0.6,
      y: 1.55,
      w: 11.9,
      h: 1.15,
      rectRadius: 0.1,
      fill: { color: COLOR.navy },
      line: { type: "none" },
    });
    iconBadge(s, 1.35, 2.12, 0.7, "checkCircle", COLOR.amber);
    s.addText("任务卡片标题永远是任务本身的标题", {
      x: 1.9,
      y: 1.72,
      w: 10.3,
      h: 0.4,
      fontFace: FONT_HEAD,
      fontSize: 16.5,
      bold: true,
      color: COLOR.white,
    });
    s.addText("和 New 邮件里出现的标题一致，不换成产物的名字 —— 这是本期明确核实过的易混淆点", {
      x: 1.9,
      y: 2.12,
      w: 10.3,
      h: 0.5,
      fontFace: FONT_BODY,
      fontSize: 12.5,
      color: COLOR.iceLine,
    });

    s.addText("产物类型（任务行下方，按类型堆叠展示）", {
      x: 0.6,
      y: 3.05,
      w: 8,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 13,
      bold: true,
      color: COLOR.navy,
    });

    const artifacts = [
      ["messageSquare", "Message", "对话消息"],
      ["mail", "Email", "邮件草稿"],
      ["fileText", "Doc", "文档产物"],
      ["link", "纯文字回答（新）", "无产物，回话 + 可选来源链接"],
    ];
    const aw = 2.85;
    const agap = 0.15;
    artifacts.forEach((a, i) => {
      const x = 0.6 + i * (aw + agap);
      s.addShape("roundRect", {
        x,
        y: 3.5,
        w: aw,
        h: 1.55,
        rectRadius: 0.1,
        fill: { color: COLOR.ice },
        line: { type: "none" },
      });
      iconBadge(s, x + aw / 2, 3.95, 0.55, a[0], COLOR.navy);
      s.addText(a[1], {
        x: x + 0.15,
        y: 4.32,
        w: aw - 0.3,
        h: 0.35,
        fontFace: FONT_HEAD,
        fontSize: 13,
        bold: true,
        color: COLOR.navy,
        align: "center",
      });
      s.addText(a[2], {
        x: x + 0.15,
        y: 4.66,
        w: aw - 0.3,
        h: 0.35,
        fontFace: FONT_BODY,
        fontSize: 10.5,
        color: COLOR.muted,
        align: "center",
      });
    });

    s.addText(
      "多产物（如同时产出 doc + sheet）→ 一个任务行 + 多个产物区块堆叠，不合并成一个区块。静态 HTML 邮件没有剪贴板能力，全部去掉 Copy 按钮。",
      {
        x: 0.6,
        y: 5.35,
        w: 11.9,
        h: 0.55,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        color: COLOR.muted,
        lineSpacingMultiple: 1.2,
      }
    );

    s.addShape("roundRect", {
      x: 0.6,
      y: 6.0,
      w: 11.9,
      h: 0.7,
      rectRadius: 0.1,
      fill: { color: "FBEFE3" },
      line: { type: "none" },
    });
    iconBadge(s, 1.18, 6.35, 0.48, "helpCircleAmber", "FDE3C4");
    s.addText("任务卡片 × 产物如何组合，仍是待设计探索的问题 —— 见第 10 页", {
      x: 1.6,
      y: 6.0,
      w: 10.7,
      h: 0.7,
      fontFace: FONT_BODY,
      fontSize: 13,
      bold: true,
      color: COLOR.amberDark,
      valign: "middle",
    });
    footer(s, 7, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 8: Client Settings ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "设置规格 · 我们负责", "Client Settings");
    s.addText("My Notes › Settings › Notifications  ——  ZoomMate 和 Workflow 两类邮件共用一套开关，用户不需要分别设置", {
      x: 0.6,
      y: 1.45,
      w: 11.9,
      h: 0.45,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: COLOR.muted,
      italic: true,
    });

    const rows = [
      ["toggleRight", "顶层 Email 总开关", "控制整体是否接收 follow-up 邮件"],
      ["checkSquare", "四个状态勾选", "New follow-ups / Action required / Completed / Failed —— 没有单独的 Not-started reminder 开关，它挂在 New follow-ups 偏好和发送规则上"],
      ["xCircle", "没有 Bundle per meeting", "讨论后决定去掉，避免过度设计"],
      ["messageCircle", "Chat apps 区块", "Zoom Team Chat 有真实开关；Slack / Microsoft Teams 只读状态 + 跳转到对应 app 管理"],
    ];
    let ry = 2.0;
    rows.forEach((r) => {
      s.addShape("roundRect", {
        x: 0.6,
        y: ry,
        w: 11.9,
        h: 1.05,
        rectRadius: 0.1,
        fill: { color: COLOR.ice },
        line: { type: "none" },
      });
      iconBadge(s, 1.25, ry + 0.54, 0.6, r[0], COLOR.white);
      s.addText(r[1], {
        x: 1.75,
        y: ry + 0.1,
        w: 3.5,
        h: 0.9,
        fontFace: FONT_HEAD,
        fontSize: 14.5,
        bold: true,
        color: COLOR.navy,
        valign: "middle",
      });
      s.addText(r[2], {
        x: 5.35,
        y: ry + 0.08,
        w: 6.9,
        h: 0.94,
        fontFace: FONT_BODY,
        fontSize: 12,
        color: COLOR.text,
        valign: "middle",
        lineSpacingMultiple: 1.15,
      });
      ry += 1.15;
    });
    footer(s, 8, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 9: Admin Settings ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "设置规格 · 我们负责", "Admin Settings");
    s.addText("Web Portal › Account Settings › My Notes › Notification  ——  复用现有大开关，不新开独立开关区块", {
      x: 0.6,
      y: 1.45,
      w: 11.9,
      h: 0.45,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: COLOR.muted,
      italic: true,
    });

    s.addShape("roundRect", {
      x: 0.6,
      y: 2.15,
      w: 11.9,
      h: 1.5,
      rectRadius: 0.1,
      fill: { color: COLOR.navy },
      line: { type: "none" },
    });
    iconBadge(s, 1.35, 2.9, 0.75, "shield", COLOR.amber);
    s.addText("Enable email notifications for My Notes（已有大开关）", {
      x: 1.9,
      y: 2.35,
      w: 10.3,
      h: 0.4,
      fontFace: FONT_HEAD,
      fontSize: 16,
      bold: true,
      color: COLOR.white,
    });
    s.addText("在它下面新增两个子勾选，而不是新开一个独立开关区块：", {
      x: 1.9,
      y: 2.78,
      w: 10.3,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: COLOR.iceLine,
    });

    const children = [
      ["Meeting summary in My Notes", "已有功能"],
      ["Follow-ups in My Notes", "新增 · NEW · P0"],
    ];
    let cx2 = 1.9;
    children.forEach((c) => {
      s.addShape("roundRect", { x: cx2, y: 3.2, w: 4.6, h: 0.36, rectRadius: 0.18, fill: { color: COLOR.amber }, line: { type: "none" } });
      s.addText(`${c[0]}  ·  ${c[1]}`, {
        x: cx2,
        y: 3.2,
        w: 4.6,
        h: 0.36,
        fontFace: FONT_BODY,
        fontSize: 11,
        bold: true,
        color: COLOR.navy,
        align: "center",
        valign: "middle",
      });
      cx2 += 4.85;
    });

    s.addShape("roundRect", {
      x: 0.6,
      y: 4.05,
      w: 11.9,
      h: 1.35,
      rectRadius: 0.1,
      fill: { color: COLOR.ice },
      line: { type: "none" },
    });
    iconBadge(s, 1.25, 4.72, 0.6, "xCircle", COLOR.white);
    s.addText("不做账号级别的「逐状态」控制", {
      x: 1.75,
      y: 4.22,
      w: 10.5,
      h: 0.4,
      fontFace: FONT_HEAD,
      fontSize: 15,
      bold: true,
      color: COLOR.navy,
    });
    s.addText(
      "不做「这个账号只能收 Completed，不能收 Action required」这种颗粒度 —— 会显著增加复杂度，且用户侧已有状态勾选，管理员只需控制「允许/不允许」这个大开关即可",
      {
        x: 1.75,
        y: 4.62,
        w: 10.5,
        h: 0.7,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        color: COLOR.text,
        lineSpacingMultiple: 1.2,
      }
    );
    footer(s, 9, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 10: Design Q1 ----------
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.navy };
    s.addShape("roundRect", {
      x: 0.6,
      y: 0.55,
      w: 3.6,
      h: 0.42,
      rectRadius: 0.21,
      fill: { color: COLOR.amber },
      line: { type: "none" },
    });
    s.addText("待设计探索 · 1 / 2", {
      x: 0.6,
      y: 0.55,
      w: 3.6,
      h: 0.42,
      fontFace: FONT_BODY,
      fontSize: 12,
      bold: true,
      color: COLOR.navy,
      align: "center",
      valign: "middle",
    });
    s.addText("Not-started Reminder 的\n「鼓励引导」设计", {
      x: 0.6,
      y: 1.15,
      w: 11.5,
      h: 1.5,
      fontFace: FONT_HEAD,
      fontSize: 32,
      bold: true,
      color: COLOR.white,
      lineSpacingMultiple: 1.05,
    });

    iconBadge(s, 1.5, 3.55, 1.0, "gift", COLOR.amber);
    s.addText(
      "用户会后没有手动点 Generate Follow Ups 时，我们推一封提醒邮件，目的很单一：鼓励他点击「Get my follow-ups」。",
      {
        x: 2.25,
        y: 3.05,
        w: 10.2,
        h: 1.0,
        fontFace: FONT_BODY,
        fontSize: 15,
        color: COLOR.iceLine,
        lineSpacingMultiple: 1.25,
      }
    );

    s.addShape("roundRect", {
      x: 0.6,
      y: 4.35,
      w: 11.9,
      h: 2.55,
      rectRadius: 0.1,
      fill: { color: COLOR.navyDark },
      line: { type: "none" },
    });
    s.addText("邮件里的任务列表内容，本质是「示意性质」的假数据", {
      x: 0.95,
      y: 4.58,
      w: 11.2,
      h: 0.4,
      fontFace: FONT_HEAD,
      fontSize: 16,
      bold: true,
      color: COLOR.amber,
    });
    s.addText(
      "因为用户还没生成任何东西，展示的是「这类会议通常会有的任务长什么样」，不是这场会议真实算出来的结果——可以类比成一个「广告页」式的呈现，目的是让用户觉得「点一下就能拿到这些」，而不是精确汇报当前状态。",
      {
        x: 0.95,
        y: 5.0,
        w: 11.2,
        h: 0.85,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: COLOR.iceLine,
        lineSpacingMultiple: 1.25,
      }
    );
    s.addText(
      "需要设计师专门探索：文案、视觉、要不要弱化「这是任务列表」的既视感、强化「一键搞定」的诱惑力，目前 prototype 只是占位，不代表最终方向。",
      {
        x: 0.95,
        y: 5.9,
        w: 11.2,
        h: 0.85,
        fontFace: FONT_BODY,
        fontSize: 13,
        italic: true,
        color: COLOR.ice,
        lineSpacingMultiple: 1.25,
      }
    );
    footer(s, 10, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 11: Design Q2 ----------
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.navy };
    s.addShape("roundRect", {
      x: 0.6,
      y: 0.55,
      w: 3.6,
      h: 0.42,
      rectRadius: 0.21,
      fill: { color: COLOR.amber },
      line: { type: "none" },
    });
    s.addText("待设计探索 · 2 / 2", {
      x: 0.6,
      y: 0.55,
      w: 3.6,
      h: 0.42,
      fontFace: FONT_BODY,
      fontSize: 12,
      bold: true,
      color: COLOR.navy,
      align: "center",
      valign: "middle",
    });
    s.addText("Completed 里「任务卡片」\n与「全部产物」的结合方式", {
      x: 0.6,
      y: 1.15,
      w: 11.9,
      h: 1.5,
      fontFace: FONT_HEAD,
      fontSize: 30,
      bold: true,
      color: COLOR.white,
      lineSpacingMultiple: 1.05,
    });

    iconBadge(s, 1.5, 3.55, 1.0, "layers", COLOR.amber);
    s.addText(
      "产品逻辑已经明确：既要有可点击查看详情的任务卡片，也要把这个任务产出的所有产物都展示出来，用户可以直接点击跳转去看每个产物。",
      {
        x: 2.25,
        y: 3.05,
        w: 10.2,
        h: 1.0,
        fontFace: FONT_BODY,
        fontSize: 15,
        color: COLOR.iceLine,
        lineSpacingMultiple: 1.25,
      }
    );

    s.addShape("roundRect", {
      x: 0.6,
      y: 4.35,
      w: 5.75,
      h: 2.55,
      rectRadius: 0.1,
      fill: { color: COLOR.navyDark },
      line: { type: "none" },
    });
    s.addText("目前 prototype 的处理方式", {
      x: 0.95,
      y: 4.58,
      w: 5.1,
      h: 0.4,
      fontFace: FONT_HEAD,
      fontSize: 15,
      bold: true,
      color: COLOR.amber,
    });
    s.addText(
      "任务卡片在上、产物区块在下、依次堆叠——但这只是一种可能的组合方式，不是定论。",
      {
        x: 0.95,
        y: 5.02,
        w: 5.1,
        h: 1.7,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: COLOR.iceLine,
        lineSpacingMultiple: 1.3,
      }
    );

    s.addShape("roundRect", {
      x: 6.6,
      y: 4.35,
      w: 5.9,
      h: 2.55,
      rectRadius: 0.1,
      fill: { color: COLOR.navyDark },
      line: { type: "none" },
    });
    s.addText("需要设计师探索的问题", {
      x: 6.95,
      y: 4.58,
      w: 5.3,
      h: 0.4,
      fontFace: FONT_HEAD,
      fontSize: 15,
      bold: true,
      color: COLOR.amber,
    });
    s.addText(
      "任务卡片和产物区块到底是什么关系——并列、主次、还是别的组织方式？尤其产物变多（doc + sheet + message 同时出现）时，怎样不散、又不显臃肿。",
      {
        x: 6.95,
        y: 5.02,
        w: 5.3,
        h: 1.7,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: COLOR.iceLine,
        lineSpacingMultiple: 1.3,
      }
    );
    footer(s, 11, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 12: Open engineering questions ----------
  {
    const s = pres.addSlide();
    sectionTitle(s, "待确认", "工程侧开放问题");
    const qs = [
      ["alertTriangle", "ZoomMate 能否实时暴露 error 状态", "决定 Failed 状态能否可靠触发，需要工程确认"],
      ["edit", "Action required 的展示形式", "只读表单预览 vs 纯文本列表，需要可用性测试后二选一"],
      ["gitBranch", "Workflow 自建通知的时间线", "Workflow 何时会为 completed / failed 建自己的通知，不由我们阻塞"],
    ];
    let qy = 1.75;
    qs.forEach((q, i) => {
      s.addShape("roundRect", {
        x: 0.6,
        y: qy,
        w: 11.9,
        h: 1.5,
        rectRadius: 0.1,
        fill: { color: COLOR.ice },
        line: { type: "none" },
      });
      s.addShape("ellipse", { x: 1.05, y: qy + 0.35, w: 0.8, h: 0.8, fill: { color: COLOR.navy }, line: { type: "none" } });
      s.addImage({ data: icons[q[0]] || icons.helpCircle, x: 1.25, y: qy + 0.55, w: 0.4, h: 0.4 });
      s.addText(q[1], {
        x: 2.1,
        y: qy + 0.22,
        w: 9.9,
        h: 0.5,
        fontFace: FONT_HEAD,
        fontSize: 16.5,
        bold: true,
        color: COLOR.navy,
      });
      s.addText(q[2], {
        x: 2.1,
        y: qy + 0.72,
        w: 9.9,
        h: 0.65,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: COLOR.muted,
        lineSpacingMultiple: 1.2,
      });
      qy += 1.68;
    });
    footer(s, 12, "Meeting Follow-up 通知框架");
  }

  // ---------- Slide 13: Closing / next steps ----------
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.navy };
    iconBadge(s, 1.35, 1.5, 0.9, "flag", COLOR.amber);
    s.addText("下一步", {
      x: 0.6,
      y: 2.15,
      w: 11.5,
      h: 0.8,
      fontFace: FONT_HEAD,
      fontSize: 38,
      bold: true,
      color: COLOR.white,
    });
    const nexts = [
      "设计师基于本框架，对第 10、11 页两个开放设计问题做二次 prototype 探索",
      "工程确认 ZoomMate error 状态可读性，明确 Failed 触发条件",
      "与 Workflow 团队对齐第 3 页的解耦边界，确认他们后续通知的时间线",
      "Action required 展示形式做一轮可用性测试后定稿",
    ];
    let ny = 3.2;
    nexts.forEach((n, i) => {
      s.addShape("ellipse", { x: 0.7, y: ny, w: 0.42, h: 0.42, fill: { color: COLOR.amber }, line: { type: "none" } });
      s.addText(String(i + 1), {
        x: 0.7,
        y: ny,
        w: 0.42,
        h: 0.42,
        fontFace: FONT_BODY,
        fontSize: 14,
        bold: true,
        color: COLOR.navy,
        align: "center",
        valign: "middle",
      });
      s.addText(n, {
        x: 1.3,
        y: ny - 0.06,
        w: 10.8,
        h: 0.55,
        fontFace: FONT_BODY,
        fontSize: 15,
        color: COLOR.iceLine,
        valign: "middle",
      });
      ny += 0.78;
    });
    footer(s, 13, "Meeting Follow-up 通知框架");
  }

  const outPath = "/Users/SueWang/Writing_Task/interactive_summary/design_handoff_followup_notifications/Meeting-Followup-Notification-Framework.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("written:", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
