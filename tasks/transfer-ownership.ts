import { task, types } from 'hardhat/config';
import fs from 'fs'
import { BASIC_ETH_NAME } from './constant'

const ENS_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
const ENS_ABI = [
  "function setSubnodeOwner(bytes32 node, bytes32 label, address owner)",
  "function owner(bytes32 node) external view returns (address)",
  "function setOwner(bytes32 node, address owner)"
]

task('transfer-ownership', 'Transfer ownership of choko.eth to FIFSRegistrar')
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();
    const gasPrice = ethers.utils.parseUnits("100", 'gwei');

    const namehash = ethers.utils.namehash(BASIC_ETH_NAME)
    console.log("namehash", namehash)

    const addresses = JSON.parse(fs.readFileSync("./address.json").toString())

    const ens = new ethers.Contract(ENS_ADDRESS, ENS_ABI, deployer);

    const owner = await ens.owner(namehash)
    console.log(owner)

    const transaction = await ens.setOwner(namehash, addresses.registrar, {
        gasPrice,
        gasLimit: 100000
    });
    await transaction.wait()

    console.log("Transfered ownership of choko.eth to registrar contract:", addresses.registrar);

  });
