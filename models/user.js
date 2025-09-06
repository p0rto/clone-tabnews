import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueUser(userInputValues.email, userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueUser(email, username) {
    const results = await database.query({
      text: `
      SELECT 
        email 
      FROM
        users
      WHERE 
        LOWER(email) = LOWER($1)
      OR
        LOWER(username) = LOWER($2)
      ;`,
      values: [email, username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Usuário já existente.",
        action: "Utilize outras credenciais.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;
