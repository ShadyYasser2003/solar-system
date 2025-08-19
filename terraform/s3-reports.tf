resource "aws_s3_bucket" "reports-bucket" {
  bucket = "reports-bucket-shady-yasser"
  
  
  tags = {
    Name        = "Solar System Reports Bucket"
    Environment = "development"
  }
}
