#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "=========================================="
echo "⚡ Deploying Monadian to Monad Testnet (10143)"
echo "=========================================="

if [ -n "$1" ]; then
  # Jika user mempassing private key sebagai argumen: ./deploy.sh 0x...
  forge script script/DeployMonadian.s.sol:DeployMonadian \
    --rpc-url https://testnet-rpc.monad.xyz \
    --broadcast \
    --legacy \
    --private-key "$1"
else
  # Mode interaktif aman (prompt password tersembunyi)
  forge script script/DeployMonadian.s.sol:DeployMonadian \
    --rpc-url https://testnet-rpc.monad.xyz \
    --broadcast \
    --legacy \
    --interactive
fi
