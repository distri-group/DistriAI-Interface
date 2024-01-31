export const getIdeToken = async (ip, port, signature) => {
  const options = {
    method: "get",
    node: "cors",
    headers: { "Content-Type": "application/json" },
    params: {
      signature,
    },
  };
  const queryParams = new URLSearchParams(options.params);
  let url = `http://${ip}:${port}?${queryParams.toString()}`;
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
