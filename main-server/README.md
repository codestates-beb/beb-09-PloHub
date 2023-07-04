# Main server of PloHub project

## 🎮 Auto generate Go code from SQL files using sqlc

### Install sqlc using Docker

```sh
$ docker pull kjconroy/sqlc
```

### Init sqlc

```sh
$ docker run --rm -v "$(pwd)/db:/src" -w /src kjconroy/sqlc init
```

### Fill out db/sqlc.yaml

```yaml
version: "2"
sql:
  - engine: "postgresql"
    schema: "schema.sql"
    queries: "query.sql"
    gen:
      go:
        package: "plohub"
        out: "plohub"
```

### Generate code

```sh
$ docker run --rm -v "$(pwd)/db:/src" -w /src kjconroy/sqlc generate
```
