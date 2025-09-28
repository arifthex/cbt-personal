cbt-api/
├── cmd/                   # Entrypoint app
│   └── server/
│       └── main.go
├── internal/              # Core modules / business logic
│   ├── user/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   ├── class/
│   ├── exam/
│   ├── question/
│   ├── answer/
│   └── score/
├── pkg/                   # Shared utils / middleware / logger
│   ├── logger/
│   ├── middleware/
│   └── utils/
├── configs/               # Config YAML / JSON
│   └── config.yaml
├── migrations/            # DB migration SQL files
│   └── 001_init.sql
├── docs/                  # Documentation / OAS.yaml / README.md
├── scripts/               # Deployment / helper scripts
├── tests/                 # Unit / integration tests
├── Dockerfile
├── docker-compose.yml
├── go.mod
└── go.sum


3 Layer API

cbt-api/
├── cmd/
│   └── main.go              # entrypoint server
│
├── config/
│   └── config.go            # load ENV, db config, redis config
│
├── handlers/                # HTTP layer (gin/echo handler)
│   └── exam_handler.go
│
├── services/                # business logic
│   └── exam_service.go
│
├── repositories/            # db access
│   └── exam_repository.go
│
├── models/                  # entity / struct
│   └── exam.go
│
├── migrations/              # migration files
│   ├── 20250921_create_users_table.up.sql
│   └── 20250921_create_users_table.down.sql
│
├── utils/                   # helper (logger, response, middleware)
│   └── response.go
│
├── Dockerfile
├── docker-compose.yml
├── go.mod
└── go.sum

