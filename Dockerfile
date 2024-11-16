# Use official nginx image from the Docker Hub as the base image
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy your project files into the nginx directory
COPY . .

# Expose port 80 to access the app via the browser
EXPOSE 80

# Run the nginx server to serve your files
CMD ["nginx", "-g", "daemon off;"]
