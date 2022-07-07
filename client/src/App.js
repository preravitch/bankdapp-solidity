import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import bankArtifact from './artifacts/contracts/Bank.sol/Bank.json';
import usdtArtifact from './artifacts/contracts/Usdt.sol/Usdt.json';
import Createaccount from './createaccount';
function App() {
  const [provider, setProviders] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [bankContract, setBankContract] = useState(undefined);
  const [usdtContract, setusdtContract] = useState(undefined);
  const [tokenSymbols, setTokenSymbols] = useState(undefined);

  const [amount, setAmount] = useState(0);
  const [showModel, setShowModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  const [isDeposit, setIsDeposit] = useState(undefined);

  const toBytes32 = text => ( ethers.utils.formatBytes32String(text) );
  const toString = bytes32 => ( ethers.utils.parseBytes32String(bytes32) );
  const toWei = ether => ( ethers.utils.parseEther(ether) );
  const toEther = wei => ( ethers.utils.formatEther(wei).toString());
  const toRound = num => ( Number(num).toFixed(2) );

  useEffect(() => {
    const init = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum)
      setProviders(provider)

      const bankContract = await new ethers.Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", bankArtifact.abi)
      setBankContract(bankContract)

      
    }
    init();
  }, [])
  console.log(bankContract);
  const isConnected = () => (signer !== undefined)
  
  const getSigner = async provider => {
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    signer.getAddress()
      .then(address => {
        setSignerAddress(address)
      })

      return signer
  }

  const connect = () => {
    getSigner(provider)
      .then(signer => {
        setSigner(signer)
      }) 
  }

  const depositUsdt = (wei, account) => {
    const usdtContract = 
    usdtContract.connect(signer).approve(bankContract.address, wei)
      .then(() => {
        bankContract.connect(signer).depositUsdt(wei, account);
      })
  }

  const createaccount = (account) =>  {
    bankContract.connect(signer).createnewaccount(account);
  }

  const withdrawUsdt = (wei, account) => {
    bankContract.connect(signer).withdrawUsdt(wei, account);
  }

  const despoitorwithdraw = (e, symbol) => {
    e.preventDefault();
    const wei = toWei(amount)

   /* if(isDeposit) {
      depositUsdt(wei, symbol)
    } else {
      withdrawUsdt
    }*/
  }
  return (
    <div className="App">
      <header className="App-header">
        {isConnected() ? (
          <div>
            <p>
              Welcome  {signerAddress?.substring(0,10)}...
            </p>
              <Createaccount></Createaccount>
          </div>
        )  : (
          <div>
            <p>
              You are not connected
            </p>
            <button onClick={connect} className="btn btn-primary">Connect Metamask</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
