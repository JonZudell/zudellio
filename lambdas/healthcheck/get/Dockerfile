# Use the official AWS Lambda Python 3.10 base image
FROM public.ecr.aws/lambda/python:3.10

# Set the working directory
WORKDIR /var/task

# Copy the rest of the application code
COPY ./Dockerfile ./Dockerfile
COPY ./__init__.py ./__init__.py
COPY ./handler.py ./handler.py
COPY ./requirements.txt ./requirements.txt
COPY ./utilities ./utilities
# Use ADD to copy the contents of the symlinked directory
RUN pip install -r ./requirements.txt

# Set the CMD to your handler (could be app.lambda_handler or similar)
CMD ["handler.lambda_handler"]