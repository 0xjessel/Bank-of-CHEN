// 2_jchentokens.js
const JCHENTokens = artifacts.require("JCHENTokens");

module.exports = function(deployer) {
  deployer.deploy(JCHENTokens);
};
