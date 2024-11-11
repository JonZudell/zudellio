# Use the official AWS Lambda Python 3.10 base image
FROM public.ecr.aws/lambda/python:3.10

# Copy the requirements.txt file and install dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set the CMD to your handler (could be app.lambda_handler or similar)
CMD ["handler.lambda_handler"]