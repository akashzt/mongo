const superagent = require("superagent");

getRequest = async function(opts) {
  try {
    const res = await superagent.get(opts.uri).set("Authorization", opts.header).query(opts.qs).send(opts.body);
    return res.body;
  } catch (err) {
    console.error(err);
  }
};

postRequest = async function(opts) {
  try {
    const res = await superagent.post(opts.uri).set("Authorization", opts.header).send(opts.body).query(opts.qs);
    return res.body;
  } catch (err) {
    console.error(err);
  }
};

putRequest = async function(opts) {
  try {
    const res = await superagent.put(opts.uri).set("Authorization", opts.header).send(opts.body).query(opts.qs);
    return res.body;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getRequest,
  postRequest,
  putRequest
};
