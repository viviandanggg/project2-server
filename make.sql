DROP DATABASE IF EXISTS budget;
DROP USER IF EXISTS budget_team@localhost;

CREATE DATABASE budget CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER budget_team@localhost IDENTIFIED BY '@HOPE9les2LEE5slim$CHANCE';
GRANT ALL PRIVILEGES ON budget.* TO budget_team@localhost; 
