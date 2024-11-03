import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import RPC from "./web3RPC";
import "./App.css";

let styles = {
  button: {
    width: "100%",
    maxWidth: 200,
    cursor: "pointer",
    background: "white",
    boxSizing: "border-box",
    borderRadius: "10px",
    fontSize: 16,
    color: "green",
    fontWeight: 700,
    padding: "12px 30px 12px 30px",
    marginTop: 4,
    display: "flex",
    justifyContent: "center",
    border: "none",
  },
  card: {
    backgroundColor: "#ffffff",
    marginBottom: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: 400,
    height: "100%",
    minHeight: 200,
    border: "10px solid #f9f9f9",
    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.03)",
    borderRadius: "1rem",
    "&:hover": {
      boxShadow: "0px 24px 33px -9px #0000005C",
    },
  },
};

const clientId = "BDzSH83S8bcZdi2oBbLqmlSNxD2SlMG0GLNubMP5NYSzrjMW9Oe3iUiEl9PmtYXUl4HBH5VGwq0JQBW7Cib5Zl0"; 

const chainConfig ={
  chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0xAA36A7", 
            rpcTarget: "https://responsive-yolo-ensemble.ethereum-sepolia.quiknode.pro/d15c93fa3d12d2a494804a02efc2800c0138fda7",
            displayName: "Ethereum Sepolia Testnet",
            blockExplorerUrl: "https://sepolia.etherscan.io",
            ticker: "ETH",
            tickerName: "Ethereum",
            logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [chainId, setChainId] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const init = async () => {
      try {
          
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {chainConfig},
        });

        const web3auth = new Web3Auth({
          clientId,
          chainConfig,
          web3AuthNetwork: 'sapphire_devnet',
          privateKeyProvider,
        });
        console.log(web3auth);
        setWeb3auth(web3auth);
        await web3auth.initModal();
    
        let connectedStatus = await isConnected();
        if (connectedStatus) {
          await web3auth.connect();
          const provider = await web3auth.getProvider();
          setProvider(provider);
    
          getUserInfo();
          getAccounts();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const isConnected = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return false;
    }
    return web3auth.status === "connected";
  };

  const handleLogin = async () => {
    console.log("hitting");
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider.provider);

    // Calling fns to get initial data
    await getUserInfo();
    await getAccounts();
    // await getBalance();
    // await getChainId();
  };
  const handleLogout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.logout();
    setProvider(web3authProvider);
    setBalance("");
    setAddress("");
    setUserData({});
    setChainId("");
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    setUserData(user);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
    setChainId(chainId);
  };
  const getAccounts = async () => {
    if (!web3auth) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const address = await rpc.getAccounts();
    setAddress(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    setBalance(balance);
    console.log(balance);
  };

 /* const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };
  const sendContractTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendContractTransaction();
    console.log(receipt);
  };
*/
  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };

  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card" style={styles.button}>
        Get User Info
      </button>
      <button onClick={getChainId} className="card" style={styles.button}>
        Get Chain ID
      </button>
      <button onClick={getAccounts} className="card" style={styles.button}>
        Get Accounts
      </button>
      <button onClick={getBalance} className="card" style={styles.button}>
        Get Balance
      </button>
      <button onClick={getPrivateKey} className="card" style={styles.button}>
        Get Private Key
      </button>
      <button onClick={handleLogout} className="card" style={styles.button}>
        Logout
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={handleLogin} className="card" style={styles.button}>
      Login
    </button>
  );

  return (
    <div
      className="container"
      style={{
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "2%",
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: 10 }}>

      </h3>

      {!address && (
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-8">
            <div style={styles.card}>
              <img
                alt="login_logo"
                src="https://plus.unsplash.com/premium_vector-1726498072933-f6112c1b1396?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9naW58ZW58MHx8MHx8fDA%3D"
                width="200px"
              />
              <h6
                style={{
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: 24,
                  textAlign: "center",
                }}
              >
              welcome to Web3Auth !
              </h6>
              <h6 style={{ color: "#000000", fontWeight: 300, fontSize: 16 }}>
                Login with any web2 account into the web3 world
              </h6>
              <button
                style={{
                  marginTop: 10,
                  backgroundColor: "#8347E5",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "0.5625rem",
                  width: "100%",
                  height: 44,
                  fontWeight: 600,
                  border: "none",
                }}
                mt={2}
                onClick={handleLogin}
              >
                Login with web2
              </button>
            </div>
          </div>
        </div>
      )}
      {address && (
        <div className="row">
          <div className="col-md-4">
            <div className="grid" style={{
              justifyContent:"center",
            }}>
              {provider ? loggedInView : unloggedInView}
            </div>
          </div>
          <div className="col-md-8">
            <div style={styles.card}>
              <img
                alt="web3auth_logo"
                src="https://res.cloudinary.com/beincrypto/image/upload/v1661461003/logos/ukflgfdxacovx9yzyrr4.png"
                width="120px"
              />
              <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 20 }}>
                Wallet3
              </h6>
              <div style={{ marginTop: 20, textAlign: "left", color: "black" }}>
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  User Info:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  <span style={{ fontSize: 12 }}>
                    <strong>{userData && userData.name}</strong> -{" "}
                    {userData && userData.email}
                  </span>
                </p>{" "}
                <br />
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  User wallet address:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {address}
                </p>
                <br />
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  ChainId:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {chainId}
                </p>
                <br />
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  Balance:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {balance}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;