import React from "react";

const DeleteModal = ({ property, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Delete Property
        </h3>
        <p className="text-gray-600 mb-1">Are you sure you want to delete:</p>
        <p className="font-semibold text-gray-900 mb-4">"{property?.title}"</p>
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-6">
          This action cannot be undone. The property will be permanently
          removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
