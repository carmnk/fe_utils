export type ServerConfig = {
    serve_frontend: boolean
    ssl_private_key_path: string
    ssl_certificate_path: string
    disable_https: boolean
    disable_http: boolean
    disable_http_when_https_available: boolean
    https_port: number
    http_port: number
    allowed_origins: string[] // ['*'] -> all but unsupported if credentials = true / [] -> only same origin
    postgres_host: string
    postgres_port: number
    postgres_db: string
    postgres_user: string
    postgres_password: string
  }