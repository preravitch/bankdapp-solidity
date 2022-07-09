import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';

import bankArtifact from './artifacts/contracts/Bank.sol/Bank.json';
import usdtArtifact from './artifacts/contracts/Usdt.sol/Usdt.json';
import CreateAccount from './CreateAccount';
import Modal from './Modal';
import TransferModal from './TransferModal'
import { Button } from 'react-bootstrap';


function App() {
  const [provider, setProviders] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [bankContract, setBankContract] = useState(undefined);
  const [usdtContract, setusdtContract] = useState(undefined);
  const [createclicked, setcreateclicked] = useState(false);

  const [amount, setAmount] = useState(0);
  const [isDeposit, setIsDeposit] = useState(true);
  const [account, setAccount] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(undefined);
  const [selectedBalance, setBalance] = useState(undefined);
  const [showCreate, setshowCreate] = useState(false);

  

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

      const bankContract = await new ethers.Contract("0x610178dA211FEF7D417bC0e6FeD39F05609AD788", bankArtifact.abi)
      setBankContract(bankContract)
      getUsdtContract(bankContract, provider);
    }
    init();
  }, [])

  console.log(bankContract);
  const isConnected = () => (signer !== undefined)
  
  const clickcreate = function () {
    setshowCreate(true);
  }
  const created =  function () {
    setTimeout(function(){
      setcreateclicked(false);
    },8000)
    
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
    const address = await bankContract.connect(provider).UsdtAddress()
    const UsdtContract = new ethers.Contract(address, usdtArtifact.abi)
    setusdtContract(UsdtContract)
  }
  
  const getAllAccount = useCallback(
    async function () {
      const allAcc = await bankContract.connect(signer).userAccounts();
      console.log(allAcc)
      setAccount(allAcc);
      connect();
      return allAcc;
    },
    [bankContract, signer]
  );

  const displayModal = (account, balance) => {
    setSelectedAccount(account)
    setBalance(balance)
    setShowModal(true)
  }

  const displayTransferModal = (account, balance) => {
    setSelectedAccount(account)
    setBalance(balance)
    setShowTransferModal(true)
  }

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

        return(

              <div className="modal-content">
                <div className='modal-body'>
                  <div className="row">
                    <div className='col-md-4'>
                      <label> Account: </label>
                    </div>
                    <div className='col-md-4'>
                      <label> {acc.name} </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className='col-md-4'>
                      <label> Balance: </label>
                    </div>
                    <div className='col-md-5'>
                      <label> {acc.balance} Usdt</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className='col-md-6'>
                      <button style={{width: "150px"}} onClick={ () => displayModal(acc.name, acc.balance) } className="btn btn-primary">Deposit/Withdraw</button>
                    </div>
                    <div className='col-md-6'>
                      <button style={{width: "150px"}} onClick={() => displayTransferModal(acc.name, acc.balance)} className="btn btn-primary">Transfer</button>
                      <Modal
                            show={showModal}
                            onClose={() => setShowModal(false)}
                            account={selectedAccount}
                            balance={selectedBalance}
                            deposit={depositUsdt}
                            withdraw={withdrawUsdt}
                          />
                      <TransferModal
                            transfer={ transferUsdt }
                            show={showTransferModal}
                            onClose={() => setShowTransferModal(false)}
                            account={selectedAccount}
                            balance={selectedBalance}
                      />
                    </div>
                  </div>
                </div>
                
              </div>
        )
              
    })
    return html;
}


  const createAccount = (_accountname) => {
    bankContract.connect(signer).createnewaccount(_accountname);
    created();
    getAllAccount();
  };

  const depositUsdt = (wei, account) => {
    usdtContract.connect(signer).approve(bankContract.address, wei)
      .then(() => {
        bankContract.connect(signer).depositUsdt(account, wei);
      })
  }

  const withdrawUsdt = (wei, accountname) => {
    bankContract.connect(signer).withdrawUsdt(wei, accountname);
  }

  const depositOrWithdraw = (e, accountname) => {
    e.preventDefault();
    const wei = toWei(amount)

    if(isDeposit) {
      depositUsdt(wei, accountname)
    } else {
      withdrawUsdt(wei, accountname)
    }
  }

  const transferUsdt = (from, to, wei) => {
    bankContract.connect(signer).transferUsdt(from, to, wei);
  }

  return (
    <div className="App">
      <header className="App-header">
        {isConnected() ? (
          <div>
            <div className='modal-content'>
              <label>Welcome  {signerAddress?.substring(0,5)}... {signerAddress?.substring(37,42)}</label>
            </div>
             <div className="modal-content">
                <label>Accounts</label>
              </div>
              <div>
                <AccountList account={account}/>
              </div>

            {showCreate ? (
                  <CreateAccount 
                    createAccount={ createAccount }
                    onClose={() => setshowCreate(false)}
                  />
              
            ) : (
              
                  
                <button onClick={clickcreate} className="btn btn-default">Create New Account</button>
            )
            }
            <div className='row'>
            <button onClick={getAllAccount} className="btn btn-default"> Refresh Data</button>
            </div>
          </div>
        )  : (
          <div className="modal-content">
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
