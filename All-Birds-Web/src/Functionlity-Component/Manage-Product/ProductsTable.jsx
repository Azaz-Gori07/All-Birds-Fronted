import React, { useEffect, useState } from "react";
import "./ProductTable.css";

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        price: "",
        title: "",
        image: ""
    });

    // Fetch products from backend
    const fetchProducts = () => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error fetching products:", err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Delete
    const deleteProduct = (id) => {
        if (window.confirm("Delete this product?")) {
            fetch(`/api/products/${id}`, { method: "DELETE" })
                .then(() => fetchProducts())
                .catch((err) => console.error("Error deleting product:", err));
        }
    };

    // Set data for edit (but actual update form alag hai)
    const handleEdit = (product) => {
        setForm({
            name: product.name,
            price: product.price,
            title: product.title,
            image: product.image
        });
        setEditId(product.id);
    };

    return (
        <div className="products-table-container">
            <h2>📋 Products List</h2>
            <table className="products-table">
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Price (₹)</th>
                        <th>Description</th><th>Image</th><th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length ? (
                        products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.price}</td>
                                <td>{p.title}</td>
                                <td>{p.image}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteProduct(p.id)}
                                    >
                                        ❌ Delete
                                    </button>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(p)}
                                    >
                                        ✏ Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="no-data">No products found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;
