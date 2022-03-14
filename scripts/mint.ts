import hre, { ethers } from 'hardhat';
import { HypeHaus } from '../typechain-types/HypeHaus';

const { CONTRACT_ADDRESS = '', LOCAL_CONTRACT_ADDRESS = '' } = process.env;

async function main() {
  console.log('On network:', hre.network.name);
  const contractAddress =
    hre.network.name === 'localhost'
      ? LOCAL_CONTRACT_ADDRESS
      : CONTRACT_ADDRESS;

  const [deployer, another] = await ethers.getSigners();
  console.log("Deployer's address:", deployer.address);

  const HypeHaus = await ethers.getContractFactory('HypeHaus');
  const hypeHaus = HypeHaus.attach(contractAddress) as HypeHaus;

  const printTotalMinted = async () => {
    const totalMinted = await hypeHaus
      .totalMinted()
      .then((it) => it.toString());
    console.log('Total minted so far:', totalMinted);
  };

  await printTotalMinted();

  await hypeHaus.mintHypeHaus(deployer.address);
  await printTotalMinted();

  if (another) {
    await hypeHaus.mintHypeHaus(another.address);
    await printTotalMinted();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
