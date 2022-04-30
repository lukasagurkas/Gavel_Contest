/* Get user name, email, team name */
SELECT users.email, users.name, teams.name
FROM userteams, users, teams
WHERE userteams.userID = users.id AND userteams.teamID = teams.id
ORDER BY teams.name