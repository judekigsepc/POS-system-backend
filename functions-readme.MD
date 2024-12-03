### POS System API Documentation for frontend devs.Am still working on it so the documentation isn't elaborate.

#### Overview

This **Point of Sale (POS) system** is under active development. It provides essential functionality for managing products, transactions, and user actions within a business environment. While the system is still being built out, the **role-based authentication** feature is functional, and various **CRUD operations** and real-time cart management features are already in place.

The system leverages **Socket.io** for real-time updates and uses **Axios** for API calls.

---

### Features in Development

- **Real-time Cart Management**: Adds, updates, and removes items from the cart using **Socket.io** for live updates.
- **CRUD Operations**: Basic operations are provided for managing **products**, **users**, and **transactions**.
- **Discount Application**: Discounts can be applied to the cart, and the cart is updated in real time.
- **Role-Based Authentication**: Authentication is set up, but further enhancements are expected.
  
Many features are under active development, including advanced security measures, payment gateway integration, and reporting systems.

---

### API Endpoints & Functions
This was developed in a react environment so am not sure of how it works with vanilla js.
1. copy the file to your directory and install socket.io-client and axios dependencies. The rest is as seen below.

Below is an outline of key API calls and their respective functionalities.

#### 1. **getAll** (Retrieve all records)

Fetches all records of a specific item (user, product, or transaction).

**Parameters**:
- `itemName`: Name of the item (must be one of `user`, `product`, or `transaction`).

**Example**:
```javascript
getAll('product')
```

#### 2. **getSingle** (Retrieve single record)

Fetches a specific record based on `itemName` and `id`.

**Parameters**:
- `itemName`: Name of the item (must be one of `user`, `product`, or `transaction`).
- `id`: Unique identifier of the item.

**Example**:
```javascript
getSingle('product', '12345')
```

#### 3. **addProduct** (Add new product)

Adds a new product to the inventory.

**Parameters**:
- `data`: Object containing the product details.

**Example**:
```javascript
addProduct({ name: 'Product A', price: 100, stock: 50 })
```

#### 4. **updateItem** (Update existing record)

Updates an existing item by `itemName` and `id`.

**Parameters**:
- `itemName`: Name of the item (must be one of `user`, `product`, or `transaction`).
- `id`: Unique identifier of the item to update.
- `data`: Updated data for the item.

**Example**:
```javascript
updateItem('product', '12345', { price: 120 })
```

#### 5. **deleteItem** (Delete a record)

Deletes an item by `itemName` and `id`.

**Parameters**:
- `itemName`: Name of the item (must be one of `user`, `product`, or `transaction`).
- `id`: Unique identifier of the item to delete.

**Example**:
```javascript
deleteItem('product', '12345')
```

---

### Real-Time Cart Management

Real-time interaction with the cart is achieved using **Socket.io**. Below are the key functions to manage cart actions:

#### 1. **addToCart**

Adds a product to the shopping cart.

**Parameters**:
- `prodId`: ID of the product.
- `qty`: Quantity to add.

**Example**:
```javascript
addToCart('prod123', 2)
```

#### 2. **updateCart**

Updates the quantity of a product already in the cart.

**Parameters**:
- `prodIndex`: Index of the product in the cart array.
- `qty`: New quantity.

**Example**:
```javascript
updateCart(0, 3)
```

#### 3. **deleteInCart**

Deletes a product from the cart.

**Parameters**:
- `prodIndex`: Index of the product in the cart array.

**Example**:
```javascript
deleteInCart(0)
```

#### 4. **discountCart**

Applies a discount to the cart.

**Parameters**:
- `discount`: Discount amount.
- `type`: Type of discount (e.g., percentage or fixed amount).

**Example**:
```javascript
discountCart(10, 'percentage')
```

#### 5. **handleCartResult**

Handles and updates the cart state based on server responses.

**Callback Parameters**:
- `cartProducts`: Array of products in the cart.
- `cartTotal`: Total price of the cart.
- `cartGeneralDiscount`: General discount applied to the cart.

**Example**:
```javascript
handleCartResult((cart) => {
  console.log(cart)
})
```

---

### Error Handling

The system uses **Socket.io** to listen for errors and notifications from the server. It logs errors or important messages to the console:

- **Error Handling**: Logs errors received from the server, including status codes and messages.
- **Notifications**: Logs any notifications sent from the server.

#### Example Error Handling:
```javascript
socket.on('error', (data) => {
  console.error(data)
})
```

---

### Authentication

The system uses role-based authentication to determine access levels. While role-based authentication is functional, the system is under development, and further enhancements will be implemented, including better session management and role-specific restrictions.

---

### Development Status

The **POS system** is a work in progress. While the core features like CRUD operations, real-time cart updates, and role-based authentication are in place, many additional functionalities, such as advanced reporting, user interfaces, payment processing, and enhanced security, are still under development.

Future enhancements include:
- Advanced security features
- Admin panel for managing products and transactions
- Payment gateway integration
- Detailed reporting tools

---

### Contributing

Contributions are welcome! If you'd like to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-xyz`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-xyz`).
6. Open a pull request.

---

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
