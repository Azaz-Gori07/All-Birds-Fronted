import React, { useState } from "react";
import "./AddProductForm.css";

const AddProductForm = ( { onProductSaved }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    title: "",
    image: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("Name aur Price required hai");
      return;
    }

    if (onProductSaved) onProductSaved();

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("title", form.title);
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error saving product: " + (errorData.error || response.statusText));
        return;
      }

      alert("✅ Product added successfully!");
      setForm({ name: "", price: "", title: "", image: "" });

    } catch (err) {
      console.error(err);
      alert("Error saving product: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-product-form" onSubmit={saveProduct}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={onChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={onChange}
      />
      <input
        type="text"
        name="title"
        placeholder="Description"
        value={form.title}
        onChange={onChange}
      />
      <input
        type="file"
        name="image"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
