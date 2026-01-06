'use client';

type Props = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-80 rounded-xl bg-surface p-6 text-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-lg font-semibold text-text-primary">
          {title}
        </h2>

        {description && (
          <p className="mb-4 text-sm text-text-secondary">
            {description}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
