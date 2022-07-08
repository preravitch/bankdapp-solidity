import { useRef } from "react";
import styles from "./CreateAccount.module.css";

const CreateAccount = function (props) {
  const accountRef = useRef();
  const submitHandler = function (e) {
    e.preventDefault();
    const account = accountRef.current.value;
    props.createAccount(account);
    props.change();
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} action="#">
        <label htmlFor="name">Account Name:</label>
        <input type="text" ref={accountRef} />
        <div className={styles.tmp}>
          <button onClick={submitHandler} className={styles.button}>Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;