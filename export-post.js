module.exports = {
  foo: async function () {
    console.log("called foo");
    const axios = require("axios");
    const res = await axios.post("http://localhost:3000/transact", {
      // `proxy` means the request actually goes to the server listening
      // on localhost:3000, but the request says it is meant for
      // 'http://httpbin.org/get?answer=42'
      data: {
        temporary: "555888",
        temporaryy: "555888sdf",
      },
      headers: {
        "Content-Type": "application/json",
        /* host: "http://localhost:3000", */
      },
    });
    console.log(res.data);
  },
};
