var cl = console.log;

let productsArr = []

const productForm = document.getElementById("productForm")
const pName = document.getElementById("pName")
const price = document.getElementById("price")
const category = document.getElementById("category")
const quantity = document.getElementById("quantity")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const clearBtn = document.getElementById("clearBtn")
const tbody = document.getElementById("tbody")
const formHeading = document.getElementById("formHeading")
const spinner = document.getElementById("spinner")

const BASE_URL = `https://gaurav-1st-db-default-rtdb.firebaseio.com/`
const PRODUCT_URL = `${BASE_URL}/fetchProducts.json`

//============================== CREATE ====================================
function createNewProduct(eve) {
    eve.preventDefault();
    let newProduct = {
        pName: pName.value,
        category: category.value,
        price: price.value,
        quantity: quantity.value,
    }
    showSpinner("text-success")
    fetch(PRODUCT_URL, {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
            "content-type": "Applicaton/json",
            "Auth": "JWT TOKEN"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            let tr = document.createElement("tr")
            tr.id = data.name
            tr.innerHTML = `<td>1</td>
                        <td> ${newProduct.pName} </td>
                        <td> ${newProduct.category} </td>
                        <td> ${newProduct.price} </td>
                        <td> ${newProduct.quantity} </td>
                        <td><button onClick="editProduct(this)" class="btn btn-primary shadow">Edit</button><button onClick="removeProduct(this)" class="btn btn-danger shadow ml-1">Remove</button></td>`
            tbody.prepend(tr)
            clearForm()

            let td = document.querySelectorAll("#tbody tr")
            td.forEach((ele, i) => {
                ele.querySelector("td").innerText = i + 1
            })
            hideSpinner("text-success")
            showSnackBar("Added", "Product Added Successfully", "success")
        })
        .catch(err => {
            hideSpinner("text-success")
            showSnackBar("", err, "error")
        })
}
//============================== READ ==========================================
function fetchProducts(arr) {
    showSpinner("text-primary")
    fetch(PRODUCT_URL, {
        method: "GET",
        body: null
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key
                productsArr.unshift(data[key])
            }
            let result = ""
            arr.forEach((ele, i) => {
                result += `
                        <tr id=${ele.id}>
                        <td> ${i + 1} </td>
                        <td> ${ele.pName} </td>
                        <td> ${ele.category} </td>
                        <td> ${ele.price} </td>
                        <td> ${ele.quantity} </td>
                        <td><button onClick="editProduct(this)" class="btn btn-primary shadow">Edit</button>
                            <button onClick="removeProduct(this)" class="btn btn-danger shadow ml-1">Remove</button></td>
                        </tr>`
                tbody.innerHTML = result
            });
            hideSpinner("text-primary")
        })
        .catch(err => {
            hideSpinner("text-primary")
            showSnackBar("", err, "error")
        })
}
fetchProducts(productsArr)
//============================== EDIT ==========================================
function editProduct(ele) {
    let EDIT_ID = ele.closest("tr").id
    let EDIT_URL = `${BASE_URL}/fetchProducts/${EDIT_ID}.json`
    showSpinner("text-primary")
    fetch(EDIT_URL, {
        method: "GET",
        body: null
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            localStorage.setItem("EDIT_ID", EDIT_ID)
            pName.value = data.pName
            price.value = data.price
            category.value = data.category
            quantity.value = data.quantity

            formHeading.innerText = "Update Product"

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
            hideSpinner("text-primary")
        })
        .catch(err => {
            hideSpinner("text-primary")
            showSnackBar("", err, "error")
        })
}
//============================== UPDATE ========================================
function updateProduct(ele) {

    let UPDATE_ID = localStorage.getItem("EDIT_ID")
    localStorage.removeItem("EDIT_ID")

    let updatedProduct = {
        pName: pName.value,
        category: category.value,
        price: price.value,
        quantity: quantity.value,
        id: UPDATE_ID
    }

    let UPDATE_URL = `${BASE_URL}/fetchProducts/${UPDATE_ID}.json`
    showSpinner("text-success")
    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(updatedProduct)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {

            let getIndex = productsArr.findIndex(ele => ele.id === UPDATE_ID)
            productsArr[getIndex] = updatedProduct
            document.getElementById(UPDATE_ID).innerHTML = `
                        
                        <td> ${getIndex + 1} </td>
                        <td> ${data.pName} </td>
                        <td> ${data.category} </td>
                        <td> ${data.price} </td>
                        <td> ${data.quantity} </td>
                        <td><button onClick="editProduct(this)" class="btn btn-primary shadow">Edit</button>
                            <button onClick="removeProduct(this)" class="btn btn-danger shadow ml-1">Remove</button></td>
                        `
            clearForm()
            formHeading.innerText = "Add Product"
            addBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")
            hideSpinner("text-success")
            showSnackBar("Updated", "Product Updated Successfully", "success")
        })
        .catch(err => {
            hideSpinner("text-success")
            showSnackBar("", err, "error")
        })
}
//============================== DELETE ========================================
function removeProduct(ele) {
    let DELETE_ID = ele.closest("tr").id
    let DELETE_URL = `${BASE_URL}/fetchProducts/${DELETE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "Product Deleted permanently...",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner("text-danger")
            fetch(DELETE_URL, {
                method: "DELETE",
                body: null
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP Error : ${res.status}`)
                    }
                    return res.json()
                })
                .then(data => {
                    let getIndex = productsArr.findIndex(ele => ele.id === DELETE_ID)
                    productsArr.splice(getIndex, 1)

                    ele.closest("tr").remove()

                    let td = document.querySelectorAll("#tbody tr")
                    td.forEach((ele, i) => {
                        ele.querySelector("td").innerText = i + 1
                    })
                    showSnackBar("Deleted", "Product Removed Successfully", "success")
                    hideSpinner("text-danger")
                })
                .catch(err => {
                    showSnackBar("", err, "error")
                    hideSpinner("text-danger")
                })
        }
    });

}
function clearForm() {
    productForm.reset()
}
function showSpinner(color) {
    spinner.classList.remove("d-none");
    spinner.classList.add(color);
}
function hideSpinner(color) {
    spinner.classList.add("d-none");
    spinner.classList.remove(color);
}
function showSnackBar(title, msg, icon) {
    Swal.fire({
        title: title,
        text: msg,
        icon: icon
    });
}
productForm.addEventListener("submit", createNewProduct)
updateBtn.addEventListener("click", updateProduct)
clearBtn.addEventListener("click", clearForm)






