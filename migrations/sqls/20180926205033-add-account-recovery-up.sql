ALTER TABLE connectwithgamers.accounts ADD COLUMN recoveryid VARCHAR(32) DEFAULT NULL AFTER emailVerification;
ALTER TABLE connectwithgamers.accounts ADD CONSTRAINT UNIQUE (recoveryid);