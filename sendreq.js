
 var axios = require("axios");
  var transaction = {
    data: {
        data: {
            temporary: "555888",
            temporaryy: "555888sdf",
          },
    },
  };
  console.log(transaction);

  var config = {
    method: "post",
    url: "http://localhost:3000/transact",
    headers: {
      "Content-Type": "application/json",
    },
    data: transaction,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });