const env =
  (typeof import.meta !== "undefined" && import.meta.env) ||
  (typeof process !== "undefined" && process.env) ||
  {};

const rawBase =
  env.VITE_API_BASE_URL ||
  env.PUBLIC_API_BASE_URL ||
  env.REACT_APP_API_BASE_URL ||
  env.API_BASE_URL ||
  "";

const API_BASE = rawBase ? rawBase.replace(/\/$/, "") : "";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  let body = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const detail = body?.details?.join(" ") || "";
    const message = body?.error || "Request failed";
    throw new Error(detail ? `${message} ${detail}` : message);
  }

  return body;
};

export async function getGames() {
  return request("/api/games");
}

export async function getGame(id) {
  return request(`/api/games/${id}`);
}

export async function createGame(game) {
  return request("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game)
  });
}

export async function updateGame(id, game) {
  return request(`/api/games/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game)
  });
}

export async function deleteGame(id) {
  return request(`/api/games/${id}`, {
    method: "DELETE"
  });
}
