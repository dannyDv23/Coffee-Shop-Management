var SweetAlert2Demo = (function () {
    //== Demos
    var initDemos = function () {
        // Attach click event to each table button
        // TODO: view table
        // document.querySelectorAll('.view-table-button').forEach(button => {
        //     button.addEventListener('click', async function () {
        //         var tableNumber = button.getAttribute('data-table');
        //         var tableStatus = button.getAttribute('data-status');

        //         try {
        //             // Fetch data from the API
        //             const response = await fetch(`http://localhost:3000/api/table/${tableNumber}`);
        //             const data = await response.json(); // Assuming API returns a JSON response
        //             const tableData = data.infoTable?.[0];
        //             console.log(tableData);

        //             if (!response.ok) {
        //                 throw new Error(`Error fetching table data: ${tableData.message}`);
        //             }

        //             // Extract bookings and orders from the tableData
        //             const bookings = tableData.bookings || [];
        //             const orders = tableData.orders || []; // Ensure orders is an array

        //             // Create bookings list string with booking status
        //             const bookingList = bookings.map(booking => {
        //                 return `${booking.customerName} (Phone: ${booking.phoneNumber}, Date: ${new Date(booking.date).toLocaleString()}, Time: ${booking.time}, Status: ${booking.status}, Reason: ${booking.reason})`;
        //             }).join(', ');

        //             // Create HTML content for the modal
        //             let tableHTML = `
        //                 <div style="margin-bottom: 10px; max-height: 100px; overflow-y: auto;">
        //                     <strong>Booking schedule:</strong>
        //                     <textarea readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; max-height: 100px; overflow-y: auto;">${bookingList}</textarea>
        //                 </div>
        //                 <div style="max-height: 200px; overflow-y: auto;">
        //                     <strong>Product List:</strong>
        //                     <div style="display: flex; margin-bottom: 8px;">
        //                         <input type="text" value="Product Name" readonly style="flex: 1; padding: 8px; border: 1px solid #ddd; margin-right: 5px;" />
        //                         <input type="text" value="Quantity" readonly style="width: 100px; padding: 8px; border: 1px solid #ddd;" />
        //                     </div>
        //                     ${orders.map(order => {
        //                 return order.product.map(product => `
        //                             <div style="display: flex; margin-bottom: 8px;">
        //                                 <input type="text" value="${product.name || 'Unknown Product'}" readonly style="flex: 1; padding: 8px; border: 1px solid #ddd; margin-right: 5px;" />
        //                                 <input type="number" value="${product.quantity || 0}" readonly style="width: 100px; padding: 8px; border: 1px solid #ddd;" />
        //                             </div>
        //                         `).join('');
        //             }).join('') || '<div>No products ordered.</div>'}
        //                 </div>
        //             `;

        //             // Create Information Customer section only if booking status is Confirmed
        //             if (bookings.some(booking => booking.status === "Confirmed")) {
        //                 const confirmedBookings = bookings.filter(booking => booking.status === "Confirmed");
        //                 tableHTML += `
        //                     <div style="margin-top: 10px; max-height: 100px; overflow-y: auto;">
        //                         <strong>Information Customer:</strong>
        //                         ${confirmedBookings.map(booking => `
        //                             <input id="productSummary" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; margin-bottom: 5px;" value="${booking.customerName} (Phone: ${booking.phoneNumber})" />
        //                         `).join('')}
        //                     </div>
        //                 `;
        //             }

        //             // Create a div for the content
        //             const content = document.createElement('div');
        //             content.innerHTML = tableHTML;

        //             // Display the modal with SweetAlert
        //             swal({
        //                 title: `Table ${tableNumber}`,
        //                 text: `Status: ${tableStatus}`,
        //                 icon: tableStatus === "Available" ? "info" : (tableStatus === "Empty" ? "warning" : "error"),
        //                 content: content,
        //                 buttons: {
        //                     confirm: {
        //                         text: "Close",
        //                         className: "btn btn-success"
        //                     }
        //                 },
        //             }).then((value) => {
        //                 switch (value) {
        //                     case "move":
        //                         swal("Table moved successfully!");
        //                         break;
        //                     case "cancel":
        //                         swal("Reservation canceled successfully!");
        //                         break;
        //                     default:
        //                         break;
        //                 }
        //             });
        //         } catch (error) {
        //             console.error('Error:', error);
        //             swal({
        //                 title: "Error",
        //                 text: `Failed to fetch data for table ${tableNumber}`,
        //                 icon: "error"
        //             });
        //         }
        //     });
        // });

        // TODO: move table

        document.querySelectorAll('.move-table-button').forEach(button => {
            button.addEventListener('click', async function () {
                var tableName = button.getAttribute('data-table');
                var tableStatus = button.getAttribute('data-status');

                try {
                    // Fetch data for empty tables
                    const response = await fetch(`http://localhost:3000/api/table/list-can-booking`);
                    const data = await response.json();
                    const emptyTables = data.listTableCanBook || [];
                    console.log(emptyTables);

                    if (!response.ok) {
                        throw new Error(`Error fetching table data: ${data.message}`);
                    }

                    // Create options for empty tables
                    let optionsHTML = emptyTables.map(table => `
                        <option value="${table.tableNumber}">Table ${table.tableNumber}</option>
                    `).join('');

                    if (optionsHTML === '') {
                        optionsHTML = '<option value="">No empty tables available</option>';
                    }

                    // Create the move table modal
                    var tableHTML = `
                        <div style="margin-top: 10px;">
                            <strong>Table Number:</strong>
                            <select id="tableNumber" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                                <option value="">Select an empty table</option>
                                ${optionsHTML}
                            </select>
                        </div>
                    `;

                    const content = document.createElement('div');
                    content.innerHTML = tableHTML;

                    swal({
                        title: tableName,
                        text: `Status: ${tableStatus}`,
                        icon: tableStatus === "Available" ? "success" : (tableStatus === "Empty" ? "warning" : "error"),
                        content: content,
                        buttons: {
                            confirm: {
                                text: "Close",
                                className: "btn btn-success"
                            },
                            move: {
                                text: "Move Table",
                                value: "move",
                                className: "btn btn-warning"
                            }
                        },
                    }).then(async (value) => {
                        switch (value) {
                            case "move":
                                const selectedTable = document.getElementById('tableNumber').value;
                                if (selectedTable) {
                                    try {
                                        // Call the API to move table data
                                        const moveResponse = await fetch(`http://localhost:3000/api/table/move`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                fromTableNumber: tableName, // The current table
                                                toTableNumber: selectedTable // The new empty table
                                            }),
                                        });

                                        const moveData = await moveResponse.json();

                                        if (!moveResponse.ok) {
                                            throw new Error(moveData.message || "Failed to move table.");
                                        }

                                        // Show success message
                                        swal(`Table moved successfully to Table ${selectedTable}!`).then(() => {
                                            // Reload the page after moving table successfully
                                            window.location.reload(); // Reload the current page
                                        });
                                    } catch (error) {
                                        swal({
                                            title: "Error",
                                            text: `Failed to move table: ${error.message}`,
                                            icon: "error"
                                        });
                                    }
                                } else {
                                    swal("Please select an empty table to move!");
                                }
                                break;
                            case "cancel":
                                swal("Reservation canceled successfully!");
                                break;
                            default:
                                break;
                        }
                    });
                } catch (error) {
                    console.error('Error:', error);
                    swal({
                        title: "Error",
                        text: `Failed to fetch data for empty tables`,
                        icon: "error"
                    });
                }
            });
        });


        //TODO: split table
        // document.querySelectorAll('.split-table-button').forEach(button => {
        //     button.addEventListener('click', function () {
        //         var tableName = button.getAttribute('data-table');
        //         var tableStatus = button.getAttribute('data-status');

        //         // Simulating product list from the selected table
        //         const products = [
        //             { name: 'Coffee', quantity: 4 },
        //             { name: 'Pepsi', quantity: 3 },
        //             { name: 'Tea', quantity: 2 }
        //         ];

        //         // Create product list with maximum quantity displayed
        //         let productHTML = products.map((product, index) => `
        //             <label style="display: flex;align-items: center;justify-content: flex-start;margin-left: 20px;">
        //                 <input type="radio" name="product" class="product-radio" data-max="${product.quantity}" value="${product.name}" /> 
        //                 ${product.name} (${product.quantity})
        //             </label>
        //         `).join('');

        //         var tableHTML = `
        //             <div style="margin-top: 10px;">
        //                 <strong>Choose table to split to:</strong>
        //                 <select id="targetTable" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
        //                     <option value="">Select a table</option>
        //                     <option value="Table 1">Table 1</option>
        //                     <option value="Table 2">Table 2</option>
        //                     <option value="Table 3">Table 3</option>
        //                     <option value="Table 4">Table 4</option>
        //                     <option value="Table 5">Table 5</option>
        //                 </select>
        //             </div>
            
        //             <div style="margin-top: 10px; display: flex; justify-content: space-between;">
        //                 <div style="width: 40%">
        //                     <strong>${tableName}</strong>
        //                     <div style="height: 150px; overflow-y: scroll; border: 1px solid #ddd;">
        //                         ${productHTML}
        //                     </div>
        //                 </div>
            
        //                 <div style="align-self: center;">
        //                      `+
        //                     //  <button id="moveLeft" style="margin-top: 5px;">&lt;&lt;</button>
        //                      `<button id="moveRight" style="margin-bottom: 5px;">&gt;&gt;</button>
        //                 </div>
            
        //                 <div style="width: 40%">
        //                     <strong id="targetTableLabel">Target Table</strong>
        //                     <div id="targetProductList" style="height: 150px; overflow-y: scroll; border: 1px solid #ddd;">
        //                         <!-- Target table products will appear here -->
        //                     </div>
        //                 </div>
        //             </div>
            
        //             <div style="margin-top: 10px;">
        //                 <label for="splitQuantity">Quantity to split:</label>
        //                 <input type="number" id="splitQuantity" min="1" style="width: 50px; border: 1px solid #ddd;">
        //             </div>
        //         `;

        //         const content = document.createElement('div');
        //         content.innerHTML = tableHTML;

        //         swal({
        //             title: tableName,
        //             text: `Status: ${tableStatus}`,
        //             icon: tableStatus === "Available" ? "success" : (tableStatus === "Empty" ? "warning" : "error"),
        //             content: content,
        //             buttons: {
        //                 confirm: {
        //                     text: "Close",
        //                     className: "btn btn-success"
        //                 },
        //                 move: {
        //                     text: "Split",
        //                     value: "split",
        //                     className: "btn btn-warning"
        //                 }
        //             },
        //         }).then((value) => {
        //             switch (value) {
        //                 case "split":
        //                     const selectedTable = document.getElementById('targetTable').value;
        //                     const selectedQuantity = document.getElementById('splitQuantity').value;
        //                     const selectedProduct = document.querySelector('.product-radio:checked');

        //                     if (selectedTable && selectedProduct && selectedQuantity) {
        //                         const maxQuantity = parseInt(selectedProduct.getAttribute('data-max'));

        //                         if (selectedQuantity <= maxQuantity) {
        //                             // Update both the source and target lists based on the split
        //                             const remainingQuantity = maxQuantity - selectedQuantity;
        //                             selectedProduct.parentNode.innerHTML = `${selectedProduct.value} (${remainingQuantity})`;

        //                             const targetList = document.getElementById('targetProductList');
        //                             targetList.innerHTML += `<div>${selectedProduct.value} (${selectedQuantity})</div>`;

        //                             swal(`Split successfully to ${selectedTable} with quantity: ${selectedQuantity} for ${selectedProduct.value}`);
        //                         } else {
        //                             swal("Split quantity exceeds available stock!");
        //                         }
        //                     } else {
        //                         swal("Please select a table, product, and enter a valid quantity!");
        //                     }
        //                     break;
        //                 case "cancel":
        //                     swal("Action canceled successfully!");
        //                     break;
        //                 default:
        //                     break;
        //             }
        //         });

        //         // Event listener for moving products to the right
        //         document.getElementById('moveRight').addEventListener('click', () => {
        //             const selectedProduct = document.querySelector('.product-radio:checked');
        //             const selectedQuantity = document.getElementById('splitQuantity').value;
        //             const targetList = document.getElementById('targetProductList');
        //             const selectedTable = document.getElementById('targetTable').value;

        //             if (!selectedTable) {
        //                 swal("Please select a target table before moving products!");
        //                 return;
        //             }

        //             if (selectedProduct && selectedQuantity) {
        //                 const maxQuantity = parseInt(selectedProduct.getAttribute('data-max'));
        //                 const inputQuantity = parseInt(selectedQuantity);

        //                 if (inputQuantity <= maxQuantity) {
        //                     const remainingQuantity = maxQuantity - inputQuantity;

        //                     selectedProduct.parentNode.innerHTML = `${selectedProduct.value} (${remainingQuantity})`;
        //                     const productItem = document.createElement('div');
        //                     productItem.innerText = `${selectedProduct.value} (${inputQuantity})`;
        //                     targetList.appendChild(productItem);

        //                     if (remainingQuantity === 0) {
        //                         selectedProduct.parentNode.style.display = 'none';
        //                     } else {
        //                         selectedProduct.setAttribute('data-max', remainingQuantity);
        //                         selectedProduct.parentNode.innerHTML = `
        //                     <label>
        //                         <input type="radio" name="product" class="product-radio" data-max="${remainingQuantity}" value="${selectedProduct.value}" />
        //                         ${selectedProduct.value} (${remainingQuantity})
        //                     </label>`;
        //                     }
        //                 } else {
        //                     swal("Quantity exceeds available amount!");
        //                 }
        //             } else {
        //                 swal("Please select a product and enter a quantity!");
        //             }
        //         });

        //         // Event listener for moving products to the left (undo move)
        //         // document.getElementById('moveLeft').addEventListener('click', () => {
        //         //     const targetProductList = document.getElementById('targetProductList');
        //         //     const lastMovedProduct = targetProductList.lastChild;

        //         //     if (lastMovedProduct) {
        //         //         const productName = lastMovedProduct.innerText.split(' ')[0];
        //         //         const productQuantity = parseInt(lastMovedProduct.innerText.match(/\d+/)[0]);

        //         //         // Find the product in the original list and restore it
        //         //         const originalProduct = Array.from(document.querySelectorAll('.product-radio')).find(input => input.value === productName);

        //         //         if (originalProduct) {
        //         //             const maxQuantity = parseInt(originalProduct.getAttribute('data-max'));
        //         //             const updatedQuantity = maxQuantity + productQuantity;

        //         //             originalProduct.setAttribute('data-max', updatedQuantity);
        //         //             originalProduct.parentNode.innerHTML = `
        //         //         <label>
        //         //             <input type="radio" name="product" class="product-radio" data-max="${updatedQuantity}" value="${originalProduct.value}" />
        //         //             ${originalProduct.value} (${updatedQuantity})
        //         //         </label>`;
        //         //         }

        //         //         // Remove the product from the target list
        //         //         targetProductList.removeChild(lastMovedProduct);
        //         //     } else {
        //         //         swal("No products to move back!");
        //         //     }
        //         // });
        //     });
        // });



        //TODO: merge table
        // document.querySelectorAll('.merge-table-button').forEach(button => {
        //     button.addEventListener('click', function () {
        //         var tableName = button.getAttribute('data-table');
        //         var tableStatus = button.getAttribute('data-status');

        //         // HTML for selecting tables to merge with checkboxes in the left column
        //         var tableHTML = `
        //             <div style="display: flex; justify-content: space-between;">
        //                 <div style="width: 45%;">
        //                     <strong>Select tables to merge:</strong>
        //                     <div id="tablesToMerge" style="width: 100%; padding: 8px; border: 1px solid #ddd; height: 150px; overflow-y: auto;">
        //                         <label><input type="checkbox" value="Table 01"> Table 01</label><br>
        //                         <label><input type="checkbox" value="Table 05"> Table 05</label><br>
        //                         <label><input type="checkbox" value="Table 08"> Table 08</label><br>
        //                         <label><input type="checkbox" value="Table 13"> Table 13</label>
        //                     </div>
        //                 </div>
        
        //                 <div style="width: 45%;">
        //                     <strong>Select the target table:</strong>
        //                     <select id="targetTable" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
        //                         <option value="">Select a table</option>
        //                         <option value="Table 01">Table 01</option>
        //                         <option value="Table 02">Table 02</option>
        //                         <option value="Table 03">Table 03</option>
        //                         <option value="Table 04">Table 04</option>
        //                         <option value="Table 05">Table 05</option>
        //                     </select>
        //                 </div>
        //             </div>
        //         `;

        //         const content = document.createElement('div');
        //         content.innerHTML = tableHTML;

        //         swal({
        //             title: tableName,
        //             text: `Status: ${tableStatus}`,
        //             icon: tableStatus === "Available" ? "success" : (tableStatus === "Empty" ? "warning" : "error"),
        //             content: content,
        //             buttons: {
        //                 confirm: {
        //                     text: "Close",
        //                     className: "btn btn-success"
        //                 },
        //                 move: {
        //                     text: "Merge Tables",
        //                     value: "move",
        //                     className: "btn btn-warning"
        //                 }
        //             },
        //         }).then((value) => {
        //             switch (value) {
        //                 case "move":
        //                     const selectedTables = Array.from(document.querySelectorAll('#tablesToMerge input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        //                     const targetTable = document.getElementById('targetTable').value;

        //                     if (selectedTables.length && targetTable) {
        //                         swal(`Tables merged successfully! Merged tables: ${selectedTables.join(', ')} to ${targetTable}.`);
        //                     } else {
        //                         swal("Please select tables to merge and a target table!");
        //                     }
        //                     break;
        //                 case "cancel":
        //                     swal("Reservation canceled successfully!");
        //                     break;
        //                 default:
        //                     break;
        //             }
        //         });
        //     });
        // });

        //TODO: cancel table
        // document.querySelectorAll('.cancel-table-button').forEach(button => {
        //     button.addEventListener('click', function () {
        //         swal({
        //             title: "Are you sure?",
        //             text: "You won't be able to revert this!",
        //             type: "warning",
        //             buttons: {
        //                 confirm: {
        //                     text: "Yes, delete it!",
        //                     className: "btn btn-success",
        //                 },
        //                 cancel: {
        //                     visible: true,
        //                     className: "btn btn-danger",
        //                 },
        //             },
        //         }).then((Delete) => {
        //             if (Delete) {
        //                 swal({
        //                     title: "Deleted!",
        //                     text: "Your file has been deleted.",
        //                     type: "success",
        //                     buttons: {
        //                         confirm: {
        //                             className: "btn btn-success",
        //                         },
        //                     },
        //                 });
        //             } else {
        //                 swal.close();
        //             }
        //         });
        //     });
        // });

        //TODO: book table
        // document.querySelectorAll('.book-table-button').forEach(button => {
        //     button.addEventListener('click', function () {
        //         const tableName = button.getAttribute('data-table');

        //         // Create the HTML for the form, styled similar to the image
        //         const reservationForm = `
        //             <div style="margin-top: 10px;">
        //                 <strong>Khách hàng:</strong>
        //                 <input id="customerName" class="form-control" type="text" placeholder="Nhập tên khách hàng" value="Đặng Lê Hùng" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
        //             </div>
        //             <div style="margin-top: 10px;">
        //                 <strong>SĐT:</strong>
        //                 <input id="customerPhone" class="form-control" type="text" placeholder="Nhập số điện thoại" value="0965433222" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
        //             </div>
        //             <div style="margin-top: 10px;">
        //                 <strong>Ngày:</strong>
        //                 <input id="reservationDate" class="form-control" type="date" value="2014-12-24" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
        //             </div>
        //             <div style="margin-top: 10px;">
        //                 <strong>Giờ:</strong>
        //                 <input id="reservationTime" class="form-control" type="time" value="10:23" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
        //             </div>
        //         `;

        //         const content = document.createElement('div');
        //         content.innerHTML = reservationForm;

        //         swal({
        //             title: `Đặt bàn ${tableName}`, // Custom title for the table
        //             content: content,  // Inject the form content
        //             buttons: {
        //                 confirm: {
        //                     text: "Đặt bàn",  // Button text for confirming
        //                     className: "btn btn-success",
        //                 },
        //                 cancel: {
        //                     text: "Hủy",  // Button text for canceling
        //                     className: "btn btn-danger",
        //                     visible: true,
        //                 },
        //             },
        //         }).then((confirmBooking) => {
        //             if (confirmBooking) {
        //                 const name = document.getElementById('customerName').value;
        //                 const phone = document.getElementById('customerPhone').value;
        //                 const date = document.getElementById('reservationDate').value;
        //                 const time = document.getElementById('reservationTime').value;

        //                 // Show success message after booking confirmation
        //                 swal({
        //                     title: "Thành công!",
        //                     text: `Bàn đã được đặt cho ${name}, SĐT: ${phone}, Ngày: ${date}, Giờ: ${time}`,
        //                     icon: "success",
        //                     buttons: {
        //                         confirm: {
        //                             className: "btn btn-success",
        //                         },
        //                     },
        //                 });
        //             } else {
        //                 swal.close();
        //             }
        //         });
        //     });
        // });

        //TODO: choose menu
        // document.querySelectorAll('.choose-menu-button').forEach(button => {
        //     button.addEventListener('click', function () {
        //         swal({
        //             title: "Are you sure?",
        //             text: "You won't be able to revert this!",
        //             type: "warning",
        //             buttons: {
        //                 confirm: {
        //                     text: "Yes, delete it!",
        //                     className: "btn btn-success",
        //                 },
        //                 cancel: {
        //                     visible: true,
        //                     className: "btn btn-danger",
        //                 },
        //             },
        //         }).then((Delete) => {
        //             if (Delete) {
        //                 swal({
        //                     title: "Deleted!",
        //                     text: "Your file has been deleted.",
        //                     type: "success",
        //                     buttons: {
        //                         confirm: {
        //                             className: "btn btn-success",
        //                         },
        //                     },
        //                 });
        //             } else {
        //                 swal.close();
        //             }
        //         });
        //     });
        // });

        //TODO: payment table
        document.querySelectorAll('.payment-table-button').forEach(button => {
            button.addEventListener('click', function () {
                const tableName = button.getAttribute('data-table');

                // Create the HTML for the payment form, styled similar to the image
                const paymentForm = `
                    <div style="margin-top: 10px;">
                        <strong>Bàn ${tableName}</strong>
                        <table border="1" cellpadding="10" style="width: 100%; text-align: left; margin-top: 10px;">
                            <thead>
                                <tr>
                                    <th>Tên món</th>
                                    <th>SL</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Sinh tố</td>
                                    <td>3</td>
                                    <td>45.000 đ</td>
                                </tr>
                                <tr>
                                    <td>Pepsi</td>
                                    <td>3</td>
                                    <td>21.000 đ</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="margin-top: 10px; text-align: right;">
                            <strong>Tổng:</strong> 66.000 đ
                        </div>
                        <div style="margin-top: 10px;">
                            <label><strong>Khách đưa:</strong></label>
                            <input id="cashGiven" class="form-control" type="number" value="100000" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                        </div>
                        <div style="margin-top: 10px;">
                            <label><strong>Thối lại:</strong></label>
                            <input id="change" class="form-control" type="number" value="34000" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                        </div>
                        <div style="margin-top: 10px;">
                            <input type="checkbox" id="changeTableStatus"> Đổi trạng thái bàn sang trống sau khi thanh toán
                        </div>
                    </div>
                `;

                const content = document.createElement('div');
                content.innerHTML = paymentForm;

                swal({
                    title: `Thanh toán bàn ${tableName}`,
                    content: content, // Inject the form content
                    buttons: {
                        confirm: {
                            text: "Thanh toán",
                            className: "btn btn-success",
                        },
                        cancel: {
                            text: "Hủy",
                            className: "btn btn-danger",
                            visible: true,
                        },
                    },
                }).then((confirmPayment) => {
                    if (confirmPayment) {
                        const cashGiven = document.getElementById('cashGiven').value;
                        const change = document.getElementById('change').value;; // This can be dynamically calculated if needed
                        const changeTableStatus = document.getElementById('changeTableStatus').checked;

                        // Show success message after confirming payment
                        swal({
                            title: "Thành công!",
                            text: `Thanh toán hoàn tất. Khách đưa: ${cashGiven} đ, Thối lại: ${change} đ`,
                            icon: "success",
                            buttons: {
                                confirm: {
                                    className: "btn btn-success",
                                },
                            },
                        }).then(() => {
                            if (changeTableStatus) {
                                // Logic to change table status goes here
                                console.log("Table status changed to 'trống'");
                            }
                        });
                    } else {
                        swal.close();
                    }
                });
            });
        });

        //TODO: Print setting
        document.querySelectorAll('.print-setting-button').forEach(button => {
            button.addEventListener('click', function () {
                swal({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    type: "warning",
                    buttons: {
                        confirm: {
                            text: "Yes, delete it!",
                            className: "btn btn-success",
                        },
                        cancel: {
                            visible: true,
                            className: "btn btn-danger",
                        },
                    },
                }).then((Delete) => {
                    if (Delete) {
                        swal({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            type: "success",
                            buttons: {
                                confirm: {
                                    className: "btn btn-success",
                                },
                            },
                        });
                    } else {
                        swal.close();
                    }
                });
            });
        });
    };

    return {
        //== Init
        init: function () {
            initDemos();
        },
    };
})();

//== Class Initialization
jQuery(document).ready(function () {
    SweetAlert2Demo.init();
});
