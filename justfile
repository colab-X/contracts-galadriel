set shell := ["sh", "-c"]
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]
#set allow-duplicate-recipe
set positional-arguments
#set dotenv-filename := ".env"




try *ARGS:
    bunx hardhat deploy {{ARGS}}