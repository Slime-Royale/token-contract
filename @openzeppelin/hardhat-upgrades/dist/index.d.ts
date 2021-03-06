import '@nomiclabs/hardhat-ethers';
import './type-extensions';
import type { silenceWarnings } from '@openzeppelin/upgrades-core';
import type { DeployFunction } from './deploy-proxy';
import type { PrepareUpgradeFunction } from './prepare-upgrade';
import type { UpgradeFunction } from './upgrade-proxy';
import type { ChangeAdminFunction, TransferProxyAdminOwnershipFunction, GetInstanceFunction } from './admin';
export interface HardhatUpgrades {
    deployProxy: DeployFunction;
    upgradeProxy: UpgradeFunction;
    prepareUpgrade: PrepareUpgradeFunction;
    silenceWarnings: typeof silenceWarnings;
    admin: {
        getInstance: GetInstanceFunction;
        changeProxyAdmin: ChangeAdminFunction;
        transferProxyAdminOwnership: TransferProxyAdminOwnershipFunction;
    };
}
//# sourceMappingURL=index.d.ts.map