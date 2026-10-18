/* ============================================================
 * 八字排盘 · 纯前端推算
 * 数据表：农历 1900-2100（lunarInfo / 节气 lTermInfo）
 * 来源：solarlunar（ISC License）https://github.com/yize/solarlunar
 * ============================================================ */
'use strict';

/* ---------- 基础常量 ---------- */

// 天干
var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
var ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 五行
var WUXING = ['木', '火', '土', '金', '水'];
// 五行颜色（UI 点缀，国风低饱和）
var WUXING_COLOR = {
  木: '#5b7a5a',
  火: '#a63d2f',
  土: '#a9843c',
  金: '#8a7d6b',
  水: '#3f5c6b'
};

// 天干五行
var GAN_WUXING = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
// 地支五行
var ZHI_WUXING = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
// 地支藏干
var ZHI_HIDDEN = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '庚', '戊'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲']
};

// 60 甲子纳音（每行 2 柱）
var NAYIN = {
  '甲子乙丑': '海中金', '丙寅丁卯': '炉中火', '戊辰己巳': '大林木',
  '庚午辛未': '路旁土', '壬申癸酉': '剑锋金', '甲戌乙亥': '山头火',
  '丙子丁丑': '涧下水', '戊寅己卯': '城头土', '庚辰辛巳': '白蜡金',
  '壬午癸未': '杨柳木', '甲申乙酉': '泉中水', '丙戌丁亥': '屋上土',
  '戊子己丑': '霹雳火', '庚寅辛卯': '松柏木', '壬辰癸巳': '长流水',
  '甲午乙未': '砂石金', '丙申丁酉': '山下火', '戊戌己亥': '平地木',
  '庚子辛丑': '壁上土', '壬寅癸卯': '金箔金', '甲辰乙巳': '覆灯火',
  '丙午丁未': '天河水', '戊申己酉': '大驿土', '庚戌辛亥': '钗钏金',
  '壬子癸丑': '桑柘木', '甲寅乙卯': '大溪水', '丙辰丁巳': '沙中土',
  '戊午己未': '天上火', '庚申辛酉': '石榴木', '壬戌癸亥': '大海水'
};

// 旬空（以日柱所在旬推算）
var XUN_KONG = {
  '甲子': '戌亥', '甲戌': '申酉', '甲申': '午未', '甲午': '辰巳',
  '甲辰': '寅卯', '甲寅': '子丑'
};

/* ---------- 农历数据表（1900-2100） ---------- */
// 每项：月大小 + 闰月信息（高位 0x10000 为闰月 30 天，低 4 位为闰月月份，0 为无闰月）
var lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520 // 2100
];

// 1900-2100 各年 24 节气日期（压缩十六进制表，每行 3 年 × 10 条）
// 1900-2100 nian 24 jieqi (ya suan shi liu jin zhi biao)
var lTermInfo = [
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
  '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
  'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
  '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
  '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
  '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
  '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
  '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
  '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
  '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
  '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
  '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
  '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
  '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
  '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
  '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
  '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
  '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
  '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
  '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
  '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
];

/* ---------- 农历换算 ---------- */

function lYearDays(y) {
  var i, sum = 348;
  var info = lunarInfo[y - 1900];
  for (i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y) {
  return lunarInfo[y - 1900] & 0xf;
}

function leapDays(y) {
  if (leapMonth(y)) {
    return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function monthDays(y, m) {
  return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

/**
 * 公历 -> 农历
 * @returns {{lYear,lMonth,lDay,isLeap}|null}
 */
function solar2lunar(y, m, d) {
  if (y < 1900 || y > 2100) return null;
  if (y === 1900 && m === 1 && d < 31) return null;

  var offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000;
  var i, temp = 0;
  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }
  var year = i;
  var leap = leapMonth(year);
  var isLeap = false;

  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === (leap + 1) && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDays(year);
    } else {
      temp = monthDays(year, i);
    }
    if (isLeap && i === (leap + 1)) {
      isLeap = false;
    }
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --i;
    }
  }
  if (offset < 0) {
    offset += temp;
    --i;
  }

  return { lYear: year, lMonth: i, lDay: offset + 1, isLeap: isLeap };
}

/* ---------- 节气 ---------- */

// 节气名，索引 0=小寒 ... 23=冬至
var TERM_NAMES = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];

/**
 * 返回公历 y 年第 n 个节气（1~24）的日期（日）
 */
function getTerm(y, n) {
  if (y < 1900 || y > 2100 || n < 1 || n > 24) return -1;
  var table = lTermInfo[y - 1900];
  var info = [];
  for (var i = 0; i < 6; i++) {
    info.push(parseInt('0x' + table.substr(i * 5, 5), 16).toString());
  }
  var day = [
    info[0].substr(0, 1), info[0].substr(1, 2), info[0].substr(3, 1), info[0].substr(4, 2),
    info[1].substr(0, 1), info[1].substr(1, 2), info[1].substr(3, 1), info[1].substr(4, 2),
    info[2].substr(0, 1), info[2].substr(1, 2), info[2].substr(3, 1), info[2].substr(4, 2),
    info[3].substr(0, 1), info[3].substr(1, 2), info[3].substr(3, 1), info[3].substr(4, 2),
    info[4].substr(0, 1), info[4].substr(1, 2), info[4].substr(3, 1), info[4].substr(4, 2),
    info[5].substr(0, 1), info[5].substr(1, 2), info[5].substr(3, 1), info[5].substr(4, 2)
  ];
  return parseInt(day[n - 1], 10);
}

/* ---------- 八字四柱 ---------- */

/**
 * 计算四柱
 * @param {number} y 公历年
 * @param {number} m 公历月
 * @param {number} d 公历日
 * @param {number} h 小时（0-23）
 */
function calcPillars(y, m, d, h) {
  // 年柱（以立春为界）
  var term3 = getTerm(y, 3); // 立春
  var gzY = toGanZhi(y - 4);
  if (m < 2 || (m === 2 && d < term3)) {
    gzY = toGanZhi(y - 5);
  }

  // 月柱（以节为界）
  var firstNode = getTerm(y, m * 2 - 1);
  var gzM = toGanZhi((y - 1900) * 12 + m + 11);
  if (d >= firstNode) {
    gzM = toGanZhi((y - 1900) * 12 + m + 12);
  }

  // 日柱
  var dayCyclical = Date.UTC(y, m - 1, 1) / 86400000 + 25567 + 10;
  var gzD = toGanZhi(dayCyclical + d - 1);

  // 时柱
  var hourZhiIndex = Math.floor((h + 1) / 2) % 12;
  var dayGanIndex = GAN.indexOf(gzD[0]);
  var hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10;
  var gzH = GAN[hourGanIndex] + ZHI[hourZhiIndex];

  return { year: gzY, month: gzM, day: gzD, hour: gzH };
}

function toGanZhi(offset) {
  offset = Math.floor(offset);
  return GAN[((offset % 10) + 10) % 10] + ZHI[((offset % 12) + 12) % 12];
}



/* ---------- 五行统计与信息 ---------- */


// 五行生克关系：生我（印）、我克（财）、克我（官）、我生（食伤）、同我（比劫）
function getRelation(myWu, otherWu) {
  var sheng = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' }; // 生我者
  var ke = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };    // 我克者
  if (myWu === otherWu) return '比劫';
  if (sheng[myWu] === otherWu) return '印';
  if (ke[myWu] === otherWu) return '财';
  if (sheng[otherWu] === myWu) return '食伤';
  return '官杀';
}

function buildChart(y, m, d, h) {
  var pillars = calcPillars(y, m, d, h);
  var lunar = solar2lunar(y, m, d);

  var charGans = [pillars.year[0], pillars.month[0], pillars.day[0], pillars.hour[0]];
  var charZhis = [pillars.year[1], pillars.month[1], pillars.day[1], pillars.hour[1]];
  var allChars = charGans.concat(charZhis);

  // 五行统计
  var count = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  allChars.forEach(function (c) {
    var w = GAN_WUXING[c] || ZHI_WUXING[c];
    if (w) count[w]++;
  });

  // 日主
  var dayMaster = pillars.day[0];
  var dayMasterWu = GAN_WUXING[dayMaster];

  // 生肖（按立春）
  var term3 = getTerm(y, 3);
  var animalYear = y;
  if (m < 2 || (m === 2 && d < term3)) animalYear = y - 1;
  var animal = ANIMALS[((animalYear - 4) % 12 + 12) % 12];

  // 藏干（四支）
  var hidden = charZhis.map(function (z) {
    return ZHI_HIDDEN[z].join('');
  }).join(' ');

  // 纳音
  var nayin = [pillars.year, pillars.month, pillars.day, pillars.hour].map(function (p) {
    var key = Object.keys(NAYIN).filter(function (k) {
      return k.indexOf(p) === 0 || k.indexOf(p) === 2;
    })[0];
    return key ? NAYIN[key] : '—';
  });

  // 旬空
  var dayXunKey = GAN[Math.floor(GAN.indexOf(pillars.day[0]) / 10) * 10] + ZHI[Math.floor(ZHI.indexOf(pillars.day[1]) / 10) * 10];
  var xunkong = XUN_KONG[dayXunKey] || '—';

  // 主星（日主五行 vs 日支五行，生我者为印）
  var dayBranchWu = ZHI_WUXING[pillars.day[1]];
  var master = getRelation(dayMasterWu, dayBranchWu);

  // ---- 新增：命理详解所需数据（不影响原有逻辑） ----
  // 四柱十神（以日主为基准）
  var tenGods = ['', '', '', ''];
  for (var tg = 0; tg < 4; tg++) {
    tenGods[tg] = getTenGod(dayMaster, charGans[tg]);
  }
  // 藏干列表（四支各自的藏干数组）
  var hiddenGans = charZhis.map(function (z) {
    return ZHI_HIDDEN[z].slice();
  });

  return {
    pillars: pillars,
    lunar: lunar,
    count: count,
    dayMaster: dayMaster,
    dayMasterWu: dayMasterWu,
    animal: animal,
    hidden: hidden,
    nayin: nayin,
    xunkong: xunkong,
    master: master,
    term3: term3,
    // 新增字段
    tenGods: tenGods,
    hiddenGans: hiddenGans,
    charGans: charGans,
    charZhis: charZhis
  };
}

/* ============================================================
 * 命理详解模块（新增，不影响原有排盘逻辑）
 * 内容基于四柱十神、五行强弱做客观通俗的参考性分析
 * ============================================================ */

/* ---------- 十神 ---------- */

// 十神名称（阳日主用阳干对照，阴日主用阴干对照）
// 与日主五行关系：同我=比劫、生我=印、我生=食伤、我克=财、克我=官杀
var SHISHEN = {
  甲: { 甲: '比肩', 乙: '劫财', 丙: '食神', 丁: '伤官', 戊: '偏财', 己: '正财', 庚: '七杀', 辛: '正官', 壬: '偏印', 癸: '正印' },
  乙: { 乙: '比肩', 甲: '劫财', 丁: '食神', 丙: '伤官', 己: '偏财', 戊: '正财', 辛: '七杀', 庚: '正官', 癸: '偏印', 壬: '正印' },
  丙: { 丙: '比肩', 丁: '劫财', 戊: '食神', 己: '伤官', 庚: '偏财', 辛: '正财', 壬: '七杀', 癸: '正官', 甲: '偏印', 乙: '正印' },
  丁: { 丁: '比肩', 丙: '劫财', 己: '食神', 戊: '伤官', 辛: '偏财', 庚: '正财', 癸: '七杀', 壬: '正官', 乙: '偏印', 甲: '正印' },
  戊: { 戊: '比肩', 己: '劫财', 庚: '食神', 辛: '伤官', 壬: '偏财', 癸: '正财', 甲: '七杀', 乙: '正官', 丙: '偏印', 丁: '正印' },
  己: { 己: '比肩', 戊: '劫财', 辛: '食神', 庚: '伤官', 癸: '偏财', 壬: '正财', 乙: '七杀', 甲: '正官', 丁: '偏印', 丙: '正印' },
  庚: { 庚: '比肩', 辛: '劫财', 壬: '食神', 癸: '伤官', 甲: '偏财', 乙: '正财', 丙: '七杀', 丁: '正官', 戊: '偏印', 己: '正印' },
  辛: { 辛: '比肩', 庚: '劫财', 癸: '食神', 壬: '伤官', 乙: '偏财', 甲: '正财', 丁: '七杀', 丙: '正官', 己: '偏印', 戊: '正印' },
  壬: { 壬: '比肩', 癸: '劫财', 甲: '食神', 乙: '伤官', 丙: '偏财', 丁: '正财', 戊: '七杀', 己: '正官', 庚: '偏印', 辛: '正印' },
  癸: { 癸: '比肩', 壬: '劫财', 乙: '食神', 甲: '伤官', 丁: '偏财', 丙: '正财', 己: '七杀', 戊: '正官', 辛: '偏印', 庚: '正印' }
};

/** 取某干相对日主的十神 */
function getTenGod(dayGan, otherGan) {
  var map = SHISHEN[dayGan];
  return map ? (map[otherGan] || '') : '';
}

/* ---------- 五行强弱（简易） ---------- */

/**
 * 简易五行强弱评估：
 * 以「得令」（月令五行生扶日主）与「党众」（同五行数量）为两个维度，
 * 输出 强 / 中 / 弱 三档。仅用于文案参考，不作命理定论。
 */
function assessStrength(chart) {
  var master = chart.dayMasterWu;          // 日主五行
  var monthWu = GAN_WUXING[chart.pillars.month[0]] || ZHI_WUXING[chart.pillars.month[1]];
  var sheng = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' }; // 生我
  var score = 0;
  // 得令：月干或月支五行生扶日主
  if (monthWu === master) score += 2;
  else if (sheng[master] === monthWu) score += 1.5;
  // 党众：八字中同五行（含藏干）数量
  var sameCount = chart.count[master];
  // 藏干里同五行的也算
  chart.hiddenGans.forEach(function (arr) {
    arr.forEach(function (g) {
      if (GAN_WUXING[g] === master) sameCount += 0.5;
    });
  });
  score += sameCount * 0.5;

  if (score >= 4) return '偏强';
  if (score <= 2) return '偏弱';
  return '中和';
}

/* ---------- 大运计算 ---------- */

/**
 * 起运与大运排法（传统简便法）：
 * - 性别：男命阳年干顺排、阴年干逆排；女命阴年干顺排、阳年干逆排。
 * - 起运时间：按出生日距最近「节」的天数，3 天 = 1 岁（取整，最少 1 岁）。
 * - 大运干支：从月柱起，顺排则下一柱，逆排则上一柱，每步 10 年。
 */
function calcDaYun(chart, y, m, d, h, gender) {
  var yearGan = chart.pillars.year[0];
  var yang = (yearGan === '甲' || yearGan === '丙' || yearGan === '戊' || yearGan === '庚' || yearGan === '壬');
  var forward = (gender === 'male') ? yang : !yang;

  // 出生日距最近「节」的天数
  // 月柱对应的「节」：小寒(1)、立春(3)、惊蛰(5)、清明(7)、立夏(9)、芒种(11)、小暑(13)、立秋(15)、白露(17)、寒露(19)、立冬(21)、大雪(23)
  var jieIndex = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]; // 12 个节在 24 节气中的序号
  var mIdx = m - 1;
  var jie = getTerm(y, jieIndex[mIdx]); // 本月「节」的日期
  var daysToJie;
  if (forward) {
    // 顺排：找下一个节
    var nextJie = (m === 12) ? getTerm(y + 1, 1) : getTerm(y, jieIndex[m]);
    var nextMonthDays = (m === 12) ? 31 : new Date(y, m, 0).getDate();
    daysToJie = (nextJie - d);
    if (daysToJie < 0) daysToJie += nextMonthDays;
  } else {
    // 逆排：找上一个节（即本月节）
    daysToJie = (d - jie);
    if (daysToJie < 0) {
      var prevMonthDays = new Date(y, m - 1, 0).getDate();
      daysToJie += prevMonthDays;
    }
  }

  // 3 天 = 1 岁，余数折算为月（1 天≈4 个月），最少 1 岁
  var qiYunAge = Math.max(1, Math.round(daysToJie / 3));
  var startYear = y + qiYunAge;

  // 从月柱起排大运
  var monthPillar = chart.pillars.month;
  var mGanIdx = GAN.indexOf(monthPillar[0]);
  var mZhiIdx = ZHI.indexOf(monthPillar[1]);
  var dayun = [];
  for (var i = 1; i <= 8; i++) {
    var gIdx = forward ? (mGanIdx + i) % 10 : ((mGanIdx - i) % 10 + 10) % 10;
    var zIdx = forward ? (mZhiIdx + i) % 12 : ((mZhiIdx - i) % 12 + 12) % 12;
    var gz = GAN[gIdx] + ZHI[zIdx];
    var from = startYear + (i - 1) * 10;
    var to = from + 9;
    dayun.push({ gz: gz, from: from, to: to, ageFrom: qiYunAge + (i - 1) * 10, ageTo: qiYunAge + (i - 1) * 10 + 9 });
  }
  return { qiYunAge: qiYunAge, startYear: startYear, list: dayun, forward: forward };
}

/* ---------- 流年计算 ---------- */

/** 计算某公历年的流年干支 */
function getLiuNianGz(year) {
  return toGanZhi(year - 4);
}

/** 流年吉凶提示（以十神关系 + 五行喜忌为参考，措辞理性） */
function analyzeLiuNian(chart, year) {
  var gz = getLiuNianGz(year);
  var gan = gz[0], zhi = gz[1];
  var tenGod = getTenGod(chart.dayMaster, gan);
  var ganWu = GAN_WUXING[gan];
  var zhiWu = ZHI_WUXING[zhi];
  var masterWu = chart.dayMasterWu;

  // 五行对日主的扶抑判断
  var sheng = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' };
  var ke = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
  var tips = [];
  var tone = '中平';

  // 十神维度提示
  var tenTips = {
    比肩: '利于合作、团队与同伴支持，竞争也会增多，适合稳扎稳打。',
    劫财: '社交活跃但开销偏大，注意财务规划与人际边界。',
    食神: '心态放松，适合学习、创作与享受生活，工作节奏可放缓。',
    伤官: '表达欲强、思路活跃，利创意输出，但注意言行分寸。',
    偏财: '偏财机会增多，适合投资与副业，但需控制风险。',
    正财: '正财稳定，收入与工作回报可期，适合务实理财。',
    七杀: '压力与挑战并存，责任加重，宜沉着应对，不宜冒进。',
    正官: '规则感增强，事业上易获认可，适合按部就班推进。',
    偏印: '学习与思考深入，但容易多虑，注意休息与情绪调节。',
    正印: '贵人运较好，适合进修与求稳，家庭支持增多。'
  };
  if (tenTips[tenGod]) tips.push('流年天干 ' + gan + ' 为「' + tenGod + '」：' + tenTips[tenGod]);

  // 五行生克维度
  if (ganWu === masterWu) {
    tips.push('流年五行与日主同气，自我能量充足，行动力强。');
    tone = '平顺';
  } else if (sheng[masterWu] === ganWu) {
    tips.push('流年五行生扶日主，精力与贵人缘有所提升。');
    tone = '偏吉';
  } else if (ke[masterWu] === ganWu) {
    tips.push('流年五行受日主所克，机会增多但需量力而行。');
  } else if (sheng[ganWu] === masterWu) {
    tips.push('流年五行生助日主所克之对象，注意精力分散与操劳。');
  } else {
    tips.push('流年五行克制日主，宜放缓节奏、注重健康与休息。');
    tone = '偏紧';
  }

  return {
    year: year,
    gz: gz,
    gan: gan,
    zhi: zhi,
    tenGod: tenGod,
    tone: tone,
    tips: tips
  };
}


/* ---------- 八模块分析文案 ---------- */

// 十神 → 性格关键词
var SHISHEN_CHAR = {
  比肩: '独立自主，重视同伴',
  劫财: '行动力强，慷慨重义',
  食神: '温和从容，懂得享受',
  伤官: '聪慧敏锐，表达欲强',
  偏财: '开朗灵活，善于把握机会',
  正财: '务实稳重，重视积累',
  七杀: '果敢担当，抗压能力强',
  正官: '自律守则，责任感强',
  偏印: '思考深入，直觉敏锐',
  正印: '温和包容，重视学习'
};

// 五行 → 性格倾向
var WUXING_CHAR = {
  木: '正直向上，有成长意识',
  火: '热情主动，行动直接',
  土: '沉稳踏实，包容可靠',
  金: '果断坚韧，讲求原则',
  水: '灵活变通，善于沟通'
};

/**
 * 模块①：性格倾向
 * 依据：日主五行 + 月柱十神 + 五行强弱
 */
function analyzeCharacter(chart) {
  var parts = [];
  parts.push('日主为「' + chart.dayMaster + '」属' + chart.dayMasterWu + '行，' + WUXING_CHAR[chart.dayMasterWu] + '。');
  var monthTen = chart.tenGods[1];
  if (monthTen && SHISHEN_CHAR[monthTen]) {
    parts.push('月柱见「' + monthTen + '」，' + SHISHEN_CHAR[monthTen] + '，对整体性格影响较明显。');
  }
  var strength = assessStrength(chart);
  if (strength === '偏强') {
    parts.push('命局五行' + strength + '，主观意志较坚定，行动有主见，但宜多倾听他人意见。');
  } else if (strength === '偏弱') {
    parts.push('命局五行' + strength + '，性格偏内敛细腻，善于配合他人，宜增强自我主张。');
  } else {
    parts.push('命局五行趋于' + strength + '，性格刚柔并济，适应力较好。');
  }
  return parts.join('');
}

/**
 * 模块②：事业财运
 * 依据：正财/偏财/正官/七杀十神分布 + 五行强弱
 */
function analyzeCareer(chart) {
  var parts = [];
  var gods = chart.tenGods;
  var hasCai = gods.indexOf('正财') >= 0 || gods.indexOf('偏财') >= 0;
  var hasGuan = gods.indexOf('正官') >= 0 || gods.indexOf('七杀') >= 0;
  var hasYin = gods.indexOf('正印') >= 0 || gods.indexOf('偏印') >= 0;

  if (hasCai) {
    parts.push('四柱见财星，对财富积累与机会把握较敏感，适合从事与资源、经营、实务相关的方向。');
  } else {
    parts.push('四柱财星不显，财运多来自专业能力与长期积累，宜稳扎稳打。');
  }
  if (hasGuan) {
    parts.push('见官杀星，有责任心与管理潜质，适合规范化、有章法的工作环境。');
  }
  if (hasYin) {
    parts.push('有印星护持，学习能力和贵人助力较好，利于专业深造与口碑积累。');
  }
  var strength = assessStrength(chart);
  if (strength === '偏强') {
    parts.push('自身能量较足，适合开拓性、挑战性较强的领域，但要注意合作分工。');
  } else if (strength === '偏弱') {
    parts.push('自身能量偏柔，更适合依托平台与团队，借势发展比单打独斗更稳妥。');
  }
  parts.push('建议：职业选择结合个人兴趣与专业积累，财务上量入为出、长期规划。');
  return parts.join('');
}

/**
 * 模块③：婚姻感情
 * 依据：日支（配偶宫）藏干 + 财官星 + 五行强弱
 */
function analyzeMarriage(chart) {
  var parts = [];
  var dayZhi = chart.pillars.day[1];
  var hidden = ZHI_HIDDEN[dayZhi];
  var dayZhiWu = ZHI_WUXING[dayZhi];
  parts.push('日支为配偶宫，坐「' + dayZhi + '」（' + dayZhiWu + '行），藏干「' + hidden.join('、') + '」。');
  parts.push('配偶宫藏干较丰富，意味着感情关系中重视内在契合与相互支持。');

  var gods = chart.tenGods;
  var hasCai = gods.indexOf('正财') >= 0 || gods.indexOf('偏财') >= 0;
  var hasGuan = gods.indexOf('正官') >= 0 || gods.indexOf('七杀') >= 0;
  if (hasCai) {
    parts.push('财星入命，对感情较为投入，愿意为关系付出，也较重视生活品质。');
  }
  if (hasGuan) {
    parts.push('官星入命，重视责任与承诺，在感情中偏理性、重长远。');
  }
  var strength = assessStrength(chart);
  if (strength === '偏强') {
    parts.push('性格较有主见，感情中宜多换位思考，避免强势主导。');
  } else if (strength === '偏弱') {
    parts.push('性格温和，感情中易迁就对方，宜学会表达自己的真实需求。');
  }
  parts.push('建议：经营感情如同经营习惯，坦诚沟通与日常陪伴比激情更长久。');
  return parts.join('');
}

/**
 * 模块④：六亲关系
 * 依据：印星（母/长辈）、财星（父）、比劫（兄弟姐妹/朋友）
 */
function analyzeFamily(chart) {
  var parts = [];
  var gods = chart.tenGods;
  var hasYin = gods.indexOf('正印') >= 0 || gods.indexOf('偏印') >= 0;
  var hasCai = gods.indexOf('正财') >= 0 || gods.indexOf('偏财') >= 0;
  var hasBi = gods.indexOf('比肩') >= 0 || gods.indexOf('劫财') >= 0;

  if (hasYin) {
    parts.push('印星可见，通常与母亲、长辈缘分较深，容易获得家庭的支持与庇护。');
  } else {
    parts.push('印星不显，与长辈的相处更偏向独立自主，亲子关系需主动经营。');
  }
  if (hasCai) {
    parts.push('财星可见，与父辈或物质层面的联结较紧密，家庭责任意识较强。');
  }
  if (hasBi) {
    parts.push('比劫入命，手足或朋友缘分较多，社交圈活跃，但也需注意利益边界。');
  } else {
    parts.push('比劫不显，更习惯独处与自主决策，朋友不在多而在于精。');
  }
  parts.push('建议：亲情重在陪伴质量，定期与家人沟通、表达关心，关系会更融洽。');
  return parts.join('');
}



/**
 * 模块⑤：健康提示
 * 依据：五行缺旺 + 日主强弱（仅作生活方式参考）
 */
function analyzeHealth(chart) {
  var parts = [];
  var zero = [];
  WUXING.forEach(function (w) {
    if (chart.count[w] === 0) zero.push(w);
  });
  var max = 0, maxWu = '';
  WUXING.forEach(function (w) {
    if (chart.count[w] > max) { max = chart.count[w]; maxWu = w; }
  });

  var healthMap = {
    木: '肝胆、筋骨与情绪调节',
    火: '心血管、睡眠与精神状态',
    土: '脾胃消化与饮食规律',
    金: '呼吸系统与皮肤',
    水: '肾脏泌尿与循环代谢'
  };
  if (zero.length > 0) {
    parts.push('八字中「' + zero.join('、') + '」五行偏弱，日常可留意与' + zero.map(function (w) { return healthMap[w]; }).join('、') + '相关的保养。');
  }
  if (maxWu && chart.count[maxWu] >= 3) {
    parts.push('「' + maxWu + '」五行较旺，注意' + healthMap[maxWu] + '方面的平衡，避免过劳。');
  }
  var strength = assessStrength(chart);
  if (strength === '偏弱') {
    parts.push('命局偏弱，精力易透支，规律作息与适度运动尤为重要。');
  }
  parts.push('提示：以上仅为五行视角的生活参考，健康问题请以专业医疗意见为准。');
  return parts.join('');
}

/**
 * 模块⑥：学业考运
 * 依据：印星（学习吸收）、食伤（表达发挥）、官星（自律）
 */
function analyzeStudy(chart) {
  var parts = [];
  var gods = chart.tenGods;
  var hasYin = gods.indexOf('正印') >= 0 || gods.indexOf('偏印') >= 0;
  var hasShi = gods.indexOf('食神') >= 0 || gods.indexOf('伤官') >= 0;
  var hasGuan = gods.indexOf('正官') >= 0;

  if (hasYin) {
    parts.push('印星入命，学习吸收能力较好，适合系统化、深度化的知识积累。');
  } else {
    parts.push('印星不显，学习更适合以兴趣驱动、实践结合的方式推进。');
  }
  if (hasShi) {
    parts.push('食伤星可见，表达与输出能力强，考试临场发挥与创意答题是优势。');
  }
  if (hasGuan) {
    parts.push('正官入命，自律性和计划性较好，长期备考有耐力优势。');
  }
  var strength = assessStrength(chart);
  if (strength === '偏强') {
    parts.push('精力充沛，适合高强度的集中学习，但要注意劳逸结合。');
  } else if (strength === '偏弱') {
    parts.push('精力偏柔，学习宜分解目标、小步推进，避免一次性透支。');
  }
  parts.push('建议：找到适合自己的节奏比拼时长更重要，稳定输出胜过临时突击。');
  return parts.join('');
}

/**
 * 模块⑦：大运流年吉凶（文字概述）
 * 依据：大运五行与日主扶抑 + 十神
 */
function analyzeDaYunTrend(chart, dayun) {
  var parts = [];
  parts.push('约' + dayun.qiYunAge + '岁起运，每十年一换大运，共排八步。');
  parts.push('整体而言，大运吉凶取决于每一步干支五行对日主的扶抑：生扶日主或助益喜用则相对顺遂，反之则需更谨慎。');
  // 找出相对最顺遂的一步
  var best = null, bestScore = -999;
  dayun.list.forEach(function (step) {
    var gz = step.gz;
    var wu = GAN_WUXING[gz[0]];
    var sheng = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' };
    var score = 0;
    if (wu === chart.dayMasterWu) score += 2;
    else if (sheng[chart.dayMasterWu] === wu) score += 1;
    else score -= 1;
    step.score = score;
    if (score > bestScore) { bestScore = score; best = step; }
  });
  if (best) {
    parts.push('其中「' + best.gz + '」运（' + best.from + '–' + best.to + '年）五行与日主较为相合，是值得把握的阶段。');
  }
  return parts.join('');
}

/**
 * 模块⑧：综合建议
 * 汇总前面要点，给出理性参考
 */
function analyzeSummary(chart) {
  var parts = [];
  var strength = assessStrength(chart);
  var zero = [];
  WUXING.forEach(function (w) { if (chart.count[w] === 0) zero.push(w); });

  parts.push('整体来看，命局五行' + strength + '，日主为' + chart.dayMasterWu + '行「' + chart.dayMaster + '」。');
  if (zero.length > 0) {
    var fillTips = [];
    if (zero.indexOf('水') >= 0) fillTips.push('灵活变通、沟通协调');
    if (zero.indexOf('木') >= 0) fillTips.push('规划生长、持续学习');
    if (zero.indexOf('火') >= 0) fillTips.push('热情主动、表达展示');
    if (zero.indexOf('金') >= 0) fillTips.push('果断决断、原则边界');
    if (zero.indexOf('土') >= 0) fillTips.push('沉稳落地、长期积累');
    parts.push('「' + zero.join('、') + '」五行偏缺，可在生活与事业中有意识地补足相关特质（如' + fillTips.join('、') + '）。');
  }
  parts.push('八字提供的是先天气质与倾向的参考，后天的选择、努力与环境影响往往更大。');
  parts.push('建议：扬长避短——发挥命局中的优势五行特质，对偏弱领域保持有意识的学习与练习，人生路径依然掌握在自己手中。');
  return parts.join('');
}


/* ---------- 数字转中文 ---------- */

var CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
var CN_MONTH = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
var CN_DAY_PREFIX = ['初', '十', '廿', '卅'];

function cnYear(y) {
  return String(y).split('').map(function (c) {
    return CN_NUM[Number(c)];
  }).join('') + '年';
}

function cnMonth(m) {
  return (m === 1 ? '正' : CN_MONTH[m - 1]) + '月';
}

function cnDay(d) {
  if (d === 10) return '初十';
  if (d === 20) return '二十';
  if (d === 30) return '三十';
  var s = CN_DAY_PREFIX[Math.floor(d / 10)];
  return s + CN_NUM[d % 10];
}

/* ---------- 时辰选项 ---------- */

var HOUR_OPTIONS = [
  { v: 23, label: '子时 (23:00-00:59)' },
  { v: 1, label: '丑时 (01:00-02:59)' },
  { v: 3, label: '寅时 (03:00-04:59)' },
  { v: 5, label: '卯时 (05:00-06:59)' },
  { v: 7, label: '辰时 (07:00-08:59)' },
  { v: 9, label: '巳时 (09:00-10:59)' },
  { v: 11, label: '午时 (11:00-12:59)' },
  { v: 13, label: '未时 (13:00-14:59)' },
  { v: 15, label: '申时 (15:00-16:59)' },
  { v: 17, label: '酉时 (17:00-18:59)' },
  { v: 19, label: '戌时 (19:00-20:59)' },
  { v: 21, label: '亥时 (21:00-22:59)' }
];

/* ---------- DOM 渲染 ---------- */

function render() {
  var y = parseInt(document.getElementById('input-year').value, 10);
  var m = parseInt(document.getElementById('input-month').value, 10);
  var d = parseInt(document.getElementById('input-day').value, 10);
  var h = parseInt(document.getElementById('input-hour').value, 10);

  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    alert('请完整填写公历出生年月日');
    return;
  }
  if (y < 1900 || y > 2100) {
    alert('仅支持 1900–2100 年');
    return;
  }
  if (y === 1900 && (m === 1 && d < 31)) {
    alert('农历数据从 1900 年 1 月 31 日开始');
    return;
  }

  var chart = buildChart(y, m, d, h);
  var result = document.getElementById('result');
  result.hidden = false;

  // 农历
  var lunar = chart.lunar;
  var lunarText = cnYear(lunar.lYear) + (lunar.isLeap ? '闰' : '') + cnMonth(lunar.lMonth) + cnDay(lunar.lDay);
  document.getElementById('result-lunar').textContent = '农历 ' + lunarText;

  // 四柱
  var pillars = chart.pillars;
  var labels = ['年柱', '月柱', '日柱', '时柱'];
  var keys = ['year', 'month', 'day', 'hour'];
  var html = '';
  for (var i = 0; i < 4; i++) {
    var p = pillars[keys[i]];
    var gan = p[0], zhi = p[1];
    var ganWu = GAN_WUXING[gan], zhiWu = ZHI_WUXING[zhi];
    var colorGan = WUXING_COLOR[ganWu], colorZhi = WUXING_COLOR[zhiWu];
    var sub = '纳音 ' + (chart.nayin[i] || '—') + ' · 藏干 ' + ZHI_HIDDEN[zhi].join('');
    html +=
      '<div class="pillar">' +
      '<div class="pillar-label">' + labels[i] + '</div>' +
      '<span class="pillar-char gan" style="color:' + colorGan + '">' + gan + '</span>' +
      '<span class="pillar-char zhi" style="color:' + colorZhi + '">' + zhi + '</span>' +
      '<span class="pillar-sub">' + sub + '</span>' +
      '</div>';
  }
  document.getElementById('pillars').innerHTML = html;

  // 五行
  var count = chart.count;
  var elHtml = '';
  var desc = { 木: '主仁 · 曲直', 火: '主礼 · 炎上', 土: '主信 · 稼穑', 金: '主义 · 从革', 水: '主智 · 润下' };
  WUXING.forEach(function (w) {
    var n = count[w];
    var isMaster = (w === chart.dayMasterWu);
    var strong = isMaster;
    var elClass = 'el-name' + (strong ? ' strong' : '');
    var cntClass = 'el-count' + (n === 0 ? ' zero' : '');
    elHtml +=
      '<div class="element">' +
      '<span class="' + elClass + '" style="color:' + (strong ? WUXING_COLOR[w] : 'inherit') + '">' + w + '</span>' +
      '<span class="' + cntClass + '">' + n + '</span>' +
      '<span class="el-desc">' + desc[w] + (isMaster ? ' · 日主' : '') + '</span>' +
      '</div>';
  });
  document.getElementById('elements-row').innerHTML = elHtml;

  // 元信息
  document.getElementById('meta-animal').textContent = chart.animal;
  document.getElementById('meta-master').textContent = chart.dayMaster + '(' + chart.dayMasterWu + ') ' + chart.master;
  document.getElementById('meta-hidden').textContent = chart.hidden;
  document.getElementById('meta-nayin').textContent = chart.nayin.join(' · ');
  document.getElementById('meta-xunkong').textContent = chart.xunkong;

  // ---- 新增：命理详解渲染 ----
  renderInsight(chart, y, m, d, h);
}


/* ---------- 命理详解渲染 ---------- */

// 8 个模块的定义（标题 + 分析函数）
var INSIGHT_MODULES = [
  { seal: '壹', title: '性格倾向', fn: analyzeCharacter },
  { seal: '贰', title: '事业财运', fn: analyzeCareer },
  { seal: '叁', title: '婚姻感情', fn: analyzeMarriage },
  { seal: '肆', title: '六亲关系', fn: analyzeFamily },
  { seal: '伍', title: '健康提示', fn: analyzeHealth },
  { seal: '陆', title: '学业考运', fn: analyzeStudy },
  { seal: '柒', title: '大运流年吉凶', fn: analyzeDaYunTrend },
  { seal: '捌', title: '综合建议', fn: analyzeSummary }
];

// 性别默认男（页面无性别选项，按男命排大运；后续可扩展）
var DEFAULT_GENDER = 'male';

/** 渲染命理详解：8 模块 + 大运折叠 + 流年选择 */
function renderInsight(chart, y, m, d, h) {
  var insight = document.getElementById('insight');
  insight.hidden = false;

  // 计算大运
  var dayun = calcDaYun(chart, y, m, d, h, DEFAULT_GENDER);

  // ① 渲染 8 大模块
  var grid = document.getElementById('insight-grid');
  var html = '';
  for (var i = 0; i < INSIGHT_MODULES.length; i++) {
    var mod = INSIGHT_MODULES[i];
    var text = mod.fn(chart, dayun); // 大运模块需要 dayun
    html +=
      '<div class="insight-module">' +
      '<div class="insight-title"><span class="seal">' + mod.seal + '</span>' + mod.title + '</div>' +
      '<div class="insight-body">' + text + '</div>' +
      '</div>';
  }
  grid.innerHTML = html;

  // ② 大运折叠面板
  var intro = document.getElementById('dayun-intro');
  intro.textContent = '命主为' + (DEFAULT_GENDER === 'male' ? '男' : '女') + '命，' +
    (dayun.forward ? '阳年顺排' : '阴年逆排') + '大运，约 ' + dayun.qiYunAge + ' 岁起运。';
  var list = document.getElementById('dayun-list');
  var listHtml = '';
  for (var k = 0; k < dayun.list.length; k++) {
    var step = dayun.list[k];
    var tone = step.score > 0 ? '顺遂' : (step.score < 0 ? '平缓偏紧' : '中平');
    var trend = analyzeDaYunStep(chart, step);
    listHtml +=
      '<div class="dayun-item">' +
      '<div class="dayun-item-head">' +
      '<span class="dayun-gz">' + step.gz + '</span>' +
      '<span class="dayun-years">' + step.from + '–' + step.to + '年（' + step.ageFrom + '–' + step.ageTo + '岁）· ' + tone + '</span>' +
      '<span class="dayun-arrow">▾</span>' +
      '</div>' +
      '<div class="dayun-item-body">' + trend + '</div>' +
      '</div>';
  }
  list.innerHTML = listHtml;

  // 大运折叠交互：点击标题展开/收起
  var items = list.querySelectorAll('.dayun-item');
  for (var j = 0; j < items.length; j++) {
    (function (item) {
      item.querySelector('.dayun-item-head').addEventListener('click', function () {
        item.classList.toggle('open');
      });
    })(items[j]);
  }

  // ③ 流年选择器（出生年 ~ 出生年+80）
  var sel = document.getElementById('input-liunian');
  var currentYear = new Date().getFullYear();
  sel.innerHTML = '';
  var startYear = Math.min(y, currentYear - 2);
  var endYear = Math.max(y + 80, currentYear + 3);
  for (var yy = startYear; yy <= endYear; yy++) {
    var opt = document.createElement('option');
    opt.value = yy;
    opt.textContent = yy + ' 年';
    sel.appendChild(opt);
  }
  // 默认选中今年（若在范围内）
  if (currentYear >= startYear && currentYear <= endYear) {
    sel.value = currentYear;
  } else {
    sel.value = y;
  }

  // 流年详情渲染函数
  function renderLiuNianDetail() {
    var year = parseInt(sel.value, 10);
    var info = analyzeLiuNian(chart, year);
    var toneClass = info.tone === '偏吉' ? '偏吉' : (info.tone === '偏紧' ? '偏紧' : '中平');
    var detailHtml =
      '<p><span class="liunian-tag">' + info.year + ' 年 · ' + info.gz + '</span>　流年走势：' + info.tone + '</p>' +
      '<ul>';
    info.tips.forEach(function (tip) {
      detailHtml += '<li>' + tip + '</li>';
    });
    detailHtml += '</ul>';
    document.getElementById('liunian-detail').innerHTML = detailHtml;
  }

  // 流年选择变化时重新渲染
  sel.onchange = renderLiuNianDetail;
  renderLiuNianDetail();
}

/** 单步大运的简要吉凶分析（供折叠面板展开显示） */
function analyzeDaYunStep(chart, step) {
  var gz = step.gz;
  var gan = gz[0], zhi = gz[1];
  var tenGod = getTenGod(chart.dayMaster, gan);
  var ganWu = GAN_WUXING[gan];
  var masterWu = chart.dayMasterWu;
  var sheng = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' };

  var parts = [];
  parts.push('本运天干「' + gan + '」为' + ganWu + '行，对日主而言是「' + tenGod + '」。');
  if (ganWu === masterWu) {
    parts.push('五行与日主同气，自我能量充足，行动力与自主性增强，适合开拓与承担。');
  } else if (sheng[masterWu] === ganWu) {
    parts.push('五行生扶日主，精力与贵人缘较好，是积累实力、稳健前行的阶段。');
  } else {
    parts.push('五行对日主形成耗泄或克制，此运宜收敛锋芒、稳中求进，注重健康与情绪管理。');
  }
  // 地支简评
  var zhiWu = ZHI_WUXING[zhi];
  if (zhiWu === masterWu) {
    parts.push('地支同气，根基较稳，但需留意固执与过度坚持。');
  } else if (sheng[masterWu] === zhiWu) {
    parts.push('地支生扶，家庭与后方支持较好，适合修整充电。');
  } else {
    parts.push('地支与日主关系平缓，外部环境变化较多，宜顺势调整。');
  }
  return parts.join('');
}


/* ---------- 表单初始化 ---------- */

function initForm() {
  var monthSel = document.getElementById('input-month');
  var daySel = document.getElementById('input-day');
  var hourSel = document.getElementById('input-hour');
  var yearInput = document.getElementById('input-year');

  // 月份 1-12
  for (var m = 1; m <= 12; m++) {
    var opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m + ' 月';
    monthSel.appendChild(opt);
  }

  // 时辰
  HOUR_OPTIONS.forEach(function (o) {
    var opt = document.createElement('option');
    opt.value = o.v;
    opt.textContent = o.label;
    hourSel.appendChild(opt);
  });

  // 默认值：今天
  var now = new Date();
  yearInput.value = now.getFullYear();
  monthSel.value = now.getMonth() + 1;
  fillDays();
  hourSel.value = 12; // 默认午时

  function fillDays() {
    var y = parseInt(yearInput.value, 10);
    var m = parseInt(monthSel.value, 10);
    if (isNaN(y) || isNaN(m)) return;
    var dim = new Date(y, m, 0).getDate(); // 当月天数
    daySel.innerHTML = '';
    for (var d = 1; d <= dim; d++) {
      var opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d + ' 日';
      daySel.appendChild(opt);
    }
    daySel.value = now.getDate();
  }

  yearInput.addEventListener('change', fillDays);
  monthSel.addEventListener('change', fillDays);

  document.getElementById('btn-paipan').addEventListener('click', render);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}
