CREATE DATABASE aviator;

CREATE TABLE flyaways (
  id SERIAL PRIMARY KEY,
  value DOUBLE PRECISION,
  closed_at TIMESTAMP
);


CREATE OR REPLACE FUNCTION flyaways_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('flyaways_insert', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER flyaways_insert_trigger
AFTER INSERT ON flyaways
FOR EACH ROW
EXECUTE PROCEDURE flyaways_insert_trigger();

