FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# index.html = home, plp.html = product listing, pdp.html = product detail

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
