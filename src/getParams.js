const { _: args, ...options } = require('minimist')(process.argv.slice(2));

const getParams = () => {
  const pr = !!options.pr;
  const code = !!options.code;

  const paramsSchema = {
    pr,
    code,
    clonePath: args,
  };

  return paramsSchema;
};

module.exports = getParams;
