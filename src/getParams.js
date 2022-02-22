const getParams = () => {
  const params = process.argv.slice(2);

  const paramsSchema = {
    pr: params.includes('--pr'),
    code: params.includes('--code'),
    clonePath: params.find((param) => param !== '--pr' && param !== '--code'),
  };

  return paramsSchema;
};

module.exports = getParams;
