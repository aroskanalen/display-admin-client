import { React, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import set from "lodash.set";
import idFromUrl from "../util/helpers/id-from-url";
import SlideForm from "./slide-form";
import {
  useGetV1SlidesByIdQuery,
  usePutV1SlidesByIdMutation,
  useGetV1TemplatesByIdQuery,
} from "../../redux/api/api.generated";

/**
 * The slide edit component.
 *
 * @returns {object} The slide edit page.
 */
function SlideEdit() {
  const { t } = useTranslation("common");
  const headerText = t("slide-edit.edit-slide-header");
  const [formStateObject, setFormStateObject] = useState();
  const { id } = useParams();

  const [
    PutV1Slides,
    { isLoading: isSaving, error: saveError, isSuccess: isSaveSuccess },
  ] = usePutV1SlidesByIdMutation();

  const { data, error: loadError, isLoading } = useGetV1SlidesByIdQuery({ id });

  const { data: template } = useGetV1TemplatesByIdQuery({
    id: idFromUrl(formStateObject?.templateInfo),
  });

  /** Set loaded data into form state. */
  useEffect(() => {
    if (data) {
      const dataCopy = { ...data };
      dataCopy.templateInfo = dataCopy.templateInfo["@id"];
      setFormStateObject(dataCopy);
    }
  }, [data]);

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
    const saveData = {
      id,
      slideSlideInput: JSON.stringify({
        title: formStateObject.title,
        description: formStateObject.description,
        modifiedBy: formStateObject.modifiedBy,
        createdBy: formStateObject.createdBy,
        templateInfo: {
          "@id": formStateObject.templateInfo,
          options: { fade: false },
        },
        duration: 38823, // @TODO:
        content: { text: formStateObject.content.text },
      }),
    };
    PutV1Slides(saveData);
  }

  return (
    <>
      {formStateObject && template && (
        <SlideForm
          template={template}
          slide={formStateObject}
          headerText={`${headerText}: ${
            formStateObject && formStateObject.title
          }`}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isSaveSuccess={isSaveSuccess}
          isSaving={isSaving}
          errors={loadError || saveError || false}
        />
      )}
    </>
  );
}

export default SlideEdit;
