//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Ecommarce{

  AggregatorV3Interface internal priceFeed;

  struct Product {
    string title;
    string desc;
    string img;
    uint price;
    uint productId;
    uint stocks;    // How many products has stocked
    address[] buyer;
    address payable seller;
  }

  Product[] public products;

//   uint[] public orderId;

  mapping(address=>mapping(uint => mapping(uint => uint))) public productsNumber;   // no[address][id][block.timestamp]=numbers

  mapping(address => mapping(uint => address[])) public customerById;   // customerById[seller address][itemId] = [customer addresses]

  mapping(address => mapping(uint => uint[])) public orderIdById;   // orderIdById[seller address][itemId] = [customer addresses]

  mapping(uint => mapping(address => mapping(uint => string))) public deliveryLocation;    // deliveryLocation[id][addr][block.timestamp]

  mapping(address => address[]) public myCustomers;

  mapping(uint => mapping(uint => address)) public customerByOrderId;   // customerByOrderId[orderId][itemId] = [customer address]

  mapping(uint => mapping (uint => mapping (address => bool))) public delivery;   // delivery[orderId(block.timeStamp)][itemId][buyerAddress] = true / false

  mapping(address => mapping(uint => uint[])) public storeOrderId;    // storeOrderId[buyerAddress][itemId] = [orderId's(block.timeStamp)]

  mapping(address => uint[]) public allMyOrderIds;    // allMyOrderIds[buyerAddress] = [orderId's(block.timeStamp)]

  mapping(address => mapping(uint => uint)) public getItemId;    // storeOrderId[buyerAddress][orderId's(block.timeStamp)] = itemId

  mapping(uint => mapping (uint => mapping (address => bool))) public orderCancel;    // orderCancel[orderId(block.timeStamp)][itemId][buyerAddress] = true / false

  uint public endAt;    // End day

  uint public listPrice;    // Listing price of a product into the market
  uint count = 1;

  address payable public manager;

  bool destroyed = false;

  constructor(){
    manager = payable(msg.sender);
    listPrice = 0.01 ether;
    endAt = 7 days;
    priceFeed = AggregatorV3Interface(
        0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    );
  }

  function registerProduct(string memory _title, string memory _desc, uint _price, uint _stocks, string memory _img) payable public {

    require(_price > 0, "Price should be greater then zero");
    // require(msg.value == listPrice * _stocks, "Please pay the exact price");
    Product memory tempProduct;
    tempProduct.title = _title;
    tempProduct.desc = _desc;
    tempProduct.img = _img;
    tempProduct.price = _price;
    tempProduct.stocks = _stocks;
    tempProduct.seller = payable(msg.sender);
    tempProduct.productId = count;
    products.push(tempProduct);
    count++;

  }

  function getLatestPrice() public view returns (int) {
    (
        ,
        /*uint80 roundID*/ int price /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,
        ,
        ,

    ) = priceFeed.latestRoundData();
    return price;
  }

  function buy(uint _productId, string memory _deliveryAddress, uint _numberOfProducts) payable public returns(uint) {

    require(msg.value == products[_productId-1].price * _numberOfProducts, "Please  pay the exact price");
    // require(msg.value >= products[_productId-1].price, "Please  pay the exact price");
    require(products[_productId-1].seller != msg.sender, "Seller not be the buyer");
    require(_numberOfProducts > 0, "Please select how many products you want to buy");
    require(_numberOfProducts <= products[_productId-1].stocks, "You reach the product's stock limit");
    uint orderId = block.timestamp;
    delivery[orderId][_productId][msg.sender] = false;
    storeOrderId[msg.sender][_productId].push(orderId);
    products[_productId-1].buyer.push(payable(msg.sender));
    deliveryLocation[_productId][msg.sender][block.timestamp] = _deliveryAddress;
    getItemId[msg.sender][orderId] = _productId;
    allMyOrderIds[msg.sender].push(orderId);
    myCustomers[products[_productId-1].seller] = products[_productId-1].buyer;
    // customers.push(products[_productId-1].buyer[products[_productId-1].buyer.length-1]);
    customerById[products[_productId-1].seller][_productId] = products[_productId-1].buyer;
    orderIdById[products[_productId-1].seller][_productId].push(orderId);
    customerByOrderId[orderId][_productId] = products[_productId-1].buyer[products[_productId-1].buyer.length-1];

    productsNumber[msg.sender][_productId][block.timestamp] = _numberOfProducts;
    products[_productId-1].stocks -= _numberOfProducts;

    return block.timestamp;

  }

  function completeDelivery(uint _orderId, uint _productId) payable public {
    require(products[_productId-1].seller != msg.sender, "Only buyer can call this");
    require(orderCancel[_orderId][_productId][msg.sender] == false, "Already Cancelled");
    uint number;
    number = productsNumber[msg.sender][_productId][_orderId];
    (products[_productId-1].seller).transfer(products[_productId-1].price * number);
    delivery[_orderId][_productId][msg.sender] = true;
  }

  function cancellOrder(uint _orderId, uint _productId) public {
    require(msg.sender != manager, "Manager can't cancell the order");
    require(delivery[_orderId][_productId][msg.sender] == false, "Already delivered");
    require(orderCancel[_orderId][_productId][msg.sender] == false, "Already Cancelled");
    uint number;
    number = productsNumber[msg.sender][_productId][_orderId];
    // return the buyer money(take it to the top for re-enterncy)
    payable(msg.sender).transfer(products[_productId-1].price * number);
    products[_productId-1].stocks += number;
    orderCancel[_orderId][_productId][msg.sender] = true;
  }

  function showAllMyOrderIds() public view returns(uint[] memory) {
    return allMyOrderIds[msg.sender];
  }

  function ShowMyCustomers() public view returns(address[] memory _buyers) {
    return myCustomers[msg.sender];
  }

  function ShowMyCustomersById(uint _id) public view returns(address[] memory _buyers) {
    return customerById[msg.sender][_id];
  }

  function ShowMyCustomersByOrderId(uint _orderId, uint _id) public view returns(address _buyer) {
    return customerByOrderId[_orderId][_id];
  }
  
  function ShowCustomersOrderIdById(uint _id) public view returns(uint[] memory) {
    return orderIdById[msg.sender][_id];
  }

  function showStockOfProduct(uint _productId) public view returns(uint) {
    return products[_productId-1].stocks;
  }

  function getAllProducts() view public returns(Product[] memory) {

    return products;

  }

  function showOrderId(uint _itemId, address _address) public view returns(uint[] memory) {
    return storeOrderId[_address][_itemId];
  }

  function updateDeliveryDays(uint _day) public {
    require(msg.sender == manager, "Only manager can call this function");
    endAt = _day;
  }

  function getMyAllProduct() public view returns(Product[] memory) {
    uint itemCount = 0;
    uint currentIndex = 0;

    for(uint i = 0; i < products.length; i++) {
      for(uint j = 0; j < products[i].buyer.length; j++) {
        if(products[i].buyer[j] == msg.sender) {
          itemCount++;
        }
      }
    }

    Product[] memory items = new Product[](itemCount);
    for(uint i = 0; i < products.length; i++) {
      for(uint j = 0; j < products[i].buyer.length; j++) {
        if(products[i].buyer[j] == msg.sender) {
          items[currentIndex] = products[i];
          currentIndex++;
        }
      }
    }
    return items;
  }

  function getAllMyListedProducts() public view returns(Product[] memory) {
    uint itemCount = 0;
    uint currentIndex = 0;

    for(uint i = 0; i < products.length; i++) {
      if(products[i].seller == msg.sender) {
        itemCount++;
      }
    }

    Product[] memory items = new Product[](itemCount);
    for(uint i = 0; i < products.length; i++) {
      if(products[i].seller == msg.sender){
        items[currentIndex] = products[i];
        currentIndex++;
      }
    }
    return items;
  }



}