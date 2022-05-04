"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.makeDeployProxy = void 0;
var upgrades_core_1 = require("@openzeppelin/upgrades-core");
var utils_1 = require("./utils");
function makeDeployProxy(hre) {
    return function deployProxy(ImplFactory, args, opts) {
        if (args === void 0) { args = []; }
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var requiredOpts, kind, provider, manifest, impl, data, proxyDeployment, _a, ProxyFactory, _b, _c, _d, AdminFactory_1, adminAddress, TransparentUpgradeableProxyFactory, _e, _f, _g, inst;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (!Array.isArray(args)) {
                            opts = args;
                            args = [];
                        }
                        requiredOpts = upgrades_core_1.withValidationDefaults(opts);
                        kind = requiredOpts.kind;
                        provider = hre.network.provider;
                        return [4 /*yield*/, upgrades_core_1.Manifest.forNetwork(provider)];
                    case 1:
                        manifest = _h.sent();
                        if (!(kind === 'uups')) return [3 /*break*/, 3];
                        return [4 /*yield*/, manifest.getAdmin()];
                    case 2:
                        if (_h.sent()) {
                            upgrades_core_1.logWarning("A proxy admin was previously deployed on this network", [
                                "This is not natively used with the current kind of proxy ('uups').",
                                "Changes to the admin will have no effect on this new proxy.",
                            ]);
                        }
                        _h.label = 3;
                    case 3: return [4 /*yield*/, utils_1.deployImpl(hre, ImplFactory, requiredOpts)];
                    case 4:
                        impl = _h.sent();
                        data = getInitializerData(ImplFactory, args, opts.initializer);
                        console.log("opts", opts);
                        _a = kind;
                        switch (_a) {
                            case 'uups': return [3 /*break*/, 5];
                            case 'transparent': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 13];
                    case 5: return [4 /*yield*/, utils_1.getProxyFactory(hre, ImplFactory.signer)];
                    case 6:
                        ProxyFactory = _h.sent();
                        _c = (_b = Object).assign;
                        _d = [{ kind: kind }];
                        return [4 /*yield*/, utils_1.deploy(ProxyFactory, impl, data)];
                    case 7:
                        proxyDeployment = _c.apply(_b, _d.concat([_h.sent()]));
                        return [3 /*break*/, 13];
                    case 8: return [4 /*yield*/, utils_1.getProxyAdminFactory(hre, ImplFactory.signer)];
                    case 9:
                        AdminFactory_1 = _h.sent();
                        return [4 /*yield*/, upgrades_core_1.fetchOrDeployAdmin(provider, function () { return utils_1.deploy(AdminFactory_1); })];
                    case 10:
                        adminAddress = _h.sent();
                        return [4 /*yield*/, utils_1.getTransparentUpgradeableProxyFactory(hre, ImplFactory.signer)];
                    case 11:
                        TransparentUpgradeableProxyFactory = _h.sent();
                        _f = (_e = Object).assign;
                        _g = [{ kind: kind }];
                        return [4 /*yield*/, utils_1.deploy(TransparentUpgradeableProxyFactory, impl, adminAddress, data)];
                    case 12:
                        proxyDeployment = _f.apply(_e, _g.concat([_h.sent()]));
                        return [3 /*break*/, 13];
                    case 13: return [4 /*yield*/, manifest.addProxy(proxyDeployment)];
                    case 14:
                        _h.sent();
                        inst = ImplFactory.attach(proxyDeployment.address);
                        // @ts-ignore Won't be readonly because inst was created through attach.
                        inst.deployTransaction = proxyDeployment.deployTransaction;
                        return [2 /*return*/, inst];
                }
            });
        });
    };
    function getInitializerData(ImplFactory, args, initializer) {
        console.log("args", args);
        console.log("initializer", initializer);
        if (initializer === false) {
            return '0x';
        }
        var allowNoInitialization = initializer === undefined && args.length === 0;
        initializer = initializer !== null && initializer !== void 0 ? initializer : 'initialize';
        try {
            var fragment = ImplFactory.interface.getFunction(initializer);
            console.log("fragment", fragment);
            return ImplFactory.interface.encodeFunctionData(fragment, args);
        }
        catch (e) {
            if (e instanceof Error) {
                if (allowNoInitialization && e.message.includes('no matching function')) {
                    return '0x';
                }
            }
            throw e;
        }
    }
}
exports.makeDeployProxy = makeDeployProxy;
//# sourceMappingURL=deploy-proxy.js.map