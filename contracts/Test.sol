// //SPDX-License-Identifier: MIT

// pragma solidity ^0.8.9;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// contract Ecommarce{

//   AggregatorV3Interface internal priceFeed;

//   struct Product {
//     string title;
//     string desc;
//     string img;
//     uint price;
//     uint productId;
//     uint stocks;    // How many products has stocked
//     uint deliveryStart;
//     uint deliveryEnd;
//     address[] buyer;
//     address payable seller;
//     // bool delevered;
//   }

//   uint[] public orderId;

//   mapping(address=>mapping(uint => uint)) public productsNumber;   // mapping(address=>mapping(id=>no. of product)) ie. no[address][id]=numbers

//   mapping(address => mapping(uint => address[])) public customerById;

//   mapping(uint => mapping(address => string)) public deliveryLocation;    // where the item should delivered

//   mapping(address => address[]) public myCustomers;

//   // mapping(uint => mapping(address => bool)) public delevery;

//   mapping(uint => mapping (uint => mapping (address => bool))) public delevery;   // delivery[orderId(block.timeStamp)][itemId][buyerAddress] = true / false

//   mapping(address => mapping(uint => uint[])) public storeOrderId;    // storeOrderId[buyerAddress][itemId] = [orderId's(block.timeStamp)]

//   mapping(uint => mapping(address => bool)) public orderCancel;

//   uint public endAt;    // End day

//   uint public listPrice;    // Listing price of a product into the market
//   uint count = 1;
//   Product[] public products;

//   address payable public manager;

//   bool destroyed = false;

//   constructor(){
//     manager = payable(msg.sender);
//     listPrice = 0.01 ether;
//     endAt = 7 days;
//     priceFeed = AggregatorV3Interface(
//         0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
//     );
//   }

//   function registerProduct(string memory _title, string memory _desc, uint _price, uint _stocks, string memory _img) payable public {

//     require(_price > 0, "Price should be greater then zero");
//     // require(msg.value == listPrice * _stocks, "Please pay the exact price");
//     Product memory tempProduct;
//     tempProduct.title = _title;
//     tempProduct.desc = _desc;
//     tempProduct.img = _img;
//     tempProduct.price = _price;
//     tempProduct.stocks = _stocks;
//     tempProduct.seller = payable(msg.sender);
//     tempProduct.productId = count;
//     tempProduct.deliveryStart = block.timestamp;
//     tempProduct.deliveryEnd = block.timestamp + endAt;
//     products.push(tempProduct);
//     count++;

//   }

//   function getLatestPrice() public view returns (int) {
//     (
//         ,
//         /*uint80 roundID*/ int price /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,
//         ,
//         ,

//     ) = priceFeed.latestRoundData();
//     return price;
//   }

//   function buy(uint _productId, string memory _deliveryAddress, uint _numberOfProducts) payable public returns(uint) {

//     require(msg.value == products[_productId-1].price * _numberOfProducts, "Please  pay the exact price");
//     // require(msg.value >= products[_productId-1].price, "Please  pay the exact price");
//     require(products[_productId-1].seller != msg.sender, "Seller not be the buyer");
//     require(_numberOfProducts > 0, "Please select how many products you want to buy");
//     require(_numberOfProducts <= products[_productId-1].stocks, "You reach the product's stock limit");

//     // orderId = block.timestamp;
//     products[_productId-1].deliveryStart = block.timestamp;
//     delevery[block.timestamp][_productId][msg.sender] = false;
//     storeOrderId[msg.sender][_productId].push(block.timestamp);
    
//     products[_productId-1].buyer.push(payable(msg.sender));
//     deliveryLocation[_productId][msg.sender] = _deliveryAddress;

//     myCustomers[products[_productId-1].seller] = products[_productId-1].buyer;
//     // customers.push(products[_productId-1].buyer[products[_productId-1].buyer.length-1]);
//     customerById[products[_productId-1].seller][_productId] = products[_productId-1].buyer;

//     productsNumber[msg.sender][_productId] = _numberOfProducts;
//     products[_productId-1].stocks -= _numberOfProducts;

//     return block.timestamp;

//   }

//   // function cancellOrder(uint _productId) public {
//   //   require(msg.sender != manager, "Manager can't cancell the order");
//   //   require(delevery[_productId][msg.sender] == false, "Already delivered");
//   //   require(orderCancel[_productId][msg.sender] == false, "Already Cancelled");


//   //   uint number;
//   //   number = productsNumber[msg.sender][_productId];

//   //   // return the buyer money(take it to the top for re-enterncy)
//   //   payable(msg.sender).transfer(products[_productId-1].price * number);
    
//   //   products[_productId-1].stocks += number;
//   //   orderCancel[_productId][msg.sender] = true;
//   // }

//   function ShowMyCustomers() public view returns(address[] memory _buyers) {
//     return myCustomers[msg.sender];
//   }

//   function ShowMyCustomersById(uint _id) public view returns(address[] memory _buyers) {
//     return customerById[msg.sender][_id];
//   }

//   function showStockOfProduct(uint _productId) public view returns(uint) {
//     return products[_productId-1].stocks;
//   }

//   function getAllProducts() view public returns(Product[] memory) {

//     return products;

//   }

//   function showOrderId(uint _itemId, address _address) public view returns(uint[] memory) {
//     return storeOrderId[_address][_itemId];
//   }

//   function delivery(uint _orderId, uint _productId) payable public {

//     require(products[_productId-1].seller != msg.sender, "Only buyer can call this");
//     require(orderCancel[_productId][msg.sender] == false, "Already Cancelled");
//     // products[_productId-1].delevered = true;
//     uint number;
//     number = productsNumber[msg.sender][_productId];
//     (products[_productId-1].seller).transfer(products[_productId-1].price * number);
//     // delevery[products[_productId-1].deliveryStart][_productId][msg.sender] = true;
//     delevery[_orderId][_productId][msg.sender] = true;
//   }

  
//   function updateDeliveryDays(uint _day) public {
//     require(msg.sender == manager, "Only manager can call this function");
//     endAt = _day;
//   }

  
//   function getMyAllProduct() public view returns(Product[] memory) {
//     uint itemCount = 0;
//     uint currentIndex = 0;

//     for(uint i = 0; i < products.length; i++) {
//       for(uint j = 0; j < products[i].buyer.length; j++) {
//         if(products[i].buyer[j] == msg.sender) {
//           itemCount++;
//         }
//       }
//     }

//     Product[] memory items = new Product[](itemCount);
//     for(uint i = 0; i < products.length; i++) {
//       for(uint j = 0; j < products[i].buyer.length; j++) {
//         if(products[i].buyer[j] == msg.sender) {
//           items[currentIndex] = products[i];
//           currentIndex++;
//         }
//       }
//     }
//     return items;
//   }

//   function getAllMyListedProducts() public view returns(Product[] memory) {
//     uint itemCount = 0;
//     uint currentIndex = 0;

//     for(uint i = 0; i < products.length; i++) {
//       if(products[i].seller == msg.sender) {
//         itemCount++;
//       }
//     }

//     Product[] memory items = new Product[](itemCount);
//     for(uint i = 0; i < products.length; i++) {
//       if(products[i].seller == msg.sender){
//         items[currentIndex] = products[i];
//         currentIndex++;
//       }
//     }
//     return items;
//   }

  

// }