// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Marketplace {
    struct Product {
        uint id;
        string name;
        uint price; // in wei
        address payable owner;
        bool isSold;
    }

    uint public nextId = 1;
    mapping(uint => Product) public products;

    event ProductAdded(uint id, string name, uint price, address owner);
    event ProductBought(uint id, address buyer, uint price);
    event ProductRemoved(uint id);

    // เพิ่มสินค้า
    function addProduct(string memory name, uint price) external {
        require(price > 0, "Price must be > 0");

        products[nextId] = Product(
            nextId,
            name,
            price,
            payable(msg.sender),
            false
        );

        emit ProductAdded(nextId, name, price, msg.sender);
        nextId++;
    }

    // ซื้อสินค้า
    function buyProduct(uint id) external payable {
        Product storage p = products[id];
        require(p.id != 0, "Product does not exist");
        require(msg.value == p.price, "Incorrect price");
        require(!p.isSold, "Already sold");
        require(p.owner != msg.sender, "Owner cannot buy");

        p.isSold = true;
        p.owner.transfer(msg.value);

        emit ProductBought(id, msg.sender, msg.value);
    }

    // ลบสินค้า (เฉพาะเจ้าของ)
    function removeProduct(uint id) external {
        Product storage p = products[id];
        require(p.id != 0, "Product does not exist");
        require(p.owner == msg.sender, "Not owner");
        require(!p.isSold, "Cannot remove sold product");

        delete products[id];

        emit ProductRemoved(id);
    }
}