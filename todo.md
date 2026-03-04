- [ ] GET /users 
- [ ] GET /users/userId
- [ ] POST /users/userId
- [ ] PUT /users/userId
- [ ] DELETE /users/userId

^ done ^
- [ x ] GET /users/userId/games
- [ ] GET /users/userId/games/gameId
- [ ] POST /users/userId/games/gameId
- [ ] PUT /users/userId/games/gameId
- [ ] DELETE /users/userId/games/gameId
- [ ] GET /games (include query params)
- [ ] GET /games/gameId

# Prometheus

- Create prometheus directory
- Create Dockerfile and prometheus.yml in prometheus directory
  - Dockerfile should copy prometheus.yml to /etc/prometheus
- Add prometheus service to docker compose file using prometheus directory
- Run docker compose up -d