import { Show } from "solid-js";

export default function ConfirmModal(props) {
  return (
    <Show when={props.open()}>
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-96">
          <h2 class="text-xl font-semibold text-gray-800 mb-4"> 
            {props.title || "Konfirmasi"}
          </h2>
          <p class="text-gray-600 mb-6">
             {props.message || "Apakah Anda yakin?"}
          </p>
          <div class="flex justify-end gap-3">
            <button
              onClick={props.onClose}
              class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
             {props.cancelText || "Batal"}
            </button>
            <button
              onClick={props.onConfirm}
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {props.confirmText || "Ya"}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
