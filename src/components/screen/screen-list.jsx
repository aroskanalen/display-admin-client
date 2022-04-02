import { React, useEffect, useState, useContext } from "react";
import { Button, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { faCalendar, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserContext from "../../context/user-context";
import ScreenCalendarCell from "../screen-list/screen-calendar-cell";
import List from "../util/list/list";
import { ScreenColumns } from "./screen-columns";
import InfoModal from "../info-modal/info-modal";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import idFromUrl from "../util/helpers/id-from-url";
import useModal from "../../context/delete-modal-context/delete-modal-context";
import {
  useGetV1ScreensQuery,
  useDeleteV1ScreensByIdMutation,
  useGetV1ScreensByIdScreenGroupsQuery,
} from "../../redux/api/api.generated";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import "./screen-list.scss";

/**
 * The screen list component.
 *
 * @returns {object} The screen list.
 */
function ScreenList() {
  const { t } = useTranslation("common", { keyPrefix: "screen-list" });
  const context = useContext(UserContext);
  const { selected, setSelected } = useModal();

  // Local state
  const [view, setView] = useState("list");
  const [createdBy, setCreatedBy] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [inGroups, setInGroups] = useState();
  const [searchText, setSearchText] = useState();
  const [listData, setListData] = useState();
  const [loadingMessage, setLoadingMessage] = useState(
    t("loading-messages.loading-screens")
  );

  // Delete call
  const [
    DeleteV1Screens,
    { isSuccess: isDeleteSuccess, error: isDeleteError },
  ] = useDeleteV1ScreensByIdMutation();

  // Get method
  const {
    data,
    error: screensGetError,
    isLoading,
    refetch,
  } = useGetV1ScreensQuery({
    page,
    order: { title: "asc" },
    search: searchText,
    createdBy,
  });

  useEffect(() => {
    if (data) {
      setListData(data);
    }
  }, [data]);

  // If the tenant is changed, data should be refetched
  useEffect(() => {
    if (context.selectedTenant.get) {
      refetch();
    }
  }, [context.selectedTenant.get]);

  /** Deletes multiple screens. */
  useEffect(() => {
    if (isDeleting && selected.length > 0) {
      if (isDeleteSuccess) {
        displaySuccess(t("success-messages.screen-delete"));
      }
      const screenToDelete = selected[0];
      setSelected(selected.slice(1));
      const screenToDeleteId = idFromUrl(screenToDelete.id);
      DeleteV1Screens({ id: screenToDeleteId });
    }
  }, [isDeleting, isDeleteSuccess]);

  // Display success messages
  useEffect(() => {
    if (isDeleteSuccess && selected.length === 0) {
      displaySuccess(t("success-messages.screen-delete"));
      setIsDeleting(false);
      refetch();
    }
  }, [isDeleteSuccess]);

  // Display error on unsuccessful deletion
  useEffect(() => {
    if (isDeleteError) {
      setIsDeleting(false);
      displayError(t("error-messages.screen-delete-error"), isDeleteError);
    }
  }, [isDeleteError]);

  /** Starts the deletion process. */
  function handleDelete() {
    setIsDeleting(true);
    setLoadingMessage(t("loading-messages.deleting-screen"));
  }

  /** @param {Array} groupsData The array of groups. */
  function openInfoModal(groupsData) {
    setInGroups(groupsData);
    setShowInfoModal(true);
  }

  /** Closes the info modal. */
  function onCloseInfoModal() {
    setShowInfoModal(false);
    setInGroups();
  }

  /**
   * Sets next page.
   *
   * @param {number} pageNumber - The next page.
   */
  function onChangePage(pageNumber) {
    setPage(pageNumber);
  }

  /**
   * Sets created by filter.
   *
   * @param {number} createdByInput - The created by filter.
   */
  function onCreatedByFilter(createdByInput) {
    if (createdByInput === "all") {
      setCreatedBy(createdByInput);
    } else {
      setCreatedBy(context.email.get);
    }
  }

  /**
   * Handles search.
   *
   * @param {object} localSearchText - The search text.
   */
  function onSearch(localSearchText) {
    setSearchText(localSearchText);
  }

  // The columns for the table.
  const columns = ScreenColumns({
    handleDelete,
    listButtonCallback: openInfoModal,
    apiCall: useGetV1ScreensByIdScreenGroupsQuery,
  });

  // Error with retrieving list of screen
  useEffect(() => {
    if (screensGetError) {
      displayError(t("error-messages.screens-load-error"), screensGetError);
    }
  }, [screensGetError]);

  return (
    <>
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-new-screen")}
        newBtnLink="/screen/create"
      >
        <Col md="auto">
          {view === "list" && (
            <Button
              style={{ width: "110px" }}
              onClick={() => setView("calendar")}
            >
              <FontAwesomeIcon className="me-1" icon={faCalendar} />
              {t("change-view-calendar")}
            </Button>
          )}
          {view === "calendar" && (
            <Button style={{ width: "110px" }} onClick={() => setView("list")}>
              <FontAwesomeIcon className="me-1" icon={faList} />{" "}
              {t("change-view-list")}
            </Button>
          )}
        </Col>
      </ContentHeader>
      <ContentBody>
        <>
          {listData && (
            <List
              columns={columns}
              totalItems={listData["hydra:totalItems"]}
              data={listData["hydra:member"]}
              currentPage={page}
              handlePageChange={onChangePage}
              handleCreatedByCurrentUser={onCreatedByFilter}
              calendarView={view === "calendar"}
              handleDelete={handleDelete}
              isLoading={isLoading || isDeleting}
              loadingMessage={loadingMessage}
              handleSearch={onSearch}
            >
              <ScreenCalendarCell />
            </List>
          )}
        </>
      </ContentBody>
      <InfoModal
        show={showInfoModal}
        redirectTo="/group/edit"
        apiCall={useGetV1ScreensByIdScreenGroupsQuery}
        onClose={onCloseInfoModal}
        dataStructureToDisplay={inGroups}
        modalTitle={t("info-modal.screen-in-groups")}
      />
    </>
  );
}

export default ScreenList;
