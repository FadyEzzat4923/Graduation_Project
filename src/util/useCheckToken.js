import { useMutation } from "@tanstack/react-query";
import { checkToken } from "./http";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useCheckToken() {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: checkToken,
    onSuccess: (data) => {
      if (!data.isValid) {
        navigate("/login");
      }
    },
  });

  useEffect(() => {
    const auth = localStorage.getItem("author");
    if (auth !== undefined) {
      try {
        const authentication = JSON.parse(auth);
        if (authentication?.token) {
          mutate({ data: { token: authentication.token } });
        } else {
          navigate("/login");
        }
      } catch (err) {
        // console.log(err);
        navigate("/login");
      }
    }
  }, [mutate, navigate]);
}
