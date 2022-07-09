import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';

import bankArtifact from './artifacts/contracts/Bank.sol/Bank.json';
import usdtArtifact from './artifacts/contracts/Usdt.sol/Usdt.json';
import CreateAccount from './CreateAccount';
import { Button } from 'react-bootstrap';


function App() {
  const [provider, setProviders] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [bankContract, setBankContract] = useState(undefined);
  const [usdtContract, setusdtContract] = useState(undefined);
  const [changed, setChanged] = useState(false);
  const [createclicked, setcreateclicked] = useState(false);

  const [amount, setAmount] = useState(0);
  const [isDeposit, setIsDeposit] = useState(undefined);
  const [account, setAccount] = useState([]);

  const toBytes32 = text => ( ethers.utils.formatBytes32String(text) );
  const toString = bytes32 => ( ethers.utils.parseBytes32String(bytes32) );
  const toWei = ether => ( ethers.utils.parseEther(ether) );
  const toEther = wei => ( ethers.utils.formatEther(wei).toString());
  const toRound = num => ( Number(num).toFixed(2) );
  const toNum = max => ( ethers.BigNumber.from(max).toNumber());

  useEffect(() => {
    const init = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum)
      setProviders(provider)

      const bankContract = await new ethers.Contract("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", bankArtifact.abi)
      setBankContract(bankContract)
    }
    init();
  }, [])

  console.log(bankContract);
  const isConnected = () => (signer !== undefined)
  const isCreated = () => (createclicked == false)
  
  const clickcreate = function () {
    setcreateclicked(true);
  }
  const created =  function () {
    setTimeout(function(){
      setcreateclicked(false);
    },30000)
    
  }
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

  const getUsdtContract = async (bankContract, provider) => {
    const address = await bankContract.connect(provider).getUsdtAddress()
    const UsdtContract = new ethers.Contract(address, usdtArtifact.abi)
    return UsdtContract
  }
  console.log(changed);
  const getAllAccount = useCallback(
    async function () {
      console.log(await bankContract.connect(signer).userAccounts());
      const allAcc = await bankContract.connect(signer).userAccounts();
      console.log(allAcc);
      setAccount(allAcc);
      return allAcc;
    },
    [bankContract, signer]
  );

  useEffect(() => {
    if (changed) {getAllAccount()};
  }, [changed, getAllAccount]);

  const changedHandler = function () {
    
      setChanged(true);
    
  };

  const AccountList = function (props) {
    const modAcc = props.account.map(acc => {
        return {
          name: acc[0],
          balance: toEther(acc[1])
        }
      })
      
    const accarr = modAcc;
    console.log(accarr);
    const html = accarr.map(acc => {

        return  <p>Account Name: {acc.name}
                    <p>
                        Balance: {acc.balance} Usdt
                    </p>
                    <button onClick={clickcreate} className="btn btn-default">Deposite/Withdraw</button>
                    <button onClick={clickcreate} className="btn btn-default">Transfer</button>
                </p>
              
    })
    return html;
}

  const depositUsdt = (wei, account) => {
    const usdtContract = 
    usdtContract.connect(signer).approve(bankContract.address, wei)
      .then(() => {
        bankContract.connect(signer).depositUsdt(wei, account);
      })
  }

  const createAccount = function (_accountname) {
    bankContract.connect(signer).createnewaccount(_accountname);
    created();
  };

  
  const withdrawUsdt = (wei, accountname) => {
    bankContract.connect(signer).withdrawUsdt(wei, accountname);
  }
  const depositOrWithdraw = (e, symbol) => {
    e.preventDefault();
    const wei = toWei(amount)

    if(isDeposit) {
      depositUsdt(wei, symbol)
    } else {
      withdrawUsdt(wei, symbol)
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        {isConnected() ? (
          <div>
            <p>
              Welcome  {signerAddress?.substring(0,10)}...
            </p>
            <button onClick={getAllAccount} className="btn btn-default"> Refresh Data</button>
             <p>
               Accounts
            
              </p>
              <div>
                <AccountList account={account}/>
              </div>

            {isCreated() ? (
                <button onClick={clickcreate} className="btn btn-default">Create New Account</button>
              
            ) : (
              <CreateAccount 
                change={ changedHandler } 
                createAccount={ createAccount }>
              </CreateAccount>
            )
            }
            
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
