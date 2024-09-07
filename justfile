set shell := ["sh", "-c"]
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]
#set allow-duplicate-recipe
set positional-arguments
#set dotenv-filename := ".env"




deploy *ARGS:
    pnpm hardhat deploy {{ARGS}}

run *ARGS:
    pnpm hardhat run {{ARGS}}

