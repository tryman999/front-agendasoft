/* eslint-disable @typescript-eslint/no-explicit-any */
import useLowStockProducts from "../../utils/hook/useLowStock";
import "./styles.css";

const BotonFlotante = ({
  onClick,
  children,
}: {
  onClick: any;
  children: any;
}) => {
  const { lowStockProducts } = useLowStockProducts();
  const lowStockCount = lowStockProducts ? lowStockProducts.length : 0;
  return (
    <button className="boton-flotante" onClick={onClick}>
      {children}
      {lowStockCount > 0 && (
        <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
          {lowStockCount}
        </span>
      )}
    </button>
  );
};

export default BotonFlotante;
