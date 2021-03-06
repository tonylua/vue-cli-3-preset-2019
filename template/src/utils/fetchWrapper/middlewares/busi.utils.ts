// @ts-ignore
import store from "@/store";

export const VALID_CODE = 0;
export const KEY_CODE = "code";
export const KEY_MSG = "message";

function isUrlMatchRoute(url: string, route: string): boolean {
  if (!route) return false;
  let urlTail = null;
  if (!~route.indexOf(":")) {
    // 普通路由
    urlTail = url.substring(url.length - route.length);
    return route === urlTail;
  }
  // 类似 "/ports/:deleteId" 的路由
  const str = route.replace(/:.+?($|\/)/g, ".*?$1").replace(/(\/{1})/g, "\\$1");
  const tailRE = new RegExp(`${str}$`);
  return tailRE.test(url);
}

function matchedURLFromTips(
  tips: object,
  method: string,
  url: string
): URLInTips {
  if (!url) return null;
  const keys = Object.keys(tips);
  const u = url.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/$/, "");
  const indexArr: Array<number> = [];
  for (let i = 0; i < keys.length; i++) {
    const kArr = keys[i].split(/\s/);
    const keyMethod = kArr.length > 1 ? kArr[0] : null;
    const k = (keyMethod ? kArr[1] : kArr[0]).replace(/\/$/, "");
    // console.log(u, k, '<--->', uTail);
    if (isUrlMatchRoute(u, k) && (!keyMethod || keyMethod === method)) {
      // 比较 tips 中的 key 和 url 最后的部分
      if (keyMethod) indexArr.unshift(i);
      else indexArr.push(i); // 保证有 method 的优先级更高
    }
  }
  return indexArr.length ? keys[indexArr[0]] : null;
}

function getIntegerCode(code: number | string): number {
  return Number.isInteger(code) ? (code as number) : parseInt(String(code), 10);
}

/**
 * 判断业务逻辑码
 * @param {number} code
 */
export function isValidCode(
  code: number | string,
  validnum = VALID_CODE
): boolean {
  const c = getIntegerCode(code);
  return !Number.isNaN(c) && c === validnum;
}

/**
 * 获得根据 getGlobalConfig 接口的返回值对业务逻辑错误对应通用的提示
 * @param {string} reqStr - 错误发生时的接口请求 URL，格式为 `${method} ${url}`
 * @param {FetchResJSON} json - 返回的 {code, message, data} 对象
 * @param {Headers} headers
 * @returns {FetchErrorType}
 */
export const getErrorTip = (
  reqStr: string,
  json: FetchResJSON,
  headers: Headers
): FetchErrorType => {
  let noWarnScope: FetchNowarn = "all";
  if (
    headers &&
    headers instanceof Headers &&
    headers.has("no-global-config-warn")
  ) {
    noWarnScope = headers.get("no-global-config-warn") as FetchNowarn;
    if (noWarnScope === true || noWarnScope === 1 || noWarnScope === "all") {
      console.log("no warn for all: ", reqStr);
      return null;
    }
  }

  // eslint-disable-next-line no-unused-vars
  const [method, url] = reqStr.split(/\s/);
  const code = getIntegerCode(json[KEY_CODE]);
  const isValid = isValidCode(code);
  const globalData = store.getters.GLOBAL_DATA;

  if (isValid && noWarnScope === "success") return null;
  if (!isValid && noWarnScope === "error") return null;

  if (noWarnScope === "store") return json[KEY_MSG];

  let _msg = null;
  // 根据 getGlobalConfig 接口获得的返回值
  // 表示与 code 和请求 url 相关的 tips 提示
  // 没配置的情况下，提示message的内容
  if (globalData && globalData.tips) {
    const { tips } = globalData;
    const tipsOfErr = tips[code];
    if (tipsOfErr) {
      let key = matchedURLFromTips(tipsOfErr, method, url);
      if (!key && url) {
        key = matchedURLFromTips(tipsOfErr, method, url);
      }
      // console.log(key, method, url);
      // console.log(tipsOfErr, reqStr, url, key, 999);
      _msg = key
        ? tipsOfErr[key]
        : "default" in tipsOfErr
        ? tipsOfErr.default
        : isValid
        ? null
        : json[KEY_MSG];
    } else if (!isValid) {
      _msg = json[KEY_MSG];
    }
  }
  return _msg;
};
