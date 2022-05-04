"use strict";
exports.__esModule = true;
exports.getContractAddress = void 0;
function getContractAddress(addressOrInstance) {
    if (typeof addressOrInstance === 'string') {
        return addressOrInstance;
    }
    else {
        return addressOrInstance.address;
    }
}
exports.getContractAddress = getContractAddress;
//# sourceMappingURL=contract-address.js.map