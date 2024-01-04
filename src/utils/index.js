import { Modal, message, notification } from "antd";

export { alert, showOK, showError, loading, formdataify };

function alert(msg, cb) {
  Modal.info({
    title: msg,
    onOk: cb,
  });
}

function showOK(content) {
  notification.success({
    description: content,
    placement: "bottomRight",
  });
}

function showError(content) {
  message.open({
    type: "error",
    content,
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
