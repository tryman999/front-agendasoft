/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPortal } from "react-dom";
const modalRoot: any = document.getElementById("modal-root");
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: any;
}) => {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-xl overflow-hidden max-w-md w-full">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M18.2 5.8a1 1 0 0 1 0 1.4L13.4 12l4.8 4.8a1 1 0 0 1-1.4 1.4L12 13.4l-4.8 4.8a1 1 0 0 1-1.4-1.4L10.6 12 5.8 7.2a1 1 0 0 1 1.4-1.4L12 10.6l4.8-4.8a1 1 0 0 1 1.4 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className="flex flex-col items-center"
          style={{ maxHeight: "70vh", overflow: "auto" }}
        >
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
