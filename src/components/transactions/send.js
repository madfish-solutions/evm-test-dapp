import { utils } from 'ethers';

import globalContext from '../..';
import Constants from '../../constants.json';
import { MIN_GAS_LIMIT } from '../../shared/constants';
import { specifyGasParametersInputId } from './global-settings';

const { heavyCallData } = Constants;

export function sendComponent(parentContainer) {
  parentContainer.insertAdjacentHTML(
    'beforeend',
    `<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-stretch">
        <div class="card full-width">
            <div class="card-body">
            <h4 class="card-title">
                Send Eth
            </h4>

            <div class="form-group">
              <label>Amount (ETH)</label>
              <input class="form-control" type="text" id="ethAmountInput" value="0">
            </div>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="sendButton"
                disabled
            >
                Send
            </button>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="sendEIP1559Button"
                disabled
                hidden
            >
                Send EIP 1559 Transaction
            </button>
            <a
                id="sendDeeplinkButton"
            >
                <button
                class="btn btn-warning btn-lg btn-block mb-3 text-dark"
                >
                (Mobile) Send with Deeplink
                </button>
            </a>
            <hr />
            <h4 class="card-title">
                Piggy bank contract
            </h4>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="deployButton"
                disabled
            >
                Deploy Contract
            </button>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="depositButton"
                disabled
            >
                Deposit
            </button>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="withdrawButton"
                disabled
            >
                Withdraw
            </button>

            <p class="info-text alert alert-secondary">
                Contract Status: <span id="contractStatus">Not clicked</span>
            </p>
            <hr />
            <h4 class="card-title">
                Failing contract
            </h4>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="deployFailingButton"
                disabled

            >
                Deploy Failing Contract
            </button>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="sendFailingButton"
                disabled
            >
                Send Failing Transaction
            </button>

            <p class="info-text alert alert-secondary">
                Failing Contract Status: <span id="failingContractStatus">Not clicked</span>
            </p>
            <hr />
            <h4 class="card-title">
                Multisig contract
            </h4>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="deployMultisigButton"
                disabled

            >
                Deploy Multisig Contract
            </button>

            <button
                class="btn btn-primary btn-lg btn-block mb-3"
                id="sendMultisigButton"
                disabled
            >
                Send ETH to Multisig Address
            </button>

            <p class="info-text alert alert-secondary">
                Multisig Contract Status: <span id="multisigContractStatus">Not clicked</span>
            </p>
            <hr />
            <div class="contract-interaction-section">
                <h4 class="card-title">Heavy Hex Data</h4>
                <p>⚠️ WARNING: this can significantly degradate your wallet performance</p>
                <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    id="sendHeavyHexDataButton"
                    disabled
                >
                    Send with heavy hex data (always without gas parameters)
                </button>
            </div>
            </div>
        </div>
    </div>`,
  );

  const ethAmountInput = document.getElementById('ethAmountInput');
  const sendButton = document.getElementById('sendButton');
  const sendEIP1559Button = document.getElementById('sendEIP1559Button');
  const sendDeeplinkButton = document.getElementById('sendDeeplinkButton');
  const deployButton = document.getElementById('deployButton');
  const depositButton = document.getElementById('depositButton');
  const withdrawButton = document.getElementById('withdrawButton');
  const contractStatus = document.getElementById('contractStatus');
  const deployFailingButton = document.getElementById('deployFailingButton');
  const sendFailingButton = document.getElementById('sendFailingButton');
  const failingContractStatus = document.getElementById(
    'failingContractStatus',
  );
  const deployMultisigButton = document.getElementById('deployMultisigButton');
  const sendMultisigButton = document.getElementById('sendMultisigButton');
  const multisigContractStatus = document.getElementById(
    'multisigContractStatus',
  );
  const sendHeavyHexDataButton = document.getElementById(
    'sendHeavyHexDataButton',
  );
  const specifyGasParametersInput = document.getElementById(
    specifyGasParametersInputId,
  );

  sendDeeplinkButton.href =
    'https://metamask.app.link/send/0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb?value=0';

  document.addEventListener('globalConnectionChange', function (e) {
    if (e.detail.connected) {
      // MetaMask is connected, enable the button
      sendButton.disabled = false;
      deployButton.disabled = false;
      deployFailingButton.disabled = false;
      deployMultisigButton.disabled = false;
      sendHeavyHexDataButton.disabled = false;
    }
  });

  document.addEventListener('disableAndClear', function () {
    sendButton.disabled = true;
    deployButton.disabled = true;
    depositButton.disabled = true;
    withdrawButton.disabled = true;
    deployFailingButton.disabled = true;
    sendFailingButton.disabled = true;
    deployMultisigButton.disabled = true;
    sendMultisigButton.disabled = true;
    sendHeavyHexDataButton.disabled = true;
  });

  document.addEventListener('contractIsDeployed', function () {
    // Piggy bank contract
    contractStatus.innerHTML = 'Deployed';
    depositButton.disabled = false;
    withdrawButton.disabled = false;
    // Failing contract
    failingContractStatus.innerHTML = 'Deployed';
    sendFailingButton.disabled = false;
    // Multisig contract
    multisigContractStatus.innerHTML = 'Deployed';
    sendMultisigButton.disabled = false;
    // Heavy calldata
    sendHeavyHexDataButton.disabled = false;
  });

  document.addEventListener('blockBaseFeePerGasUpdate', function (e) {
    if (e.detail.supported) {
      sendEIP1559Button.disabled = false;
      sendEIP1559Button.hidden = false;
      sendButton.innerText = 'Send Legacy Transaction';
    } else {
      sendEIP1559Button.disabled = true;
      sendEIP1559Button.hidden = true;
      sendButton.innerText = 'Send';
    }
  });

  /**
   * Sending ETH
   */

  sendButton.onclick = async () => {
    const specifyGasParameters = specifyGasParametersInput.checked;
    const result = await globalContext.provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: globalContext.accounts[0],
          to: '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb',
          value: utils.parseEther(ethAmountInput.value || '0').toHexString(),
          gasLimit: specifyGasParameters ? '0x5208' : undefined,
          gasPrice: specifyGasParameters ? '0x2540be400' : undefined,
          type: '0x0',
        },
      ],
    });
    console.log(result);
  };

  sendEIP1559Button.onclick = async () => {
    const specifyGasParameters = specifyGasParametersInput.checked;
    const result = await globalContext.provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: globalContext.accounts[0],
          to: '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb',
          value: utils.parseEther(ethAmountInput.value || '0').toHexString(),
          gasLimit: specifyGasParameters ? MIN_GAS_LIMIT : undefined,
          maxFeePerGas: specifyGasParameters ? '0x2540be400' : undefined,
          maxPriorityFeePerGas: specifyGasParameters ? '0x3b9aca00' : undefined,
        },
      ],
    });
    console.log(result);
  };

  /**
   * Piggy bank
   */
  let piggybankContract;

  deployButton.onclick = async () => {
    contractStatus.innerHTML = 'Deploying';
    try {
      piggybankContract = await globalContext.piggybankFactory.deploy();
      await piggybankContract.deployTransaction.wait();
    } catch (error) {
      contractStatus.innerHTML = 'Deployment Failed';
      throw error;
    }

    console.log(piggybankContract.address);
    if (piggybankContract.address === undefined) {
      return;
    }

    console.log(
      `Contract mined! address: ${piggybankContract.address} transactionHash: ${piggybankContract.deployTransaction.hash}`,
    );
    contractStatus.innerHTML = 'Deployed';
    depositButton.disabled = false;
    withdrawButton.disabled = false;
  };

  async function makePiggybankOperation(method, ...args) {
    const contract = piggybankContract || globalContext.piggybankContract;
    let result;
    if (specifyGasParametersInput.checked) {
      result = await contract[method](...args);
    } else {
      const params = await contract.populateTransaction[method](...args);
      result = await globalContext.provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            ...params,
            value: params.value ? params.value.toHexString() : undefined,
          },
        ],
      });
    }

    console.log(result);
    const receipt = await result.wait();
    console.log(receipt);

    return receipt;
  }

  function withErrorHandling(fn) {
    return async (...args) => {
      try {
        await fn(...args);
      } catch (error) {
        console.log('error', error);
      }
    };
  }

  depositButton.onclick = withErrorHandling(async () => {
    contractStatus.innerHTML = 'Deposit initiated';
    await makePiggybankOperation('deposit', { value: '0x3782dace9d900000' });
    contractStatus.innerHTML = 'Deposit completed';
  });

  withdrawButton.onclick = withErrorHandling(async () => {
    await makePiggybankOperation('withdraw', '0xde0b6b3a7640000');
    contractStatus.innerHTML = 'Withdrawn';
  });

  /**
   * Failing
   */

  let failingContract;
  deployFailingButton.onclick = async () => {
    failingContractStatus.innerHTML = 'Deploying';

    try {
      failingContract = await globalContext.failingContractFactory.deploy();
      await failingContract.deployTransaction.wait();
    } catch (error) {
      failingContractStatus.innerHTML = 'Deployment Failed';
      throw error;
    }

    if (failingContract.address === undefined) {
      return;
    }

    console.log(
      `Contract mined! address: ${failingContract.address} transactionHash: ${failingContract.deployTransaction.hash}`,
    );
    failingContractStatus.innerHTML = 'Deployed';
    sendFailingButton.disabled = false;
  };

  sendFailingButton.onclick = async () => {
    try {
      const specifyGasParameters = specifyGasParametersInput.checked;
      const contract = failingContract || globalContext.failingContract;
      const result = await globalContext.provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: globalContext.accounts[0],
            to: contract.address,
            value: '0x0',
            gasLimit: specifyGasParameters ? MIN_GAS_LIMIT : undefined,
            maxFeePerGas: specifyGasParameters ? '0x2540be400' : undefined,
            maxPriorityFeePerGas: specifyGasParameters
              ? '0x3b9aca00'
              : undefined,
          },
        ],
      });
      failingContractStatus.innerHTML =
        'Failed transaction process completed as expected.';
      console.log('send failing contract result', result);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  /**
   * Multisig
   */

  let multisigContract;
  deployMultisigButton.onclick = async () => {
    multisigContractStatus.innerHTML = 'Deploying';
    try {
      multisigContract = await globalContext.multisigFactory.deploy();
      await multisigContract.deployTransaction.wait();
    } catch (error) {
      multisigContractStatus.innerHTML = 'Deployment Failed';
      throw error;
    }

    if (multisigContract.address === undefined) {
      return;
    }

    console.log(
      `Contract mined! address: ${multisigContract.address} transactionHash: ${multisigContract.deployTransaction.hash}`,
    );
    multisigContractStatus.innerHTML = 'Deployed';
    sendMultisigButton.disabled = false;
  };

  sendMultisigButton.onclick = async () => {
    try {
      const specifyGasParameters = specifyGasParametersInput.checked;
      const contract = multisigContract || globalContext.multisigContract;
      const result = await globalContext.provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: globalContext.accounts[0],
            to: contract.address,
            value: '0x16345785D8A0', // 24414062500000
            gasLimit: specifyGasParameters ? MIN_GAS_LIMIT : undefined,
            maxFeePerGas: specifyGasParameters ? '0x2540be400' : undefined,
            maxPriorityFeePerGas: specifyGasParameters
              ? '0x3b9aca00'
              : undefined,
          },
        ],
      });
      multisigContractStatus.innerHTML = 'Transaction completed as expected.';
      console.log('send multisig contract result', result);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  sendHeavyHexDataButton.onclick = async () => {
    try {
      const result = await globalContext.provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: globalContext.accounts[0],
            to: '0x0000000000000000000000000000000000000000',
            data: heavyCallData,
          },
        ],
      });
      console.log('Transaction completed as expected.', result);
    } catch (error) {
      console.log('Error sending transaction', error);
      throw error;
    }
  };
}
