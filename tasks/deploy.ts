import { task, types } from 'hardhat/config';
import fs from 'fs'
import { BASIC_ETH_NAME } from './constant'

const ENS_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
const ENS_ABI = [
  "function setSubnodeOwner(bytes32 node, bytes32 label, address owner)",
  "function owner(bytes32 node) external view returns (address)",
  "function setOwner(bytes32 node, address owner)"
]

task('deploy', 'Deploy FIFSRegistrar')
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();
    const gasPrice = ethers.utils.parseUnits("100", 'gwei');

    const namehash = ethers.utils.namehash(BASIC_ETH_NAME)
    console.log("namehash", namehash)

    const FIFSRegistrar = await ethers.getContractFactory("FIFSRegistrar");
    const registrar = await FIFSRegistrar.deploy(ENS_ADDRESS, namehash, {
        gasPrice,
    });
    await registrar.deployed();
    console.log("FIFSRegistrar deployed to:", registrar.address);

    fs.writeFileSync("./address.json", JSON.stringify({ "registrar": registrar.address }))

  });
