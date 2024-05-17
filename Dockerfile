FROM node:18

#Define working dir inside the container
WORKDIR /app


#Copy app into container
COPY ./src/ /app/src/
COPY *.json /app/
#COPY *.lock /app/
COPY *.npmrc /app/

# AWS CLI installation and authentication commands
RUN	curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN	unzip awscliv2.zip && ./aws/install
ARG AWS_REGION
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_ACCESS_KEY_ID  
ARG AWS_SESSION_TOKEN
ENV AWS_REGION=${AWS_REGION}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN}
RUN aws sts get-caller-identity 

#Install dependencies in container
RUN aws codeartifact login --tool npm --repository CA_REPOSITORY --domain CA_DOMAIN --domain-owner 067435599643 --region AWS_REGION

#Install dependencies
RUN yarn install


COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
