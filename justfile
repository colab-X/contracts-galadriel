cset shell := ["sh", "-c"]
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]
#set allow-duplicate-recipe
set positional-arguments
#set dotenv-filename := ".env"




deploy NETWORK="hal":
    npx hardhat deploy --network {{NETWORK}}

t:
    pnpm run t --bail --grep "Results"; 