# resource "aws_iam_role" "sso_role" {
#   name = "sso-role"
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Principal = {
#           Service = "sso.amazonaws.com"
#         }
#         Action = "sts:AssumeRole"
#       }
#     ]
#   })
# }

# resource "aws_iam_policy" "sso_policy" {
#   name        = "sso-policy"
#   description = "Policy for SSO access"
#   policy      = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Action = [
#           "sso:ListDirectoryAssociations",
#           "sso:DescribeDirectoryAssociation",
#           "sso:CreateDirectoryAssociation",
#           "sso:DeleteDirectoryAssociation"
#         ]
#         Resource = "*"
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "sso_policy_attachment" {
#   role       = aws_iam_role.sso_role.name
#   policy_arn = aws_iam_policy.sso_policy.arn
# }

# output "sso_role_arn" {
#   value = aws_iam_role.sso_role.arn
# }