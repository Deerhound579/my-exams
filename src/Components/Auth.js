import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useCookies } from "react-cookie";
import formatUsername from "../Functions/formatUsername"
export const getToken = async ({ username, password }) => {
  const res = await axios.post(
    "https://ninshou.test.ctf.science.mcgill.ca/api/v1/authenticate/simple",
    { email: formatUsername(username), password: password }
  );
  return res.data;
};

export const useGetCourses = token => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    (async function getCourses() {
      if (token) {
        const shortUser = jwtDecode(token).sub;
        const headers = {
          Authorization: `Bearer ${token}`
        };
        const res = await axios.get(
          `https://attrispool.test.ctf.science.mcgill.ca/api/v1/users/${shortUser}`,
          { headers }
        );
        setCourses(res.data.courses);
      }
    })();
  }, [token]);
  return courses;
};

export const AuthRoute = ({ component: Component, ...rest }) => {
  const [cookies] = useCookies(["jwt"]);
  return (
    <Route
      {...rest}
      render={props =>
        // the jwt won't expire, so just check if there's any
        cookies.jwt ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        )
      }
    />
  );
};
