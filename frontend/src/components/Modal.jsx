import { X } from "lucide-react";

export default function Modal({
  title,
  children,
  onClose
}) {
  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>{title}</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            <X size={19} />
          </button>

        </div>

        <div className="modal-body">
          {children}
        </div>

      </div>

    </div>
  );
}