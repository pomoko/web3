// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "hardhat/console.sol"; //for using console.log()
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner(); //ContractName__ErrorName

/** @title A contract for crowd funding
 *   @author me
 *   @notice This contract is to demo a sample funding contract
 *   @dev This imnplements price feeds as our library
 */
contract FundMe {
    //Type Declarations
    using PriceConverter for uint256;

    //State Variables
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10**18;
    AggregatorV3Interface private s_aggregatorPriceFeedAddress;

    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address _priceFeedAddress) {
        i_owner = msg.sender;
        s_aggregatorPriceFeedAddress = AggregatorV3Interface(_priceFeedAddress);
        console.log("console.log() debugging");
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function get_minimum_fund() public pure returns (uint256) {
        return MINIMUM_USD;
    }

    /**
     *   @notice This function funds this contract
     *   @dev This implements price feeds as our library
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_aggregatorPriceFeedAddress) >=
                get_minimum_fund(),
            "You need to spend more ETH!"
        );
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function getVersion() public view returns (uint256) {
        return s_aggregatorPriceFeedAddress.version();
    }

    function withdraw() public payable onlyOwner {
        //put the entire s_funders into a memory variable and then read from memory to save on gas
        //NOTE: mappings cant be in memory
        address[] memory memoryFundersArray = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < memoryFundersArray.length;
            funderIndex++
        ) {
            address currentFunderAddress = memoryFundersArray[funderIndex];
            s_addressToAmountFunded[currentFunderAddress] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 _index) public view returns (address) {
        return s_funders[_index];
    }

    function getAddressToAmountFunded(address _funderAddress)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[_funderAddress];
    }

    function getAggregatorPriceFeedAddress()
        public
        view
        returns (AggregatorV3Interface)
    {
        return s_aggregatorPriceFeedAddress;
    }
}
// Explainer from: https://solidity-by-example.org/fallback/
// Ether is sent to contract
//      is msg.data empty?
//          /   \
//         yes  no
//         /     \
//    receive()?  fallback()
//     /   \
//   yes   no
//  /        \
//receive()  fallback()

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly
