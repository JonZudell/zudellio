
output "s3_bucket_name" {
  value = aws_s3_bucket.zudellio_cdn.bucket
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.zudellio_contact.name
}
