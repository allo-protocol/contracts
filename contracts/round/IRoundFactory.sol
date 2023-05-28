// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

interface IRoundFactory {
    function initialize() external;

    function updateAlloSettings(address newAlloSettings) external;

    function updateRoundImplementation(
        address payable newRoundImplementation
    ) external;

    function create(
        uint256 projectId,
        bytes calldata encodedParameters
    ) external returns (address);
}
