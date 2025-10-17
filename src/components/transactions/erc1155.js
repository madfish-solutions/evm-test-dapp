import globalContext from '../..';
import { specifyGasParametersInputId } from './global-settings';

export function erc1155Component(parentContainer) {
  parentContainer.insertAdjacentHTML(
    'beforeend',
    `<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-stretch">
      <div class="card full-width">
        <div class="card-body">
          <h4 class="card-title">
            ERC 1155
          </h4>

          <p class="info-text alert alert-success">
            Token(s): <span id="erc1155TokenAddresses"></span>
          </p>

          <button
          class="btn btn-primary btn-lg btn-block mb-3"
          id="deployERC1155Button"
          disabled
        >
          Deploy
        </button>

        <div class="form-group">
          <label>Batch Mint Receiver (empty for current account)</label>
          <input
            class="form-control"
            type="text"
            placeholder="0x..."
            id="batchMintReceiverInput"
          />
        </div>

        <div class="form-group">
          <label>Batch Mint Token IDs</label>
          <input
            class="form-control"
            type="text"
            placeholder="1, 2, 3"
            id="batchMintTokenIds"
          />
        </div>

        <div class="form-group">
          <label>Batch Mint Token ID Amounts</label>
          <input
            class="form-control"
            type="text"
            placeholder="1, 1, 1000000000000000"
            id="batchMintIdAmounts"
          />
        </div>

        <div class="form-group">
          <button
            class="btn btn-primary btn-lg btn-block mb-3"
            id="batchMintButton"
            disabled
          >
            Batch Mint
          </button>
        </div>

        <div class="form-group">
          <label>Batch Transfer From (empty for current account)</label>
          <input
            class="form-control"
            type="text"
            placeholder="0x..."
            id="batchTransferFromInput"
          />
        </div>

        <div class="form-group">
          <label>Batch Transfer To</label>
          <input
            class="form-control"
            type="text"
            placeholder="0x..."
            id="batchTransferToInput"
            value="0x2f318C334780961FB129D2a6c30D0763d9a5C970"
          />
        </div>

        <div class="form-group">
          <label>Batch Transfer Token IDs</label>
          <input
            class="form-control"
            type="text"
            placeholder="1, 2, 3"
            id="batchTransferTokenIds"
          />
        </div>

        <div class="form-group">
          <label>Batch Transfer Token Amounts</label>
          <input
            class="form-control"
            type="text"
            placeholder="1, 1, 1"
            id="batchTransferTokenAmounts"
          />
        </div>

        <div class="form-group">
          <button
            class="btn btn-primary btn-lg btn-block mb-3"
            id="batchTransferFromButton"
            disabled
          >
            Batch Transfer
          </button>
        </div>

        <div class="form-group">
          <label>Spender Address</label>
          <input
            class="form-control"
            type="text"
            placeholder="0x..."
            id="spenderAddressInput"
            value="0x9bc5baF874d2DA8D216aE9f137804184EE5AfEF4"
          />
        </div>

        <div class="form-group">
          <button
            class="btn btn-primary btn-lg btn-block mb-3"
            id="setApprovalForAllERC1155Button"
            disabled
          >
            Set Approval For All
          </button>
        </div>

        <div class="form-group">
          <button
            class="btn btn-primary btn-lg btn-block mb-3"
            id="revokeERC1155Button"
            disabled
          >
            Revoke
          </button>
        </div>

        <div class="form-group">
          <label>Watch ERC1155 Token ID</label>
          <input
            class="form-control"
            type="text"
            value="1"
            id="watchAssetInput"
          />
        </div>

        <div class="form-group">
          <button
            class="btn btn-primary btn-lg btn-block mb-3"
            id="watchAssetButton"
            disabled
          >
            Watch ERC1155 Asset
          </button>
        </div>

        <p class="info-text alert alert-secondary">
          ERC 1155 methods results: <span id="erc1155Status"></span>
        </p>
      </div>
    </div>
  </div>`,
  );

  const specifyGasParametersInput = document.getElementById(
    specifyGasParametersInputId,
  );
  const deployERC1155Button = document.getElementById('deployERC1155Button');
  const batchMintReceiverInput = document.getElementById(
    'batchMintReceiverInput',
  );
  const batchMintTokenIds = document.getElementById('batchMintTokenIds');
  const batchMintIdAmounts = document.getElementById('batchMintIdAmounts');
  const batchMintButton = document.getElementById('batchMintButton');
  const batchTransferFromInput = document.getElementById(
    'batchTransferFromInput',
  );
  const batchTransferToInput = document.getElementById('batchTransferToInput');
  const batchTransferTokenIds = document.getElementById(
    'batchTransferTokenIds',
  );
  const batchTransferTokenAmounts = document.getElementById(
    'batchTransferTokenAmounts',
  );
  const batchTransferFromButton = document.getElementById(
    'batchTransferFromButton',
  );
  const spenderAddressInput = document.getElementById('spenderAddressInput');
  const setApprovalForAllERC1155Button = document.getElementById(
    'setApprovalForAllERC1155Button',
  );
  const revokeERC1155Button = document.getElementById('revokeERC1155Button');
  const watchAssetInput = document.getElementById('watchAssetInput');
  const watchAssetButton = document.getElementById('watchAssetButton');
  const erc1155Status = document.getElementById('erc1155Status');
  const erc1155TokenAddresses = document.getElementById(
    'erc1155TokenAddresses',
  );

  document.addEventListener('globalConnectionChange', function (e) {
    if (e.detail.connected) {
      // MetaMask is connected, enable the button
      deployERC1155Button.disabled = false;
    }
  });

  document.addEventListener('disableAndClear', function () {
    deployERC1155Button.disabled = true;
    batchTransferTokenIds.disabled = true;
    batchTransferTokenAmounts.disabled = true;
    batchTransferFromButton.disabled = true;
    batchTransferFromInput.disabled = true;
    batchTransferToInput.disabled = true;
    setApprovalForAllERC1155Button.disabled = true;
    revokeERC1155Button.disabled = true;
    watchAssetInput.disabled = true;
    watchAssetButton.disabled = true;
    batchTransferTokenIds.value = '';
    batchTransferTokenAmounts.value = '';
  });

  document.addEventListener('contractIsDeployed', function () {
    // ERC 1155 Multi Token
    erc1155TokenAddresses.innerHTML = globalContext.erc1155Contract
      ? globalContext.erc1155Contract.address
      : '';
    erc1155Status.innerHTML = 'Deployed';
    batchMintButton.disabled = false;
    batchMintTokenIds.disabled = false;
    batchMintReceiverInput.disabled = false;
    batchMintIdAmounts.disabled = false;
    batchTransferFromInput.disabled = false;
    batchTransferToInput.disabled = false;
    batchTransferTokenIds.disabled = false;
    batchTransferTokenAmounts.disabled = false;
    batchTransferFromButton.disabled = false;
    setApprovalForAllERC1155Button.disabled = false;
    revokeERC1155Button.disabled = false;
    watchAssetInput.disabled = false;
    watchAssetButton.disabled = false;
  });

  /**
   * ERC1155 Token
   */

  let erc1155Contract;
  deployERC1155Button.onclick = async () => {
    erc1155Status.innerHTML = 'Deploying';

    try {
      erc1155Contract = await globalContext.erc1155Factory.deploy();
      await erc1155Contract.deployTransaction.wait();
    } catch (error) {
      erc1155Status.innerHTML = 'Deployment Failed!';
      throw error;
    }

    if (erc1155Contract.address === undefined) {
      return;
    }

    console.log(
      `Contract mined! address: ${erc1155Contract.address} transactionHash: ${erc1155Contract.deployTransaction.hash}`,
    );

    erc1155TokenAddresses.innerHTML = erc1155TokenAddresses.innerHTML
      .concat(', ', erc1155Contract.address)
      .split(', ')
      .filter(Boolean)
      .join(', ');

    erc1155Status.innerHTML = 'Deployed';
    batchTransferTokenIds.disabled = false;
    batchTransferTokenAmounts.disabled = false;
    batchMintButton.disabled = false;
    batchTransferFromButton.disabled = false;
    setApprovalForAllERC1155Button.disabled = false;
    revokeERC1155Button.disabled = false;
    watchAssetInput.disabled = false;
    watchAssetButton.disabled = false;
  };

  async function makeOperation(method, ...args) {
    const contract = erc1155Contract || globalContext.erc1155Contract;
    let result;
    if (specifyGasParametersInput.checked) {
      result = await (await contract[method](...args)).wait();
    } else {
      const params = await contract.populateTransaction[method](...args);
      result = await globalContext.provider.request({
        method: 'eth_sendTransaction',
        params: [params],
      });
    }

    console.log(result);

    return result;
  }

  batchMintButton.onclick = async () => {
    erc1155Status.innerHTML = 'Batch Mint initiated';
    try {
      await makeOperation(
        'mintBatch',
        batchMintReceiverInput.value || globalContext.accounts[0],
        batchMintTokenIds.value.split(',').map(Number),
        batchMintIdAmounts.value.split(',').map(Number),
        '0x',
      );
      erc1155Status.innerHTML = 'Batch Minting completed';
    } catch (error) {
      console.error(error);
      erc1155Status.innerHTML = 'Mint Failed!';
    }
  };

  batchTransferFromButton.onclick = async () => {
    erc1155Status.innerHTML = 'Batch Transfer From initiated';
    try {
      await makeOperation(
        'safeBatchTransferFrom',
        batchTransferFromInput.value || globalContext.accounts[0],
        batchTransferToInput.value,
        batchTransferTokenIds.value.split(',').map(Number),
        batchTransferTokenAmounts.value.split(',').map(Number),
        '0x',
      );
      erc1155Status.innerHTML = 'Batch Transfer From completed';
    } catch (error) {
      console.error(error);
      erc1155Status.innerHTML = 'Transaction Failed!';
    }
  };

  setApprovalForAllERC1155Button.onclick = async () => {
    erc1155Status.innerHTML = 'Set Approval For All initiated';
    try {
      await makeOperation('setApprovalForAll', spenderAddressInput.value, true);
      erc1155Status.innerHTML = 'Set Approval For All completed';
    } catch (error) {
      console.error(error);
      erc1155Status.innerHTML = 'Transaction Failed!';
    }
  };

  revokeERC1155Button.onclick = async () => {
    erc1155Status.innerHTML = 'Revoke initiated';
    try {
      await makeOperation(
        'setApprovalForAll',
        spenderAddressInput.value,
        false,
      );
      erc1155Status.innerHTML = 'Revoke completed';
    } catch (error) {
      console.error(error);
      erc1155Status.innerHTML = 'Transaction Failed!';
    }
  };

  watchAssetButton.onclick = async () => {
    try {
      const contract = erc1155Contract || globalContext.erc1155Contract;
      const watchAssetResult = await globalContext.provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC1155',
          options: {
            address: contract.address,
            tokenId: watchAssetInput.value,
          },
        },
      });
      console.log(watchAssetResult);
    } catch (error) {
      console.error(error);
    }
  };
}
