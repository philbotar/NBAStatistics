FROM python:3.8.13-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /api

# Copy the requirements.txt file and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of your code
COPY . .

EXPOSE 8000
