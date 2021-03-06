
import { ethers } from 'ethers';

const AccountList = function (props) {
    const toEther = wei => ( ethers.utils.formatEther(wei).toString());
    const toNum = max => ( ethers.BigNumber.from(max).toNumber());
    const modAcc = props.account.map(acc => {
        return {
          name: acc[0],
          balance: toEther(acc[1])
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