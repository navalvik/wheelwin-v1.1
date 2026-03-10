import { TonConnectUI } from "@tonconnect/ui"

let tonConnectUI: TonConnectUI | null = null

/*
INIT TON CONNECT
*/

export function initTonConnect() {

  tonConnectUI = new TonConnectUI({

    manifestUrl: `${window.location.origin}/tonconnect-manifest.json`

  })

}

/*
GET INSTANCE
*/

export function getTonConnect() {

  if (!tonConnectUI) {

    throw new Error("TON Connect not initialized")

  }

  return tonConnectUI

}

/*
CONNECT WALLET
*/

export async function connectWallet() {

  const connector = getTonConnect()

  await connector.openModal()

}

/*
GET WALLET ADDRESS
*/

export function getWalletAddress(): string | null {

  const connector = getTonConnect()

  const wallet = connector.wallet

  if (!wallet) return null

  return wallet.account.address

}

/*
CHECK CONNECTED
*/

export function isWalletConnected(): boolean {

  const connector = getTonConnect()

  return !!connector.wallet

}

/*
SEND TON PAYMENT
*/

export async function sendTonTransaction(

  to: string,
  amountTon: number

) {

  const connector = getTonConnect()

  const nanoTon = BigInt(
    Math.floor(amountTon * 1e9)
  ).toString()

  const tx = {

    validUntil: Math.floor(Date.now() / 1000) + 600,

    messages: [

      {

        address: to,

        amount: nanoTon

      }

    ]

  }

  return connector.sendTransaction(tx)

}
