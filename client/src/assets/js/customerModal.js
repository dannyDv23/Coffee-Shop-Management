var SweetAlert2Demo = (function () {
    //== Demos
    var initDemos = function () {
        // Attach click event to each table button
        // TODO: view table
        document.querySelectorAll('.view-table-button').forEach(button => {
            button.addEventListener('click', function () {
                var tableName = button.getAttribute('data-table');
                var tableStatus = button.getAttribute('data-status');
                var products = JSON.parse(button.getAttribute('data-list-product'));

                // Tạo danh sách sản phẩm dưới dạng chuỗi
                var productList = products.map(product => `${product.name} (${product.quantity})`).join(', ');

                // Tạo bảng HTML với input để hiển thị danh sách sản phẩm
                var tableHTML = `
                    <div style="margin-bottom: 10px;">
                        <strong>Booking schedule :</strong>
                        <textarea readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; max-height: 100px; overflow-y: auto;">${productList}</textarea>
                    </div>
                    <div style="max-height: 200px; overflow-y: auto;">
                     <strong>Product List:</strong> <!-- Scrollable Container -->
                    <div style="display: flex; margin-bottom: 8px;">                   
                            <input type="text" value="Product Name" readonly style="flex: 1; padding: 8px; border: 1px solid #ddd;
                            margin-right: 5px;" />
                            <input type="text" value="Quantity" readonly style="width: 100px; padding: 8px; border: 1px solid #ddd;" />
                        </div>
                       
                `;

                // Thay thế bảng bằng các ô input
                products.forEach(product => {
                    tableHTML += `
                        <div style="display: flex; margin-bottom: 8px;">
                            <input type="text" value="${product.name}" readonly style="flex: 1; padding: 8px; border: 1px solid #ddd; margin-right: 5px;" />
                            <input type="number" value="${product.quantity}" readonly style="width: 100px; padding: 8px; border: 1px solid #ddd;" />
                        </div>
                    `;
                });

                tableHTML += `
                    </div>
                    <div style="margin-top: 10px;">
                        <strong>Infomation customer :</strong>
                        <input id="productSummary" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd;" value="${productList}" />
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
                        }
                    },
                }).then((value) => {
                    switch (value) {
                        case "move":
                            swal("Table moved successfully!");
                            break;
                        case "cancel":
                            swal("Reservation canceled successfully!");
                            break;
                        default:
                            break;
                    }
                });
            });
        });

        // TODO: move table

        document.querySelectorAll('.move-table-button').forEach(button => {
            button.addEventListener('click', function () {
                var tableName = button.getAttribute('data-table');
                var tableStatus = button.getAttribute('data-status');

                // Updated to use a select element instead of an input
                var tableHTML = `
                    <div style="margin-top: 10px;">
                        <strong>Table Number:</strong>
                        <select id="tableNumber" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                            <option value="">Select a table</option>
                            <option value="Product 1">Product 1</option>
                            <option value="Product 2">Product 2</option>
                            <option value="Product 3">Product 3</option>
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
                }).then((value) => {
                    switch (value) {
                        case "move":
                            const selectedProduct = document.getElementById('tableNumber').value;
                            if (selectedProduct) {
                                swal(`Table moved successfully with product: ${selectedProduct}!`);
                            } else {
                                swal("Please select a product to move the table!");
                            }
                            break;
                        case "cancel":
                            swal("Reservation canceled successfully!");
                            break;
                        default:
                            break;
                    }
                });
            });
        });

        //TODO: split table
        document.querySelectorAll('.split-table-button').forEach(button => {
            button.addEventListener('click', function () {
                var tableName = button.getAttribute('data-table');
                var tableStatus = button.getAttribute('data-status');
                var tableHTML = `
                    <div style="margin-top: 10px;">
                        <strong>Choose table to split to:</strong>
                        <select id="targetTable" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                            <option value="">Select a table</option>
                            <option value="Table 1">Table 1</option>
                            <option value="Table 2">Table 2</option>
                            <option value="Table 3">Table 3</option>
                            <option value="Table 4">Table 4</option>
                            <option value="Table 5">Table 5</option>
                        </select>
                    </div>
        
                    <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                        <div>
                            <strong>Table 15</strong>
                            <div style="height: 150px; overflow-y: scroll; border: 1px solid #ddd;">
                                <label><input type="checkbox" class="product-checkbox" value="Sinh tố" data-quantity="1/1" /> Sinh tố (1/1)</label><br>
                                <label><input type="checkbox" class="product-checkbox" value="Pepsi" data-quantity="2/4" /> Pepsi (2/4)</label><br>
                                <label><input type="checkbox" class="product-checkbox" value="Trà Lipton" data-quantity="0/0" /> Trà Lipton (0/0)</label><br>
                            </div>
                        </div>
        
                        <div>
                            <button id="moveProduct" style="margin: auto;">&lt;&lt;</button>
                        </div>
        
                        <div>
                            <strong id="targetTableLabel">Target Table</strong>
                            <div id="targetProductList" style="height: 150px; overflow-y: scroll; border: 1px solid #ddd;">
                                <!-- Target table products will appear here -->
                            </div>
                        </div>
                    </div>
        
                    <div style="margin-top: 10px;">
                        <label for="splitQuantity">Quantity to split:</label>
                        <input type="number" id="splitQuantity" min="1" style="width: 50px; border: 1px solid #ddd;">
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
                            text: "Split",
                            value: "split",
                            className: "btn btn-warning"
                        }
                    },
                }).then((value) => {
                    switch (value) {
                        case "split":
                            const selectedTable = document.getElementById('targetTable').value;
                            const selectedQuantity = document.getElementById('splitQuantity').value;
                            const checkedProducts = Array.from(document.querySelectorAll('.product-checkbox:checked'))
                                .map(checkbox => checkbox.value);

                            if (selectedTable && checkedProducts.length > 0 && selectedQuantity) {
                                swal(`Split successfully to ${selectedTable} with quantity: ${selectedQuantity} for products: ${checkedProducts.join(', ')}`);
                            } else {
                                swal("Please select a table, product, and enter a valid quantity!");
                            }
                            break;
                        case "cancel":
                            swal("Action canceled successfully!");
                            break;
                        default:
                            break;
                    }
                });

                // Add event listener to move the product to the target list
                document.getElementById('moveProduct').addEventListener('click', () => {
                    const checkedProducts = Array.from(document.querySelectorAll('.product-checkbox:checked'));
                    const targetList = document.getElementById('targetProductList');
                    const selectedTable = document.getElementById('targetTable').value;

                    if (!selectedTable) {
                        swal("Please select a target table before moving products!");
                        return;
                    }

                    checkedProducts.forEach(product => {
                        const productName = product.value;
                        const productQuantity = product.getAttribute('data-quantity');

                        // Append the selected products to the target list
                        const productItem = document.createElement('div');
                        productItem.innerText = `${productName} (${productQuantity})`;
                        targetList.appendChild(productItem);

                        // Disable the moved product
                        product.disabled = true;
                    });
                });
            });
        });


        //TODO: merge table
        document.querySelectorAll('.merge-table-button').forEach(button => {
            button.addEventListener('click', function () {
                var tableName = button.getAttribute('data-table');
                var tableStatus = button.getAttribute('data-status');

                // HTML for selecting tables to merge with checkboxes in the left column
                var tableHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <div style="width: 45%;">
                            <strong>Select tables to merge:</strong>
                            <div id="tablesToMerge" style="width: 100%; padding: 8px; border: 1px solid #ddd; height: 150px; overflow-y: auto;">
                                <label><input type="checkbox" value="Table 01"> Table 01</label><br>
                                <label><input type="checkbox" value="Table 05"> Table 05</label><br>
                                <label><input type="checkbox" value="Table 08"> Table 08</label><br>
                                <label><input type="checkbox" value="Table 13"> Table 13</label>
                            </div>
                        </div>
        
                        <div style="width: 45%;">
                            <strong>Select the target table:</strong>
                            <select id="targetTable" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                                <option value="">Select a table</option>
                                <option value="Table 01">Table 01</option>
                                <option value="Table 02">Table 02</option>
                                <option value="Table 03">Table 03</option>
                                <option value="Table 04">Table 04</option>
                                <option value="Table 05">Table 05</option>
                            </select>
                        </div>
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
                            text: "Merge Tables",
                            value: "move",
                            className: "btn btn-warning"
                        }
                    },
                }).then((value) => {
                    switch (value) {
                        case "move":
                            const selectedTables = Array.from(document.querySelectorAll('#tablesToMerge input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
                            const targetTable = document.getElementById('targetTable').value;

                            if (selectedTables.length && targetTable) {
                                swal(`Tables merged successfully! Merged tables: ${selectedTables.join(', ')} to ${targetTable}.`);
                            } else {
                                swal("Please select tables to merge and a target table!");
                            }
                            break;
                        case "cancel":
                            swal("Reservation canceled successfully!");
                            break;
                        default:
                            break;
                    }
                });
            });
        });

        //TODO: cancel table
        document.querySelectorAll('.cancel-table-button').forEach(button => {
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

        //TODO: book table
        document.querySelectorAll('.book-table-button').forEach(button => {
            button.addEventListener('click', function () {
                const tableName = button.getAttribute('data-table');
        
                // Create the HTML for the form, styled similar to the image
                const reservationForm = `
                    <div style="margin-top: 10px;">
                        <strong>Khách hàng:</strong>
                        <input id="customerName" class="form-control" type="text" placeholder="Nhập tên khách hàng" value="Đặng Lê Hùng" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                    </div>
                    <div style="margin-top: 10px;">
                        <strong>SĐT:</strong>
                        <input id="customerPhone" class="form-control" type="text" placeholder="Nhập số điện thoại" value="0965433222" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                    </div>
                    <div style="margin-top: 10px;">
                        <strong>Ngày:</strong>
                        <input id="reservationDate" class="form-control" type="date" value="2014-12-24" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                    </div>
                    <div style="margin-top: 10px;">
                        <strong>Giờ:</strong>
                        <input id="reservationTime" class="form-control" type="time" value="10:23" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                    </div>
                `;
        
                const content = document.createElement('div');
                content.innerHTML = reservationForm;
        
                swal({
                    title: `Đặt bàn ${tableName}`, // Custom title for the table
                    content: content,  // Inject the form content
                    buttons: {
                        confirm: {
                            text: "Đặt bàn",  // Button text for confirming
                            className: "btn btn-success",
                        },
                        cancel: {
                            text: "Hủy",  // Button text for canceling
                            className: "btn btn-danger",
                            visible: true,
                        },
                    },
                }).then((confirmBooking) => {
                    if (confirmBooking) {
                        const name = document.getElementById('customerName').value;
                        const phone = document.getElementById('customerPhone').value;
                        const date = document.getElementById('reservationDate').value;
                        const time = document.getElementById('reservationTime').value;
        
                        // Show success message after booking confirmation
                        swal({
                            title: "Thành công!",
                            text: `Bàn đã được đặt cho ${name}, SĐT: ${phone}, Ngày: ${date}, Giờ: ${time}`,
                            icon: "success",
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

        //TODO: choose menu
        document.querySelectorAll('.choose-menu-button').forEach(button => {
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
