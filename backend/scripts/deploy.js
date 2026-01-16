// backend/scripts/deploy.js
const hre = require("hardhat");

async function main() {
    // 1. Deploy Contract
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const market = await Marketplace.deploy();

    await market.waitForDeployment();
    const address = await market.getAddress();

    console.log("----------------------------------------------------");
    console.log("Marketplace deployed to:", address);
    console.log("----------------------------------------------------");

    // 2. เพิ่มสินค้าให้อัตโนมัติ (Mock Data)
    console.log("Creating initial products...");

    // สินค้าชิ้นที่ 1
    const tx1 = await market.addProduct("Nike Air Jordan", hre.ethers.parseEther("0.1"));
    await tx1.wait();
    console.log("✅ Added: Nike Air Jordan (0.1 ETH)");

    // สินค้าชิ้นที่ 2
    const tx2 = await market.addProduct("iPhone 15 Pro", hre.ethers.parseEther("0.5"));
    await tx2.wait();
    console.log("✅ Added: iPhone 15 Pro (0.5 ETH)");

    console.log("----------------------------------------------------");
    console.log("Ready to use! Copy address above to frontend.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});