import { useEffect, useState } from "react";
import { Search, Plus, MoreVertical, Package } from "lucide-react";
import Modal from "../components/Modal";
import { productAPI } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = {
    name: "",
    price: "",
    stock: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Load products
  const load = async () => {
    try {
      setError("");

      const { data } = await productAPI.getAll();

      setProducts(data);
    } catch (e) {
      console.error("Unable to load products:", e);

      setError(
        e.response?.data?.error ||
          "Unable to load products."
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Add product
  const addProduct = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await productAPI.create({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      setForm(emptyForm);
      setShowModal(false);

      await load();
    } catch (e) {
      console.error("Unable to save product:", e);

      setError(
        e.response?.data?.error ||
          "Unable to save product."
      );
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await productAPI.delete(id);

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.id !== id
        )
      );

      setShowActions(null);
    } catch (e) {
      console.error("Failed to delete product:", e);

      setError(
        e.response?.data?.error ||
          "Failed to delete product."
      );
    }
  };

  // Open edit modal
  const openEditModal = (product) => {
    setSelectedProduct(product);

    setForm({
      name: product.name || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
    });

    setShowActions(null);
    setShowEditModal(true);
    setError("");
  };

  // Update product
  const updateProduct = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedProduct) {
      return;
    }

    try {
      const { data } = await productAPI.update(
        selectedProduct.id,
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? data
            : product
        )
      );

      setForm(emptyForm);
      setSelectedProduct(null);
      setShowEditModal(false);
    } catch (e) {
      console.error("Unable to update product:", e);

      setError(
        e.response?.data?.error ||
          "Unable to update product."
      );
    }
  };

  const closeAddModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setError("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    setForm(emptyForm);
    setError("");
  };

  // Search
  const filtered = products.filter((product) =>
    (product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>
            Manage your products and inventory
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setForm(emptyForm);
            setShowModal(true);
            setError("");
          }}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Products Card */}
      <div className="module-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={17} />

            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="record-count">
            {filtered.length} Products
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="table-person">
                      <div className="customer-avatar">
                        {(product.name || "?").charAt(0)}
                      </div>

                      <strong>
                        {product.name}
                      </strong>
                    </div>
                  </td>

                  <td>
                    ₹{Number(product.price || 0).toFixed(2)}
                  </td>

                  <td>{product.stock}</td>

                  {/* Actions */}
                  <td>
                    <div
                      className="actions-wrapper"
                      style={{
                        position: "relative",
                      }}
                    >
                      <button
                        className="icon-btn"
                        onClick={() =>
                          setShowActions(
                            showActions === product.id
                              ? null
                              : product.id
                          )
                        }
                      >
                        <MoreVertical size={17} />
                      </button>

                      {showActions === product.id && (
                        <div
                          className="actions-menu"
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "100%",
                            zIndex: 20,
                            background: "white",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "6px",
                            minWidth: "110px",
                            boxShadow:
                              "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(product)
                            }
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "8px 10px",
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(product.id)
                            }
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "8px 10px",
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!filtered.length && (
          <div className="empty-state">
            <Package size={35} />

            <h3>No products found</h3>

            <p>
              Add your first product.
            </p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <Modal
          title="Add New Product"
          onClose={closeAddModal}
        >
          <form onSubmit={addProduct}>
            <div className="form-group">
              <label>Product Name *</label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price *</label>

                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Stock *</label>

                <input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeAddModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                Save Product
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <Modal
          title="Edit Product"
          onClose={closeEditModal}
        >
          <form onSubmit={updateProduct}>
            <div className="form-group">
              <label>Product Name *</label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price *</label>

                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Stock *</label>

                <input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeEditModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                Update Product
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}