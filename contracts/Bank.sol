//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Bank {
    address owner;
    address public Usdt;

    constructor() {
    owner = msg.sender;
  }
    function getAddress(address UsdtAddress) external {
        require(msg.sender == owner, "No Permission");
        Usdt = UsdtAddress;
    }

    struct BankAccont {
        string name;
        uint   balance;
        address owner;
    }

    BankAccont[] public Accounts;
    mapping(address => mapping(string => BankAccont)) public AccountDetails;
    mapping(address => BankAccont) public accountwallet;

    function createnewaccount(string memory _accountname) public {
        BankAccont memory newAccount = BankAccont (_accountname, 0, msg.sender);
        Accounts.push(newAccount);
    }

    function myAccounts() public view returns (string[] memory) {
        string[] memory myaccount = new string[](Accounts.length);
        uint count = 0;
        for (uint i = 0; i < Accounts.length; i++) {
            if (Accounts[i].owner == msg.sender) {
                myaccount[count] = Accounts[i].name;
                count++;
            }
        }
        return myaccount;
    }

    /*function myAccountsalldetail() public view returns (BankAccont[] memory) {
        BankAccont[] memory myaccount = new BankAccont[](Accounts.length);
        uint count = 0;
        for (uint i = 0; i < Accounts.length; i++) {
            if (Accounts[i].owner == msg.sender) {
                myaccount[count] = Accounts[i];
                count++;
            }
        }
        return myaccount;
    }*/

    function getBalance(string memory _accountname) public view returns(uint) {
       return AccountDetails[msg.sender][_accountname].balance;
    }

    function depositeUsdt(string memory _accountname, uint _amount) external {
       AccountDetails[msg.sender][_accountname].balance += _amount;
       IERC20(Usdt).transferFrom(msg.sender, address(this), _amount);
    }

    function withdrawUsdt(uint _amount, string memory _accountname) public {
       require(AccountDetails[msg.sender][_accountname].balance >= _amount, "not enough funds");

        AccountDetails[msg.sender][_accountname].balance -= _amount;
        IERC20(Usdt).transfer(msg.sender, _amount);
    }

    function withdrawAllUsdt(string memory _accountname) public {

       uint balanceToSend = AccountDetails[msg.sender][_accountname].balance;
    
       AccountDetails[msg.sender][_accountname].balance = 0;
       IERC20(Usdt).transfer(msg.sender, balanceToSend);
    }

    function transferUsdt(string memory _accountfrom, string memory _accountto, uint _amount) public {
       require(AccountDetails[msg.sender][_accountfrom].balance >= _amount, "not enough funds");
        
      AccountDetails[msg.sender][_accountfrom].balance -= _amount;
        //checksameowner
       if (AccountDetails[msg.sender][_accountfrom].owner != AccountDetails[msg.sender][_accountto].owner) {
            _amount = _amount * 99 / 100;
        }
      AccountDetails[msg.sender][_accountto].balance += _amount;
    }

    function transferAllUsdt(string memory _accountfrom, string memory _accountto) public {

        uint balanceToSend = AccountDetails[msg.sender][_accountfrom].balance;
       AccountDetails[msg.sender][_accountfrom].balance = 0;
        //checksameowner
       if (AccountDetails[msg.sender][_accountfrom].owner != AccountDetails[msg.sender][_accountto].owner) {
            balanceToSend = balanceToSend * 99 / 100;
        }
       AccountDetails[msg.sender][_accountto].balance = balanceToSend;
    }
}
