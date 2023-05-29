import { task, types } from 'hardhat/config';
import fs from 'fs'
import { namehash } from 'ethers/lib/utils';
import { ensNormalize } from '@ethersproject/hash'
import { keccak256 } from "@ethersproject/keccak256";
import { concat, hexlify } from "@ethersproject/bytes";
import { serialize, UnsignedTransaction } from "@ethersproject/transactions";
import { resolveProperties } from "@ethersproject/properties";


const ENS_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
const ENS_ABI = [
  "function setSubnodeOwner(bytes32 node, bytes32 label, address owner)"
]
// 0xe5315dfb268989e08e40f23427cc14354f12d8d9fdf19782f8a6b0d0448e630a Transaction
// 0x6686b4bb3b00cbe586fa4e43be8208d20bb38e445232f77753207cf8e531ff04 snode.chokotest.eth
// 0xff848bb5c721260e6f86f7ecffd70fcb5224b8feb204223471a524ade77d4d42 chokotest.eth
// 0x55735f90a4c2276e7dd12846ed00d2935a950f660d44024d44204bcd0c4941ac snode
task('add-node', 'Add subnode')
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();
    const gasPrice = ethers.utils.parseUnits("200", 'gwei');

    const addresses = JSON.parse(fs.readFileSync("./address.json").toString())

    const FIFSRegistrar = await ethers.getContractFactory("FIFSRegistrar");
    const registrar = await FIFSRegistrar.attach(addresses.registrar);

    const namehash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("snode"))
    console.log(namehash)

    const transaction = await registrar.populateTransaction.register(namehash, deployer.address, {
      gasPrice,
      gasLimit: 100000
    })
    console.log(transaction)
    const tx = await resolveProperties(transaction)
    if (tx.from != null) {
      delete tx.from;
    }
    console.log(serialize(tx))
    // console.log('Transaction created.')
    // console.log(await transaction.wait())

  });
