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
