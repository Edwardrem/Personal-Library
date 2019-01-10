// jsonSchema for MongoDB createCollection method

const bookSchema = {
  bsonType: "object",
  required: ["book_title", "comment"],
  properties: {
    book_title: {
      bsonType: "string",
      description: "must be a string and is required"
    },
    comment: {
      bsonType: "array",
      description: "must be a string and is required"
    }
  }
};
module.exports = bookSchema;