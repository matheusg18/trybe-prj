const getParams = () => {
  const params = process.argv.slice(2);

  const paramsSchema = {
    pr: params.includes('--pr'),
    code: params.includes('--code'),
    default: params.includes('--default'),
    clonePath: params.find((param) => param !== '--pr' && param !== '--code' && param !== '--default'),
  };

  return paramsSchema;
};

module.exports = getParams;
