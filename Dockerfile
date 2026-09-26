FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# index.html is the homepage (no rename step needed after the reorganization)

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
