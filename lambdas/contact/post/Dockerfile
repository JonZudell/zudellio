# Use the official AWS Lambda Python 3.10 base image
FROM public.ecr.aws/lambda/python:3.10

# Set the working directory
WORKDIR /var/task

# Copy the rest of the application code
COPY . .

RUN pip install -r requirements.txt

# Set the CMD to your handler (could be app.lambda_handler or similar)
CMD ["handler.lambda_handler"]