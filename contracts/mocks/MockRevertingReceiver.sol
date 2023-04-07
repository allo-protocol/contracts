// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

contract MockRevertingReceiver {
    receive() external payable {
        revert("ETH not accepted");
    }
}