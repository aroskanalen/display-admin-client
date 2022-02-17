import { React, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { ToastContainer } from "react-toastify";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";
import Login from "./components/user/login";
import Logout from "./components/user/logout";
import TopBar from "./components/navigation/topbar/topbar";
import SideBar from "./components/navigation/sidebar/sidebar";
import ScreenList from "./components/screen/screen-list";
import SlidesList from "./components/slide/slides-list";
import GroupsList from "./components/groups/groups-list";
import GroupCreate from "./components/groups/group-create";
import GroupEdit from "./components/groups/group-edit";
import PlaylistCampaignList from "./components/playlist/playlist-campaign-list";
import PlaylistCampaignEdit from "./components/playlist/playlist-campaign-edit";
import PlaylistCampaignCreate from "./components/playlist/playlist-campaign-create";
import MediaList from "./components/media/media-list";
import commonDa from "./translations/da/common.json";
import UserList from "./components/user-list/user-list";
import ScreenCreate from "./components/screen/screen-create";
import ScreenEdit from "./components/screen/screen-edit";
import SlideEdit from "./components/slide/slide-edit";
import SlideCreate from "./components/slide/slide-create";
import MediaCreate from "./components/media/media-create";
import ThemesList from "./components/themes/themes-list";
import ThemeCreate from "./components/themes/theme-create";
import ThemeEdit from "./components/themes/theme-edit";
import "react-toastify/dist/ReactToastify.css";
import "./app.scss";

/**
 * App component.
 *
 * @returns {object} The component.
 */
function App() {
  const [authenticated, setAuthenticated] = useState(null);
  const [ready, setReady] = useState(false);

  const handleReauthenticate = () => {
    setAuthenticated(false);
  };

  const handleAuthenticated = () => {
    setAuthenticated(true);
  };

  // Check that authentication token exists.
  useEffect(() => {
    const token = localStorage.getItem("api-token");

    if (token !== null) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }

    document.addEventListener("reauthenticate", handleReauthenticate);
    document.addEventListener("authenticated", handleAuthenticated);

    i18next.init({
      interpolation: { escapeValue: false }, // React already does escaping
      lng: "da", // language to use
      resources: {
        da: {
          common: commonDa,
        },
      },
    });

    return () => {
      document.removeEventListener("reauthenticate", handleReauthenticate);
      document.removeEventListener("authenticated", handleAuthenticated);
    };
  }, []);

  useEffect(() => {
    i18next.init({
      interpolation: { escapeValue: false }, // React already does escaping
      lng: "da", // language to use
      resources: {
        da: {
          common: commonDa,
        },
      },
    });
    setReady(true);
  }, []);

  return (
    <>
      {ready && (
        <I18nextProvider i18n={i18next}>
          {authenticated === false && <Login />}
          {authenticated === null && <Spinner animation="border" />}
          {authenticated && (
            <Container fluid className="h-100 px-0 bg-light">
              <Row className="row-full-height g-0">
                <SideBar />
                <Col lg={9} xl={10}>
                  <TopBar />
                  <ToastContainer
                    autoClose="10000"
                    position="bottom-right"
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    progress={undefined}
                  />
                  <main className="col p-3">
                    <Routes>
                      <Route path="campaign">
                        <Route
                          path="create"
                          element={
                            <PlaylistCampaignCreate location="campaign" />
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={<PlaylistCampaignEdit location="campaign" />}
                        />
                        <Route
                          path="list"
                          element={<PlaylistCampaignList location="campaign" />}
                        />
                      </Route>
                      <Route path="playlist">
                        <Route
                          path="create"
                          element={
                            <PlaylistCampaignCreate location="playlist" />
                          }
                        />
                        <Route
                          path="edit/:id"
                          element={<PlaylistCampaignEdit location="playlist" />}
                        />
                        <Route
                          path="list"
                          element={<PlaylistCampaignList location="playlist" />}
                        />
                      </Route>

                      <Route path="screen">
                        <Route path="list" element={<ScreenList />} />
                        <Route path="create" element={<ScreenCreate />} />
                        <Route path="edit/:id" element={<ScreenEdit />} />
                      </Route>
                      <Route path="group">
                        <Route path="list" element={<GroupsList />} />
                        <Route path="edit/:id" element={<GroupEdit />} />
                        <Route path="create" element={<GroupCreate />} />
                      </Route>
                      <Route path="slide">
                        <Route path="list" element={<SlidesList />} />
                        <Route path="create" element={<SlideCreate />} />
                        <Route path="edit/:id" element={<SlideEdit />} />
                      </Route>
                      <Route path="media">
                        <Route path="list" element={<MediaList />} />
                        <Route path="create" element={<MediaCreate />} />
                      </Route>
                      <Route path="themes">
                        <Route path="list" element={<ThemesList />} />
                        <Route path="edit/:id" element={<ThemeEdit />} />
                        <Route path="create" element={<ThemeCreate />} />
                      </Route>
                      <Route path="users" element={<UserList />} />
                      <Route path="*" element={<Navigate to="/slide/list" />} />
                    </Routes>
                  </main>
                </Col>
              </Row>
            </Container>
          )}
        </I18nextProvider>
      )}
    </>
  );
}

export default App;
