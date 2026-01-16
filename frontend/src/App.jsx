import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
// import MarketplaceABI from './Marketplace.json'; // Comment ออกไปก่อนเพราะเราใช้ Fake Mode

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// --- 1. ข้อมูลจำลองตั้งต้น (Cute Cat Theme Mock Data) ---
const INITIAL_MOCK_PRODUCTS = [
  { id: 1, name: "Fluffy Yarn Ball", price: "0.05", owner: "0xKitty...Paw1", isSold: false },
  { id: 2, name: "Golden Fish Treat", price: "0.12", owner: "0xMeow...Boss", isSold: true },
  { id: 3, name: "Cozy Cat Bed Pro", price: "0.80", owner: "0xPurr...Fect", isSold: false },
  { id: 4, name: "Laser Pointer 3000", price: "0.02", owner: "0xChase...Dotts", isSold: false },
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState(INITIAL_MOCK_PRODUCTS);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Logic เชื่อมต่อ Wallet (Fake Mode เน้นๆ) ---
  const connectWallet = async () => {
    // Simulation Mode: สร้าง Address ปลอมๆ ที่ดูน่ารัก
    const mockAddress = "0xCute...CatLover"; 
    setLoading(true);
    setTimeout(() => {
        setAccount(mockAddress);
        setLoading(false);
        // alert(`🐾 Paw-some! Connected as ${mockAddress}`);
    }, 800);
  };

  // --- Add Product (Fake) ---
  const addProduct = async (e) => {
    e.preventDefault();
    if (!account) return alert("😿 Pls connect wallet to list goodies!");

    setLoading(true);
    
    // --- Fake Simulation Logic ---
    setTimeout(() => {
    const newId = products.length + 1;
    const newProduct = {
        id: newId,
        name: productName,
        price: productPrice,
        owner: account, // ใช้ Fake Account ที่ Login อยู่
        isSold: false
    };
    setProducts([newProduct, ...products]); // เพิ่มของใหม่ไปบนสุด
    // alert("😻 Meow! New item listed!");
    setProductName(""); 
    setProductPrice("");
    setLoading(false);
    }, 1000);
  };

  // --- Buy Product (Fake) ---
  const buyProduct = async (id, price) => {
    if (!account) return alert("😿 Pls connect wallet to adopt!");

    setLoading(true);

    // --- Fake Simulation Logic ---
    setTimeout(() => {
    const updatedProducts = products.map(item => {
        if (item.id === id) {
        return { ...item, isSold: true, owner: account }; // เปลี่ยนเจ้าของเป็นเรา
        }
        return item;
    });
    setProducts(updatedProducts);
    // alert("🎉 Yay! You adopted this item with treats!");
    setLoading(false);
    }, 800);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo เปลี่ยนเป็น icon แมว */}
          <div className="logo">
             🐱 Neko Market <span className="demo-badge">Demo</span>
          </div>
          <button className="connect-btn" onClick={connectWallet} disabled={loading}>
            {loading ? "Connecting..." : (account ? `🐾 ${account}` : "Connect Paw-Wallet")}
          </button>
        </div>
      </nav>

      <main className="container">
        
        {/* Section นี้ใส่หูแมวด้วย CSS */}
        <section className="create-section">
          <h2>✨ List Your Kitty Goodies</h2>
          <form className="add-form" onSubmit={addProduct}>
            <input
              className="input-field"
              type="text"
              placeholder="Item Name (e.g. Super Catnip)"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
            <input
              className="input-field"
              type="number"
              step="0.0001"
              placeholder="Price in ETH treats 🐟"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
            <button className="add-btn" type="submit" disabled={loading || !account}>
              {loading ? "Purring..." : "Meow-t it! (List Item)"}
            </button>
          </form>
        </section>

        <section>
          <div className="section-header">
            <h2>💖 Fresh cat-lectibles</h2>
            <span className="item-count">{products.length} Items found</span>
          </div>

          <div className="grid">
            {products.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <h3>😿 No items yet...</h3>
                <p>Be the first cool cat to list something!</p>
              </div>
            ) : (
              products.map((item) => (
                <div key={item.id.toString()} className={`card ${item.isSold ? 'sold' : ''}`}>
                  {/* เปลี่ยน Emoji ให้เข้าธีม */}
                  <div className="card-image-placeholder">
                    {item.isSold ? "💤" : (item.id % 2 === 0 ? "🧶" : "🐟")}
                  </div>
                  
                  <div className="card-body">
                    <div className="owner">
                      <span>🐱 Owner:</span>
                      <span style={{ fontWeight: 600 }}>
                        {item.owner.length > 15 ? item.owner.substring(0, 8) + "..." : item.owner}
                      </span>
                    </div>
                    
                    <h3>{item.name}</h3>
                    {/* ใส่ icon ปลาตรงราคา */}
                    <div className="price">🐟 {item.price} ETH</div>

                    {item.isSold ? (
                      <button className="action-btn btn-sold" disabled>Already Adopted 🏠</button>
                    ) : (
                      <button 
                        className="action-btn btn-buy"
                        onClick={() => buyProduct(item.id, item.price)}
                        disabled={loading || !account || item.owner === account}
                      >
                        {account && item.owner === account ? "Your Item 🐾" : "Adopt Now ✨"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </>
  );
}

export default App;