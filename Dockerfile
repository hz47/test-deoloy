# Use the official Nginx Alpine image
FROM nginx:alpine

# Remove the default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy the index.html and main.js to the Nginx static content directory
COPY index.html main.js error.js /usr/share/nginx/html/

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
