/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./styles.css";
import { generarSKU } from "../../../utils/generateSku";

const Create = ({ productData }: { productData: any }) => {
  const url = import.meta.env.VITE_BACK_URL || "";
  const [lastId, setLastId] = useState(productData?.producto_id || 0);
  const [categorias, setCategorias] = useState<any[]>([]); // Estado para almacenar las categorías
  const [categoriasError, setCategoriasError] = useState<string | null>(null);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [productoSku, setProductoSku] = useState("");
  const [proveedores, setProveedores] = useState<any[]>([]); // Estado para proveedores
  const [proveedoresError, setProveedoresError] = useState<string | null>(null);
  const [proveedoresLoading, setProveedoresLoading] = useState(true);
  const [moreStock, setMoreStock] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewInputStock, setViewInputStock] = useState(false);
  const [productos, setProductos] = useState({
    nombre_producto: productData?.nombre_producto,
    descripcion: productData?.descripcion,
    precio_costo: productData?.precio_costo,
    precio_venta: productData?.precio_venta,
    stock: productData?.stock,
    categoria_id: productData?.categoria_id,
    proveedor_id: productData?.proveedor_id,
    estado: productData?.estado,
    marca: productData?.marca,
    stock_minimo: productData?.stock_minimo,
    codigo: productData?.codigo || productoSku,
    sku: productData?.sku,
    image_url: productData?.image_url,
  });
  const productSkuData = generarSKU(
    lastId,
    productos?.nombre_producto,
    productos?.proveedor_id,
    productos?.categoria_id,
    productos?.marca
  );

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    console.log(event.target);
    setProductos({ ...productos, [name]: value, sku: productSkuData });

    setProductoSku(productSkuData);
  };

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/productos`
      );
      const data = await response.json();
      const idMayor = data.reduce(
        (maxId: number, objeto: { producto_id: number }) => {
          return Math.max(maxId, objeto.producto_id);
        },
        -Infinity
      );
      setLastId(idMayor + 1);
    };
    if (lastId === 0) {
      getProducts();
    }
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${url}/api/categorias`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategorias(data);
        setCategoriasLoading(false);
      } catch (error: any) {
        console.error("Error fetching categorias:", error);
        setCategoriasError("Error al cargar las categorías.");
        setCategoriasLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch(`${url}/api/proveedores`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProveedores(data);
        setProveedoresLoading(false);
      } catch (error: any) {
        console.error("Error fetching proveedores:", error);
        setProveedoresError("Error al cargar los proveedores.");
        setProveedoresLoading(false);
      }
    };

    fetchProveedores();
  }, [url]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const productExist = await fetch(
        `${url}/api/productos/${productData?.producto_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (productExist?.ok) {
        const data = await productExist.json();
        if (data) {
          const response = await fetch(
            `${url}/api/productos/${productData.producto_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...productos,
                stock: Number(productos.stock) + Number(moreStock),
              }),
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Error al crear producto: ${response.status}`
            );
          }
          setSubmitSuccess("Producto actualizado exitosamente!");
          window.location.reload();
        }
      } else {
        const response = await fetch(`${url}/api/productos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...productos,
            stock: Number(productos.stock) + Number(moreStock),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Error al crear producto: ${response.status}`
          );
        }
        setSubmitSuccess("Producto creado exitosamente!");
        setProductos({
          // Reset del formulario
          nombre_producto: "",
          descripcion: "",
          precio_costo: "",
          precio_venta: "",
          stock: 0,
          categoria_id: "",
          proveedor_id: "",
          estado: "disponible",
          marca: "",
          stock_minimo: 0,
          codigo: 0,
          sku: "",
          image_url: "",
        });
      }
    } catch (error: any) {
      console.error("Error al crear producto:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="productForm w-full">
      <h1>Ingrese los Datos del Producto</h1>

      <form id="productoForm" onSubmit={handleSubmit}>
        <div className="form-group w-full">
          <label htmlFor="nombre_producto">Nombre del Producto:</label>
          <input
            className="w-full"
            type="text"
            id="nombre_producto"
            name="nombre_producto"
            onChange={handleChange}
            disabled={productData?.nombre_producto}
            value={productos?.nombre_producto}
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div>
              <label htmlFor="stock">Cantidad:</label>
              <input
                min="1"
                type="number"
                id="stock"
                name="stock"
                disabled={productData?.stock}
                onChange={handleChange}
                value={Number(productos.stock) + Number(moreStock)}
                required
              />
            </div>
            <div>
              <label>
                <br />
              </label>
              <button
                className=" flex bg-gray-800 p-2"
                type="button"
                onClick={() => {
                  setViewInputStock(!viewInputStock);
                  setMoreStock(0);
                }}
              >
                {viewInputStock ? "X" : "+ agregar mas cantidad"}
              </button>
            </div>

            {viewInputStock && (
              <div>
                <label htmlFor="stock">Agregar:</label>
                <input
                  min="1"
                  type="number"
                  id="stock"
                  name="moreStock"
                  onChange={(e) => setMoreStock(Number(e.target.value))}
                  value={moreStock === 0 ? "" : moreStock}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="stock_minimo">Cantidad Minima:</label>
          <input
            type="number"
            id="stock_minimo"
            min="1"
            name="stock_minimo"
            onChange={handleChange}
            value={productos.stock_minimo}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            onChange={handleChange}
            value={productos.descripcion}
            rows={5}
          ></textarea>
        </div>

        {/*<div className="form-group">
          <label htmlFor="precio_costo">Precio de costo:</label>
          <input
            type="number"
            id="precio_costo"
            name="precio_costo"
            min="0"
            step="0.01"
            onChange={handleChange}
            value={productos.precio_costo}
            required
          />
        </div> */}

        <div className="form-group">
          <label htmlFor="precio_venta">Precio de venta:</label>
          <input
            type="number"
            id="precio_venta"
            name="precio_venta"
            min="0"
            step="0.01"
            onChange={handleChange}
            value={productos.precio_venta}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_url">URL de la Imagen:</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            onChange={handleChange}
            value={productos.image_url}
          />
        </div>

        <div className="image-preview-container">
          <label>Vista Previa de la Imagen:</label>
          <img
            id="vistaPrevia"
            src={productos.image_url}
            alt="Vista previa de la imagen"
            className="image-preview"
          />
          <p id="mensajeNoImagen">Ingrese una URL para ver la imagen.</p>
        </div>

        <div className="form-group">
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            id="marca"
            name="marca"
            disabled={productData?.marca}
            onChange={handleChange}
            value={productos?.marca}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria_id">Categoria:</label>
          {categoriasLoading ? (
            <p>Cargando categorías...</p>
          ) : categoriasError ? (
            <p className="error-message">{categoriasError}</p>
          ) : (
            <select
              name="categoria_id"
              onChange={handleChange}
              value={productos.categoria_id}
              disabled={productData?.categoria_id}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map(
                (categoria: { categoria_id: any; nombre_categoria: any }) => (
                  <option
                    key={categoria.categoria_id}
                    value={categoria.categoria_id}
                  >
                    {categoria.nombre_categoria}
                  </option>
                )
              )}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="proveedor_id">Proveedor:</label>

          {proveedoresLoading ? (
            <p>Cargando proveedores...</p>
          ) : proveedoresError ? (
            <p className="error-message">{proveedoresError}</p>
          ) : (
            <select
              name="proveedor_id"
              id="proveedor_id"
              onChange={handleChange}
              value={productos.proveedor_id}
              disabled={productData?.proveedor_id}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map(
                (proveedor: { proveedor_id: any; email: any }) => {
                  console.log(proveedor);
                  return (
                    <option
                      key={proveedor.proveedor_id}
                      value={proveedor.proveedor_id}
                    >
                      {proveedor.email}
                    </option>
                  );
                }
              )}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado:</label>

          <select
            name="estado"
            id="estado"
            onChange={handleChange}
            value={productos.estado}
          >
            <option>Seleccione</option>

            <option value="disponible">Disponible</option>
            <option value="no disponible">No disponible</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="codigo">Codigo:</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={productos?.codigo}
            onChange={handleChange}
            disabled={productData?.codigo}
            required
          />
        </div>

        <div className="form-group hidden">
          <label htmlFor="sku">Sku:</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={productos?.sku}
            onChange={handleChange}
            disabled={true}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Producto"}
        </button>

        {submitSuccess && <p style={{ color: "green" }}>{submitSuccess}</p>}
        {submitError && <p style={{ color: "red" }}>{submitError}</p>}
      </form>
    </section>
  );
};

export default Create;
