import { React } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ModalDialog from "../util/modal/modal-dialog";
import SelectedRowsProptypes from "../proptypes/selected-rows-proptypes";
import contentString from "../util/helpers/content-string";

/**
 * Delete modal component, a modal that deletes elements.
 *
 * @param {object} props
 * Props.
 * @param {boolean} props.show
 * Whether to show the modal.
 * @param {Function} props.onClose
 * Callback on close modal.
 * @param {Function} props.selectedRows
 * Rows that are selected for deletion
 * @param {Function} props.handleAccept
 * Callback on accept.
 * @returns {object}
 * The modal.
 */
function DeleteModal({ show, onClose, selectedRows, handleAccept }) {
  if (!show) {
    return <></>;
  }
  const { t } = useTranslation("common");

  return (
    <div id="delete-modal">
      <ModalDialog
        title={t("delete-modal.title")}
        onClose={onClose}
        handleAccept={handleAccept}
      >
        <ul>
          {dataStructureToDisplay.map(({ name }) => (
            <li>{name}</li>
          ))}
        </ul>
      </ModalDialog>
    </div>
  );
}

DeleteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedRows: SelectedRowsProptypes.isRequired,
  handleAccept: PropTypes.func.isRequired,
};

export default DeleteModal;
