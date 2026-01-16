async function main() {
    const marketAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const market = await Marketplace.attach(marketAddr);

    await market.addProduct("Shoes", ethers.parseEther("0.1"));
    console.log("Added product ID 1");
}

main();
