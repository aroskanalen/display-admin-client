import { React, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Table from "../table/table";
import SearchBox from "../search-box/search-box";
import DeleteModal from "../../delete-modal/delete-modal";
import Pagination from "../paginate/pagination";
import ColumnProptypes from "../../proptypes/column-proptypes";
import SelectedRowsProptypes from "../../proptypes/selected-rows-proptypes";
import MergeModal from "../../merge-modal/merge-modal";

/**
 * @param {object} props
 * The props.
 * @param {Array} props.data
 * The data for the list.
 * @param {Array} props.columns
 * The columns for the table.
 * @param {Array} props.selectedRows
 * The selected rows, for styling.
 * @param {object} props.showMerge
 * Whether to show the merge button.
 * @param {Function} props.clearSelectedRows
 * Callback to clear the selected rows.
 * @param {boolean} props.withChart
 * If the list should display a gantt chart
 * @returns {object}
 * The List.
 */
function List({
  data,
  columns,
  selectedRows,
  showMerge,
  clearSelectedRows,
  withChart,
}) {
  const { t } = useTranslation("common");
  const { search } = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(search).get("search");
  const sortParams = new URLSearchParams(search).get("sort");
  const orderParams = new URLSearchParams(search).get("order");
  const pageParams = new URLSearchParams(search).get("page");
  // At least two rows must be selected for merge.
  const disableMergeButton = selectedRows.length < 2;
  // At least one row must be selected for deletion.
  const disableDeleteButton = !selectedRows.length > 0;
  const [searchText, setSearchText] = useState(
    searchParams !== null ? searchParams : ""
  );
  const [sortBy, setSortBy] = useState({
    path: sortParams || "name",
    order: orderParams || "asc",
  });
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(
    parseInt(pageParams, 10) ? parseInt(pageParams, 10) : 1
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMergeModal, setViewMergeModal] = useState(false);

  /**
   * @param {string} newSearchText
   * Updates the search text state and url.
   */
  function handleSearch(newSearchText) {
    setCurrentPage(1);
    setSearchText(newSearchText);
  }

  /**
   * @param {Array} items
   * The items to paginate.
   * @param {number} pageNumber
   * The chosen page.
   * @param {number} sizeOfPage
   * The page size
   * @returns {Array}
   * The paginated items.
   */
  function paginate(items, pageNumber, sizeOfPage) {
    const startIndex = (pageNumber - 1) * sizeOfPage;
    return items.slice(startIndex, startIndex + sizeOfPage);
  }

  /**
   * If they search or filter, the pagination is reset.
   */
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (searchText) {
      params.delete("search");
      params.append("search", searchText);
    }
    params.delete("sort");
    params.append("sort", sortBy.path);
    params.delete("order");
    params.append("order", sortBy.order);
    params.delete("page");
    params.append("page", currentPage);
    history.replace({ search: params.toString() });
  }, [searchText, sortBy, currentPage]);

  /**
   * Closes delete modal.
   */
  function onCloseDeleteModal() {
    setShowDeleteModal(false);
  }

  /**
   * Closes merge modal.
   */
  function onCloseMergeModal() {
    setViewMergeModal(false);
  }

  /**
   * @param {number} page
   * Updates pagination page.
   */
  function handlePageChange(page) {
    setCurrentPage(page);
  }

  /**
   * @param {object} sortColumn
   * Updates sortcolumn.
   */
  function handleSort(sortColumn) {
    setCurrentPage(1);
    setSortBy(sortColumn);
  }

  /**
   * @param {object} dataToFilter
   * Search filter function.
   * @returns {boolean}
   * Whether the searchtext is in the data entry.
   */
  function filterDataFromSearchInput(dataToFilter) {
    let dataValuesString = Object.values(dataToFilter);
    dataValuesString = dataValuesString
      .filter((el) => {
        return typeof el === "string" || typeof el === "number";
      })
      .join("");
    return dataValuesString
      .toLocaleLowerCase()
      .includes(searchText.toLocaleLowerCase());
  }

  /**
   * @param {string|number} a Sort parameter a
   * @param {string|number} b Sort parameter b
   * @returns {number} Sorting number.
   */
  /* @TODO: Is this needed
  function sortData(a, b) {
    let sortVarA = a[sortBy.path];
    let sortVarB = b[sortBy.path];
    sortVarA =
      typeof sortVarA === "string" ? sortVarA.toLocaleLowerCase() : sortVarA;
    sortVarB =
      typeof sortVarB === "string" ? sortVarB.toLocaleLowerCase() : sortVarB;
    sortVarA = Array.isArray(sortVarA) ? sortVarA.length : sortVarA;
    sortVarB = Array.isArray(sortVarB) ? sortVarB.length : sortVarB;
    if (sortVarA < sortVarB) {
      return -1;
    }
    if (sortVarA > sortVarB) {
      return 1;
    }

    return 0;
  }
  */

  /**
   * @returns {object}
   * returns object of paginated data array and length of data.
   */
  function getTableData() {
    let returnValue = data;
    if (searchText) {
      returnValue = returnValue.filter(filterDataFromSearchInput);
    }
    if (sortBy) {
      // @TODO: Fix issue.
      // returnValue = returnValue.sort(sortData);
    }
    if (sortBy.order === "desc") {
      returnValue = returnValue.reverse();
    }
    const paginated = paginate(returnValue, currentPage, pageSize);
    return { data: paginated, length: returnValue.length };
  }

  /**
   * Deletes selected data, and closes modal.
   */
  function handleDelete() {
    // @TODO: delete elements
    setShowDeleteModal(false);
  }

  /**
   * Should handle merge.
   */
  function handleMerge() {
    // @TODO merge elements
    setViewMergeModal(false);
  }

  return (
    <>
      <Row className="my-2">
        <Col>
          <SearchBox value={searchText} onChange={handleSearch} />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button
            variant="danger"
            id="delete-button"
            disabled={disableDeleteButton}
            onClick={() => setShowDeleteModal(true)}
            className="me-3"
          >
            {t("list.delete-button")}
          </Button>

          {showMerge && (
            <Button
              className="me-3"
              id="merge-button"
              disabled={disableMergeButton}
              onClick={() => setViewMergeModal(true)}
              variant="success"
            >
              {t("list.merge-button")}
            </Button>
          )}
          <Button
            id="clear-rows-button"
            disabled={selectedRows.length === 0}
            onClick={() => clearSelectedRows()}
            variant="dark"
          >
            {t("list.deselect-all")}
          </Button>
        </Col>
      </Row>
      <Table
        onSort={handleSort}
        data={getTableData().data}
        sortColumn={sortBy}
        columns={columns}
        selectedRows={selectedRows}
        withChart={withChart}
      />
      <Pagination
        itemsCount={getTableData().length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <DeleteModal
        show={showDeleteModal}
        handleAccept={handleDelete}
        onClose={onCloseDeleteModal}
        selectedRows={selectedRows}
      />
      <MergeModal
        show={showMergeModal}
        handleAccept={handleMerge}
        onClose={onCloseMergeModal}
        dataStructureToDisplay={selectedRows}
      />
    </>
  );
}

List.defaultProps = {
  showMerge: false,
  withChart: false,
};

List.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, id: PropTypes.number })
  ).isRequired,
  columns: ColumnProptypes.isRequired,
  selectedRows: SelectedRowsProptypes.isRequired,
  showMerge: PropTypes.bool,
  clearSelectedRows: PropTypes.func.isRequired,
  withChart: PropTypes.bool,
};
export default List;
