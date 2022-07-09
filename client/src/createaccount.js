import { useRef } from "react";
import styles from "./CreateAccount.module.css";
import './Modal.css'

const CreateAccount = function (props) {
  const accountRef = useRef();
  const submitHandler = function (e) {
    e.preventDefault();
    const account = accountRef.current.value;
    props.createAccount(account);
    props.change();
  };

  return (
    <div className="modaly" onClick={props.onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
            <label className="modal-title"> Create New Account</label>
        </div>
        <div className='modal-body'>
          <form>
            <label >Account Name</label>
            <input  ref={accountRef} />
          </form>
        </div>
        <div className="modal-footer">
                    <div className='col-md-8'>
                    <button style={{width: "150px"}} onClick={submitHandler} className="btn btn-primary">Create</button>
                    </div>
          
        </div>    
      </div>
    </div>
    
  );
};

export default CreateAccount;