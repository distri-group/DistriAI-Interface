// 访问 localStorage
export default { get, set, remove, clear };

/**
 * 获取数据，如果该数据为JSON格式则返回JSON数据
 * @param {String} key 要获取的数据名
 * @returns
 */
function get(key) {
  let str = localStorage.getItem(key);
  let json = null;
  if (!str) {
    return str;
  }
  try {
    json = JSON.parse(str);
  } catch (e) {
    console.log(e);
  }
  if (!json || typeof json != "object") {
    return str;
  }
  if (!json.type || !json.data) {
    return json;
  }
  return json.data;
}
/**
 * 修改数据
 * @param {*} key 要修改的数据名
 * @param {*} value 修改值
 */
function set(key, value) {
  let type = typeof value;
  let json = {
    type,
    data: value,
  };
  localStorage.setItem(key, JSON.stringify(json));
}
/**
 * 移除数据
 * @param {*} key 要移除的数据名
 */
function remove(key) {
  localStorage.removeItem(key);
}
/**
 * 清除 localStorage
 */
function clear() {
  localStorage.clear();
}
