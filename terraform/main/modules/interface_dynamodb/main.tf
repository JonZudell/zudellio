resource "aws_dynamodb_table" "zudellio_contact" {
  name           = "zudellio_contact"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  attribute {
    name = "id"
    type = "S"
  }
}
