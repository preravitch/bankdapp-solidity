import React from 'react';
import { useRef } from "react";
import './Modal.css'

const CreateAccount = function (props) {
  const [value, setValue] = React.useState('');
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const accountRef = useRef();
  const submitHandler = function (e) {
    e.preventDefault();
    const account = accountRef.current.value;
    props.createAccount(account);
    setValue('');
  };
  if (!props.show) {
    return null
  }

  return (
    <div className="modaly" onClick={props.onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
            <label className="modal-title"> Create New Account</label>
        </div>
        <div className='modal-body'>
          <form onSubmit={submitHandler}>
            <label >Account Name</label>
            <input  type='text' ref={accountRef} value={value} onChange={handleChange}/>
          </form>
        </div>
        <div className="modal-footer">
                    <div className='col-md-8'>
                    <button disabled={!value} style={{width: "150px"}} onClick={submitHandler} className="btn btn-primary">Create</button>
                    </div>
          
        </div>    
      </div>
    </div>
    
  );
};

export default CreateAccount;