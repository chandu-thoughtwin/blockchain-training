// SPDX-License-Identifier: MIT

// pragma solidity ^0.5.17;
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staker is ERC20, Ownable {
    address[] stakerHolders;

    mapping(address => uint256) stakes;
    mapping(address => uint256) rewards;

    constructor() ERC20("Coin", "CCC") {}

    function isStakerHolder(address staker)
        public
        view
        returns (bool, uint256)
    {
        for (uint256 i = 0; i < stakerHolders.length; i += 1) {
            if (staker == stakerHolders[i]) return (true, i);
        }
        return (false, 0);
    }

    function addStakeHolder(address staker) public {
        (bool _staker, ) = isStakerHolder(staker);
        if (!_staker) {
            stakerHolders.push(staker);
        }
    }

    function removeStakeHolder(address staker) public {
        (bool _staker, uint256 i) = isStakerHolder(staker);
        if (_staker) {
            stakerHolders[i] = stakerHolders[stakerHolders.length - 1];
            stakerHolders.pop();
        }
    }

    function stakeOf(address staker) public view returns (uint256) {
        return (stakes[staker]);
    }

    function totalStakes() public view returns (uint256) {
        uint256 _totalStakes = 0;

        for (uint256 i = 0; i < stakerHolders.length; i += 1) {
            _totalStakes = _totalStakes + stakes[stakerHolders[i]];
        }
        return _totalStakes;
    }

    function createStake(uint256 stake_amount) public {
        _burn(msg.sender, stake_amount);
        if (stakes[msg.sender] == 0) {
            addStakeHolder(msg.sender);
        }
        stakes[msg.sender] = stakes[msg.sender] + stake_amount;
    }

    function removeStake(uint256 stake_amount) public {
        stakes[msg.sender] = stakes[msg.sender] - stake_amount;
        if (stakes[msg.sender] == 0) removeStakeHolder(msg.sender);
        _mint(msg.sender, stake_amount);
    }

    function rewardOf(address _stakerHolder) public view returns (uint256) {
        return (rewards[_stakerHolder]);
    }

    function totalReward() public view returns (uint256) {
        uint256 _totalReward = 0;

        for (uint256 i = 0; i < stakerHolders.length; i += 1) {
            _totalReward += _totalReward + rewards[stakerHolders[i]];
        }
        return _totalReward;
    }

    function calculateReward(address _stakerHolder)
        public
        view
        returns (uint256)
    {
        return stakes[_stakerHolder] / 100;
    }

    function distributeReward() public onlyOwner {
        for (uint256 i = 0; i < stakerHolders.length; i += 1) {
            address stakerHolder = stakerHolders[i];
            uint256 reward = calculateReward(stakerHolder);
            rewards[stakerHolder] = rewards[stakerHolder] + reward;
        }
    }

    function withdrawReward() public {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        _mint(msg.sender, reward);
    }
}
