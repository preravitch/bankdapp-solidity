
import { ethers } from 'ethers';

const AccountList = function (props) {
    const toEther = wei => ( ethers.utils.formatEther(wei).toString());
    const modAcc = props.account.map(acc => {
        return {
          name: acc[0],
          address: acc[2]
        }
      })
      
    const accarr = modAcc;
    console.log(accarr);
    const html = accarr.map(acc => {

        return <p>Account Name: {acc.name}
                    <p>
                        Balance: {acc.balance} Usdt
                    </p>
                </p>
    })
    return html;
}

export default AccountList;