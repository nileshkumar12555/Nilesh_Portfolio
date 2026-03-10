import axios from "axios";

const githubClient = axios.create({
  baseURL: "https://api.github.com",
  timeout: 9000,
});

export async function fetchGithubRepos(signal, username = "nileshkumar12555") {
  const response = await githubClient.get(`/users/${username}/repos`, {
    signal,
    params: {
      sort: "updated",
      per_page: 20,
    },
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  return response.data;
}
