import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}

/**
 * Native <dialog> modal: focus trapping, Escape-to-close and the backdrop come
 * from the browser, which keeps it accessible without a library.
 */
const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, wide }) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? 'modal--wide' : ''}`}
      aria-labelledby="modal-title"
      onClose={onClose}
      // Click on the backdrop (the dialog element itself) closes it.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {open && (
        <div className="modal__inner">
          <header className="modal__header">
            <h2 id="modal-title" className="modal__title">
              {title}
            </h2>
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </header>
          <div className="modal__body">{children}</div>
        </div>
      )}
    </dialog>
  );
};

export default Modal;
