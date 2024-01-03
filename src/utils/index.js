import request from "./request";
import { Modal, message, notification } from "antd";
import clipboard from "copy-to-clipboard";

export {
  request,
  formatAddress,
  alert,
  alertP,
  showOK,
  noti,
  showError,
  confirm,
  loading,
  formdataify,
  copy,
};
/**
 * 复制
 * @param {string} text
 */
function copy(text) {
  clipboard(text);
  showOK("Copy successful !");
}
/**
 * 钱包地址处理,保留前后5位
 * @param {string} addr
 * @returns
 */
function formatAddress(addr) {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return addr.slice(0, 5) + "..." + addr.slice(-5);
}
/**
 * 提示
 * @param {string} msg 错误消息
 * @param {Function} cb 确认回调
 */
function alert(msg, cb) {
  Modal.info({
    title: msg,
    onOk: cb,
  });
}
/**
 * 提示
 * @param {string} msg
 * @returns
 */
function alertP(msg) {
  return new Promise((resolve, reject) => {
    Modal.info({
      title: msg,
      onOk: resolve,
    });
  });
}
function showOK(content) {
  // message.success(content);
  notification.success({
    description: content,
    placement: "bottomRight",
  });
}
function noti(content) {
  notification.info({
    description: content,
    placement: "top",
  });
}
function showError(content) {
  // notification.error({
  //   description: content,
  //   placement: "top",
  // });
  message.open({
    type: "error",
    content,
  });
}
function confirm(content) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content: content,
      okText: "OK",
      cancelText: "Cancel",
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

function loading(show, txt) {
  if (!show) {
    return message.destroy();
  }
  message.loading({
    content: txt || "loading...",
    duration: 0,
    style: { marginTop: "200px" },
  });
}
function formdataify(params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    if (typeof params[key] == "object") {
      formData.append(key, JSON.stringify(params[key]));
    } else {
      formData.append(key, params[key]);
    }
  });
  return formData;
}
