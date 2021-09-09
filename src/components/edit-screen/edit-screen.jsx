import { React, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import ContentFooter from "../util/content-footer/content-footer";
import FormInput from "../util/forms/form-input";
import LocationDropdown from "../util/forms/multiselect-dropdown/locations/location-dropdown";
import GroupsDropdown from "../util/forms/multiselect-dropdown/groups/groups-dropdown";
import Select from "../util/forms/select";
import FormInputArea from "../util/forms/form-input-area";
import RadioButtons from "../util/forms/radio-buttons";
import getFormErrors from "../util/helpers/form-errors-helper";
import GridGenerationAndSelect from "./grid-generation-and-select";

/**
 * The edit screen component.
 *
 * @returns {object}
 *   The edit screen page.
 */
function EditScreen() {
  const { t } = useTranslation("common");
  const history = useHistory();
  const requiredFields = [
    "screenName",
    "screenLocations",
    "screenGroups",
    "screenLayout",
  ];
  const radioButtonOptions = [
    {
      id: "horizontal",
      label: t("edit-screen.radio-button-horizontal"),
    },
    {
      id: "vertical",
      label: t("edit-screen.radio-button-vertical"),
    },
  ];
  const [formStateObject, setFormStateObject] = useState({
    screenLocations: [],
    screenGroups: [],
    screenLayout: "",
    playlists: [],
    horizontalOrVertical: radioButtonOptions[0].id,
    screenSlides: [],
  });
  const { id } = useParams();
  const [screenName, setScreenName] = useState([]);
  const [grid, setGrid] = useState();
  const [layoutOptions, setLayoutOptions] = useState();
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const newScreen = id === "new";

  /**
   * Load content from fixture.
   */
  useEffect(() => {
    // @TODO: load real content.
    fetch("/fixtures/screen-layout/screen-layout.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setLayoutOptions(jsonData.layouts);
      });
    if (!newScreen) {
      fetch("/fixtures/screens/screen.json")
        .then((response) => response.json())
        .then((jsonData) => {
          setScreenName(jsonData.screen.name);
          // Map existing screen to state.
          setFormStateObject({
            screenLocations: jsonData.screen.locations,
            sizeOfScreen: jsonData.screen.sizeOfScreen,
            resolutionOfScreen: jsonData.screen.resolutionOfScreen,
            screenGroups: jsonData.screen.groups,
            screenLayout: jsonData.screen.screenLayout,
            playlists: jsonData.screen.playlists,
            horizontalOrVertical: jsonData.screen.horizontalOrVertical,
            screenName: jsonData.screen.name,
            description: jsonData.screen.description,
            descriptionOfLocation: jsonData.screen.descriptionOfLocation,
            screenSlides: jsonData.screen.slides,
          });
        });
    }
  }, []);

  useEffect(() => {
    if (layoutOptions) {
      const localGrid = layoutOptions.find(
        (layout) => layout.id === parseInt(formStateObject.screenLayout, 10)
      );
      setGrid(localGrid);
    }
  }, [formStateObject.screenLayout]);

  /**
   * Set state on change in input field
   *
   * @param {object} props
   * The props.
   * @param {object} props.target
   * event target
   */
  function handleInput({ target }) {
    const localFormStateObject = { ...formStateObject };
    localFormStateObject[target.id] = target.value;
    setFormStateObject(localFormStateObject);
  }

  /**
   * Handles validations, and goes back to list.
   *
   * @param {object} e
   * the submit event.
   * @returns {boolean}
   * Boolean indicating whether to submit form.
   */
  function handleSubmit(e) {
    // @TODO: Make it save.
    e.preventDefault();
    setErrors([]);
    let returnValue = false;
    const createdErrors = getFormErrors(requiredFields, formStateObject);
    if (createdErrors.length > 0) {
      setErrors(createdErrors);
    } else {
      setSubmitted(true);
      returnValue = true;
    }
    return returnValue;
  }

  return (
    <Form onSubmit={handleSubmit}>
      {newScreen && (
        <ContentHeader title={t("edit-screen.create-new-screen")} />
      )}
      {!newScreen && (
        <ContentHeader
          title={`${t("edit-screen.edit-screen")}: ${screenName}`}
        />
      )}
      <ContentBody>
        <h2 className="h4">{t("edit-screen.screen-about")}</h2>
        <FormInput
          errors={errors}
          name="screenName"
          type="text"
          label={t("edit-screen.screen-name-label")}
          invalidText={t("edit-screen.screen-name-validation")}
          helpText={t("edit-screen.screen-name-placeholder")}
          value={formStateObject.screenName}
          onChange={handleInput}
        />
        <FormInputArea
          name="description"
          type="text"
          label={t("edit-screen.screen-description-label")}
          helpText={t("edit-screen.screen-description-placeholder")}
          value={formStateObject.description}
          onChange={handleInput}
        />
      </ContentBody>
      <ContentBody>
        <h2 className="h4">{t("edit-screen.screen-groups")}</h2>
        <GroupsDropdown
          errors={errors}
          name="screenGroups"
          isCreatable
          handleGroupsSelection={handleInput}
          selected={formStateObject.screenGroups}
        />
      </ContentBody>
      <ContentBody>
        <h2 className="h4">{t("edit-screen.screen-location")}</h2>
        <LocationDropdown
          errors={errors}
          isCreatable
          name="screenLocations"
          handleLocationSelection={handleInput}
          selected={formStateObject.screenLocations}
          formGroupClasses="mb-3"
        />
        <FormInput
          name="descriptionOfLocation"
          type="text"
          required
          label={t("edit-screen.screen-description-of-location-label")}
          helpText={t("edit-screen.screen-description-of-location-placeholder")}
          value={formStateObject.descriptionOfLocation}
          onChange={handleInput}
        />
      </ContentBody>
      <ContentBody>
        <h2 className="h4">{t("edit-screen.screen-settings")}</h2>
        <FormInput
          name="sizeOfScreen"
          type="text"
          label={t("edit-screen.screen-size-of-screen-label")}
          helpText={t("edit-screen.screen-size-of-screen-placeholder")}
          value={formStateObject.sizeOfScreen}
          onChange={handleInput}
        />
        <RadioButtons
          options={radioButtonOptions}
          radioGroupName="horizontalOrVertical"
          selected={formStateObject.horizontalOrVertical}
          handleChange={handleInput}
          label={t("edit-screen.radio-buttons-horizontal-or-vertical-label")}
        />
        <FormInput
          name="resolutionOfScreen"
          type="text"
          label={t("edit-screen.screen-resolution-of-screen-label")}
          placeholder={t("edit-screen.screen-resolution-of-screen-placeholder")}
          value={formStateObject.resolutionOfScreen}
          helpText={t("edit-screen.screen-resolution-of-screen-helptext")}
          pattern="(\d+)x(\d+)"
          onChange={handleInput}
        />
      </ContentBody>
      <ContentBody>
        <h2 className="h4">{t("edit-screen.screen-layout")}</h2>
        <div className="row">
          {layoutOptions && (
            <div className="col-md-8">
              <Select
                name="screenLayout"
                onChange={handleInput}
                label={t("edit-screen.screen-layout-label")}
                errors={errors}
                options={layoutOptions}
                value={formStateObject.screenLayout}
              />
            </div>
          )}
          {grid?.grid && (
            <GridGenerationAndSelect
              grid={grid?.grid}
              layout={formStateObject.horizontalOrVertical}
              regions={grid?.regions}
              handleInput={handleInput}
              selectedData={formStateObject.playlists}
            />
          )}
        </div>
      </ContentBody>
      <ContentFooter>
        {submitted && <Redirect to="/screens" />}
        <Button
          variant="secondary"
          type="button"
          id="screen_cancel"
          onClick={() => history.goBack()}
          size="lg"
          className="me-3"
        >
          {t("edit-screen.cancel-button")}
        </Button>
        <Button variant="primary" type="submit" id="save_screen" size="lg">
          {t("edit-screen.save-button")}
        </Button>
      </ContentFooter>
    </Form>
  );
}

export default EditScreen;
