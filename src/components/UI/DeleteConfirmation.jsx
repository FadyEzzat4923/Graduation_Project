/* eslint-disable react/prop-types */
import MainButton from "./MainButton";
import Modal from "./Modal";

export default function DeleteConfirmation({
  handleStopDelete,
  isPendingDelete,
  onDelete,
  deleteText,
}) {
  return (
    <Modal
      deleteModal
      hideModal={handleStopDelete}
      className="max-w-xl mx-5 lg:mx-auto md:mx-auto top-1/2 -translate-y-1/2 rounded-lg"
    >
      <div className="p-5">
        <h1 className="text-center text-4xl font-bold text-red-600">
          WARNING!
        </h1>
        <p className="text-xl text-center mt-10">
          Are you sure you want to delete {deleteText}? This action can not be
          undone.
        </p>
        <div className="actions flex flex-wrap lg:flex-nowrap gap-3 justify-center mt-10">
          <MainButton
            disabled={isPendingDelete}
            onClick={onDelete}
            className={"w-full lg:w-auto hover:bg-red-500 hover:text-white"}
          >
            {isPendingDelete ? "Submitting..." : "Delete"}
          </MainButton>
          <MainButton
            disabled={isPendingDelete}
            className={"w-full lg:w-auto hover:bg-purple-500 hover:text-white"}
            onClick={handleStopDelete}
          >
            Cancle
          </MainButton>
        </div>
      </div>
    </Modal>
  );
}
