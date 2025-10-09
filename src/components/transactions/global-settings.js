export const specifyGasParametersInputId = 'specifyGasParameters';

export function specifyGasParametersInputComponent(parentContainer) {
  parentContainer.insertAdjacentHTML(
    'beforeend',
    `<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-center">
      <label for="${specifyGasParametersInputId}" class="!mb-0 font-weight-normal">
        Specify Gas Parameters (not for contract deployment)
      </label>
      <input
        class="ml-2"
        type="checkbox"
        id="${specifyGasParametersInputId}"
        checked
      />
    </div>`,
  );
}
