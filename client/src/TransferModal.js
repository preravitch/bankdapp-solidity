import { useRef } from "react";
import { ethers } from 'ethers';
import styles from "./CreateAccount.module.css";
import './TransferModal.css'

const toWei = ether => ( ethers.utils.parseEther(ether) );

const TransferModal = function (props) {
  const amountRef = useRef();
  const toaccountRef = useRef();
  const submitHandler = function (e) {
    e.preventDefault();
    const amount = amountRef.current.value;
    const wei = toWei(amount)
    const toaccount = toaccountRef.current.value;
    props.transfer(props.account, toaccount, wei);
  };
  if (!props.show) {
    return null
  }

  return (
    <div className="modaly" onClick={ props.onClose }>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
            <label className="modal-title"> Transfer Usdt</label>
        </div>
        <div className='modal-body'>
          <form>
            <div className="row">
                    <div className='col-md-5'>
                        <label>Account: </label>
                    </div>
                    <div className='col-md-6'>
                        <label>{props.account} </label>
                    </div>
            </div>
            <div className="row">
                    <div className='col-md-5'>
                        <label>Balance:</label>
                    </div>
                    <div className='col-md-4'>
                        <label>{props.balance}</label>
                    </div>
                    <div className='col-md-3'>
                        <label> Usdt </label>
                    </div>
            </div>
            <div className="row">
                    <div className='col-md-5'>
                        <label>to Account:</label>
                    </div>
                    <div className='col-md-3'>
                        <input type="text" style={{width: "270px"}} ref={toaccountRef} />
                    </div>
            </div>
            <div className="row">
                    <div className='col-md-5'>
                        <label>Amount:</label>
                    </div>
                    <div className='col-md-4'>
                        <input style={{width: "200px"}} type="text" ref={amountRef} />
                        
                    </div>
                    <div className='col-md-3'>
                        <label>Usdt</label>
                    </div>
                    
            </div>
            
          </form>
        <div className="modal-footer">
                    <div className='col-md-8'>
                        <button style={{width: "150px"}} onClick={submitHandler} className="btn btn-primary">Transfer</button>
                    </div>
            
        </div>
        </div>    
      </div>
    </div>
    
  );
};

export default TransferModal;