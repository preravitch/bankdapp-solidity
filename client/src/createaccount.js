import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './createaccount.css'

const Createaccount = (props) => {
  return (
    <div className={`create account-container ${props.rootClassName} `}>
      <div className="create account-container1">
        <div className="create account-container2">
          <div className="create account-container3">
            <span className="create account-text">{props.account}</span>
          </div>
          <div className="create account-container4">
            <div className="create account-container5">
              <input
                type="text"
                placeholder={props._inputaccountname}
                className="create account-input input"
              />
            </div>
          </div>
          <Link to="/accounts" className="create account-navlink button">
            {props.button}
          </Link>
        </div>
        <div className="create account-container6">
          <Link to="/accounts" className="create account-navlink1 button">
            {props.Create}
          </Link>
        </div>
      </div>
    </div>
  )
}

Createaccount.defaultProps = {
  account: 'Account Name:',
  Create: 'Create',
  button: 'close',
  _inputaccountname: '',
  rootClassName: '',
}

Createaccount.propTypes = {
  account: PropTypes.string,
  Create: PropTypes.string,
  button: PropTypes.string,
  _inputaccountname: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default Createaccount
