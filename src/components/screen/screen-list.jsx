import { React, useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CampaignIcon from "../screen-list/campaign-icon";
import CheckboxForList from "../util/list/checkbox-for-list";
import selectedHelper from "../util/helpers/selectedHelper";
import LinkForList from "../util/list/link-for-list";
import DeleteModal from "../delete-modal/delete-modal";
import List from "../util/list/list";
import InfoModal from "../info-modal/info-modal";
import ListButton from "../util/list/list-button";
import LiveIcon from "../screen-list/live-icon";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import { useGetV1ScreensQuery } from "../../redux/api/api.generated";
import "./screen-list.scss";

/**
 * The screen list component.
 *
 * @returns {object}
 *   The screen list.
 */
function ScreenList() {
  const { t } = useTranslation("common");
  const { search } = useLocation();
  const history = useHistory();
  const viewParams = new URLSearchParams(search).get("view");
  const [view, setView] = useState(viewParams ?? "list");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [inGroups, setInGroups] = useState();

  /**
   * @param {Array} groupsArray
   * The array of groups.
   */
  function openInfoModal(groupsArray) {
    setInGroups(groupsArray);
    setShowInfoModal(true);
  }

  /**
   * Closes the info modal.
   */
  function onCloseInfoModal() {
    setShowInfoModal(false);
    setInGroups();
  }

  /**
   * Set the view in url.
   */
  useEffect(() => {
    const params = new URLSearchParams(search);
    params.delete("view");
    params.append("view", view);
    history.replace({ search: params.toString() });
  }, [view]);

  /**
   * Sets the selected row in state.
   *
   * @param {object} data
   * The selected row.
   */
  function handleSelected(data) {
    setSelectedRows(selectedHelper(data, [...selectedRows]));
  }

  /**
   * Opens the delete modal, for deleting row.
   *
   * @param {object} props
   * The props.
   * @param {string} props.name
   * The name of the tag.
   * @param {number} props.id
   * The id of the tag
   */
  function openDeleteModal({ id, name }) {
    setSelectedRows([{ id, name }]);
    setShowDeleteModal(true);
  }

  // The columns for the table.
  const columns = [
    {
      key: "pick",
      label: t("screens-list.columns.pick"),
      content: (data) => (
        <CheckboxForList
          onSelected={() => handleSelected(data)}
          selected={selectedRows.indexOf(data) > -1}
        />
      ),
    },
    {
      path: "live",
      sort: true,
      label: t("screens-list.columns.live"),
      content: (data) => LiveIcon(data),
    },
    {
      path: "title",
      sort: true,
      label: t("screens-list.columns.name"),
    },
    {
      sort: true,
      path: "onFollowingGroups",
      // content: (data) =>
      //   ListButton(
      //     openInfoModal,
      //     data.onFollowingGroups,
      //     data.onFollowingGroups.length,
      //     data.onFollowingGroups.length === 0
      //   ),
      content: (data) => <div>@TODO</div>,
      key: "groups",
      label: t("screens-list.columns.on-groups"),
    },
    {
      path: "size",
      sort: true,
      label: t("screens-list.columns.size"),
    },
    {
      sort: true,
      content: (data) => (
        <div>
          {data.dimensions.height}x{data.dimensions.width}
        </div>
      ),
      label: t("screens-list.columns.dimensions"),
    },
    {
      sort: true,
      label: t("screens-list.columns.campaign"),
      content: (data) => CampaignIcon(data),
      // TODO implement overridden by campaing
    },
    {
      key: "edit",
      content: (data) => (
        <LinkForList
          data={data}
          label={t("screens-list.edit-button")}
          param="screen"
        />
      ),
    },
    {
      key: "delete",
      content: (data) => (
        <>
          <Button
            variant="danger"
            disabled={selectedRows.length > 0}
            onClick={() => openDeleteModal(data)}
          >
            {t("screens-list.delete-button")}
          </Button>
        </>
      ),
    },
  ];

  /**
   * Deletes screen, and closes modal.
   *
   * @param {object} props
   * The props.
   * @param {string} props.name
   * The name of the tag.
   * @param {number} props.id
   * The id of the tag
   */
  // eslint-disable-next-line
  function handleDelete({ id, name }) {
    setSelectedRows([]);
    setShowDeleteModal(false);
  }

  /**
   * Closes the delete modal.
   */
  function onCloseModal() {
    setSelectedRows([]);
    setShowDeleteModal(false);
  }

  /**
   * Clears the selected rows.
   */
  function clearSelectedRows() {
    setSelectedRows([]);
  }

  const { data, error, isLoading } = useGetV1ScreensQuery({ page: 1 });

  return (
    <>
      <ContentHeader
        title={t("screens-list.header")}
        newBtnTitle={t("screens-list.create-new-screen")}
        newBtnLink="/screen/create"
      />
      <Col md="auto">
        {view === "list" && (
          <Button onClick={() => setView("calendar")}>
            {t("screens-list.change-view-calendar")}
          </Button>
        )}
        {view === "calendar" && (
          <Button onClick={() => setView("list")}>
            {t("screens-list.change-view-list")}
          </Button>
        )}
      </Col>
      <ContentBody>
        {!isLoading && data && data["hydra:member"] && (
          <List
            columns={columns}
            selectedRows={selectedRows}
            data={data["hydra:member"]}
            clearSelectedRows={clearSelectedRows}
            withChart={view === "calendar"}
          />
        )}
      </ContentBody>
      <DeleteModal
        show={showDeleteModal}
        onClose={onCloseModal}
        handleAccept={handleDelete}
        selectedRows={selectedRows}
      />
      <InfoModal
        show={showInfoModal}
        onClose={onCloseInfoModal}
        dataStructureToDisplay={inGroups}
        title={t("screens-list.info-modal.screen-in-groups")}
      />
    </>
  );
}

export default ScreenList;
