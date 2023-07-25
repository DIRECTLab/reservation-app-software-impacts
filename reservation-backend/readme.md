# Reservation Backend

## Developer setup

* `npm install`
* `npx sequelize db:migrate`
* `npx sequelize db:seed:all`

## Setup Auth (for signing the JWT's)

* Run `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key` and leave the passphrase blank
* Run `openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub`
* Rename outputted files to `public.key` and `private.key`
* Move to both `src/auth/`
