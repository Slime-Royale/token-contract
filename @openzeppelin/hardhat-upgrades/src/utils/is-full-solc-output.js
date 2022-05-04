"use strict";
exports.__esModule = true;
exports.isFullSolcOutput = void 0;
function isFullSolcOutput(output) {
    var _a;
    if ((output === null || output === void 0 ? void 0 : output.contracts) == undefined || (output === null || output === void 0 ? void 0 : output.sources) == undefined) {
        return false;
    }
    for (var _i = 0, _b = Object.values(output.contracts); _i < _b.length; _i++) {
        var file = _b[_i];
        if (file == undefined) {
            return false;
        }
        for (var _c = 0, _d = Object.values(file); _c < _d.length; _c++) {
            var contract = _d[_c];
            if (((_a = contract === null || contract === void 0 ? void 0 : contract.evm) === null || _a === void 0 ? void 0 : _a.bytecode) == undefined) {
                return false;
            }
        }
    }
    for (var _e = 0, _f = Object.values(output.sources); _e < _f.length; _e++) {
        var file = _f[_e];
        if ((file === null || file === void 0 ? void 0 : file.ast) == undefined || (file === null || file === void 0 ? void 0 : file.id) == undefined) {
            return false;
        }
    }
    return true;
}
exports.isFullSolcOutput = isFullSolcOutput;
//# sourceMappingURL=is-full-solc-output.js.map