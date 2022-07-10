import React from 'react';
import { useRef, useState } from "react";
import { ethers } from 'ethers';
import './TransferModal.css'

const toWei = ether => ( ethers.utils.parseEther(ether) );


const ListTransfer = function (props) {
    const [value1, setValue1] = React.useState('');
    const handleChange1 = (event) => {
        setValue1(event.target.value);
      };
    
    const [value2, setValue2] = React.useState('');
    const handleChange2 = (event) => {
        setValue2(event.target.value);
      };
    const [listname,setlistname] = useState([]);
    const nameRef = useRef();
    const amountRef = useRef();
    const addnameHandler = function (e) {
        e.preventDefault();
        const name = nameRef.current.value;
        setlistname(oldArray => [...oldArray,name] );
        setValue1('');
    }
    const clearlist = function (e) {
        e.preventDefault();
        setlistname([]);
    }
    const submitHandler = function (e) {
        e.preventDefault();
        const amount = amountRef.current.value;
        const wei = toWei(amount);
        props.listtransfer(props.account, listname, wei);
        setValue2('');
      };
    if (!props.show) {
        return null
      }
    
      return (
        <div className="modaly" onClick={ props.onClose }>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
                <label className="modal-title"> List Transfer Usdt</label>
            </div>
            <div className='modal-body'>
              <form onSubmit={addnameHandler}>
                <div className="row">
                        <div className='col-md-5'>
                            <label> Account: </label>
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
                            <label>to Accounts: </label>
                        </div>
                        <div className='col-md-6'>
                            <label>{listname.map(name => <p>{name}</p> )} </label>
                        </div>
                </div>
                <div className="row">
                        <div className='col-md-5'>
                            <label>add Account:</label>
                        </div>
                        <div className='col-md-4'>
                            <input type="text" style={{width: "200px"}} ref={nameRef} 
                                   value={value1}  
                                   onChange={handleChange1}
                            />
                        </div>
                        <div className='col-md-3'>
                            <button disabled={!value1} style={{width: "50px"}} onClick={addnameHandler} className="btn btn-primary">Add</button>
                            <button  style={{width: "50px"}} onClick={clearlist} className="btn btn-primary">Clear</button>
                        </div>
                </div>
                <div className="row">
                        <div className='col-md-5'>
                            <label>each Amount:</label>
                        </div>
                        <div className='col-md-4'>
                            <input 
                              style={{width: "200px"}} 
                              type="text" 
                              ref={amountRef}
                              value={value2}  
                              onChange={handleChange2}
                              onKeyPress={e => {!/[0-9]/.test(e.key) && e.preventDefault()}}
                            />
                        </div>
                        <div className='col-md-3'>
                            <label>Usdt</label>
                        </div>
                </div>
              </form>
              <div className="modal-fee">
                <p> 1% fee, if you transfer to account in other wallet </p>
                <p> No fee, if you transfer to account in this wallet</p>
              </div>
            </div>
            <div className="modal-footer">
                        <div className='col-md-8'>
                            <button  disabled={!value2 || (listname.length === 0)} style={{width: "150px"}} onClick={submitHandler} className="btn btn-primary">Transfer</button>
            </div>
            </div>    
          </div>
        </div>
        
      );
}

export default ListTransfer;