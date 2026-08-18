import { useState } from "react";
import {
  Search,
  Plus,
  Package,
  MoreVertical
} from "lucide-react";

import Modal from "../components/Modal";

const initialProducts = [
  {
    id: 1,
    name: "Steel Component A",
    price: 250,
    stock: 500
  },
  {
    id: 2,
    name: "Steel Component B",
    price: 150,
    stock: 800
  },
  {
    id: 3,
    name: "Industrial Fastener",
    price: 75,
    stock: 1200
  }
];

export default function Products() {

  const [products, setProducts] =
    useState(initialProducts);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: ""
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const addProduct = (e) => {

    e.preventDefault();

    setProducts([
      ...products,
      {
        id: Date.now(),
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock)
      }
    ]);

    setForm({
      name: "",
      price: "",
      stock: ""
    });

    setShowModal(false);
  };

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage products, prices and optional stock
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          Add Product
        </button>

      </div>

      <div className="module-card">

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

          <span className="record-count">
            {filteredProducts.length} Products
          </span>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Stock</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map((product) => (

                <tr key={product.id}>

                  <td>
                    <div className="table-person">

                      <div className="product-icon">
                        <Package size={17} />
                      </div>

                      <strong>
                        {product.name}
                      </strong>

                    </div>
                  </td>

                  <td>
                    ₹{product.price.toLocaleString()}
                  </td>

                  <td>{product.stock}</td>

                  <td>

                    <span
                      className={
                        product.stock < 100
                          ? "status low"
                          : "status confirmed"
                      }
                    >
                      {product.stock < 100
                        ? "Low Stock"
                        : "In Stock"}
                    </span>

                  </td>

                  <td>
                    <button className="icon-btn">
                      <MoreVertical size={17} />
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {showModal && (

        <Modal
          title="Add New Product"
          onClose={() => setShowModal(false)}
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
                    name: e.target.value
                  })
                }
                placeholder="Steel Component A"
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>Unit Price *</label>

                <input
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value
                    })
                  }
                  placeholder="250"
                />

              </div>

              <div className="form-group">

                <label>Stock</label>

                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: e.target.value
                    })
                  }
                  placeholder="500"
                />

              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowModal(false)}
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

    </div>
  );
}