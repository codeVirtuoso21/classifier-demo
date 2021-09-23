FROM nginx:alpine
COPY ./nginx_config/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/static/js.templates && \
  mv /usr/share/nginx/html/static/js/*.js /usr/share/nginx/html/static/js.templates && \
  for f in $(find /usr/share/nginx/html/static/js.templates -name '*.js'); do cp $f ${f}.template; done
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/usr/share/nginx/html/static/js.templates
ENV NGINX_ENVSUBST_OUTPUT_DIR=/usr/share/nginx/html/static/js