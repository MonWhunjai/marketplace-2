const { expect } = require("chai");

describe("Marketplace", () => {
    let Marketplace, market, owner, buyer, other;

    beforeEach(async () => {
        [owner, buyer, other] = await ethers.getSigners();
        Marketplace = await ethers.getContractFactory("Marketplace");
        market = await Marketplace.deploy();
    });

    it("should allow adding a product", async () => {
        await market.connect(owner).addProduct("Book", ethers.parseEther("1"));

        const product = await market.products(1);
        expect(product.name).to.equal("Book");
        expect(product.price).to.equal(ethers.parseEther("1"));
        expect(product.owner).to.equal(owner.address);
    });

    it("should allow buying a product", async () => {
        await market.addProduct("Laptop", ethers.parseEther("2"));

        await expect(
            market.connect(buyer).buyProduct(1, { value: ethers.parseEther("2") })
        ).to.emit(market, "ProductBought");

        const item = await market.products(1);
        expect(item.isSold).to.equal(true);
    });

    it("should fail if price is incorrect", async () => {
        await market.addProduct("Pen", ethers.parseEther("1"));

        await expect(
            market.connect(buyer).buyProduct(1, { value: ethers.parseEther("0.5") })
        ).to.be.revertedWith("Incorrect price");
    });

    it("should not allow owner to buy its own product", async () => {
        await market.addProduct("Phone", ethers.parseEther("1"));
        await expect(
            market.connect(owner).buyProduct(1, { value: ethers.parseEther("1") })
        ).to.be.revertedWith("Owner cannot buy");
    });

    it("should allow only owner to remove product", async () => {
        await market.addProduct("Camera", ethers.parseEther("1"));

        await expect(
            market.connect(buyer).removeProduct(1)
        ).to.be.revertedWith("Not owner");

        await expect(market.connect(owner).removeProduct(1)).to.emit(
            market,
            "ProductRemoved"
        );
    });
});

