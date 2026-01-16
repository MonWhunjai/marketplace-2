import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import MarketplaceABI from './Marketplace.json';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Logic เดิม (คงไว้ตามเดิมทุกประการ) ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        const marketplaceContract = new ethers.Contract(contractAddress, MarketplaceABI.abi, signer);
        setContract(marketplaceContract);
      } catch (error) { console.error(error); }
    } else { alert("Please install Metamask!"); }
  };

  const loadProducts = async () => {
    if (!contract) return;
    try {
      const itemCount = await contract.nextId();
      let items = [];
      for (let i = 1; i < itemCount; i++) {
        const item = await contract.products(i);
        if (item.id > 0n) {
          items.push({
            id: item.id,
            name: item.name,
            price: ethers.formatEther(item.price),
            owner: item.owner,
            isSold: item.isSold
          });
        }
      }
      setProducts(items);
    } catch (error) { console.error("Error loading:", error); }
  };

  useEffect(() => { if (contract) loadProducts(); }, [contract]);

  const addProduct = async (e) => {
    e.preventDefault();
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.addProduct(productName, ethers.parseEther(productPrice));
      await tx.wait();
      alert("✅ Product Added!");
      setProductName(""); setProductPrice(""); loadProducts();
    } catch (error) { alert("Failed!"); console.error(error); }
    setLoading(false);
  };

  const buyProduct = async (id, price) => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.buyProduct(id, { value: ethers.parseEther(price) });
      await tx.wait();
      alert("🎉 Bought Successfully!");
      loadProducts();
    } catch (error) { alert("Transaction Failed!"); }
    setLoading(false);
  };

  // --- UI ใหม่ (Modern / Dark) ---
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
             ⚡ NEXUS MARKET
          </div>
          <button className="connect-btn" onClick={connectWallet}>
            {account ? `🟢 ${account.substring(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </nav>

      <main className="container">
        
        {/* ส่วนที่ 1: Dashboard Panel */}
        <section className="create-section">
          <h2>🚀 List Your Digital Asset</h2>
          <form className="add-form" onSubmit={addProduct}>
            <input
              className="input-field"
              type="text"
              placeholder="Item Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
            <input
              className="input-field"
              type="number"
              step="0.0001"
              placeholder="Price (ETH)"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
            <button className="add-btn" type="submit" disabled={loading || !account}>
              {loading ? "Minting..." : "Create Listing"}
            </button>
          </form>
        </section>

        {/* ส่วนที่ 2: Marketplace Grid */}
        <section>
          <div className="section-header">
            <h2>Latest Drops</h2>
            <span className="item-count">{products.length} Items Available</span>
          </div>

          <div className="grid">
            {products.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b', border: '1px dashed #334155', borderRadius: '20px' }}>
                <h3>No items found</h3>
                <p>Be the first to list an item above.</p>
              </div>
            ) : (
              products.map((item) => (
                <div key={item.id.toString()} className={`card ${item.isSold ? 'sold' : ''}`}>
                  <div className="card-image-placeholder">
                    {item.isSold ? "🔒" : "💎"}
                  </div>
                  
                  <div className="card-body">
                    <div className="owner">
                      <span>Owner:</span>
                      <span style={{ fontFamily: 'monospace' }}>{item.owner.substring(0, 6)}...</span>
                    </div>
                    
                    <h3>{item.name}</h3>
                    <div className="price">{item.price} ETH</div>

                    {item.isSold ? (
                      <button className="action-btn btn-sold" disabled>Sold</button>
                    ) : (
                      <button 
                        className="action-btn btn-buy"
                        onClick={() => buyProduct(item.id, item.price)}
                        disabled={loading || !account || item.owner.toLowerCase() === account?.toLowerCase()}
                      >
                        {item.owner.toLowerCase() === account?.toLowerCase() ? "Manage Item" : "Purchase Now"}
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