import UnidirectionalPaymentChannel from './contracts/UnidirectionalPaymentChannelHub.json';

const getUnidirectional = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const contractDeployment = UnidirectionalPaymentChannel.networks[networkId];
  return new web3.eth.Contract(UnidirectionalPaymentChannel.abi, contractDeployment && contractDeployment.address);
};

export {getUnidirectional}