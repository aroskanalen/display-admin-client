import { React, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

/**
 * @param {object} props
 * The props.
 * @param {string} props.title
 * The modal title
 * @param {string} props.acceptText
 * The text for the acceptbutton
 * @param {string} props.declineText
 * The text for the declinebutton
 * @param {Function} props.onClose
 * The callback for close.
 * @param {Function} props.handleAccept
 * The callback for accept.
 * @param {object} props.children
 * The children to be rendered.
 * @param {boolean} props.showAcceptButton
 * Whether to show the accept button.
 * @param {string} props.btnVariant
 * The variant of the submit button.
 * @returns {object}
 * The the modal dialog
 */
function ModalDialog({
  title,
  acceptText,
  declineText,
  onClose,
  handleAccept,
  children,
  showAcceptButton,
  btnVariant,
}) {
  const { t } = useTranslation("common");

  /**
   * For closing modals on escape key.
   *
   * @param {object} props - the props.
   * @param {string} props.key - the key input.
   */
  function downHandler({ key }) {
    if (key === "Escape") {
      onClose();
    }
  }

  // Add event listeners for keypress
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []);

  return (
    <>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={onClose}>
          {declineText || t("modal-dialog.cancel")}
        </Button>
        {showAcceptButton && (
          <Button variant={btnVariant} type="submit" onClick={handleAccept}>
            {acceptText || t("modal-dialog.remove")}
          </Button>
        )}
      </Modal.Footer>
    </>
  );
}

ModalDialog.defaultProps = {
  acceptText: "",
  declineText: "",
  showAcceptButton: true,
  handleAccept: () => {},
  btnVariant: "primary",
};

ModalDialog.propTypes = {
  title: PropTypes.string.isRequired,
  acceptText: PropTypes.string,
  declineText: PropTypes.string,
  showAcceptButton: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  handleAccept: PropTypes.func,
  children: PropTypes.node.isRequired,
  btnVariant: PropTypes.string,
};

export default ModalDialog;
