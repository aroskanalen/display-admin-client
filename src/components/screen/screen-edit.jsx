import { React, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import set from "lodash.set";
import idFromUrl from "../util/helpers/id-from-url";
import {
  useGetV1ScreensByIdQuery,
  usePutV1ScreensByIdMutation,
  usePutV1ScreensByIdScreenGroupsMutation,
} from "../../redux/api/api.generated";
import ScreenForm from "./screen-form";

/**
 * The screen edit component.
 *
 * @returns {object} The screen edit page.
 */
function ScreenEdit() {
  const { t } = useTranslation("common");
  const headerText = t("screen-edit.edit-screen-header");
  const [formStateObject, setFormStateObject] = useState();
  const [groupId, setGroupId] = useState();
  const [groupsToAdd, setGroupsToAdd] = useState();
  const { id } = useParams();
  const [
    PutV1Screens,
    { isLoading: isSaving, error: saveError, isSuccess: isSaveSuccess },
  ] = usePutV1ScreensByIdMutation();

  const [
    PutV1ScreensByIdScreenGroups,
    {
      isLoading: isSavingGroups,
      error: saveErrorGroups,
      isSuccess: isSaveSuccessGroups,
    },
  ] = usePutV1ScreensByIdScreenGroupsMutation();

  const {
    data,
    error: loadError,
    isLoading: isLoadingScreen,
  } = useGetV1ScreensByIdQuery({ id });

  /** Sets the id of groups for api call. */
  useEffect(() => {
    if (formStateObject && !groupId) {
      setGroupId(idFromUrl(formStateObject.inScreenGroups));
    }
  }, [formStateObject]);

  /** Set loaded data into form state. */
  useEffect(() => {
    if (data) {
      setFormStateObject(data);
    }
  }, [data]);

  /** When the screen is saved, the groups will be saved. */
  useEffect(() => {
    if (isSaveSuccess) {
      PutV1ScreensByIdScreenGroups({
        id,
        body: JSON.stringify(groupsToAdd),
      });
    }
  }, [isSaveSuccess]);

  /**
   * Set state on change in input field
   *
   * @param {object} props - The props.
   * @param {object} props.target - Event target.
   */
  function handleInput({ target }) {
    let localFormStateObject = { ...formStateObject };
    localFormStateObject = JSON.parse(JSON.stringify(localFormStateObject));
    set(localFormStateObject, target.id, target.value);
    setFormStateObject(localFormStateObject);
  }

  /** Handles submit. */
  function handleSubmit() {
    formStateObject.dimensions.width = parseInt(
      formStateObject.dimensions.width,
      10
    );
    formStateObject.dimensions.height = parseInt(
      formStateObject.dimensions.height,
      10
    );
    const saveData = {
      title: formStateObject.title,
      description: formStateObject.description,
      size: formStateObject.size,
      modifiedBy: formStateObject.modifiedBy,
      createdBy: formStateObject.createdBy,
      layout: formStateObject.layout,
      location: formStateObject.location,
      dimensions: {
        width: formStateObject.dimensions.width,
        height: formStateObject.dimensions.height,
      },
    };
    PutV1Screens({ id, screenScreenInput: JSON.stringify(saveData) });
    if (Array.isArray(formStateObject.inScreenGroups)) {
      setGroupsToAdd(
        formStateObject.inScreenGroups.map((group) => {
          return idFromUrl(group);
        })
      );
    }
  }

  return (
    <>
      {formStateObject && groupId && (
        <ScreenForm
          screen={formStateObject}
          headerText={headerText}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
          isLoading={isLoadingScreen}
          isSaveSuccess={isSaveSuccess || isSaveSuccessGroups}
          isSaving={isSaving || isSavingGroups}
          errors={saveError || loadError || saveErrorGroups || false}
          groupId={groupId}
        />
      )}
    </>
  );
}

export default ScreenEdit;
