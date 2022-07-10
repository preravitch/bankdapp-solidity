import React from 'react';
import { useRef } from "react";
import { ethers } from 'ethers';
import './Modal.css'

const toWei = ether => ( ethers.utils.parseEther(ether) );

const Modal = props => {
  const [value, setValue] = React.useState('');
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const amountRef =useRef();
  const submitHandlerdeposit = function (e) {
    e.preventDefault();
    const amount = amountRef.current.value
    const wei = toWei(amount)
    props.deposit(wei, props.account)
  };

  const submitHandlerwithdraw = function (e) {
    e.preventDefault();
    const amount = amountRef.current.value
    const wei = toWei(amount)
    props.deposit(wei, props.account)
  };
  if (!props.show) {
    return null
  }

  return(
    <div className="modaly" onClick={ props.onClose }>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Account: {props.account}</h2>
        </div>
        <div className="modal-body">

          <form>
            <div className="row">
              <div className='col-md-4'>
                <label>Balance: </label> 
              </div>
              <div className='col-md-5'>
                <label> {props.balance} </label>
              </div>
              <div className='col-md-2'>
                <label>Usdt </label> 
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label>Amount:</label>
              </div>
              <div className="col-md-5">
                <input 
                  style={{width: "230px"}} 
                  type="text" 
                  ref={amountRef} 
                  value={value}  
                  onChange={handleChange}
                  onKeyPress={e => {!/[0-9]/.test(e.key) && e.preventDefault()}}
                />
              </div>
              <div className="col-md-2">
                <label>Usdt</label>
              </div>
            </div>

            <div className="row">
              
            </div>
          </form>

        </div>

        <div className="modal-footer">
          <div className="col-md-5">
                <button disabled={!value} style={{width: "150px"}} onClick={ submitHandlerdeposit } className="btn btn-primary">Deposit</button>
              </div>
              <div className="col-md-5">
                <button disabled={!value} style={{width: "150px"}} onClick={ submitHandlerwithdraw } className="btn btn-primary">Withdraw</button>
              </div>
        </div>
      </div>
    </div>
  )
}

export default Modal