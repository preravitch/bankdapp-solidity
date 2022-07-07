async function main() {
    [signer1, signer2] = await ethers.getSigners();
  
    const Bank = await ethers.getContractFactory("Bank", signer1);
    const bankContract = await Bank.deploy();
  
    const Usdt = await ethers.getContractFactory("Usdt", signer2);
    const usdt = await Usdt.deploy();

    await bankContract.getAddress(
        usdt.address
      );
  
    console.log("Bank deployed to:", bankContract.address, "by", signer1.address);
    console.log("Tether deployed to:", usdt.address, "by", signer2.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });