import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

export async function login({ data, action, token }) {
  let method = "POST";
  let headers = {
    "Content-Type": "application/json",
  };
  const endpoint =
    action === "signup"
      ? "register"
      : action === "forget-password"
        ? "forget-password"
        : action === "reset-password"
          ? "reset-password"
          : action === "update-profile"
            ? "update-profile"
            : action === "verify-reset-code"
              ? "verify-reset-code"
              : "login";
  if (action === "update-profile") {
    method = "PUT";
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  const url = `https://localhost:7054/api/Account/${endpoint}`;

  const response = await fetch(url, {
    headers,
    method,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = new Error("An error occurred during authentication.");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

export async function checkToken({ data }) {
  const response = await fetch(
    "https://localhost:7054/api/Account/validate-token",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred during authentication.");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
}

export async function fetchMessages({ signal, token, messageId }) {
  let url = "https://localhost:7054/api/Messages";
  if (messageId) {
    url += "/" + messageId;
  }
  const response = await fetch(url, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetch the messages");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function sendMessage({ data, token, messageId }) {
  let url = "https://localhost:7054/api/Messages";
  let method = "POST";
  if (messageId) {
    url += "/" + messageId;
    method = "PUT";
  }
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetch the messages");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function deleteMessage({ token, messageId, forMe }) {
  let url = "https://localhost:7054/api/Messages/";
  if (forMe) {
    url += "for-me/";
  }
  const response = await fetch(url + messageId, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetch the messages");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function fetchProductsData({
  signal,
  brandId,
  imageId,
  searchData,
  savedProduct,
  myProduct,
  token,
}) {
  let url = "https://localhost:7054/api/Products";
  if (brandId) {
    url += "/" + brandId;
  }
  if (searchData) {
    url += "/search?keyword=" + searchData;
  }
  if (myProduct) {
    url += "/my-products";
  }
  if (savedProduct) {
    url += "/Saved-product";
  }
  if (imageId) {
    url += "/image/" + imageId;
  }
  const response = await fetch(url, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetch the products.");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  if (imageId) {
    return response.blob();
  }
  return response.json();
}

export async function createProduct({ data, token, brandId }) {
  let method = "POST";
  let url = "https://localhost:7054/api/Products";
  if (brandId) {
    url += "/" + brandId;
    method = "PUT";
  }
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!response.ok) {
    const error = new Error(
      `An error occurred while ${method === "PUT" ? "editing" : "creating"
      }creating a new product.`
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function deleteProduct({ brandId, token }) {
  const response = await fetch(
    "https://localhost:7054/api/Products/" + brandId,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(`An error occurred while deleting product.`);
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function savedProduct({ brandId, removeSaved, token }) {
  let url =
    "https://localhost:7054/api/Products/saved-product?productId=" +
    brandId;
  let method = "POST";
  if (removeSaved) {
    url =
      "https://localhost:7054/api/Products/DeleteSavedProduct?productId=" +
      brandId;
    method = "DELETE";
  }
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = new Error(`An error occurred while deleting product.`);
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function isSavedProduct({ brandId, token, signal }) {
  const response = await fetch(
    "https://localhost:7054/api/Products/IsProductSavedByUser?productId=" +
    brandId,
    {
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      `An error occurred while check is it saved product.`
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function fetchVoiceRecognition({ token, signal, momGuids }) {
  const response = await fetch(
    `https://localhost:7054/api/BabyRecord/${momGuids ? "RandomTips" : "records"
    }`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      `An error occurred while fetch voice recognition classification.`
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function sendVoice({ token, data }) {
  const response = await fetch(
    "https://localhost:7054/api/BabyRecord/Upload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  );

  if (!response.ok) {
    const error = new Error(`An error occurred while send voice to ai.`);
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}

export async function deleteVoice({ token, id, userId }) {
  let url =
    "https://localhost:7054/api/BabyRecord/DeleteVoiceWithPrediction/" +
    id;
  if (userId) {
    url =
      "https://localhost:7054/api/BabyRecord/DeleteUserRecords/" + userId;
  }
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = new Error(`An error occurred while delete voice.`);
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  return response.json();
}
