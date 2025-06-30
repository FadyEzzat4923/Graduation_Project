import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCheckToken from "./useCheckToken";

export default function useAuthentication() {
  const [author, setAuthor] = useState([]);
  useCheckToken();
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("author");
    try {
      const authentication = JSON.parse(auth);
      if (authentication?.token) {
        setAuthor(authentication);
      }
    } catch (err) {
      // console.log(err);
      navigate("/login");
    }
  }, [navigate]);

  return author || undefined;
}
