import React from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = React.useState();
  const [refreshToken, setRefreshToken] = React.useState();
  const [expiresIn, setExpiresIn] = React.useState();

  React.useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn); // "61" to debug refreshing token
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        window.location = "/";
      });
  }, [code]);

  React.useEffect(() => {
    if (!refreshToken || !expiresIn) {
      return;
    }

    const timeout = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn); // "61" to debug refreshing token
        })
        .catch(() => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(timeout);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
