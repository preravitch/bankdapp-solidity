//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
contract Bank {
    address owner;
    address public Usdt;

    event showname(string _Name, address owner);

    constructor() {
    owner = msg.sender;
  }
    function getUsdtAddress(address _UsdtAddress) external {
        require(msg.sender == owner, "No Permission");
        Usdt = _UsdtAddress;
    }

    function UsdtAddress() external view returns(address) {
        return Usdt;
    }

    struct BankAccont {
        string name;
        uint   balance;
        address owner;
    }

    BankAccont[] public Accounts;

    function userAccounts() public view returns (BankAccont[] memory) {
        BankAccont[] memory userdetail = new BankAccont[](Accounts.length);
        uint count = 0;
        for (uint i = 0; i < Accounts.length; i++) {
            if (Accounts[i].owner == msg.sender) {
                userdetail[count] = Accounts[i];
                count++;
            }
        }
        return userdetail;
    }

    function userAccountsdetails() public view returns (BankAccont[] memory) {
        BankAccont[] memory myaccount = new BankAccont[](Accounts.length);
        uint count = 0;
        for (uint i = 0; i < Accounts.length; i++) {
            if (Accounts[i].owner == msg.sender) {
                myaccount[count] = Accounts[i];
                count++;
            }
        }
        return myaccount;
    }

    function createnewaccount(string memory _accountname) public {
        BankAccont memory newAccount = BankAccont (_accountname, 0, msg.sender);
        Accounts.push(newAccount);
        emit showname(newAccount.name, msg.sender);
    }

    function compareStringsbyBytes(string memory s1, string memory s2) public pure returns(bool){
    return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }

    function getBalance(string memory _accountname) public view returns(uint) {
       uint balance;
       for (uint i = 0; i < Accounts.length; i++) {
            if (compareStringsbyBytes(Accounts[i].name,_accountname)) {
                balance = Accounts[i].balance;
            }
        }
        return balance;
    }

    function depositUsdt(string memory _accountname, uint _amount) external {
       uint index;
       for (uint i = 0; i < Accounts.length; i++) {
            if (compareStringsbyBytes(Accounts[i].name,_accountname)) {
                index = i;
            }
        }
        Accounts[index].balance += _amount;
       IERC20(Usdt).transferFrom(msg.sender, address(this), _amount);
    }

    function withdrawUsdt(uint _amount, string memory _accountname) public {
        uint index;
        for (uint i = 0; i < Accounts.length; i++) {
            if (compareStringsbyBytes(Accounts[i].name,_accountname)) {
                index = i;
            }
        }
       require(Accounts[index].balance >= _amount, "not enough funds");

        Accounts[index].balance -= _amount;
        IERC20(Usdt).transfer(msg.sender, _amount);
    }

    function transferUsdt(string memory _accountfrom, string memory _accountto, uint _amount) public {
        uint from;
        uint to;
        for (uint i = 0; i < Accounts.length; i++) {
            if (compareStringsbyBytes(Accounts[i].name, _accountfrom)) {
                from = i;
            } else if  (compareStringsbyBytes(Accounts[i].name, _accountto)) {
                to = i;
            }
        }
        require(Accounts[from].balance >= _amount, "not enough funds");
        
        Accounts[from].balance -= _amount;
        //checksameowner
        if (Accounts[from].owner != Accounts[to].owner) {
            _amount = _amount * 99 / 100;
        }
        Accounts[to].balance += _amount;
    }

}