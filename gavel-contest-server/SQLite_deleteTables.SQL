/* Deleting all entries from user table */
DELETE FROM users;
DELETE FROM sqlite_sequence WHERE NAME='users';

/* Deleting all entries from teams table */
DELETE FROM teams;
DELETE FROM sqlite_sequence WHERE NAME='teams';

/* Deleting all entries from userteams table */
DELETE FROM userteams;
DELETE FROM sqlite_sequence WHERE NAME='userteams';